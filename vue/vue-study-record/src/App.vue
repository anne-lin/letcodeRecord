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
    
    <div>
      <h3>用户输入超过5秒再更新dom</h3>
      firstName:<input type="text" v-model="firstName">
      lastName:<input type="text" v-model="lastName">
      fullName:{{fullName}}
    </div>

    <flash-sale :date-val="dateVal"></flash-sale>
  </div>
</template>

<script>
import FlashSale from './components/flashSale.vue'
import TodoList from './components/todoList.vue'
import VmodelNative from "./components/vmodelNative"

export default {
  data(){
    return {
      inputTest:"",
      name1:"yinghan1",
      inputTest2:"",
      list:["1"],
      firstName:"",
      lastName:"",
      dateVal:new Date("2021-2-5 18:25:00")
    }
  },
  computed:{
    fullName:function(){
      return this.firstName + this.lastName
    }
  },
  components:{
    TodoList,
    VmodelNative,
    FlashSale
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
