<template>
  <div>
        <input type="text" :value="phonNnumber" @change="$emit('change',$event.target.value)">
    <span v-show="isShowMessage">{{message}}</span>
  </div>
</template>

<script>
export default {
    model:{
        prop:"phonNnumber",
        event:"change"
    },
    props:{
        "phonNnumber":String,
        "message":String,
        "validateFun":Function
    },
    data(){
        return{
            isShowMessage:true
        }
    },
    watch:{
        phonNnumber:function(val){
            this.handleValidate(val);
        }
    },
    methods:{
        handleValidate(val){
            this.isShowMessage=!this.validateFun(val);
        }
    }
}
</script>

<style>

</style>