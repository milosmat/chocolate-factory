<template>
    <div>
      <h1>Moja Korpa</h1>
      <div v-if="cartItems.length > 0">
        <table>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Gramaža</th>
              <th>Tip</th>
              <th>Vrsta</th>
              <th>Cena</th>
              <th>Slika</th>
              <th>Količina</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in cartItems" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.weight }}g</td>
              <td>{{ item.type }}</td>
              <td>{{ item.variety }}</td>
              <td>{{ item.price }} RSD</td>
              <td><img :src="getChocolateImage(item.image)" alt="Chocolate Image" height="100px"/></td>
              <td>
                <input v-model.number="item.newQuantity" type="number" :min="1" :max="item.stockQuantity" />
                <button @click="confirmUpdateQuantity(index, item)">Potvrdi</button>
              </td>
              <td>
                <button @click="removeFromCart(index, item.cartId, item.id, item.quantity)">Ukloni</button>
              </td>
            </tr>
          </tbody>
        </table>
        <h2>Ukupna cena: {{ discountedTotalCartPrice }} RSD</h2>
        <button @click="placeOrder">Kupi</button>
      </div>
      <div v-else>
        <p>Vaša korpa je prazna.</p>
      </div>
    </div>
</template>
  
<script>
import axios from 'axios';
  
export default {
    data() {
        return {
            cartItems: [],
            totalCartPrice: 0,
            discountedTotalCartPrice: 0,
            currentUser: null,
            customerType: null
        };
    },
    mounted() {
        this.fetchCurrentUser();
    },
    methods: {
        async fetchCurrentUser() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/auth/current-user', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                this.currentUser = response.data;

                if (this.currentUser.customerType) {
                    const typeResponse = await axios.get(`/api/customer-types/${this.currentUser.customerType}`, {
                        headers: {
                            'x-auth-token': token
                        }
                    });
                    this.customerType = typeResponse.data;
                }

                await this.fetchCartItems();
            } catch (error) {
                console.error('Error fetching current user:', error);
                this.currentUser = null;
            }
        },
        async fetchCartItems() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/carts/user/${this.currentUser.id}/my-cart`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                const cartData = response.data;
        
                let items = [];
                for (let cart of cartData) {
                    for (let i = 0; i < cart.chocolates.length; i++) {
                        const chocolateId = cart.chocolates[i];
                        const chocolate = await this.fetchChocolateDetails(chocolateId);
                        const quantity = cart.itemQuantity[i];
                        items.push({
                            ...chocolate,
                            quantity,
                            newQuantity: quantity,
                            stockQuantity: chocolate.quantity, // Dodajemo stockQuantity za proveru limita
                            cartId: cart.id // Dodajemo cartId za API zahteve
                        });
                    }
                }
                this.cartItems = items;
                this.calculateTotalPrice();
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        },
        async fetchChocolateDetails(chocolateId) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/chocolates/${chocolateId}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching chocolate details:', error);
                return {};
            }
        },
        getChocolateImage(imagePath) {
            try {
                const imageName = imagePath.split('/').pop(); 
                return require('D:/web_projekat/chocolateFactory/Frontend/public/' + imageName);
            } catch (e) {
                console.error(`Image not found: ${imagePath}`);
                return '';
            }
        },
        async confirmUpdateQuantity(index, item) {
            if (item.newQuantity < 1 || item.newQuantity > item.stockQuantity) {
                alert(`Unesite količinu između 1 i ${item.stockQuantity}.`);
                item.newQuantity = Math.min(Math.max(item.newQuantity, 1), item.stockQuantity);
                return;
            }
        
            try {
                const token = localStorage.getItem('token');
                await axios.put(`/api/carts/user/${this.currentUser.id}/cart/${item.cartId}/update-quantity`, {
                    chocolateId: item.id,
                    quantity: item.newQuantity,
                }, {
                    headers: {
                        'x-auth-token': token,
                    }
                });
        
                item.quantity = item.newQuantity; // Ažuriranje trenutne količine na novu količinu
                this.calculateTotalPrice();
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        },
        async removeFromCart(index, cartId, chocolateId, quantity) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/carts/user/${this.currentUser.id}/cart/${cartId}/remove`, {
                    data: {
                        chocolateId,
                        quantity,
                    },
                    headers: {
                        'x-auth-token': token,
                    }
                });
        
                this.cartItems.splice(index, 1);
                this.calculateTotalPrice();
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        },
        async placeOrder() {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`/api/carts/user/${this.currentUser.id}/place-order`, {}, {
                    headers: {
                        'x-auth-token': token,
                    }
                });
                alert('Porudžbina je kreirana.');
                this.cartItems = [];
                this.totalCartPrice = 0;
                this.discountedTotalCartPrice = 0;
            } catch (error) {
                console.error('Error placing order:', error);
            }
        },
        calculateTotalPrice() {
            let total = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            if (this.customerType && this.customerType.discount) {
                const discount = total * (this.customerType.discount / 100);
                this.discountedTotalCartPrice = total - discount;
            } else {
                this.discountedTotalCartPrice = total;
            }
            this.totalCartPrice = total;
        },
    }
};
</script>
  
<style scoped>
/* Local styles for the component */
.factory-details img {
    width: 50px; /* Smanjena širina slike */
    height: 50px;
}
table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc; /* Dodan border na tabelu */
}
th, td {
    border: 1px solid #ccc; /* Dodan border na ćelije tabele */
    padding: 8px;
    text-align: left;
}
</style>
