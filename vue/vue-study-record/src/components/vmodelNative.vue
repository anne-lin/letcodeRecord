<template>
<div>
    <vmodel-input v-model="phoneInfo" :zip-code.sync="zipCode"></vmodel-input>
    <vmodel-input :phone-Info="phoneInfo"></vmodel-input>
</div>
</template>
<script>
import VmodelInput from "./vmodelInput"

export default {
    data() {
        return {
        }
    },
    components:{
        VmodelInput
    }
}   
</script>
<style lang='less'>
</style>