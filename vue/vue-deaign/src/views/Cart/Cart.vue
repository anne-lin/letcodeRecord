<template>
<div>
  <p>购物车</p>
  <goods-list :goodsList="goodsList" @addCart="addCart"></goods-list>
  <br>
  <cart-list :cartList="cartList" @addNum="addNum" @reduceNum="reduceNum"></cart-list>
</div>
</template>
<script>
import CartList from '../../components/CartList.vue';
import GoodsList from '../../components/GoodsList.vue'
export default {
  components:{
    GoodsList,
    CartList
  },
  data() {
     return {
       goodsList:[{
          id:"1",
          name:"haha1",
          price:18,
          count:100
       },{
          id:"2",
          name:"haha2",
          price:18,
          count:100
       },{
          id:"3",
          name:"haha3",
          price:18,
          count:100
       },{
          id:"4",
          name:"haha4",
          price:18,
          count:100
       },{
          id:"5",
          name:"haha5",
          price:18,
          count:100
       },],
       cartList:[]
      }
  },
  methods: {
    addCart:function(id){
      let {goodsList,cartList}=this;
      let goods=goodsList.find(item=>item.id == id);

      let cartsGoods=cartList.find(item=>item.id==id);
      if(cartsGoods){
        cartsGoods.count++;
      }else{
        this.cartList.push({
          ...goods,
          count:1
        });
      }
      console.log(this.cartList);
    },
    reduceNum:function(){

    },
    addNum:function(){

    }
  },
  
}
</script>
<style lang='less'>
</style>