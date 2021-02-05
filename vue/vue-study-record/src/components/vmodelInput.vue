<template>
    <div>
        <input type="text" :value="phoneInfo" @change="$emit('change',$event.target.value)">
    </div>
</template>
<script>
export default {
    model:{
        prop:"phoneInfo",
        event:"change"
    },
    props:["phoneInfo","zipCode"],
    data() {
        return {
        }
    },
    methods: {
        
    },
}
</script>
<style lang='less'>
</style>