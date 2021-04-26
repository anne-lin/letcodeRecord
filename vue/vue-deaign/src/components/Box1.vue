<template>
<div>
  <input v-model = "title">
  <button @click="changeTitle()">修改标题</button>
</div>
</template>
<script>
export default {
  data() {
    return {
      title:""
    }
  },
  methods: {
    changeTitle(){
      this.$emit("addTitle",this.title)
    }
  },
}
</script>
<style lang='less'>
</style>