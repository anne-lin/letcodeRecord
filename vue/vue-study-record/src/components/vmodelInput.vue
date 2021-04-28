<template>
    <div>
        <input type="text" :value="phoneInfo" @input="$emit('input',$event.target.value)">
        <span v-show="isShowErrorMsg">{{errorMessage}}</span>
    </div>
</template>
<script>
export default {
    model:{
        prop:"phoneInfo",
        event:"input"
    },
    props:{
        validateFun:Function,
        phoneInfo:String,
        errorMessage:String
    },
    data() {
        return {
            isShowErrorMsg:false,
        }
    },
    watch:{
        phoneInfo:function(val){
            if(val === ""){
                this.isShowErrorMsg = false;
                return;
            }
            this.handleValidate(val);
        }
    },
    methods: {
        handleValidate(val){
            let res = this.validateFun(val);
            this.isShowErrorMsg = !res;
        }
    },
}
</script>
<style lang='less'>
</style>