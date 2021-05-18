<template>
  <div>
    <p>购物车Vuex</p>
    <product-list></product-list>
    <br>
    <carts-list></carts-list>
  </div>
</template>
<script>
import ProductList from '../../../../vue-study-record/src/components/shopping/ProductList.vue'
import CartsList from '../../components/CartsList.vue'
export default {
  components: { CartsList, ProductList },
  data() {
    return {
    }
  }
}
</script>
<style lang='less'>
</style>