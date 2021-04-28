/**
 * Created by fei on 2015/12/8.
 */
define(["require", "wa_Constant", "wa_Counter", "wa_Tip", "wa_Log", "wa_Vm", "wa_RegisterHandler", "wa_Storage", "area_code", "RobotAgent","Utils"], function (require, constant, counter, tip, Log, vm, registerHandler, storage, areaCode, RobotAgent,utils) {
    "use strict";
    
    var states = constant.states;
    var events = constant.events;
    var setBusySuccessCallback = null;
    var getCallDataCallback = null;
    
    /**
     * 处理事件
     * @param data
     */
    function handleEvent(data) {
        Log.log("receive event: " + JSON.stringify(data));
        vm.doingState(null);    // 收到事件后清除正在状态
        var eventType = data.type;
        if (eventType === events.EVENT_AGENT_LOGIN) {
            //Log.log("登录成功");
            vm.alreadyLogin(true);
            vm.handlerLogout(false);
            vm.isMute(false);
            require('HRCookie').setCookie('sid', vm.sid, 365);
            //外显号
            var outBoundStr = data.ext.outBoundNumList;
            /* outBoundStr="059126487555|059126487555|01026487222|071926498999|043126480777|039426486666|039426486666";*/
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
            //TODO
            var awayStatusStr = data.ext.awayStatusList;
            //var awayStatusStr = "你好=0;喝水=1;吃饭=2;睡觉=3;开会=4;休息=5";
            vm.awayStatusList([]);
            if (awayStatusStr) {
                var len = awayStatusStr.length;
                var awayStatusArr = [];
                if (awayStatusStr.substr(len - 1, 1) == ";") {
                    awayStatusArr = (awayStatusStr.substring(0, len - 1)).split(";");
                } else {
                    awayStatusArr = awayStatusStr.split(";");
                }
                //var awayStatusArr = awayStatusStr.split(";");
                
                for (var j = 0; j < awayStatusArr.length; j++) {
                    var awayStatu = awayStatusArr[j].split("=");
                    vm.awayStatusList.push({ statuName: awayStatu[0], statuValue: awayStatu[1] });
                }
            }
            
            //IVR协助节点
            var ivrAssistStr = data.ext.ivrAssist;
            vm.ivrAssists([]);
            if (ivrAssistStr) {
                var ivrAssistArr = ivrAssistStr.split(',');
                var ivrAssistObj = {};
                for (var j = 0; j < ivrAssistArr.length; j++) {
                    var ivrNode = ivrAssistArr[j].split('|');
                    ivrAssistObj[ivrNode[0]] = ivrNode[1];
                }
                
                for (var key in ivrAssistObj) {
                    vm.ivrAssists.push({
                        key: key,
                        value: ivrAssistObj[key]
                    });
                }
            }
            
            //IVR回转节点
            var ivrRouterStr = data.ext.ivrTransfer;
            vm.ivrRouters([]);
            if (ivrRouterStr) {
                var ivrRouterArr = ivrRouterStr.split(',');
                var ivrRouterObj = {};
                for (var j = 0; j < ivrRouterArr.length; j++) {
                    var ivrNode = ivrRouterArr[j].split('|');
                    ivrRouterObj[ivrNode[0]] = ivrNode[1];
                }
                
                for (var key in ivrRouterObj) {
                    vm.ivrRouters.push({
                        key: key,
                        value: ivrRouterObj[key]
                    });
                }
            }
            
            // 技能组 WebAgent.skillInfo
            if(data.ext.skillInfo){
                WebAgent.userMessage.skillList = utils.formatSkillInfo(data.ext.skillInfo);
                WebAgent.userMessage.factSkillInfo = utils.formatSkillInfo(data.ext.factSkillInfo);
            }
            
            WebAgent.userMessage.agentName = data.ext.agentName;
            WebAgent.userMessage.nubeNum = data.ext.nubeNum;
            
            vm.agentRole(data.ext.agentType || "1");
            
            vm.loginMessage(null);
            
            // TODO 是否在登录成功的事件里做判断
            //如果勾选记住登录信息，则在localStorage中存储登录信息，否则清除
            vm.rememberLogin() ? storage.saveLoginInfo() : storage.clearLoginInfo();
            
        } else if (eventType === events.EVENT_NETTY_LOGIN_SUCCESS) {
            Log.log("Netty方式登录成功(已有Http方式登录)");
            vm.alreadyLogin(true);
            
            // 取出最近保存的事件，手动执行事件回调恢复状态
            var recentEvent = data.ext.currentEvent;
            handleEvent({
                type: recentEvent, ext: {}
            });
            
        } else if (eventType === events.EVENT_AGENT_LOGOUT) {
            var forceLogout = data.ext && data.ext.forceLogout == '1';
            var needLogin = data.ext && data.ext.needLogin == '1';
            Log.log("登出成功 - " + (forceLogout ? "异常登出" : "正常登出"));
            vm.alreadyLogin(false);
            vm.currentState(states.INIT);
            vm.operBoxDisplay(false);
            if (forceLogout || needLogin) {
                vm.loginMessage("您已被强制登出（可能在另一点登录或者服务异常）");
                WebAgent.isNormalError = true;
                vm.handlerLogout(true);
                //sip分机使用cphone或者butel分机时登出cphone
                if (vm.sipUseCphone() && vm.agentNumber && vm.agentNumber().indexOf("sip:") == 0) {
                    WebAgent.ButelAjax && WebAgent.ButelAjax.ajaxFunc("Logout", "logout", "");
                }
                if (window.CR) {
                    window.CR.logout();
                }
                //登出chat
                WebAgent.ChatLogout();
                // 登出后断开并重连socket，刷新会话，避免复杂问题
                require("wa_Socket").reconnectSocket();
                if(needLogin){
                    let t = setTimeout(function () {
                        let isSocketConnect = require("wa_Socket").isSocketConnect();
                        if(isSocketConnect){
                            WebAgent.multiChannelLogin(WebAgent, {
                                entId        : WebAgent.vm.entId(),
                                agentId      : WebAgent.vm.agentId(),
                                agentPassword: WebAgent.vm.agentPassword(),
                                agentNumber  : WebAgent.vm.agentNumber(),
                                waAutoLoginResult: false,
                            });
                            clearTimeout(t);
                            WebAgent.isConnect = true;
                        }
                    },5000)
                }
            }else{
                // 登出后断开并重连socket，刷新会话，避免复杂问题
                require("wa_Socket").reconnectSocket();
                WebAgent.isConnect = false;
            }
        } else if (eventType === events.EVENT_AGENT_LOGIN_FAIL) {
            Log.log("登录失败");
            if (data.ext && data.ext.errorMessage) {
                vm.loginMessage(data.ext.errorMessage);
            }
        } else if (eventType === events.EVENT_AGENT_READY) {
            Log.log("置闲成功");
            vm.currentState(states.READY);
            counter.stop().clear();     // 置闲 - 清空计时
        } else if (eventType === events.EVENT_AGENT_NOTREADY) {
            Log.log("置忙成功");
            vm.currentState(states.BUSY);
            counter.stop().clear();      // 置忙 - 清空计时
            setBusySuccessCallback && setBusySuccessCallback();
            setBusySuccessCallback = null;
        }else if (eventType === events.EVENT_AGENT_WORKSTATE) {
            Log.log("工作状态成功");
            vm.currentState(states.WORKING);
            counter.stop().clear();      // 置忙 - 清空计时
        } else if (eventType === events.EVENT_AGENT_AWAY) {
            Log.log("小休成功");
            vm.currentState(states.AWAY);
            counter.stop().clear();      // 置忙 - 清空计时
        } else if (eventType === events.EVENT_SET_AWAY_FAIL) {
            Log.log("小休失败");
            //vm.currentState(states.AWAY);
            //counter.stop().clear();      // 置忙 - 清空计时
        } else if (eventType === events.EVENT_OUTBOUND_ALERTING_TP) {
            Log.log("外呼坐席振铃");
            vm.currentState(states.AGENT_ALERTING);
        } else if (eventType === events.EVENT_OUTBOUND_CONNECTED_TP) {
            Log.log("外呼坐席接通");
            vm.currentState(states.AGENT_CONNECTED);
        } else if (eventType === events.EVENT_OUTBOUND_ALERTING_OP) {
            Log.log("外呼客户振铃");
            vm.currentState(states.CUSTOM_ALERTING);
        } else if (eventType === events.EVENT_OUTBOUND_CONNECTED_OP) {
            Log.log("外呼客户接通，双方通话");
            if (WebAgent.licenseCustomer != "1") {
                window.vm.sendState("msgFromAgentCallStart", "msgFromAgentCallStart", "PC");
                //传递技能组id(为视频推送提供服务)
                if (window.vm.callInUser() && window.vm.callInUser().isCalling) {
                    data.ext.chatType = window.vm.callInUser().chatType();
                    data.ext.skillName = window.vm.callInUser().skillName;
                } else if (window.vm.currentUser() && window.vm.currentUser().isCalling) {
                    data.ext.skillName = window.vm.currentUser().skillName;
                    data.ext.chatType = window.vm.currentUser().chatType();
                }
            }
            vm.currentState(states.CONNECTED);
            counter.start();    // 双方通话 - 开始计时
        } else if (eventType === events.EVENT_TP_DISCONNECT || eventType === events.EVENT_OP_DISCONNECT) {
            Log.log(eventType === events.EVENT_TP_DISCONNECT ? "坐席挂断" : "客户挂断");
            vm.operBoxDisplay(false);
            vm.isMute(false);
            WebAgent.licenseCustomer != "1" && window.vm.callEnd(data.ext.strDnis);
            require("dialog").hide(); //如果dialog在的话，隐藏
        } else if (eventType === events.EVENT_AGENT_HOLD) {
            Log.log("坐席保持");
            vm.currentState(states.HOLD);
        } else if (eventType === events.EVENT_HOLD_RETRIEVE) {
            Log.log("坐席保持接回，变为双方通话");
            vm.currentState(states.CONNECTED);
        } else if (eventType === events.EVENT_CONSULT_ALTERTING_OP) {
            Log.log("咨询振铃");
            vm.currentState(states.CONSULT_ALERTING);
        } else if (eventType === events.EVENT_CONSULT_CONNECTED_OP) {
            Log.log("咨询接通");
            vm.currentState(states.CONSULTED);
        } else if (eventType === events.EVENT_CONSULT_RETRIEVE) {
            Log.log("咨询接回，变为双方通话");
            vm.currentState(states.CONNECTED);
        } else if (eventType === events.EVENT_TRANSFER) {
            Log.log("转移事件，变为双方通话");
            WebAgent.licenseCustomer != "1" && window.vm.sendState("msgFromAgentCallStart", "msgFromAgentCallStart", "PC");
            vm.currentState(states.CONNECTED);
        } else if (eventType === events.EVENT_CONSULT_ALERTING_TP) {
            Log.log("被咨询振铃");
            vm.currentState(states.CONSULT_B_ALERTING);
        } else if (eventType === events.EVENT_CONSULT_CONNECTED_TP) {
            Log.log("被咨询接通");
            WebAgent.licenseCustomer != "1" && window.vm.sendState("msgFromAgentCallStart", "msgFromAgentCallStart", "PC");
            counter.start();
            vm.currentState(states.CONSULTED_B);
        } else if (eventType === events.EVENT_MONITOR_ALERTING) {
            Log.log("监听振铃");
            vm.currentState(states.OBSERVE_ALERTING);
        } else if (eventType === events.EVENT_MONITOR) {
            Log.log("监听接通");
            WebAgent.licenseCustomer != "1" && window.vm.sendState("msgFromAgentCallStart", "msgFromAgentCallStart", "PC");
            vm.currentState(states.OBSERVED);
            counter.stop().clear();
        } else if (eventType === events.EVENT_INBOUND_ALERTING) {
            Log.log("呼入坐席振铃");
            vm.currentState(states.AGENT_ALERTING);
        } else if (eventType === events.EVENT_INBOUND_CONNECTED) {
            Log.log("呼入坐席接通，变为双方通话");
            WebAgent.licenseCustomer != "1" && window.vm.sendState("msgFromAgentCallStart", "msgFromAgentCallStart", "PC");
            vm.currentState(states.CONNECTED);
            vm.callNumber(data.ext.strAni);
            counter.start();    // 双方通话 - 开始计时
        } else if (eventType === events.EVENT_FORCE_CONNECT) {
            Log.log("强插成功，变为会议状态");
            vm.currentState(states.CONFERENCED);
        } else if (eventType === events.EVENT_FORCE_DROP_SUCCESS) {
            vm.operBoxDisplay(false);
            WebAgent.licenseCustomer != "1" && window.vm.callEnd();
            Log.log("强拆事件");
        } else if (eventType === events.EVENT_CLEAR_CALL) {
            vm.operBoxDisplay(false);
            WebAgent.licenseCustomer != "1" && window.vm.callEnd();
            Log.log("全拆事件");
        } else if (eventType === events.EVENT_CONFERENCE) {
            if (data.ext.conferenceMembers == 4) {
                Log.log("四方会议本方接通事件");
                vm.meetingNum(data.ext.conferenceMembers);
                counter.start();
                vm.currentState(states.MP_CONFERENCE);
            } else {
                Log.log("会议事件");
                vm.currentState(states.CONFERENCED);
            }
        } else if (eventType === events.EVENT_QUIT_MONITOR_SUCCESS) {
            WebAgent.licenseCustomer != "1" && window.vm.callEnd();
            Log.log("监听退出/强插退出");
            vm.isMute(false);
        } else if (eventType === events.EVENT_INTERNAL_ALERTING_TP) {
            Log.log("发起方内呼振铃");
            vm.currentState(states.INTERNAL_ALERTING);
        } else if (eventType === events.EVENT_INTERNAL_ALERTING_OP) {
            Log.log("被内呼方振铃");
            // vm.currentState(states.INTERNAL_ALERTING);
        } else if (eventType === events.EVENT_INTERNAL_CONNECTED_TP) {
            Log.log("发起方内呼接通");
            WebAgent.licenseCustomer != "1" && window.vm.sendState("msgFromAgentCallStart", "msgFromAgentCallStart", "PC");
            vm.currentState(states.INTERNAL_CONNECTED);
            counter.start();    // 内呼接通 - 开始计时
        } else if (eventType === events.EVENT_INTERNAL_CONNECTED_OP) {
            WebAgent.licenseCustomer != "1" && window.vm.sendState("msgFromAgentCallStart", "msgFromAgentCallStart", "PC");
            Log.log("被内呼方内呼接通");
            vm.currentState(states.INTERNAL_CONNECTED);
            counter.start();    // 内呼接通 - 开始计时
        } else if (eventType === events.EVENT_AGENT_ACW) {
            Log.log("事后整理");
            vm.currentState(states.ACW);
            counter.stop();     // 事后整理 - 停止计时
        } else if (eventType === events.EVENT_SINGLE_STEP_TRANSFER_CONNECTED_TP) {
            WebAgent.licenseCustomer != "1" && window.vm.sendState("msgFromAgentCallStart", "msgFromAgentCallStart", "PC");
            Log.log("单步转移接通，变为双方通话");
            counter.start();    // 内呼接通 - 开始计时
            vm.currentState(states.CONNECTED);
        } else if (eventType === events.EVENT_SINGLE_STEP_TRANSFER_ALERTING_TP) {
            Log.log("单步转移振铃");
            vm.currentState(states.TRANSFER_ALERTING);
        } else if (eventType === events.EVENT_CALL_CONTROL_FAIL) {
            Log.log("话路控制失败");
            tip("话路控制失败: " + data.ext.errorMessage);
            
            //话路控制失败，恢复原来的状态，内呼失败用到
            if (vm.currentState() == constant.states.CONNECTING) {
                vm.currentState(states.BUSY);
            }
        } else if (eventType === events.EVENT_CONSULT_FAIL) {
            Log.log("咨询失败");
            tip("咨询失败: " + data.ext.errorMessage);
        } else if (eventType === events.EVENT_MONITOR_FAIL) {
            Log.log("监听失败");
            tip("监听失败: " + data.ext.errorMessage);
        } else if (eventType === events.EVENT_INTRUDE_FAIL) {
            Log.log("强插失败");
            tip("强插失败: " + data.ext.errorMessage);
        } else if (eventType === events.EVENT_FORCE_DROP_FAIL) {
            Log.log("强拆失败");
            tip("强拆失败: " + data.ext.errorMessage);
        } else if (eventType === events.EVENT_AGENT_BEHOLD) {
            Log.log("坐席被保持");
            vm.currentState(states.BEHOLD);
        } else if (eventType === events.EVENT_AGENT_BEUNHOLD) {
            Log.log("坐席被保持接回，变为双方通话");
            vm.currentState(states.CONNECTED);
            
            //使用面板时，ivr协助后获取随路数据
            if (vm.ui()) {
                //ivr协助返回的保持接回异步事件,获取随路数据
                var result = require("wa_Extend").getCallData("QNIVRRESULT", function (value) {
                    switch ( value ) {
                        case "0":
                            vm.ivrConfirmDialogResult("fail");
                            break;
                        case "1":
                            vm.ivrConfirmDialogResult("success");
                            break;
                        case "2": {
                            vm.ivrConfirmDialogResult("timeout");
                            break;
                        }
                        case "3": {
                            vm.ivrConfirmDialogResult("error");
                            break;
                        }
                        default :
                            break;
                    }
                });
                
                if (result.code === 0) {
                    Log.log("ivr协助，获取随路数据命令发送成功");
                } else {
                    Log.warn(result.msg);
                }
            }
            
        } else if (eventType === events.EVENT_GET_ASSOCIATE_DATA) {
            Log.log("获得随路数据返回事件");
            var callData = data.ext.result;
            getCallDataCallback && getCallDataCallback(callData);
            getCallDataCallback = null;
        } else if (eventType === events.EVENT_SET_ASSOCIATE_DATA) {
            Log.log("设置随路数据返回事件");
        } else if (eventType == events.EVENT_AGENT_GET_LIST) {
            vm.agentList([]);
            vm.workingAgentList([]);
            var agentListStr = data.ext.agentList;
            var agentListArr = agentListStr.split("|");
            var agentItem;
            for (var i = 0; i < agentListArr.length - 1; i++) {
                agentItem = agentListArr[i].split(":");
                vm.agentList.push({
                    agentName: agentItem[2],
                    agentId: agentItem[0]
                });
            }
            if(!vm.isGetWorkingAgent()){
                vm.skillList([]);
                //新增转接技能组,事件返回技能组列表
                //vm.skillList(data.ext.skillList.split("|") || []);
                var skillNameStr = data.ext.skillList;
                var skillNameArr = skillNameStr.split("|");
                for (var index in skillNameArr) {
                    vm.skillList.push({
                        skillName: skillNameArr[index]
                    });
                }
            }
            
        } else if (eventType === events.EVENT_AGENT_LOGIN_FAIL_ROBOT || eventType === events.EVENT_AGENT_NOTREADY_ROBOT || eventType === events.EVENT_AGENT_READY_ROBOT || eventType === events.EVENT_INBOUND_CONNECTED_ROBOT) {
            var agentRobot = isInRobotAgentList(data.agentId);
            var stateObj = {
                "EVENT_AGENT_LOGIN_FAIL_ROBOT": "logout",
                "EVENT_AGENT_NOTREADY_ROBOT": "busy",
                "EVENT_AGENT_READY_ROBOT": "ready",
                "EVENT_INBOUND_CONNECTED_ROBOT": "talk"
            };
            if (agentRobot) {
                agentRobot.state = stateObj[data.type];
            } else {
                vm.robotAgentList.push(new RobotAgent(data.agentId, stateObj[data.type]));
            }
        } else if (eventType === events.EVENT_MP_CONFERENCE_ALERTING_TP) {
            Log.log("多方会议本方振铃事件");
            vm.meetingNum(data.ext.conferenceMembers);
            vm.currentState(states.MP_CONFERENCE_ALERTING_TP);
        } else if (eventType === events.EVENT_MP_CONFERENCE_ALERTING_OP) {
            Log.log("多方会议对方振铃事件");
            vm.meetingNum(data.ext.conferenceMembers);
            vm.currentState(states.MP_CONFERENCE_ALERTING_OP);
        } else if (eventType === events.EVENT_MP_CONFERENCE_CONNECTED_TP) {
            Log.log("多方会议本方接通事件");
            vm.meetingNum(data.ext.conferenceMembers);
            counter.start();    // 内呼接通 - 开始计时
            vm.currentState(states.MP_CONFERENCE);
        } else if (eventType === events.EVENT_MP_CONFERENCE_CONNECTED_OP) {
            Log.log("多方会议对方接通事件");
            vm.meetingNum(data.ext.conferenceMembers);
            vm.currentState(states.MP_CONFERENCE);
        } else if (eventType === events.EVENT_MP_CONFERENCE_DISCONNECT_TP) {
            Log.log("多方会议本方挂断事件");
            vm.meetingNum(data.ext.conferenceMembers);
        } else if (eventType === events.EVENT_MP_CONFERENCE_DISCONNECT_OP) {
            Log.log("多方会议对方挂断事件");
            vm.currentState(states.CONFERENCED);
            vm.meetingNum(data.ext.conferenceMembers);
        } else if (eventType === events.EVENT_JOIN_CONFERENCE_FAIL) {
            Log.log("加入会议失败事件");
            vm.meetingNum(data.ext.conferenceMembers);
        } else if (eventType === events.EVENT_STARTCRYPTO) {
            Log.log("发起方:开启密语成功事件");
            counter.start();    // 内呼接通 - 开始计时
            vm.currentState(states.LAUNCH_CRYPTOLALIA);
        } else if (eventType === events.EVENT_BE_STARTCRYPTO) {
            Log.log("接收方:开启密语成功事件");
            vm.currentState(states.CRYPTOLALIA);
        } else if (eventType === events.EVENT_STARTCRYPTO_FAIL) {
            Log.log("开启密语失败事件");
        } else if (eventType === events.EVENT_STOPCRYPTO) {
            Log.log("关闭密语成功事件");
            vm.currentState(states.CONNECTED);
        } else if (eventType === events.EVENT_STOPCRYPTO_FAIL) {
            Log.log("关闭密语失败事件");
        } else if (eventType === events.EVENT_INTERCEPT_FAIL) {
            Log.log("拦截失败事件");
        } else if (eventType === events.EVENT_SINGLE_STEP_CONFERENCE_ALERTING_OP) {
            Log.log("单步会议对方振铃事件");
            vm.currentState(states.SINGLE_STEP_CONFERENCE_ALERTING);
        } else if (eventType === events.EVENT_SINGLE_STEP_CONFERENCE_ALERTING_TP) {
            Log.log("单步会议本方振铃事件");
            vm.currentState(states.SINGLE_STEP_CONFERENCE_ALERTING);
        } else if (eventType === events.EVENT_SINGLE_STEP_CONFERENCE_CONNECTED_OP) {
            Log.log("单步会议对方接通");
        } else if (eventType === events.EVENT_SINGLE_STEP_CONFERENCE_CONNECTED_TP) {
            Log.log("单步会议本方接通");
            counter.start();
        } else if (eventType === events.EVENT_SWTCH_SKILLGROUP_SUCCESS) {
            Log.log("技能组切换成功");
            if(data.ext.factSkillInfo){
                WebAgent.userMessage.factSkillInfo = utils.formatSkillInfo(data.ext.factSkillInfo);
            }
        } else if (eventType === events.EVENT_SWTCH_SKILLGROUP_FAIL) {
            Log.log("技能组切换失败");
        }
        
        // 执行自定义事件处理函数
        registerHandler.triggerEvent(data);
    }
    
    function isInRobotAgentList(robotId) {
        return vm.robotAgentList().find(function (item) {
            return item.robotId == robotId;
        });
    }
    
    return {
        setBusySuccessCallback: function (callback) {
            setBusySuccessCallback = callback;
        },
        setGetCallDataCallback: function (callback) {
            getCallDataCallback = callback;
        },
        handleEvent: handleEvent
    };
});
