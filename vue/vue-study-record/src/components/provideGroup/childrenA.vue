<template>
    <div>
        childrenA
        <input type="text" v-model="username">
        <ChildrenB />
    </div>
</template>

<script>
import ChildrenB from "./childrenB"
export default {
    data(){
        return {
            username:""
        }
    },
    components: {
        ChildrenB    
    },
    provide() {
        return {
            setChildrenRef: (name, ref) => {
                this[name] = ref;
            },
            getChildrenRef: name => {
                return this[name];
            },
            getRef: () => {
                return this;
            }
        };
    }
}
</script>

<style>

</style>
