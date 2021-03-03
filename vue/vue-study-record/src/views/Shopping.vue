<template>
<div>
    <h3>购物车示例</h3>
    <div>
        账号：{{email}}
    </div>
    <br>
    <h4>产品</h4>
    <ProductList/>
    <hr>
    <h4>清单</h4>
    <ShoppingCart/>
</div>
</template>
<script>
import { mapState } from 'vuex'

import ProductList from '../components/shopping/ProductList.vue'
import ShoppingCart from '../components/shopping/ShoppingCart.vue'

export default {
    data() {
        return {
        }
    },
    computed: mapState({
        email: state => state.username
    }),
      components: { ProductList, ShoppingCart }
}
</script>
<style lang='less'>
</style>