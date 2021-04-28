<template>
<div>
    <button @click="updateData">updateData</button>
    <p>{{zipCode}}</p>
</div>
</template>
<script>
export default {
    props:["zipCode"],
    data() {
        return {
        }
    },
    methods: {
        updateData(){
            this.$emit('update:zipCode',"hahahaha");
        }
    },
}
</script>
<style lang='less'>
</style>