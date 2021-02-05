<template>
<div>
    <vmodel-input v-model="phoneInfo" :zip-code.sync="zipCode"></vmodel-input>

    <p>v-model native</p>
    <vmodel-input 
    :phone-Info="phoneInfo"
    @change="val=>(phoneInfo=val)"    
    ></vmodel-input>

    <p>async native</p>
    <async-native 
        :zip-code="zipCode"
        @update:zipCode="val=>(zipCode = val)"
    />
    <p>phoneInfo:{{phoneInfo}}</p>
    <p>zipCode:{{zipCode}}</p>
</div>
</template>
<script>
import VmodelInput from "./vmodelInput"
import AsyncNative from "./asyncNative"

export default {
    data() {
        return {
            phoneInfo:"",
            zipCode:"123"
        }
    },
    components:{
        VmodelInput,
        AsyncNative
    }
}   
</script>
<style lang='less'>
</style>