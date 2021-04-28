/**
 * Created by panfei on 2015/11/23.
 */
define(["jquery", "jsjac", "require", "RegisterEvent", "util", "User"], function($, jsjac, require, registerEvent, util, User) {
    "use strict";

    var con;

    var globalUsername;

    var oFormObj;

    var logoutFlag = false; //登出标识

    var timeError; //异常登出记时

    WebAgent.isNormalError=false; //判断是否为互踢导致的异常

    var presence = {}; //在线好友列表

    var friendName = 'cchat001@ccod';
    //var friendName = 'test1@ccod';

    var queryAgentUserT = null;

    function handleConnected() {
        con.send(new JSJaCPresence()); //发送空的JSJaCPresence，表明登录成功

        if(timeError){
            clearTimeout(timeError);
            //重连成功。若后台与
            if(WebAgent.readyEnabled){
                require('Vm').setReady();
            }
            return;
        }
        require('Vm').agentOnline(true);

        //请求好友列表
        var iq = new JSJaCIQ();
        iq.setType("get").setQuery("jabber:iq:roster");
        con.send(iq);

        //查询在线客服数、排队客户数
        if(!queryAgentUserT) {
            queryAgentUserT = setInterval(function() {
                require("Vm").getCuAmount();
            }, 30000);
        }

        //获取下线客户列表
        require("Vm").getOfflineList();

        util.Log("log", "登入成功") ;

        //查询后台是否开启智能协助
        require("Vm").getIntellOpen();
    }

    function handleDisconnected() {
        // console.log("error:",error);

        //正常登出时
        if(logoutFlag){
            require('Vm').agentOnline(false);
            //清除查询在线客服数、排队客户数
            clearInterval(queryAgentUserT);

        }

        util.Log("warn","disconnected后台传输数据："+JSON.stringify(arguments));
        // console.log("[webAgent-IM-disconnect]:",new Date().toLocaleString());

        /*vm.userList().forEach(function (p1, p2, p3) {
            if(p1.online()){
                p1.online(false);
            }
        });*/
        /*console.log("currentState:",WebAgent.vm.currentState());
        if(WebAgent.vm.currentState().key != "LOGOUT" ){
            WebAgent.multiChannelLogout();
        }*/

    }

    function handleError(e) {
        registerEvent.loginFailCallback({type: "loginFail", error: e});

        util.Log("error","error后台传输数据："+JSON.stringify(arguments));

        if(WebAgent.isNormalError){
            WebAgent.isNormalError=false;
        }else {
            loginAction("reconnect");

            timeError=setTimeout(function () {
                if(!logoutFlag) {
                    registerEvent.openfireDisconnect();
                    logoutFlag = true;
                }
            },15000);
        }



        // handleDisconnected();

        // if (con.connected()) {
        //     con.disconnect();
        // }
    }

    function handlePresence(oJSJaCPacket) {
        var user = oJSJaCPacket.getFromJID();
        var userFullName = user.toString();
        var userFirstName = userFullName.split("/")[0];
        var count = 0;

        if(Object.keys(presence).indexOf(userFirstName) == -1) {
            presence[userFirstName] = {};
        }
        presence[userFirstName][userFullName] = {type: oJSJaCPacket.getType(), show: oJSJaCPacket.getShow(), status: oJSJaCPacket.getStatus()};

        util.Log("log", "openfire好友状态列表：" + JSON.stringify(presence, null, 4));
        if((userFirstName == friendName) && (presence[friendName][userFullName].type == 'unavailable')) {
            for(var i in presence[friendName]) {
                if(presence[friendName][i].type != 'unavailable') {
                    return;
                } else {
                    count++;
                    if(count == Object.keys(presence[friendName]).length) {
                        util.Log("info", "openfire-"+userFirstName + "下线了");
                        logout();
                        registerEvent.openfireDisconnect();
                    }
                }
            }
        }
    }

    function handleIqRoster(iq) {
        var item = iq.getChild("query").innerHTML || $(iq.getChild("query")).text();
        util.Log("log","openfire好友列表：" + item);

        if(Object.keys(presence).indexOf(friendName) == -1) {
            util.Log("log", friendName + "不在线");
            logout();
            registerEvent.openfireDisconnect();
        } else {
            //登录成功自定义注册函数
            registerEvent.loginCallback();
        }
    }


    function doLogin(reconnect) {

        if (oFormObj.http_base.substring(0,5) === 'ws://' || oFormObj.http_base.substr(0, 6) === 'wss://') {
            con = new JSJaCWebSocketConnection({
                httpbase: oFormObj.http_base
            });
        } else {
            con = new JSJaCHttpBindingConnection({
                httpbase: oFormObj.http_base,
                oDbg : new JSJaCConsoleLogger(4)
            });
        }
        setupCon(con);

        // setup args for connect method
        var oArgs = {}; //创建一个对象
        oArgs.domain = oFormObj && oFormObj.domain; //获得服务器的域名
        oArgs.username = oFormObj && oFormObj.openfireUsername();  //获得用户名
        oArgs.resource =reconnect ? "reconnect" : "PC";  //判断登入标识
        oArgs.pass = oFormObj && oFormObj.password;  //获得登录密码
        oArgs.register = false;  //判断是否注册
       // oArgs.authtype = "nonsasl"; //不安全登录
        con.connect(oArgs); //连接服务器


        //require('Vm').username(oArgs.username);
    }

    function loginAction(reconnect) {
        $.ajax({
            url: WebAgent.config.ADD_AGENT_URL,
            dataType:'json',
            data: {
                username: oFormObj.entId + "_" + oFormObj.agentId
            },
            success: function(data) {
                doLogin(reconnect);
            }
        });
    }
    /**
     * 登录
     * @param params
     * @returns {boolean}
     */
    function login(params) {
        //若openfire已登入，就不做登录处理
        if(require('Vm').agentOnline()){
            registerEvent.loginCallback();
            return;
        }
        oFormObj = {
            entId: params.entId,
            agentId: params.agentId,
            password: params.password,
            domain: WebAgent.config.HTTP_SERVER,
            http_base: WebAgent.config.HTTP_BASE,
            openfireUsername: function() {
                return this.entId + "_" + this.agentId;
            }
        };

        require('Vm').agentEntId(params.entId);
        require('Vm').agentId(params.agentId);
        require('Vm').userList([]);
        require('Vm').currentUser(new User()); //登录时清空当前用户

        loginAction();

        logoutFlag = false;
        return false;
    }

    function setupCon(oCon) {
        oCon.registerHandler('message', handleMessage);  //接收消息
        oCon.registerHandler('onconnect', handleConnected);  //登录成功
        oCon.registerHandler('ondisconnect', handleDisconnected);   //断开连接
        oCon.registerHandler('onerror', handleError);  //登录失败

        oCon.registerHandler('iq', 'query', 'jabber:iq:roster', handleIqRoster);  //请求好友列表回调
        oCon.registerHandler('presence', handlePresence); //好友列表状态回调

    }

    /**
     * 发送消息
     * @param name
     * @param ent
     * @param channel
     * @param text
     * @param resource
     * @returns {boolean}
     */
    function sendMessage(name, ent, channel, text, resource) {
        var oMsg = new JSJaCMessage();
        util.Log("log", "上一条数据信息：" + text);
        //一个dms宕机，发消息给其他在线的dms
        if (presence[friendName]
            && presence[friendName][friendName + '/' + resource]
            && presence[friendName][friendName + '/' + resource].type == 'unavailable') {
            for(var j in presence[friendName]) {
                if(presence[friendName][j].type != 'unavailable') {
                    resource = j.split("/")[1];
                    break;
                }
            }
        }

        oMsg.setTo(new JSJaCJID(globalUsername + "@" + con.domain + "/" + resource));
        oMsg.setBody(text);

       /* var nickNode = document.createElement("nick");
        nickNode.setAttribute("xmlns", "http://jabber.org/protocol/nick");*/
        var nickNode = document.createElementNS('http://jabber.org/protocol/nick', 'nick');
        /*nickNode.setAttribute("xmlns", "http://www.baidu.com");*/
        nickNode.appendChild(document.createTextNode(name + ":" + ent + ":" + channel));

        oMsg.appendNode(nickNode);

        con.send(oMsg);

        return false;
    }

    /**
     * 发送状态
     * @param name
     * @param ent
     * @param channel
     * @param text
     * @returns {boolean}
     */
    function sendState(name, ent, channel, text) {
        var oMsg = new JSJaCMessage();
        util.Log("log", "发送状态：" + text);
        oMsg.setTo(new JSJaCJID("cchat001@" + con.domain));
        oMsg.setBody(text);

        //var nickNode = document.createElement("nick");
        //nickNode.setAttribute("xmlns", "http://jabber.org/protocol/nick");
        //nickNode.appendChild(document.createTextNode(name + ":" + ent + ":" + channel));
        //oMsg.appendNode(nickNode);

        oMsg.appendNode('nick', {'xmlns': 'http://jabber.org/protocol/nick'}, (name + ':' + ent + ':' + channel));

        con.send(oMsg);
        return false;
    }

    function sendMUC(sessionId,text){
        console.log("sendMUC");
        var oMsg = new JSJaCMessage();
        oMsg.setTo(new JSJaCJID("cchat001@" + con.domain));
        oMsg.setBody(JSON.stringify(text));

        oMsg.appendNode('nick', {'xmlns': 'http://jabber.org/protocol/nick'}, ('MUC:' + sessionId));

        con.send(oMsg);
        return false;
    }

    /**
     * 接收消息
     * @param oJSJaCPacket
     */
    function handleMessage(oJSJaCPacket) {
        var userName = oJSJaCPacket.getFromJID()["_node"];
        var resource = oJSJaCPacket.getFromJID().toString().split('/')[1];

        if (!globalUsername) {
            globalUsername = userName;
        }

        //去掉空格，替换\n和\r
        var msgBody = oJSJaCPacket.getBody().trim().replace(/\n/g,"\\\\n").replace(/\r/g,"\\\\r");
        msgBody = JSON.parse(msgBody);

        var nickNode = oJSJaCPacket.getChild("nick");
        require('Vm').handleMessage(msgBody, nickNode.innerHTML || $(nickNode).text(), resource);
    }

    /**
     * 登出
     */
    function logout() {
        var p = new JSJaCPresence();
        p.setType("unavailable");
        p.setStatus("normalLogout"); //标识正常登出
        con.send(p);
        logoutFlag = true;
        con.disconnect();

        handleDisconnected();

        clearTimeout(timeError);
        timeError="";
        registerEvent.logOutCallback({type: "logOut"});
    }

    return {
        login: login,
        sendMessage: sendMessage,
        sendState: sendState,
        sendMUC: sendMUC,
        logout: logout
    }
});