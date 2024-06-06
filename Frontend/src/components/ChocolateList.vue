<template>
  <div>
    <h1>Lista čokolada</h1>
    <table>
      <thead>
        <tr>
          <th>Ime</th>
          <th>Cena</th>
          <th>Tip</th>
          <th>Vrsta</th>
          <th>Težina</th>
          <th>Opis</th>
          <th>Status</th>
          <th>Količina</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="chocolate in chocolates" :key="chocolate._id">
          <td>{{ chocolate.name }}</td>
          <td>{{ chocolate.price }}</td>
          <td>{{ chocolate.type }}</td>
          <td>{{ chocolate.variety }}</td>
          <td>{{ chocolate.weight }}</td>
          <td>{{ chocolate.description }}</td>
          <td>{{ chocolate.status }}</td>
          <td>{{ chocolate.quantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ChocolateList',
  props: {
    chocolates: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
/* Stilizuj tabele prema potrebama */
</style>
