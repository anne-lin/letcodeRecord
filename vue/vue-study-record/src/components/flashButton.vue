<template>
<div>
    <button @click="$emit('buttonClick')" :disabled="disabled">{{buttonMsg}}
    </button>
</div>
</template>
<script>
export default {
    props:{
        buttonMsg:String,
        disabled:Boolean
    },
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