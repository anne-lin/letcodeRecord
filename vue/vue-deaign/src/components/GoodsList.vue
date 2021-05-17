<template>
  <div>
    <ul>
      <li v-for="item in goodsList" :key="item.id">
        {{item.name}}-{{item.price}}
        <button @click="$emit('addCart',item.id)">加入购物车</button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props:{
    goodsList:{
      type:Array,
      default:function(){
        return [{
        id:"123",
        name:"haha",
        price:18
      }]
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>
<style lang='less'>
</style>