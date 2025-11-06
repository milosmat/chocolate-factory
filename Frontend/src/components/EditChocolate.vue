<template>
    <div>
      <h1>Izmeni čokoladu</h1>
      <form @submit.prevent="updateChocolate">
        <input v-model="name" placeholder="Naziv" required />
        <input v-model="price" type="number" placeholder="Cena" required />
        <input v-model="type" placeholder="Vrsta" required />
        <input v-model="variety" placeholder="Tip" required />
        <input v-model="weight" type="number" placeholder="Gramaža" required />
        <input v-model="description" placeholder="Opis" required />
        <input v-model="image" placeholder="Slika URL" required />
        <button type="submit">Izmeni čokoladu</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        price: 0,
        type: '',
        variety: '',
        weight: 0,
        description: '',
        image: '',
        factoryId: ''
      };
    },
    mounted() {
      this.fetchChocolateDetails();
    },
    methods: {
      async fetchChocolateDetails() {
        try {
          const chocolateId = this.$route.params.id;
          const response = await axios.get(`/api/chocolates/${chocolateId}`);
          const chocolate = response.data;
          this.name = chocolate.name;
          this.price = chocolate.price;
          this.type = chocolate.type;
          this.variety = chocolate.variety;
          this.weight = chocolate.weight;
          this.description = chocolate.description;
          this.image = chocolate.image;
          console.log('Fetched chocolate details:', chocolate);
          console.log('Factory ID:', chocolate.factoryId); // Log the factoryId
          this.factoryId = chocolate.factoryId; // Correctly set factoryId
          console.log('Factory ID set:', this.factoryId); // Log after setting factoryId
        } catch (error) {
          console.error('Error loading chocolate details:', error);
        }
      },
      async updateChocolate() {
        try {
          const chocolateId = this.$route.params.id;
          const response = await axios.put(`/api/chocolates/${chocolateId}`, {
            name: this.name,
            price: this.price,
            type: this.type,
            variety: this.variety,
            weight: this.weight,
            description: this.description,
            image: this.image,
            factoryId: this.factoryId,
            quantity: 0,
            status: 'Out of Stock'
          });
          console.log('Chocolate updated:', response.data);
          console.log('Navigating to factory details with id:', this.factoryId); // Log the navigation intent
          const id = parseInt(this.factoryId); // Convert factoryId to an integer
          console.log('Parsed Factory ID:', id); // Log the parsed ID
          this.$router.push({ name: 'FactoryDetails', params: { id: id } });
        } catch (error) {
          console.error('Error updating chocolate:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Local styles for the component */
  </style>
  