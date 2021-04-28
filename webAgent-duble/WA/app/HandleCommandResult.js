/**
 * Created by fei on 2015/12/8.
 */
define(["wa_Constant","wa_Tip", "wa_Log", "wa_Vm", "wa_RegisterHandler", "wa_CheckInit","area_code"],
    function(constant, tip, Log, vm, registerHandler, checkInit,areaCode) {
    "use strict";

    var states = constant.states;
    var commands = constant.commands;
    /**
     * 处理控制同步返回结果
     * @param data
     */
    return function (data) {
        Log.log("receive result: " + JSON.stringify(data));
        var resultType = data.type;
        var code = data.code;
        var msg = data.msg;
        if (resultType === commands.AUTO_LOGIN) {
            if (code != 0) {
                Log.log("自动登录失败：" + msg);
                if(!WebAgent.disconnectError){
                    checkInit.autoLoginResult(false);
                    checkInit.autoLoginData(data);
                }else {
                    registerHandler.triggerResult(data);
                }
            } else {
                Log.log("自动登录成功");
                checkInit.autoLoginResult(true);
                checkInit.autoLoginData(data);
                vm.handlerLogout(false);
                var map = data.ext;
                vm.entId(map.entId);
                vm.agentId(map.agentId);
                vm.agentPassword(map.agentPwd);
                //vm.agentNumber(map.agentDn);
                //使用butel分机时，自动登录成功设置agentNumber为空，否则登出后再登录会提示“分机号码不存在”，导致登录失败
                vm.agentNumber(map.agentDn.indexOf('btl:') == 0 ? '': map.agentDn);
                vm.agentRole(map.agentType);
                vm.alreadyLogin(map.isAlreadyLogin == "true");
                var state = null;
                switch (map.agentStatus) {
                    case "Idle" :
                        state = states.READY;
                        break;
                    case "NotReady" :
                        state = states.BUSY;
                        break;
                    case "Ringing" :
                        state = states.AGENT_ALERTING;
                        break;
                    case "Acw" :
                        state = states.ACW;
                        break;
                    case "Held" :
                        state = states.HOLD;
                        break;
                    case "Talking" :
                        state = states.CONNECTED;
                        break;
                    case "loggedOut" :
                        state = states.LOGOUT;
                        break;
                    case "Dialing" :
                        state = states.CONNECTING;
                        break;
                    case "Away":
                        state = states.AWAY;
                        break;
                    case "WORKING":
                        state = states.WORKING;
                        break;
                }

                vm.currentState(state);

                //外显号
                var outBoundStr = map.outboundList;
                vm.outNumbers([]);
                if (outBoundStr) {
                    var outNumbersArr = outBoundStr.split("|");
                    var tmpOutNumber = [];
                    for (var i = 0; i < outNumbersArr.length; i++) {
                        // console.log(areaCode(outNumbersArr[i]));
                        if (tmpOutNumber.indexOf(outNumbersArr[i]) == -1) {
                            tmpOutNumber.push(outNumbersArr[i]);
                            vm.outNumbers.push({
                                "number": outNumbersArr[i],
                                "area": areaCode(outNumbersArr[i])
                            });
                        }
                        // vm.outNumbers.push(outNumbersArr[i] + " " +areaCode(outNumbersArr[i]));
                    }
                    vm.outNumbersTmp(vm.outNumbers().slice());
                    vm.disNumber(vm.outNumbers()[0].number + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + vm.outNumbers()[0].area);
                    vm.disNumberWa(vm.outNumbers()[0].number + vm.outNumbers()[0].area);
                }

                //小休子状态
                var awayStatusStr = map.awayStatusList;
                //var awayStatusStr = "你好=0;喝水=1;吃饭=2;睡觉=3;开会=4;休息=5";
                vm.awayStatusList([]);
                if(awayStatusStr) {
                    var len = awayStatusStr.length;
                    var awayStatusArr = [];
                    if(awayStatusStr.substr(len-1,1) == ";") {
                        awayStatusArr = (awayStatusStr.substring(0,len-1)).split(";");
                    } else {
                        awayStatusArr = awayStatusStr.split(";");
                    }
                    //var awayStatusArr = awayStatusStr.split(";");

                    for(var j = 0; j < awayStatusArr.length; j++) {
                        var awayStatu = awayStatusArr[j].split("=");
                        vm.awayStatusList.push({statuName: awayStatu[0], statuValue: awayStatu[1]});
                    }
                }

                //IVR协助节点
                var ivrAssistStr = map.ivrAssist;
                vm.ivrAssists([]);
                if(ivrAssistStr) {
                    var ivrAssistArr = ivrAssistStr.split(',');
                    var ivrAssistObj = {};
                    for(var j = 0; j < ivrAssistArr.length; j++) {
                        var ivrNode = ivrAssistArr[j].split('|');
                        ivrAssistObj[ivrNode[0]] = ivrNode[1];
                    }

                    for(var key in ivrAssistObj) {
                        vm.ivrAssists.push({
                            key: key,
                            value: ivrAssistObj[key]
                        });
                    }
                }

                //IVR回转节点
                var ivrRouterStr = map.ivrTransfer;
                vm.ivrRouters([]);
                if(ivrRouterStr) {
                    var ivrRouterArr = ivrRouterStr.split(',');
                    var ivrRouterObj = {};
                    for(var j = 0; j < ivrRouterArr.length; j++) {
                        var ivrNode = ivrRouterArr[j].split('|');
                        ivrRouterObj[ivrNode[0]] = ivrNode[1];
                    }

                    for(var key in ivrRouterObj) {
                        vm.ivrRouters.push({
                            key: key,
                            value: ivrRouterObj[key]
                        });
                    }
                }
                registerHandler.triggerResult(data);

            }
            checkInit.setAutoLoginFinish().checkInitSuccess();

            } else if (resultType === commands.LOGIN || resultType === commands.FORCE_LOGIN) {
                if (code != 0) {
                    Log.log("登录失败: " + msg);
                    vm.loginMessage(msg);
                    vm.doingState(null);
                    if(WebAgent.isConnect){
                        let t = null;
                        function onConnect() {
                            if(WebAgent.connectNum >= 0){
                                t = setTimeout(function () {
                                    WebAgent.multiChannelLogin(WebAgent, {
                                        entId        : WebAgent.vm.entId(),
                                        agentId      : WebAgent.vm.agentId(),
                                        agentPassword: WebAgent.vm.agentPassword(),
                                        agentNumber  : WebAgent.vm.agentNumber(),
                                        waAutoLoginResult: false,
                                    });
                                    clearTimeout(t);
                                    WebAgent.connectNum --;
                                },5000)
                            }else{
                                WebAgent.isConnect = false;
                                WebAgent.connectNum = 14;
                            }
                        }
                        onConnect();
                    }
                }else{
                    WebAgent.isConnect = false;
                    WebAgent.connectNum = 14;
                }
            registerHandler.triggerResult(data);
            } else {
                if (code != 0) {
                    tip(msg);
                    vm.doingState(null); //发送命令失败清除doingState
                }
                registerHandler.triggerResult(data);
            }

            // 设置"正在xxx"的状态 ("000" == 0 -> true)
            //if (code == 0) {
            //    var stateING = null;
            //    switch (resultType) {
            //        case commands.MAKE_CALL:
            //        case commands.MAKE_CALL_INTERNAL:
            //            stateING = states.CONNECTING;
            //            break;
            //        case commands.CONSULT:
            //            stateING = states.CONSULTING;
            //            break;
            //        case commands.TRANSFER:
            //        case commands.SINGLE_TRANSFER:
            //            stateING = states.TRANSFERRING;
            //            break;
            //        case commands.CONFERENCE:
            //            stateING = states.CONFERENCING;
            //            break;
            //        case commands.OBSERVE:
            //            stateING = states.OBSERVING;
            //            break;
            //        case commands.FORCE_INSERT:
            //            stateING = states.INSERTING;
            //            break;
            //        case commands.FORCE_ABORT:
            //            stateING = states.FORCE_ABORTING;
            //            break;
            //        case commands.FULL_ABORT:
            //            stateING = states.FULL_ABORTING;
            //            break;
            //        default:
            //    }
            //    stateING && vm.doingState(stateING);
            //}

            //registerHandler.triggerResult(data);
        };
    });
