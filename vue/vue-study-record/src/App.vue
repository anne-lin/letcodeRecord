<template>
  <div id="app">
    <div>
        <h3>聚名插槽</h3>
        <input type="text" v-model="inputTest" @change="addList">
        {{name1}}
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
    <div>
      <h3>v-model实现</h3>
      <vmodel-native></vmodel-native>
    </div>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->
  </div>
</template>

<script>
import TodoList from './components/todoList.vue'
import VmodelNative from "./components/vmodelNative"

export default {
  data(){
    return {
      inputTest:"",
      name1:"yinghan1",
      inputTest2:"",
      list:["1"]
    }
  },
  components:{
    TodoList,
    VmodelNative
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
