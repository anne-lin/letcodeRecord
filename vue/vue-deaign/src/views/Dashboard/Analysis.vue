<template>
<div>
  <p>分析页</p>
  <div>
    <button @click="incrementAdd1()">+1</button>
    <button @click="incrementAdd2($event,2)">+2</button>
    <div>result:{{value}}</div>
  </div>
  <div>
    <p>兄弟组件间的通信</p>
    <box-1 @addTitle = "addTitle"></box-1>
    <box-2></box-2>
  </div>
  <div>
    <p>input原生</p>
    <div>
      input native:<input type="text" :value="inputVal1" @input="handleChange">
      {{inputVal1}}
    </div>
    <div>
      自定义input组件
      <input-native v-model="inputVal"></input-native>
      {{inputVal}}
    </div>
  </div>
  <div>
    <ul ref="list">
      <li v-for="(item,index) in list" :key="index">
        {{item}}
      </li>
    </ul>
    <button @click="addList">增加列表</button>
  </div>
</div>
</template>
<script>
import Box1 from "../../components/Box1"
import Box2 from "../../components/Box2"
import event from "../../util/event"
import InputNative from "../../components/InputNative"

export default {
  components:{
    Box1,
    Box2,
    InputNative
  },
  methods: {    
     handleChange(event){
      this.inputVal1 = event.target.value;
    },
    addTitle(title){
      event.$emit("onAddTitle",{
        title
      })
    },
    incrementAdd1(){
      this.value++;
    },
    incrementAdd2(event,add){
      this.value+=add;
      console.log(event);
    },
    addList(){
      this.list.push("d");
      this.$nextTick(()=>{
        console.log(this.$refs["list"].childNodes.length)
      })
    }
  },
   data() {
    return {
      value:0,
      inputVal1:"",
      inputVal:"",
      list:["a","b","c"]
    }
  },
}
</script>
<style lang='less'>
</style>