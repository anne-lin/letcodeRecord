<template>
    <ul>
        <li
            v-for="product in products" :key="product.id"
        >      
        {{ product.title }} - {{ product.price }} - {{product.inventory}}
        <br>
        <button :disabled="!product.inventory" @click="addProductToCart(product)">加入购物车</button>
        <input type="number" >
        <button :disabled="!product.inventory" @click="addProductToCartBatch(product)">批量加入购物车</button>
        </li>
    </ul>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
    data() {
        return {
        }
    },
    created(){
        this.$store.dispatch('products/getAllProducts');
    },
    computed:mapState({
       products:state => state.products.all 
    }),
    methods: mapActions('cart',["addProductToCart"])
}
</script>
<style lang='less'>
</style>