/**
 * Created by panfei on 2016/8/14.
 */
define(["jquery", "Q", "ButelAjax", "MultiRegisterEvent", "require", "TLog", "WebRTC", "Screencap"], function ($, Q, ButelAjax, MultiRegisterEvent, require, Log, CR, Screencap) {
    
    // var sipUseWebRTC=false;
    
    /**
     * 登录多渠道统一入口
     * p:登录信息
     * isWAAutoLogin:软电话是否已经自动登录
     */
    var loginCCODMultiChannel = function (p, isWAAutoLogin) {
        //登录软电话
        function WALogin(p) {
            var q = Q.defer();
            Log.log('多渠道软电话登录信息:' + JSON.stringify(p));
            
            function loginRegisterEventHandler(data) {
                if (data.type === 'EVENT_AGENT_LOGIN') {
                    Log.log('多渠道软电话登录成功');
                    p.nubeAppKey = data.ext.nubeAppKey;
                    p.nubeUUID = data.ext.nubeUUID;
                    p.licenseButel = data.ext.licenseButel;
                    p.licenseCustomer = data.ext.licenseCustomer;
                    if (data.ext.nubeNum && (p.agentNumber == undefined || p.agentNumber == "")) {
                        p.nubeNum = data.ext.nubeNum;
                        // sipUseWebRTC=true;
                        WebAgent.sipUseWebRTC = true;
                    } else {
                        WebAgent.sipUseWebRTC = false;
                    }
                    // p.licenseCustomer = "1";
                    p.awayStatusList = data.ext.awayStatusList;
                    WebAgent.licenseCustomer = p.licenseCustomer;
                    WebAgent.screenRecording = data.ext.screenRecording;
                    var sipaccount = p.agentNumber ? p.agentNumber.replace("sip:", "") : p.nubeNum.replace("sip:", "");
                    WebAgent.screenRecording == "1" && Screencap.loginScreenRecording({
                        extensionid: sipaccount,
                        agentid: data.entId + '@' + data.agentId
                    });
                    q.resolve(p);
                    
                    //异常登出再登入时保持两端状态一致
                    if (WebAgent.disconnectError) {
                        if (WebAgent.readyEnabled && WebAgent.vm.currentState().key == "BUSY") {
                            WebAgent.extend.setReady();
                        }
                        
                        if (!WebAgent.readyEnabled && WebAgent.vm.currentState().key == "READY") {
                            WebAgent.extend.setBusy();
                        }
                    }
                }
                if (data.type === 'EVENT_AGENT_LOGIN_FAIL') {
                    q.reject(new Error(JSON.stringify({
                        channel: 'WA',
                        msg: data.ext.errorMessage
                    })));
                }
            };
            
            WebAgent.removeEventHandler(loginRegisterEventHandler);
            WebAgent.registerEventHandler(loginRegisterEventHandler);
            
            //WebAgent.registerEventHandler(function(data){
            //    if(data.type === 'EVENT_AGENT_LOGIN'){
            //        console.log('[WebAgent] 多渠道软电话登录成功');
            //        p.nubeAppKey = data.ext.nubeAppKey;
            //        p.nubeNum  = data.ext.nubeNum;
            //        p.nubeUUID    = data.ext.nubeUUID;
            //        p.licenseButel = data.ext.licenseButel;
            //        p.licenseCustomer = data.ext.licenseCustomer;
            //        q.resolve(p);
            //    }
            //    if(data.type === 'EVENT_AGENT_LOGIN_FAIL'){
            //        q.reject(new Error(JSON.stringify({
            //            channel:'WA',
            //            msg:data.msg
            //        })));
            //    }
            //});
            
            function loginRegisterResultHandler(data) {
                if (data.type === 'login' || data.type === 'forceLogin') {
                    if (data.code !== "000") {
                        q.reject(new Error(JSON.stringify({
                            channel: 'WA',
                            msg: data.msg
                        })));
                    }
                }
            };
            
            WebAgent.removeResultHandler(loginRegisterResultHandler);
            WebAgent.registerResultHandler(loginRegisterResultHandler);
            
            //WebAgent.registerResultHandler(function(data){
            //    if(data.type === 'login' || data.type === 'forceLogin'){
            //        if(data.code !== "000"){
            //            q.reject(new Error(JSON.stringify({
            //                channel:'WA',
            //                msg:data.msg || data.ext.errorMessage || ''
            //            })));
            //        }
            //    }
            //});
            
            if (WebAgent) {
                var r = WebAgent.extend.login(p);
                Log.log('多渠道软电话登录立即返回结果:' + JSON.stringify(r));
            }
            return q.promise;
        }
        
        //登录WebChat，华润定制版本，sip+硬电话+IM，没有licenseCustomer配置，一定登录IM
        function WebChatLogin(p) {
            var q = Q.defer();
            //if(p.licenseCustomer == 1){ //不开启IM，IM开启Butel一定开启
            //    window.setTimeout(function(){
            //        q.resolve(p);
            //    },0);
            //    return q.promise;
            //} else {
            Log.log('多渠道WebChat登录信息:' + JSON.stringify(p));
            
            function loginFailCallback(data) {
                if (data && data.type === 'loginFail') {
                    q.reject(new Error(JSON.stringify({
                        channel: 'IM',
                        msg: ''
                    })));
                } else {
                    q.resolve(p);
                }
            }
            
            WebAgent && WebAgent.ChatRemoveEvent('loginFailCallback', loginFailCallback);
            WebAgent && WebAgent.ChatRegisterEvent("loginFailCallback", loginFailCallback);
            //WebAgent && WebAgent.ChatRegisterEvent("loginFailCallback", function(data) {
            //    if(data && data.type === 'loginFail'){
            //        q.reject(new Error(JSON.stringify({
            //            channel:'IM',
            //            msg:''
            //        })));
            //    }
            //    else{
            //        q.resolve(p);
            //    }
            //});
            
            function loginCallback(data) {
                q.resolve(p);
                require("MultiChannelState").chatLogin = true;
                //WebAgent.ChatBusyCallback();
                if (WebAgent.vm.currentState().key == "BUSY") {
                    WebAgent.ChatSetBusy();
                } else {
                    WebAgent.ChatSetReady();
                }
                Log.log('多渠道WebChat登录成功');
            }
            
            WebAgent && WebAgent.ChatRemoveEvent('loginCallback', loginCallback);
            WebAgent && WebAgent.ChatRegisterEvent("loginCallback", loginCallback);
            //WebAgent && WebAgent.ChatRegisterEvent("loginCallback", function(data){
            //    q.resolve(p);
            //    require("MultiChannelState").chatLogin = true;
            //    WebAgent.ChatBusyCallback();
            //    console.log('[WebAgent] 多渠道WebChat登录成功');
            //});
            
            if (WebAgent.licenseCustomer == "1") {
                WebAgent.ChatBusyCallback();
                window.setTimeout(function () {
                    Log.log("不登多渠道webChat");
                    q.resolve(p);
                }, 0);
            } else {
                WebAgent && WebAgent.ChatLogin({
                    agentId: p.agentId,
                    entId: p.entId,
                    password: '1'
                });
            }
            
            
            return q.promise;
            //}
        }
        
        
        //登录Butel
        function ButelLogin(p) {
            $("#logOutBtn").removeClass('disabled');
            $("#logOutBtn").attr('disabled', false);
            var q = Q.defer();
            Log.log('检测webRTC结果：' +  WebAgent.hasUseWebRtc);
            /**
             * 分机标识
             * pstn:tel || TEL
             * xlite:sip && sipUseCphone:false
             * webRTC:浏览器环境支持webRTC && agentProxy显示用webRTC登录
             * Cphone：sip && sipUseCphone:true
             */
            //使用PSTN分机、Sip分机+Xlite
            if ((p.agentNumber && (p.agentNumber.indexOf("tel:") == 0 || p.agentNumber.indexOf("TEL:") == 0)) || (p.agentNumber && p.agentNumber.indexOf('sip:') == 0 && !p.sipUseCphone)) {
                Log.log('登录分机:PSTN,sip&xlite');
                sessionStorage.setItem('agentNumber', p.agentNumber);
                window.setTimeout(function () {
                    q.resolve(p);
                }, 0);
            }
            //sip+webRTC
            else if (WebAgent.sipUseWebRTC && WebAgent.hasUseWebRtc) {
                Log.log('登录分机:WebRTC');
                window.CR = CR;
                WebAgent.vm.CR(window.CR);
                var sipaccount = p.nubeNum.replace("sip:", "");
                CR && CR.login(sipaccount, WebAgent.vertoPasswrod, WebAgent.config.vertoWebSocket, webRTCLoginCallback, logoutCallbackRegister);
                
                function webRTCLoginCallback(res) {
                    if (res.code === 0) {
                        WebAgent.callType = "webRTC";
                        q.resolve(p);
                    } else {
                        q.reject(new Error(JSON.stringify({
                            channel: 'webRTC',
                            msg: "login freeswitch fail",
                            code: res.code
                        })));
                    }
                }
                
                function logoutCallbackRegister() {
                    multiChannelLogout();
                }
            }
            //Sip+Cphone
            else if ((!WebAgent.hasUseWebRtc && p.sipUseCphone) || (p.agentNumber && p.sipUseCphone && p.agentNumber.indexOf('sip:') == 0)) {
                Log.log('多渠道Sip分机登录信息:' + JSON.stringify(p));
                
                function getButelState1(data) {
                    if (data.type === 'msgFromAgentButelLogin') {
                        q.resolve(p);
                    }
                    if (data.type === 'msgFromAgentButelLoginFail') {
                        q.reject(new Error(JSON.stringify({
                            channel: 'Cphone',
                            msg: 'errorCode' + data.errorCode
                        })));
                    }
                }
                
                WebAgent.ChatRemoveEvent('getButelState', getButelState1);
                WebAgent.ChatRegisterEvent('getButelState', getButelState1);
                var sipaccount = p.agentNumber ? p.agentNumber.replace("sip:", "") : p.nubeNum.replace("sip:", "");
                // 缓存分机号
                sessionStorage.setItem('agentNumber', 'sip:' + sipaccount);
                // var sip = JSON.stringify({"sipaccount": sipaccount, "sippwd": sipaccount});
                // ButelAjax && ButelAjax.ajaxFunc("Login", "login", "&sip=" + sip);
                // 新版cphone登陆
                var params = JSON.parse(JSON.stringify(WebAgent.cphoneParams));
                params.interval = WebAgent.vm.cphoneInterval();
                params.account = sipaccount;
                params.wssUrl += '?id=' + sipaccount;
                console.log(params, p, 'sip + cphone');
                // var paramsStr = '&interval=' + WebAgent.vm.cphoneInterval() + '&account=' + sipaccount + '&password=' + params.password + '&iceParams=' + params.iceParams + '&wssUrl=' + params.wssUrl + '?id=' + sipaccount;
                var paramsStr = '';
                for (var key in params) {
                    paramsStr += '&' + key + '=' + params[key];
                }
                ButelAjax && ButelAjax.ajaxFunc("Login", "login", paramsStr);
            }
            //Butel+Cphone
            else if (p.agentNumber == undefined || p.agentNumber == "" || p.agentNumber && p.agentNumber.indexOf("btl:") == 0) {
                if (p.licenseButel == 0) { //开启Butel
                    Log.log('多渠道Butel分机登录信息:' + JSON.stringify(p));
                    
                    function getButelState2(data) {
                        if (data.type === 'msgFromAgentButelLogin') {
                            q.resolve(p);
                        }
                        if (data.type === 'msgFromAgentButelLoginFail') {
                            q.reject(new Error(JSON.stringify({
                                channel: 'Butel',
                                msg: 'errorCode' + data.errorCode
                            })));
                        }
                    }
                    
                    WebAgent.ChatRemoveEvent('getButelState', getButelState2);
                    WebAgent.ChatRegisterEvent('getButelState', getButelState2);
                    //WebAgent.ChatRegisterEvent('getButelState', function (data) {
                    //    if (data.type === 'msgFromAgentButelLogin') {
                    //        q.resolve(p);
                    //    }
                    //    if (data.type === 'msgFromAgentButelLoginFail') {
                    //        q.reject(new Error(JSON.stringify({
                    //            channel: 'Butel',
                    //            msg: 'errorCode' + data.errorCode
                    //        })));
                    //    }
                    //});
                    p.appkey = p.nubeAppKey;
                    p.numbe = p.nubeNum && p.nubeNum.replace("btl:", "") || "";
                    p.uid = p.nubeUUID;
                    ButelAjax && ButelAjax.ajaxFunc("Login", "login", "&appkey=" + p.appkey + "&numbe=" + p.numbe + "&uid=" + p.uid + "&localname=test");
                } else if (p.licenseButel == 1 || p.licenseButel == undefined) { //不开启Butel
                    q.reject(new Error(JSON.stringify({
                        channel: "Butel",
                        msg: "请传分机号"
                    })));
                }
            } else {
                q.reject(new Error(JSON.stringify({
                    channel: "WA",
                    msg: "请传入正确分机号"
                })));
            }
            return q.promise;
            
        }
        
        function onLoginError(e) {
            var channel = e.channel;
            var msg = e.msg;
            Log.warn('多渠道(' + channel + ')登录失败:' + msg);
            MultiRegisterEvent.login({ type: 'loginFail', channel: channel, msg: msg });
            if (channel != 'WA') {
                WebAgent && WebAgent.extend.logout();
            }
        }
        
        if (!isWAAutoLogin) {
            Log.info('登录多渠道软电话');
            MultiRegisterEvent.setAgentStateText({ text: "登录多渠道:软电话" });
            WALogin(p)
                //TODO
                .then(function (data) {
                    Log.info(' 登录多渠道WebChat');
                    MultiRegisterEvent.setAgentStateText({ text: "登录多渠道:WebChat" });
                    return WebChatLogin(data);
                })
                .then(function (data) {
                    Log.info('正在登录分机');
                    // MultiRegisterEvent.setAgentStateText({text:"登录多渠道:Butel"});
                    MultiRegisterEvent.setAgentStateText({ text: "正在登录分机" });
                    return ButelLogin(data);
                })
                .then(function (data) {
                    Log.info('多渠道登录成功');
                    MultiRegisterEvent.setAgentStateText({ text: "多渠道登录成功" });
                    MultiRegisterEvent.login({ type: 'loginSuccess', params: data });
                })
                .catch(function (e) {
                    Log.warn('多渠道登录失败');
                    MultiRegisterEvent.setAgentStateText({ text: "多渠道登录失败" });
                    
                    onLoginError(JSON.parse(e.message));
                });
        } else {
            Log.info('多渠道软电话已自动登录');
            Log.info('登录多渠道:WebChat');
            MultiRegisterEvent.setAgentStateText({ text: "登录多渠道:软电话已自动登录" });
            MultiRegisterEvent.setAgentStateText({ text: "登录多渠道:WebChat" });
            //WebAgent.ChatLogout();
            WebChatLogin(p).then(function (data) {
                Log.info('正在登录分机');
                MultiRegisterEvent.setAgentStateText({ text: "正在登录分机" });
                return ButelLogin(data);
            })
                .then(function (data) {
                    Log.info('多渠道登录成功');
                    MultiRegisterEvent.login({ type: 'loginSuccess', params: data });
                })
                .catch(function (e) {
                    Log.warn('多渠道登录失败');
                    MultiRegisterEvent.setAgentStateText({ text: "多渠道登录失败" });
                    onLoginError(JSON.parse(e.message));
                });
        }
    };
    
    //登录多渠道
    function multiChannelLogin(WebAgent, loginParam) {
        
        //页面卸载多渠道登出
        $(window).on("unload", function () {
            // 多中心自动登陆需要,缓存服务相关的数据 自动登陆需开启
            // if (WebAgent.isMulticenter && WebAgent.vm.alreadyLogin()) {
            //     let params = {
            //         isAutoLogin: true,
            //         iceServer: WebAgent.config.iceServerUrlList,
            //         currentWebRTCIndex: WebAgent.currentWebRTCIndex,
            //         currentHostIndex: WebAgent.currentHostIndex,
            //         agentProxyUrlList: WebAgent.agentProxyUrlList,
            //         webRTCUrlList: WebAgent.config.webRTCUrlList
            //     };
            //     sessionStorage.setItem('autoLoginData', JSON.stringify(params));
            // } else {
            //     sessionStorage.removeItem('autoLoginData');
            //     sessionStorage.removeItem('agentNumber');
            // }
            WebAgent && WebAgent.extend.logout();
            if(WebAgent.licenseCustomer != '1'){
                WebAgent.ChatLogout();
                // 退出cphone
                if (WebAgent.vm.sipUseCphone()){
                    ButelAjax && ButelAjax.ajaxFunc("Logout", "logout", "");
                }
            }
            WebAgent.screenRecording == "1" && Screencap.logoutScreenRecording();
            require("MultiChannelState").chatLogin = false;
        });
        
        //初始化状态
        require("MultiChannelState").init(WebAgent, loginParam.isLocking, loginParam.unLocking, loginParam.awayStatus);
        
        if (loginParam.waAutoLoginResult) {
            
            //多渠道登录成功状态为置忙，自动登录成功调用软电话重置接口，恢复其状态为置忙，避免状态不统一
            WebAgent.extend.reset();
            
            loginParam.waAutoLoginData.ext.sipUseCphone = WebAgent.vm.sipUseCphone();
            WebAgent.sipUseWebRTC = sessionStorage.getItem('agentNumber') ? false : true;
            loginCCODMultiChannel($.extend({
                entId: loginParam.entId,
                agentId: loginParam.agentId,
                agentPassword: loginParam.agentPassword,
                agentNumber: loginParam.agentNumber || sessionStorage.getItem('agentNumber') || '',
                isForce: loginParam.isForce,
                assistants: loginParam.assistants || ""
            }, loginParam.waAutoLoginData.ext), true);
        } else {
            loginCCODMultiChannel({
                entId: loginParam.entId,
                agentId: loginParam.agentId,
                agentPassword: loginParam.agentPassword,
                agentNumber: loginParam.agentNumber,
                sipUseCphone: WebAgent.vm.sipUseCphone(),
                isForce: loginParam.isForce || "",
                assistants: loginParam.assistants || ""
            }, false);
        }
    };
    
    //自动登录
    function multiChannelAutoLogin(WebAgent, loginParam) {
        //WebAgent.chatInitFinished && multiChannelLogin(WebAgent, loginParam);
    }
    
    //登出 CCODMultiChannel
    function multiChannelLogout() {
        /*  if(!require("MultiChannelState").chatLogin){
             return;
         } */
        Log.info('正在登出多渠道！');
        WebAgent.screenRecording == "1" && Screencap.logoutScreenRecording();
        MultiRegisterEvent.setAgentStateText({ text: '正在登出多渠道' });
        MultiRegisterEvent.logout();
        //window.setTimeout(function(){
        //    window.location.href = "<%=request.getContextPath()%>/logout";
        //},1*1000);
        WebAgent && WebAgent.extend.logout();
        
        // 清除自动登陆缓存数据
        sessionStorage.removeItem('autoLoginData');
        sessionStorage.removeItem('agentNumber');
        
        if (WebAgent.sipUseWebRTC) {
            CR.logout();
            WebAgent.vm.CR('');
        } else if (WebAgent.vm.sipUseCphone()) {
            ButelAjax && ButelAjax.ajaxFunc("Logout", "logout", "");
        }
        if (WebAgent.licenseCustomer != '1') {
            WebAgent.ChatLogout();
        }
        require("MultiChannelState").chatLogin = false;
        // 登出之后执行回调函数，通知客家已经登出
        // logoutCallBack();
    }
    
    return {
        multiChannelLogin: multiChannelLogin,
        multiChannelLogout: multiChannelLogout,
        multiChannelAutoLogin: multiChannelAutoLogin
    };
    
});
