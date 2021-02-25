<template>
    <div>
        childrenC
        <button @click="getHRef">get parentName</button>
        <span>username:{{getParentChildrenRef("username")}}</span>
    </div>
</template>

<script>
export default {
    data(){
        return {
            username:this.getParentChildrenRef("username")
        }
    },
    inject:{
        getParentChildrenRef: {
            from: "getChildrenRef",
            default: () => {}
        }
    },
    methods:{
        getHRef() {
            this.username=this.getParentChildrenRef("username");
            console.log(this.getParentChildrenRef("username"));
        }
    }
}
</script>

<style>

</style>