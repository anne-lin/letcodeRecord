/**
 * Created by panfei on 2016/3/18.
 */

define(["require","TLog","MultiRegisterEvent"], function(require,TLog,MultiRegisterEvent) {
    var t = null;
    var agentStatuLast = "";
    var butelStateLast = "";
    var serviceFlag = false;
    var alertingFlag = false;
    var loginFlag = false;
    var errorCodeLast = 0;
    var Butel = {};
    var butelSessionId;
    // var isError = false;
    var loginInfo;
    var reLoginTime = 0;
    var isCphoneOffline = false; //cphone掉线（404）
    var webAgentLogout = false;
    /**
     * ajax函数
     * @param url
     * @param callback
     */
    Butel.ajaxFunc = function(url,callback, loginMeg) {
        //if(callback == "login") {
        //    console.log("ButelAjaxLogin:" + url);
        //}
        $.ajax({
            url: WebAgent.cphoneParams.cphoneUrl + url + '?callback=?' + loginMeg,
            // url: "http://localhost:8080/" + url + "?callback=?" + loginMeg,
            dataType: "jsonp",
            //jsonpCallback: callback,
            global:false,
            success: function(data) {
                isCphoneOffline = false;
                WebAgent.canWriteLog = true;
                switch(callback) {
                    case "login":
                        /**
                         * 由于cphone增加心跳机制后，心跳超时登出cphone，不能通知多渠道，多渠道没办法更新butel相关状态,
                         * butel状态标识还是登录状态，导致下次登录登录不上，所以每次调用登录接口时，butel相关状态清空
                         */

                        if(!loginInfo){
                            loginInfo=loginMeg;
                            TLog.log("Cphone:loginInfo:"+loginInfo);
                        }
                        butelStateLast = "";
                        agentStatuLast = "";
                        errorCodeLast = 0;
                        loginFlag = false;
                        login(data);
                        break;
                    case "queryState":
                        queryState(data);
                        break;
                    case "logout":
                        logout(data);
                        break;
                    default:
                        break;
                }
            },
            error: function(data){
                WebAgent.canWriteLog = false;
                if (callback === 'login') {
                    require("RegisterEvent").butelAjaxError(data);
                    // cphone登陆失败的提示
                    $("#result").text('登录失败，请重启CPhone后重新登录');
                } else if(callback == 'queryState') {
                    if (!isCphoneOffline) {
                        TLog.log('CPhone登录失败，请重启CPhone后重新登录');
                        MultiRegisterEvent.cphoneUnlogged({type:'cphoneUnlogged',msg:"CPhone登录失败，请重启CPhone后重新登录"});
                        isCphoneOffline = true
                    }
                }
                TLog.log("Cphone:" + callback + "Error:" + JSON.stringify(data));
            }
        });
    };

    //设置计时器的值
    Butel.setT = function(timer) {
        t = timer;
    }

    //获取计时器的值
    Butel.getT = function() {
        return t;
    }

    /**
     * 登录成功后的回调
     * @param data
     */
    function login(data) {
        TLog.log("Cphone:butelLogin回调" + data.ret);
        if(!t) {
            t = setInterval(function() {Butel.ajaxFunc("getStatus", "queryState", "")}, 1000);
        }
    }

    /**
     * 查询成功回调
     * @param data
     */
    function queryState(data) {
        // data = JSON.parse(data);
        // var butelState = data.ButelState;
        var butelState = data.WebRTCAgentState;
        var agentStatus = data.AgentStatus;
        var errorCode = parseInt(data.ErrorCode);
        /**
         * 音频、视频振铃事件中，从cphone获取随路数据（该数据为IM客户端通过flash传输给红云，cphone从红云底层cbg中获取；数据格式json）；
         * */
        var CadObj = data.Cad;

        console.log("[webAgent-CphoneState-ButelState]:" + butelState + ", AgentStatus:" + agentStatus + ", errorCode: " + errorCode);

        if(agentStatuLast != agentStatus) {
            agentStatuLast = agentStatus;
            //console.log("[ButelAgentStatuLast]-" + agentStatuLast);
            switch(agentStatuLast) {
                case "Audio":
                    return;
                case "Alerting":
                    butelSessionId = data.butelsessionId;
                    alertingFlag = true;
                    // if(WebAgent.licenseCustomer != "1"){
                    //     require("ButelEvent").msgFromAgentButelAlerting(CadObj, butelSessionId);
                    // }
                    TLog.log("Cphone:CphoneState-ButelAlerting");
                    break;
                case "Servicing":
                    serviceFlag = true;
                    // if(WebAgent.licenseCustomer != "1") {
                    //     require("ButelEvent").msgFromAgentButelConnected(CadObj, butelSessionId);
                    // }
                    TLog.log("Cphone:CphoneState-ButelConnected");
                    break;
                case "UnService":
                    if((butelState != "UnLogged") && alertingFlag) {
                        if(WebAgent.licenseCustomer != "1"){
                            if(serviceFlag) {
                                // require("ButelEvent").msgFromAgentButelEnd(CadObj, butelSessionId);
                                TLog.log("Cphone:CphoneState-ButelEnd");
                            } else {
                                // require("ButelEvent").msgFromAgentButelAlertingAbort(CadObj, butelSessionId);
                                TLog.log("Cphone:CphoneState-ButelAlertingAbort");
                            }
                        }
                        serviceFlag = false;
                        alertingFlag = false;
                    }
                    break;
                default:
                    break;
            }
        }

        if((butelStateLast != butelState) || (errorCodeLast != errorCode)) {
            butelStateLast = butelState;
            errorCodeLast = errorCode;

            switch(butelStateLast) {
                case "Logged":
                    if(errorCode === 0) {
                        loginFlag = true;
                        if(WebAgent.licenseCustomer != "1"){
                            require("ButelEvent").msgFromAgentButelLogin(errorCode); //发布给multiChannelLoginOut的登录事件，且发送状态给open_fire
                        }else {
                            //require("RegisterEvent").butelAjaxError(data)
                            require("RegisterEvent").getButelState({type: "msgFromAgentButelLogin", errorCode: errorCode}); // 发布给multiChannelLoginOut的登录事件
                        }
                        TLog.log("Cphone:Cphone登录成功");
                        //登录成功
                    }
                    if(errorCode < 0) {
                        if(WebAgent.licenseCustomer != "1"){
                            require("ButelEvent").msgFromAgentButelLogoutFail(errorCode);
                        }
                        TLog.log("Cphone:Cphone登出失败");
                    }
                    break;
                case "UnLogged":
                    //异常情况断开butel离线，恢复butel状态
                    if(loginFlag && WebAgent.disconnectError){
                        Butel.ajaxFunc("Login", "login", loginInfo);
                        Tlog.log('Cphone:异常断开后重新登录' + reLoginTime);
                        return;
                    }
                    if(loginFlag && (errorCode === 0)) {
                        if(WebAgent.licenseCustomer != "1"){
                            if(webAgentLogout){ //调用登出时才登出
                                require("ButelEvent").msgFromAgentButelLogout(errorCode);
                                TLog.log("Cphone:Cphone登出成功");
                                webAgentLogout = false;
                                loginFlag = false;
                                loginInfo="";
                                if(t) {
                                    clearInterval(t);
                                    t = null;
                                }
                                // 主动退出 不走下面的代码
                                break;
                            }else {  //异常情况
                                Tlog.log("Cphone:CPhone连接失败，请重新登录");
                                MultiRegisterEvent.cphoneUnlogged({type:'cphoneUnlogged',msg:"CPhone连接失败，请重新登录"});
                                webAgentLogout = true;
                            }
                        }
                        loginFlag = false;
                        loginInfo="";
                        if(t) {
                            clearInterval(t);
                            t = null;
                        }
                    }

                    //第一次登录没有登录上
                    if (!loginFlag && !webAgentLogout) {
                        if (t) {
                            clearInterval(t);
                            t = null;
                        }
                        if (reLoginTime === 5) {
                            TLog.log("Cphone:CPhone登录失败，请重启CPhone后重新登录");
                            MultiRegisterEvent.cphoneUnlogged({type:'cphoneUnlogged',msg:"CPhone登录失败，请重启CPhone后重新登录"});
                            reLoginTime = 0;
                        } else {
                            MultiRegisterEvent.setAgentStateText({text:"正在登录CPhone"});
                            reLoginTime ++;
                            setTimeout(function () {
                                Butel.ajaxFunc("Login", "login", loginInfo)
                            }, 3000);
                            TLog.log('Cphone:正在重新登录 '+reLoginTime)
                        }
                    } else if(!loginFlag && webAgentLogout) {
                        if (t) {
                            clearInterval(t);
                            t = null;
                        }
                        TLog.log("Cphone:CPhone登录失败，请重启CPhone后重新登录");
                        MultiRegisterEvent.cphoneUnlogged({type:'cphoneUnlogged',msg:"CPhone登录失败，请重启CPhone后重新登录"});
                    }


                    if(errorCode < 0) {
                        if(WebAgent.licenseCustomer != "1"){
                            require("ButelEvent").msgFromAgentButelLoginFail(errorCode);
                        }
                        TLog.log("Cphone:Cphone登录失败");
                    }
                    //clearInterval(t);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 登出成功回调
     * @param data
     */
    function logout() {
        TLog.log("Cphone:butelLogout回调");
        webAgentLogout = true;  //调用了登出
    }

    /**
     * 配置是否开启隐藏日志
     * @param level
     * @param message
     * @constructor
     */
    var Log = function(level, message) {
        var isOpenHiddenLog = localStorage.getItem("QN_WEBAGENT_OPEN_CPHONE_LOG"); //"0": 开启,"1":关闭

        if (window.console && window.console[level] && (isOpenHiddenLog == "0")) {
            window.console[level](message);
        }
    };

   return Butel;

});
