/**
 * Created by fei on 2015/12/3.
 */
define(["require", "wa_io", "wa_Constant", "wa_Log", "wa_Vm", "wa_HandleEvent", "wa_HandleCommandResult", "wa_RegisterHandler","HRCookie"], function(require, io, constant, Log, vm, handleEvent, handleCommandResult, registerHandler,HRCookie) {
    "use strict";

    var socket;
    var timeout;
    var sid;

    var login = function (data) {
        if(data.type == "autoLogin" && data.code == -1 && !WebAgent.isNormalError){
            //异常情况下自动登入失败，代码执行登入agentProxy
            WebAgent.extend.login({
                entId        : vm.entId(),
                agentId      : vm.agentId(),
                agentPassword: vm.agentPassword(),
                agentNumber  : vm.agentNumber(),
                isForce : true
            });
        }
    };
    var handleConnected = function() {
        Log.info("连接服务器成功");
        if(timeout){
            clearTimeout(timeout);
        }else{
            sid = socket.id;
            WebAgent.vm.sid=sid;
            HRCookie.setCookie('sid', sid, 365);
        }
    };

    var handleDisconnected = function() {
        Log.warn("与服务器断开连接");
        WebAgent.disconnectError=false;
        WebAgent.removeResultHandler(login);

        if(WebAgent.isNormalError || vm.handlerLogout()) {
            if (vm.alreadyLogin()) {        // 区分是主动断开（登出后执行）还是被动断开（登录中服务断开），给予提示
                vm.loginMessage("连接断开");
            }

            vm.alreadyLogin(false);
            vm.currentState(constant.states.INIT);
            //WebAgent.removeResultHandler(login);

            //与服务器断开连接时清除doingState
            vm.doingState(null);
            return;
        }
        WebAgent.registerResultHandler(login);
        WebAgent.disconnectError=true;
        timeout=setTimeout(function () {
            console.log("执行报异常");
            // 执行自定义事件处理函数
            WebAgent.removeResultHandler(login);
            registerHandler.triggerEvent({
                type: constant.events.EVENT_SOCKET_ABNORMAL_DISCONNECT,
                ext: {
                    errorMessage: "socket异常断开"
                }
            });
        },15000);
    };

    var initSocket = function() {
        if (!io) {
            throw new Error("io is undefined, please check your socket.io importing.");
        }
        sid = HRCookie.getCookie('sid');

        //socket = io.connect(WebAgent.host);
        //socket = io(WebAgent.host, { transports: [ 'websocket' ] });
        socket = io(WebAgent.host, {
            path: WebAgent.agentProxyPath,
            transports: [ 'websocket' ],
            query: "lastSessionId=" + sid
        });
       // socket = io(WebAgent.host, { transports: [ 'polling' ] });

        //var judgeIE8 = navigator.userAgent.indexOf("MSIE 8.0");
        //var judgeIE9 = navigator.userAgent.indexOf("MSIE 9.0");
        //
        //if((judgeIE8 > 0) || (judgeIE9 > 0)) {
        //    socket = io.connect(WebAgent.host);
        //} else {
        //    /**
        //     * After some research and tests I found out that when using
        //     * netty-socketio as server, you need to specify the transport method on the client side
        //     */
        //    socket = io(WebAgent.host, { transports: [ 'websocket' ] });
        //}

        socket.on("connect", handleConnected);
        socket.on("disconnect", handleDisconnected);
        socket.on("event", handleEvent.handleEvent);
        socket.on("result", handleCommandResult);

        socket.on("connect_error", function(obj) {
            Log.info("connect_error" + obj);
        });

        socket.on("reconnect_attempt", function() {
            Log.info("reconnect_attemp");
        });

        socket.on("reconnecting", function(e) {
            //socket断开重连，
            Log.info("reconnecting");
            if(WebAgent.isMulticenter && e == WebAgent.agentProxyReconnectNum){
                WebAgent.currentHostIndex ++;
                if(WebAgent.currentHostIndex >= WebAgent.agentProxyUrlList.length){
                    Log.info("重连失败");
                    // WebAgent.currentHostIndex = 0;
                }else{
                    WebAgent.host = WebAgent.agentProxyUrlList[WebAgent.currentHostIndex][location.protocol];
                    socket.disconnect();
                    initSocket();
                    qnTool.initChatUrl()
                }
            }

            if(vm.handlerLogout()){
                var t = require("ButelAjax").getT();

                //console.log("setInterval:" + t);

                //清除查询cphone
                 if(t) {
                     clearInterval(t);
                     require("ButelAjax").setT(null);
                 }
            }


            //registerHandler.triggerEvent({
            //    type: constant.events.EVENT_SOCKET_RECONNECTING,
            //    ext: {
            //        errorMessage: "socket正在重连"
            //    }
            //});
        });

        socket.on("reconnect_error", function(obj) {
            Log.info("reconnect_error" + obj);
        });

        socket.on("reconnect_failed", function() {
            Log.info("reconnect_failed");
        });
    };

    /**
     * socket重连
     */
    var reconnectSocket = function() {
        socket.disconnect();
        setTimeout(function () {
            socket.connect();
        }, 500);
    };

    var states = constant.states;
    var commands = constant.commands;

    /**
     * 发送命令
     * @param commandObj
     */
    var sendCommand = function(commandObj) {
        if (socket) {

            //发送命令前赋值doingState
            var stateING = null;
            switch (commandObj.type) {
                case commands.MAKE_CALL:
                case commands.MAKE_CALL_INTERNAL:
                    stateING = states.CONNECTING;
                    break;
                case commands.CONSULT:
                    stateING = states.CONSULTING;
                    break;
                case commands.TRANSFER:
                case commands.SINGLE_TRANSFER:
                    stateING = states.TRANSFERRING;
                    break;
                case commands.CONFERENCE:
                    stateING = states.CONFERENCING;
                    break;
                case commands.OBSERVE:
                    stateING = states.OBSERVING;
                    break;
                case commands.FORCE_INSERT:
                    stateING = states.INSERTING;
                    break;
                case commands.FORCE_ABORT:
                    stateING = states.FORCE_ABORTING;
                    break;
                case commands.FULL_ABORT:
                    stateING = states.FULL_ABORTING;
                    break;
                case commands.JOIN_CONFERENCE:
                    stateING = states.MP_CONFERENCING;
                    break;
                default:
            }
            vm.doingState(stateING);

            Log.log("send command: " + JSON.stringify(commandObj));
            socket.emit("command", commandObj);
        } else {
            Log.error("服务未连接，操作无法进行");
        }
    };

    /**
     * 判断当前socket是否连接到服务器
     */
    var isSocketConnect = function() {
        return socket && socket.connected;
    };

    return {
        initSocket: initSocket,
        sendCommand: sendCommand,
        isSocketConnect: isSocketConnect,
        reconnectSocket: reconnectSocket
    }
});
