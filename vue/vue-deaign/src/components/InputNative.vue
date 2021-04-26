<template>
<div>
  <div>
    input native:<input type="text" :value="inputVal" @input="$emit('change',$event.target.value)">
  </div>
</div>
</template>
<script>
export default {
  model:{
    prop:"inputVal",
    event:"change"
  },
  props:{
    inputVal:String
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