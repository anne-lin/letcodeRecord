/**
 * Created by fei on 2015/12/3.
 */
define(["wa_Log", "wa_Constant", "wa_Vm", "wa_Socket", "wa_HandleEvent"], function(Log, constant, vm, socket, handleEvent) {
    "use strict";

    /**
     * 对外接口
     */
    var extend = {};

    var commands = constant.commands;
    var states = constant.states;

    extend.login = function(params) {
        //if (!vm.loginEnabled()) { return { code : -1, msg : "Login denied" }; }
        if (!socket.isSocketConnect()) { return { code : -1, msg : "服务未连接" }; }

        params = params || {};

        if (!params.entId) { return { code : -2, msg : "企业编号必填" }; }
        if (!params.agentId) { return { code : -2, msg : "坐席工号必填" }; }
        //if (!params.agentNumber) { return { code : -2, msg : "坐席分机必填" }; }

        var isForce = !!params.isForce;

        vm.entId(params.entId);
        vm.agentId(params.agentId);
        vm.agentNumber(params.agentNumber);
        vm.agentPassword(params.agentPassword);
        vm.forceLogin(isForce);

        socket.sendCommand({
            type : vm.forceLogin() ? commands.FORCE_LOGIN : commands.LOGIN,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                number : vm.agentNumber(),
                password : vm.agentPassword(),
                businessType: params && params.businessType,
                assistants:params && params.assistants
            }
        });

        vm.doingState(states.LOGINING);

        return { code : 0 };
    };

    extend.logout = function() {
        //if (!vm.logoutEnabled()) { return { code : -1, msg : "logout denied" }; }

        socket.sendCommand({
            type : commands.LOGOUT,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        vm.handlerLogout(true);

        return { code : 0 };
    };

    extend.setBusy = function(callback) {
        if (!vm.busyEnabled()) { return { code : -1, msg : "set busy denied" }; }

        socket.sendCommand({
            type : commands.SET_BUSY,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        if(typeof callback == "function") {
            handleEvent.setBusySuccessCallback(callback);
        }

        return { code : 0 };
    };
    
    extend.setWorking = function() {
        if (!vm.workingEnabled()) { return { code : -1, msg : "set working denied" }; }
        
        socket.sendCommand({
            type : commands.SET_WORKING,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });
        
        return { code : 0 };
    };
    
    extend.setAway = function(awayVaule) {
        if (!vm.awayEnabled()) { return { code : -1, msg : "set away denied" }; }

        if (!awayVaule) { return { code : -2, msg : "小休状态必选" }; }

        socket.sendCommand({
            type : commands.SET_AWAY,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                awayStatus: awayVaule
            }
        });

        return { code : 0 };
    };

    extend.setReady = function() {
        if (!vm.readyEnabled()) { return { code : -1, msg : "set ready denied" }; }
        if (!window.vm.setReadyEnabled()) { return { code : -2, msg : "当前文本会话数达到上限，不可置闲" }; }

        socket.sendCommand({
            type : commands.SET_READY,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    /**
     * 外呼号码保护
     * 手机号码中间四位数字处理为*，座机号码最后四位数字处理为*
     * @param outCallNumber
     */
    var numberProtection = function(outCallNumber) {
        var regExpMobile = new RegExp("^((9|90)?)1[0-9]{10}$");
        var regExpTel = new RegExp("([0-9]{3,4}-)?[0-9]{7,8}");

        if(regExpMobile.test(outCallNumber)) {
            outCallNumber = outCallNumber.substring(0, outCallNumber.length - 8) + "****" + outCallNumber.substring(outCallNumber.length - 4, outCallNumber.length);
            return outCallNumber;
        }

        if(regExpTel.test(outCallNumber)) {
            outCallNumber = outCallNumber.substring(0, outCallNumber.length - 4) + "****";

            return outCallNumber;
        }
    };

    extend.makeCall = function(params) {        

        if (!vm.callEnabled()) { return Promise.reject({ code : -1, msg : "make call denied" }); }

        params = params || {};
        if (!params.outCallNumber) { return  Promise.reject({ code : -2, msg : "呼叫号码必填" }); }

        if(params.isIntellectCall){
            params.disNumber = ""
        }else{
            if(!params.disNumber){
                return  Promise.reject({code: -2, msg: '没有可用的外显号码'})
            }
        }

        let promise = WebAgent.WaParams.callNumValidate && (typeof WebAgent.WaParams.callNumValidate == "function") ? WebAgent.WaParams.callNumValidate(params.outCallNumber):Promise.resolve();

        return promise.then(function(){
                    vm.numberProtection(params.numberProtection);  //设置外呼号码是否被保护

                    vm.callNumber(params.numberProtection ? numberProtection(params.outCallNumber):params.outCallNumber);   
                    
                    socket.sendCommand({
                        type : commands.MAKE_CALL,
                        entId : vm.entId(),
                        agentId : vm.agentId(),
                        ext : {
                            to : params.outCallNumber,
                            ani : params.disNumber,
                            uuid : params.uuid,        // 附加唯一标识
                            userData:params.userData,
                            mediaType:params.mediaType || "1",
                            ignoreTimeQuantumsCallLimit:params.ignoreTimeQuantumsCallLimit || "false"
                        }
                    });
            
                    return { code : 0 };
                }).catch(function(err){
                    return Promise.reject(err);
                })
    };

    /**
     * 扩展外呼接口
     *
     * 若当前状态可以外呼，则直接外呼
     * 若当前状态可以置忙，则置忙后外呼
     * 其他状态下此操作将被拒绝
     * @param params
     * @returns {*}
     */
    extend.makeCallExt = function(params) {
        var makeCall = function() {
            return extend.makeCall(params);
        };

        if (vm.callEnabled()) {
            return makeCall();
        }

        if (!vm.busyEnabled()) { return { code : -1, msg : "make call ext denied."}; }

        return extend.setBusy(makeCall);
    };

    extend.makeCallInternal = function(params) {
        if (!vm.callInternalEnabled()) { return { code : -1, msg : "make call internal denied" }; }

        params = params || {};
        if (!params.inCallNumber && !params.skillGroupName && !params.workStateAgentId) { return { code : -2, msg : "呼叫号码必填" }; }

        vm.callNumber(params.inCallNumber || params.workStateAgentId);

        socket.sendCommand({
            type : commands.MAKE_CALL_INTERNAL,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                agentId : params.workStateAgentId ? '' : vm.callNumber(),
                skillGroupName:params.skillGroupName || "",
                mediaType:params.mediaType || "",
                workStateAgentId:params.workStateAgentId || ""
            }
        });

        return { code : 0 };
    };

    extend.hangup = function() {
        if (!vm.hangupEnabled()) { return { code : -1, msg : "hangup denied" }; }

        socket.sendCommand({
            type : commands.HANGUP,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    extend.reset = function() {
        if (!vm.resetEnabled()) { return { code : -1, msg : "reset denied" }; }

        socket.sendCommand({
            type : commands.RESET,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                state : null
            }
        });

        return { code : 0 };
    };

    extend.hold = function(params) {
        params = params || {};
        if(!params.isVideo && !vm.holdEnabled()){
            return { code : -1, msg : "hold denied" };
        }
        
        socket.sendCommand({
            type : commands.HOLD,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    extend.holdReturn = function() {
        if (!vm.holdReturnEnabled()) { return { code : -1, msg : "hold return denied" }; }

        socket.sendCommand({
            type : commands.HOLD_RETURN,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    extend.agentGetList = function(params) {
        socket.sendCommand({
            type : commands.AGENTGETLIST,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                workType : params
            }
        });

        return { code : 0 };
    }

    extend.consult = function(params) {
        if (!vm.consultEnabled()) { return { code : -1, msg : "consult denied" }; }

        params = params || {};
        if (!params.consultAgent) { return { code : -2, msg : "咨询号码必填" }; }
        if (!params.type) { return {code : -3, msg : "咨询类型必填" }; }

        socket.sendCommand({
            type : commands.CONSULT,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                to : params.consultAgent,
                type : params.type         // 1:内线咨询, 0:外线咨询
            }
        });
        return { code : 0 };
    };

    extend.consultReturn = function() {
        if (!vm.consultReturnEnabled()) { return { code : -1, msg : "consult return denied" }; }

        socket.sendCommand({
            type : commands.CONSULT_RETURN,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    extend.transfer = function() {
        if (!vm.transferEnabled()) { return { code : -1, msg : "transfer denied" }; }

        socket.sendCommand({
            type : commands.TRANSFER,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    extend.singleTransfer = function(params) {
        if (!vm.singleTransferEnabled()) { return { code : -1, msg : "single transfer denied" }; }

        params = params || {};
        if (!params.transferTo) { return { code : -2, msg : "转移号码必填" }; }
        if (!params.type) { return {code : -3, msg : "转移类型必填" }; }

        socket.sendCommand({
            type : commands.SINGLE_TRANSFER,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                to : params.transferTo,
                type : params.type    //1:单步转移内线，0:单步转移外线
            }
        });

        return { code : 0 };
    };

    extend.observe = function(params) {
        if (!vm.observeEnabled()) { return { code : -1, msg : "observe denied" }; }

        params = params || {};
        if (!params.observeAgentId) { return { code : -2, msg : "监听坐席必填" }; }

        socket.sendCommand({
            type : commands.OBSERVE,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                agentId : params.observeAgentId
            }
        });

        return { code : 0 };
    };


    /**
     * 扩展监听接口
     *
     * 若当前状态可以监听，则直接监听
     * 若当前状态可以置忙，则置忙后监听
     * 其他状态下此操作将被拒绝
     * @param params
     * @returns {*}
     */
    extend.observeExt = function(params) {
        var observe = function() {
            return extend.observe(params);
        };

        if (vm.observeEnabled()) {
            return observe();
        }

        if (!vm.busyEnabled()) { return { code : -1, msg : "observe ext denied."}; }

        return extend.setBusy(observe);
    };


    extend.forceInsert = function() {
        if (!vm.insertEnabled()) { return { code : -1, msg : "force insert denied" }; }

        socket.sendCommand({
            type : commands.FORCE_INSERT,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    extend.forceAbort = function() {
        if (!vm.forceAbortEnabled()) { return { code : -1, msg : "force abort denied" }; }

        socket.sendCommand({
            type : commands.FORCE_ABORT,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    extend.fullAbort = function() {
        if (!vm.fullAbortEnabled()) { return { code : -1, msg : "full abort denied" }; }

        socket.sendCommand({
            type : commands.FULL_ABORT,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    extend.conference = function() {
        if (!vm.conferenceEnabled()) { return { code : -1, msg : "conference denied" }; }

        socket.sendCommand({
            type : commands.CONFERENCE,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });

        return { code : 0 };
    };

    /**
     * 单步会议
     * @returns {{msg: string, code: number}|{code: number}}
     */
    extend.singleConference = function(params) {
        if (!vm.singleConferenceEnabled()) { return { code : -1, msg : "single conference denied" }; }

        params = params || {};
        if (!params.transferTo) { return { code : -2, msg : "会议呼叫信息必填" }; }
        if (!params.type) { return {code : -3, msg : "会议呼叫类型必填" }; }

        socket.sendCommand({
            type : commands.SINGLE_CONFERENCE,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                to : params.transferTo,
                type : params.type    //1:会议呼叫内线，0:会议呼叫外线，2:会议呼叫技能组，4:工作态坐席
            }
        });

        return { code : 0 };
    };

    extend.assistIVR = function(params) {
        if (!vm.assistIVREnabled()) { return { code : -1, msg : "assist IVR denied" }; }

        params = params || {};
        var callDataKey = params.key || "";
        var callDataValue = params.value || "";
        var checkIvrCardIdType = params.type;
        var ivrAssistsCardId= params.cardId || "";

       Log.log("params:",callDataValue+";type="+checkIvrCardIdType+";cardId="+ivrAssistsCardId);

        socket.sendCommand({
            type : commands.ASSIST_IVR,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                key:callDataKey,
                value:callDataValue+";type="+checkIvrCardIdType+";cardId="+ivrAssistsCardId
            }
        });

        return { code : 0 };
    };

    //extend.routerToIVR = function(params) {
    //    if (!vm.routerToIVREnabled()) { return { code : -1, msg : "router to IVR denied" }; }
    //
    //    params = params || {};
    //    var callDataKey = params.key || "SD";
    //    var callDataValue = params.value || "";
    //
    //    socket.sendCommand({
    //        type : commands.ROUTER_TO_IVR,
    //        entId : vm.entId(),
    //        agentId : vm.agentId(),
    //        ext : {
    //            key : callDataKey,
    //            value : callDataValue
    //        }
    //    });
    //
    //    return { code : 0 };
    //};

    extend.routerToIVR = function(param) {
        if (!vm.routerToIVREnabled()) { return { code : -1, msg : "router to IVR denied" }; }

        var callDataValue = param;

        socket.sendCommand({
            type : commands.ROUTER_TO_IVR,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                param : callDataValue
            }
        });

        return { code : 0 };
    };

    extend.setCallData = function(params) {
        if (!vm.setCallDataEnabled()) { return { code : -1, msg : "set call data denied" }; }

        params = params || {};
        var callDataKey = params.key || "";
        var callDataValue = params.value || "";

        socket.sendCommand({
            type : commands.SET_CALL_DATA,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                key : callDataKey,
                value : callDataValue
            }
        });

        return { code : 0 };
    };

    extend.getCallData = function(key, callback) {
        if (!vm.getCallDataEnabled()) { return { code : -1, msg : "get call data denied" }; }

        //if (!key) { return { code : -2, msg : "随路数据key必填" }; }

        socket.sendCommand({
            type : commands.GET_CALL_DATA,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                key : key || ""
            }
        });

        if (typeof callback === "function") {
            handleEvent.setGetCallDataCallback(callback);
        }

        return { code : 0 };
    };

    extend.pushVideo = function(params){
        if (!vm.holdEnabled()) { return { code : -1, msg : "hold denied" }; }

        if(!params){
            return  { code : -2, msg : "视频推送地址必填" }
        }
        socket.sendCommand({
            type : commands.PUSH_VIDEO,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                file:params.url
            }
        });

        return { code : 0 };
    }

    extend.sendDTMF = function(dtmf) {

        var regex = /^([0-9\#\*])+$/g; //匹配0-9*#

        if (!vm.sendDTMFEnabled()) { return { code : -1, msg : "send DTMF denied" }; }
        if (!dtmf) { return { code : -2, msg : "二次拨号号码不能为空" }; }
        if(!regex.test(dtmf)) {return {code : -2, msg : "二次拨号号码不合法，需由0123456789*#组成"};}

        socket.sendCommand({
            type : commands.SECOND_CALL,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                secondNum : dtmf
            }
        });

        return { code : 0 };
    };
    
    extend.joinConference = function(params) {
        if (!vm.joinConferenceEnabled()) { return { code : -1, msg : "Join ConferencmakeCalle denied" }; }
    
        params = params || {};
        if (!params.consultAgent) { return { code : -2, msg : "加入会议号码必填" }; }
        if (!params.type) { return {code : -3, msg : "加入会议类型必填" }; }
    
        socket.sendCommand({
            type : commands.JOIN_CONFERENCE,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                to : params.consultAgent,
                type : params.type         // 1:内线咨询, 0:外线咨询 2:会议呼叫技能组，4:工作态坐席
            }
        });
        return { code : 0 };
    };
    
    /**
     * 拦截坐席
     * @param params
     * @returns {{msg: string, code: number}|{code: number}}
     */
    extend.intercept = function(params) {
        if (!vm.observeEnabled()) { return { code : -1, msg : "intercept denied" }; }
        
        params = params || {};
        if (!params.observeAgentId) { return { code : -2, msg : "拦截坐席必填" }; }
        
        socket.sendCommand({
            type : commands.INTERCEPT,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                destAgentId : params.observeAgentId
            }
        });
        
        return { code : 0 };
    };
    
    /**
     * 开启密语
     * @param params
     * @returns {{msg: string, code: number}|{code: number}}
     */
    extend.startCrypto = function(params) {
        if (!vm.startCryptolaliaEnabled()) { return { code : -1, msg : "start cryptolalia denied" }; }
        
        socket.sendCommand({
            type : commands.START_CRYPTO,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });
        return { code : 0 };
    };
    
    /**
     * 开启密语
     * @param params
     * @returns {{msg: string, code: number}|{code: number}}
     */
    extend.stopCrypto = function(params) {
        if (!vm.stopCryptolaliaEnabled()) { return { code : -1, msg : "stop cryptolalia denied" }; }
        
        socket.sendCommand({
            type : commands.STOP_CRYPTO,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {}
        });
        return { code : 0 };
    };
    
    /**
     * 切换技能组
     */
    extend.switchSkillGroup = function (params) {
        console.log(params,'params');
        if(!params.skillGroupList){ return { code : -1, msg : "请至少选择一个技能组！" }; }
        
        socket.sendCommand({
            type : commands.SWITCH_SKILL_GROUP,
            entId : vm.entId(),
            agentId : vm.agentId(),
            ext : {
                skillGroupList: params.skillGroupList
            }
        });
        return { code : 0 };
    }

    return extend;
});
