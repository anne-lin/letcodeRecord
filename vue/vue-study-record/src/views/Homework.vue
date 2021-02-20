<template>
<div>
    <h3>vue作业</h3>
    <ul>
        <li>
            作业1：自定义校验input
            <vmodel-input
                v-model="phoneInfo"
               :validateFun="validateFun"
               errorMessage="校验错误"
            ></vmodel-input>
        </li>
    </ul>
</div>
</template>
<script>
import VmodelInput from "../components/vmodelInput"
export default {
    data() {
        return {
            phoneInfo:""
        }
    },
    methods: {
        validateFun(val){
           return /^[0-9]{5,11}$/.test(val);
        }
    },
     components:{
        VmodelInput
    }
}
</script>
<style lang='less'>
</style>