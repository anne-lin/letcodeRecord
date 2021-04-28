<template>
<div>
    <h3>秒杀倒计时</h3>
    <div>秒杀状态：{{time}}</div>
    <flash-button :buttonMsg="done ? '已参与购买':'立即购买'" v-on:buttonClick="done=true" :disabled="done"></flash-button>
</div>
</template>
<script>
import moment from "moment";
import flashButton from './flashButton.vue';

export default {
    components:{
        flashButton
    },
    props:{
        startTime:{
            type:Object,
            validator:function(val){
                return moment.isMoment(val)
            }
        },
        endTime:{
            type:Object, 
            validator:function(val){
                return moment.isMoment(val)
            }
        },
    },
    data() {
        return {
                buttonMsg:"立即购买",//已经购买，秒杀已结束,
                end:false,
                done:false,
                time:"",
                status:"活动未开始"
            }
    },
    async created(){
        const serverTime = await this.getServerTime();
        this.timeGap = Date.now() - serverTime;
        this.updateStatus();
        this.timeInterval = setInterval(()=>{
            this.updateStatus();
        },1000);
    },
    updated() {
        if(this.done || this.end){
            clearInterval(this.timeInterval);
        }
    },
    methods: {        
        updateStatus(){

        },
        getServerTime(){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve(new Date(Date.now() - 60*1000).getTime())
                },0)
            })
        }
    },
    beforeDestroy() { 
        clearInterval(this.timeInterval);
    }
}
</script>
<style lang='less'>
</style>