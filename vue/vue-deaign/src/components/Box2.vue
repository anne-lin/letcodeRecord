<template>
<div>
  标题：{{title}}
</div>
</template>
<script>
import event from "../util/event"
export default {
  data() {
    return {
      title:""
    }
  },
  mounted() {
    event.$on("onAddTitle",this.addTitleHandler)
  },
  methods: {
    addTitleHandler(data){
      this.title = data.title;
    }
  },
  beforeDestroy() {
    //为避免造成内存泄漏，自定义注册事件要及时销毁
    event.$off("onAddTitle",this.addTitleHandler)
  },
}
</script>
<style lang='less'>
</style>