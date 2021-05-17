<template>
  <div>
    <ul>
      <li v-for="item in cartsList" :key="item.id">
        {{item.name}}({{item.count}})
        <button @click="$emit('addNum',item.id)">增加</button>
        <button @click="$emit('reduceNum',item.id)">减少</button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props:{
    cartsList:{
      type:Array,
      default:function(){
        return []
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