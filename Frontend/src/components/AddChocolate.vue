<template>
  <div>
    <h1>Dodaj novu čokoladu</h1>
    <form @submit.prevent="addChocolate">
      <input v-model="name" placeholder="Naziv" required />
      <input v-model="price" type="number" placeholder="Cena" required />
      <input v-model="type" placeholder="Vrsta" required />
      <input v-model="variety" placeholder="Tip" required />
      <input v-model="weight" type="number" placeholder="Gramaža" required />
      <input v-model="description" placeholder="Opis" required />
      <input v-model="image" placeholder="Slika URL" required />
      <button type="submit">Dodaj čokoladu</button>
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
      factoryId: this.$route.params.factoryId // Automatski uzimamo factoryId iz parametara rute
    };
  },
  methods: {
    async addChocolate() {
      try {
        console.log('Trying to add chocolate:', {
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

        const response = await axios.post('/api/chocolates/create', {
          name: this.name,
          price: this.price,
          type: this.type,
          variety: this.variety,
          weight: this.weight,
          description: this.description,
          image: this.image,
          factoryId: this.factoryId, // Send factoryId
          quantity: 0,
          status: 'Out of Stock'
        });
        console.log('Chocolate added:', response.data);
        this.$router.push('/');
      } catch (error) {
        console.error('Error adding chocolate:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Local styles for the component */
</style>
