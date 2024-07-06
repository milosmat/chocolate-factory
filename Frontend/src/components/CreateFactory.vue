<template>
  <div>
    <h1>Create Chocolate Factory</h1>
    <form @submit.prevent="createFactory">
      <input v-model="name" placeholder="Factory Name" required />
      <div id="map" class="map"></div>
      <div v-if="location.latitude && location.longitude">
        <p>Latitude: {{ location.latitude }}</p>
        <p>Longitude: {{ location.longitude }}</p>
      </div>
      <input v-model="location.street" @change="geocodeAddress" placeholder="Street" required />
      <input v-model="location.city" @change="geocodeAddress" placeholder="City" required />
      <input v-model="location.postalCode" @change="geocodeAddress" placeholder="Postal Code" required />
      <input v-model="workingHours" placeholder="Working Hours" required />
      <input type="file" @change="onFileChange" required />
      <select v-model="selectedManagerId" required>
        <option v-for="manager in availableManagers" :key="manager.id" :value="manager.id">
          {{ manager.username }}
        </option>
      </select>
      <button v-if="!selectedManagerId" type="button" @click="redirectToCreateManager">Create New Manager</button>
      <div v-if="showManagerForm">
        <h2>Create New Manager</h2>
        <input v-model="newManager.username" placeholder="Username" required />
        <input v-model="newManager.password" type="password" placeholder="Password" required />
        <input v-model="newManager.confirmPassword" type="password" placeholder="Confirm Password" required />
        <input v-model="newManager.firstName" placeholder="First Name" required />
        <input v-model="newManager.lastName" placeholder="Last Name" required />
        <input v-model="newManager.gender" placeholder="Gender" required />
        <input v-model="newManager.dateOfBirth" type="date" placeholder="Date of Birth" required />
      </div>
      <button type="submit">Create Factory</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      location: {
        latitude: null,
        longitude: null,
        street: '',
        city: '',
        postalCode: ''
      },
      workingHours: '',
      logo: null,
      availableManagers: [],
      selectedManagerId: null,
      showManagerForm: false,
      newManager: {
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: ''
      },
      map: null,
      marker: null,
      errorMessage: '',
      successMessage: '',
    };
  },
  mounted() {
    this.fetchAvailableManagers();
    this.initializeMap();
  },
  methods: {
    async fetchAvailableManagers() {
      try {
        const response = await axios.get('http://localhost:3000/api/chocolate-factories/managers/available');
        this.availableManagers = response.data;
      } catch (error) {
        console.error('Error fetching available managers:', error);
      }
    },
    onFileChange(event) {
      this.logo = event.target.files[0];
    },
    initializeMap() {
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([20.457273, 44.787197]), // Default center (Belgrade)
          zoom: 12,
        }),
      });

      this.map.on('singleclick', async (event) => {
        const coordinates = toLonLat(event.coordinate);
        this.setMarker(coordinates[0], coordinates[1]);

        try {
          const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${coordinates[1]}+${coordinates[0]}&key=f334aebae0db433187505ef2b720430c`);
          const addressComponents = response.data.results[0].components;
          this.location.street = addressComponents.road || '';
          this.location.city = addressComponents.city || '';
          this.location.postalCode = addressComponents.postcode || '';
          this.location.latitude = coordinates[1];
          this.location.longitude = coordinates[0];
          console.log("Updated Location Object:", this.location); // Dodato za proveru podataka lokacije
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      });

      this.marker = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: '/locationMarker.png', // Path to marker icon in public directory
            size: [48, 48]
          }),
        }),
      });

      this.map.addLayer(this.marker);
    },
    setMarker(longitude, latitude) {
      const coordinates = fromLonLat([longitude, latitude]);
      this.marker.getSource().clear();
      const markerFeature = new Feature({
        geometry: new Point(coordinates),
      });
      this.marker.getSource().addFeature(markerFeature);

      this.location.longitude = longitude;
      this.location.latitude = latitude;
    },
    async geocodeAddress() {
      if (this.location.street && this.location.city && this.location.postalCode) {
        const address = `${this.location.street}, ${this.location.city}, ${this.location.postalCode}`;
        try {
          const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=f334aebae0db433187505ef2b720430c`);
          if (response.data.results.length > 0) {
            const coordinates = response.data.results[0].geometry;
            this.location.latitude = coordinates.lat;
            this.location.longitude = coordinates.lng;
            this.setMarker(this.location.longitude, this.location.latitude);
          }
        } catch (error) {
          console.error('Error geocoding address:', error);
        }
      }
    },
    redirectToCreateManager() {
      this.$router.push('/create-manager');
    },
    async createFactory() {
      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('workingHours', this.workingHours);
      formData.append('logo', this.logo);

      if (this.showManagerForm) {
        if (this.newManager.password !== this.newManager.confirmPassword) {
          console.error('Passwords do not match!');
          this.errorMessage = 'Passwords do not match';
          return;
        }

        try {
          const managerResponse = await axios.post('http://localhost:3000/api/auth/register', {
            ...this.newManager,
            role: 'Manager'
          });
          this.selectedManagerId = managerResponse.data.id;
          formData.append('managerId', this.selectedManagerId); // Ensure managerId is appended after setting it
        } catch (error) {
          console.error('Error creating new manager:', error);
          this.errorMessage = 'Error creating new manager';
          return;
        }
      } else {
        formData.append('managerId', this.selectedManagerId);
      }

      const locationData = {
        street: this.location.street,
        city: this.location.city,
        postalCode: this.location.postalCode,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
      };

      console.log("Location Data being sent:", locationData); // Dodato za proveru podataka lokacije pre slanja

      formData.append('location', JSON.stringify(locationData));

      try {
        const response = await axios.post('http://localhost:3000/api/chocolate-factories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Factory created:', response.data);
        this.$router.push('/');
      } catch (error) {
        console.error('Error creating factory:', error);
        this.errorMessage = 'Failed to create factory';
      }
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
}
</style>
