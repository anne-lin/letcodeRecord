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
        <li>
            作业2：防抖<br>
            first name:<input type="text" v-model="firstName"><br>
            last name:<input type="text" v-model="lastName"><br>
            fullName:{{fullName}}
        </li>
        <li>
            <router-link to="shopping">购物车</router-link>
        </li>
    </ul>
</div>
</template>
<script>
import VmodelInput from "../components/vmodelInput"
import flashSale from "../components/flashSale"
import moment from "moment"

export default {
    data() {
        return {
            phoneInfo:"",
            firstName:"",
            lastName:"",
            fullName:"",
            startTime:moment("2021-02-25 16:25"),
            endTime:moment("2021-02-25 16:35")
        }
    },
   /*  computed:{
        fullName:function(){
            return this.firstName+this.lastName
        }
    }, */
    watch:{
        firstName:function(val){
            clearInterval(this.firstTime);
            this.firstTime = setTimeout(()=>{
                this.fullName = val + this.lastName
            },500)
        }
    },
    methods: {
        validateFun(val){
           return /^[0-9]{5,11}$/.test(val);
        }
    },
     components:{
        VmodelInput,
        flashSale
    }
}
</script>
<style lang='less'>
</style>