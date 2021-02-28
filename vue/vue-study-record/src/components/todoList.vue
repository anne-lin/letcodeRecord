<template>
<div>
    <li>
        <span class="fontColor">{{item}}</span>
        <input type="checkbox" v-model="checked">
        <slot name="tip" v-bind="{checked}"></slot>
        <button @click="handleName">changName</button>
    </li>
</div>
</template>
<script>
export default {
    props:["item"],
    data() {
        return {
            checked:false
        }
    },
    methods: {
        handleName(){
            console.log("test:",this.$emit("changeName","wentao"))
        }
    },
    beforeCreate() {
    console.log("子组件：beforeCreate");
  },
  created(){
    console.log("子组件：created");

  },
  beforeMount() {
        console.log("子组件：beforeMount");

  },
  mounted() {
        console.log("子组件：mounted");

  },
  beforeUpdate() {
        console.log("子组件：beforeUpdate");

  },
  updated() {
        console.log("子组件：updated");

  },
  beforeDestroy() {
        console.log("子组件：beforeDestroy");

  },
  destroyed() {
        console.log("子组件：destroyed");

  },
}
</script>
<style lang='less' scoped>
.fontColor{
    color:red;
}
</style>