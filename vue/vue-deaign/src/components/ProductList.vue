<template>
  <div>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.title }} - {{ product.price | currency }}

      （inventory: {{product.inventory}}）<!-- 这里可以自己加一下显示库存 -->
      <br>
      <button
        :disabled="!product.inventory"
        @click="addProductToCart(product)">
        Add to cart
      </button>
      </li>
    </ul>
  </div>
</template>
<script>
import {mapState,mapActions} from "vuex";

export default {
  data() {
    return {
    }
  },
  computed:mapState({
    products:state=>state.products.all
  }),
  methods: mapActions('cart',[
    "addProductToCart"
  ])
}
</script>
<style lang='less'>
</style>