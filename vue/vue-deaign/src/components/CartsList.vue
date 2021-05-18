<template>
  <div>
    <p v-show="!products.length">目前还没有商品</p>
    <ul>
      <li
        v-for="product in products"
        :key="product.id">
        {{ product.title }} - {{ product.price | currency }} x {{ product.quantity }}
      </li>
    </ul>
    <p>Total: {{ total | currency }}</p>
    <p><button :disabled="!products.length" @click="checkout(products)">Checkout</button></p>
    <p v-show="checkoutStatus">Checkout {{ checkoutStatus }}.</p>
  </div>
</template>
<script>
import {mapState,mapActions,mapGetters} from "vuex";

export default {
  data() {
    return {
    }
  },
  computed:{
    ...mapState({

    }),
    ...mapGetters({
      products:"cartProducts",
      total:"cartTotalPrice"
    })
  },
  methods: {
    checkout(products){
      this.$store.dispatch('cart/checkout', products)
    }
  },
}
</script>
<style lang='less'>
</style>