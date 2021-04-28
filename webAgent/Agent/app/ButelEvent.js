/**
 * Created by panfei on 2016/3/16.
 */
define(["RegisterEvent", "Vm"], function(registerEvent, vm) {
    var butelEvent = {};
    butelEvent.msgFromAgentButelAlerting = function(Cad, butelSessionId) {
        registerEvent.getButelState({type: "msgFromAgentButelAlerting"});
        if(Cad && Cad.CustomId) {
            vm.sendState("msgFromAgentButelAlerting", Cad.CustomId, "butel", {
                butelSessionId:butelSessionId
            });
            //console.log("[WebAgent] 坐席发送butel呼叫振铃事件");
        }
    };

    butelEvent.msgFromAgentButelConnected = function(Cad, butelSessionId) {
        registerEvent.getButelState({type: "msgFromAgentButelConnected"});
        if(Cad && Cad.CustomId) {
            vm.sendState("msgFromAgentButelConnected", Cad.CustomId, "butel",  {
                butelSessionId:butelSessionId
            });
            //console.log("[WebAgent] 坐席发送butel呼叫接通事件");
        }
    };

    butelEvent.msgFromAgentButelEnd = function(Cad, butelSessionId) {
        registerEvent.getButelState({type: "msgFromAgentButelEnd"});
        if(Cad && Cad.CustomId) {
            vm.sendState("msgFromAgentButelEnd", Cad.CustomId, "butel",  {
                butelSessionId:butelSessionId
            });
            //console.log("[WebAgent] 坐席发送butel呼叫结束事件");
        }
    };

    butelEvent.msgFromAgentButelAlertingAbort = function(Cad, butelSessionId) {
        registerEvent.getButelState({type: "msgFromAgentButelAlertingAbort"});
        if(Cad && Cad.CustomId) {
            vm.sendState("msgFromAgentButelAlertingAbort", Cad.CustomId, "butel",  {
                butelSessionId:butelSessionId
            });
            //console.log("[WebAgent] 坐席发送butel呼叫振铃取消事件");
        }
    };

    butelEvent.msgFromAgentButelLogin = function(errorCode) {
        registerEvent.getButelState({type: "msgFromAgentButelLogin", errorCode: errorCode});
        // vm.sendState("msgFromAgentButelLogin", "ButelLogin", "butel");
        //console.log("[WebAgent] 坐席视频登录成功");
    };

    butelEvent.msgFromAgentButelLogout = function(errorCode) {
        registerEvent.getButelState({type: "msgFromAgentButelLogout", errorCode: errorCode});
        vm.sendState("msgFromAgentButelLogout", "ButelLogout", "butel");
        //console.log("[WebAgent] 坐席视频登出成功");
    };

    butelEvent.msgFromAgentButelLogoutFail = function(errorCode) {
        registerEvent.getButelState({type: "msgFromAgentButelLogoutFail" , errorCode: errorCode});
        //console.log("[WebAgent] 坐席视频登出失败");
    };

    butelEvent.msgFromAgentButelLoginFail = function(errorCode) {
        registerEvent.getButelState({type: "msgFromAgentButelLoginFail" , errorCode: errorCode});
        //console.log("[WebAgent] 坐席视频登录失败");
    };

    return butelEvent;

});