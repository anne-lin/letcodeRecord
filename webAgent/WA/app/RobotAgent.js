define(["knockout", "require", "wa_Log", "wa_Counter"], function (ko, require, Log, Counter) {
    function robotAgent(robotId,state){
        var recordTime;
        var self=this;
        this.robotId=robotId;
        this.robotNum;
        this.state=state;
        this.callDuration=0;
        this.getCallTime=function(){
            if(this.state == "talk"){
                recordTime=setInterval(function() {
                    //Counter.getTimeFormat(self.callDuration);
                    self.callDuration++;
                }, 1000);
            }
        }
        this.clearCallTime = function(){
            clearInterval(recordTime);
            self.callDuration=0;
        }
    }
    return robotAgent;
})