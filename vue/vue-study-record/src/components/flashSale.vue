<template>
<div>
    <h3>秒杀倒计时</h3>
    {{time}}
</div>
</template>
<script>
import moment from "moment";

export default {
    props:{
        dateVal:{
            type:Date,
            validator:function(value){
                return value.getTime() > new Date().getTime()
            }
        }
    },
    data() {
        console.log(moment(304211-28800000).format("HH:mm:ss"))
        console.log(moment(new Date("2021-2-5 18:25:00").getTime()-new Date().getTime()).format("HH:mm:ss"))
        return {
                start:false,
                time:moment(this.dateVal.getTime()-new Date().getTime()).format("HH:mm:ss")
            }
    },
    mounted() {
        this.startClock();
    },
    methods: {
        startClock() { 
            clearInterval(this.clockInterval);
            this.clockInterval=setInterval(()=>{
                if(this.dateVal.getTime()-new Date().getTime() < 0){
                    clearInterval(this.clockInterval);
                    return;
                }
                this.time=moment(this.dateVal.getTime()-new Date().getTime()).format("HH:mm:ss")
            },1000);
        }
    },
    beforeDestroy() { 
        clearInterval(this.clockInterval);
    }
}
</script>
<style lang='less'>
</style>