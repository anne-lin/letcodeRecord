<template>
  <div>
    <div>
        <h3>聚名插槽</h3>
        <ul>
         <todo-list v-for="(item,index) in list" :key="index" :item="item" @changeName="changeName">
              <template v-slot:tip>
                <div>
                  tip
                </div>
              </template>
          </todo-list>
        </ul>
    </div>
    <div>
        <h3>作用域插槽（子组件向父组件传值）</h3>
        <input type="text" v-model="inputTest2" @change="addList">
        <ul >
         <todo-list v-for="(item,index) in list" :key="index" :item="item">
              <template v-slot:tip="itemProps">
                <div :style="{color:itemProps.checked ? 'red':'blue'}">
                  tip
                </div>
              </template>
          </todo-list>
        </ul>
    </div>
  </div>
</template>

<script>

import TodoList from './todoList.vue'

export default {
  data(){
    return {
      inputTest:"",
      name1:"yinghan1",
      inputTest2:"",
      list:["1"]
    }
  },
  beforeCreate() {
    console.log("父组件：beforeCreate");
  },
  created(){
    console.log("父组件：created");
  },
  beforeMount() {
        console.log("父组件：beforeMount");
  },
  mounted() {
        console.log("父组件：mounted");

  },
  beforeUpdate() {
        console.log("父组件：beforeUpdate");
  },
  updated() {
        console.log("父组件：updated");
  },
  beforeDestroy() {
        console.log("父组件：beforeDestroy");

  },
  destroyed() {
        console.log("父组件：destroyed");
  },
  computed:{
    
  },
  components:{
    TodoList,  
  },
  methods: {
    addList(e){
      this.list.push(e.target.value)
    },
    changeName(name){
      this.name1=name;
      return name;
    } 
  },
}
</script>
<style lang="less">
#app li span{
  color:sandybrown
}
</style>
