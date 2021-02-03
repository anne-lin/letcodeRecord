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
}
</script>
<style lang='less' scoped>
.fontColor{
    color:red;
}
</style>