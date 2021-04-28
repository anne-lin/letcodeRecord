/**
 * Created by panfei on 2015/12/29.
 */
define([], function() {
    var eventName = {
        updateOrAddUser: "updateOrAddUser",
        kchartCreate: "kchartCreate",
        getButelState: "getButelState",
        busyCallback: "busyCallback",
        readyCallback: "readyCallback",
        loginCallback: "loginCallback",
        loginFailCallback: "loginFailCallback",
        logOutCallback: "logOutCallback",
        selectUser: "selectUser",
        sessionQuit: "sessionQuit",
        newCustomInter: "newCustomInter",
        timeOutTip: "timeOutTip",
        unReadMsgNum: "unReadMsgNum",
        openfireDisconnect: "openfireDisconnect",
        butelAjaxError: "butelAjaxError",
        callIn: "callIn",
        autoMatchCallback: "autoMatchCallback" ,//开启自动匹配，切换到常用语界面
        openIntellCallback: "openIntellCallback" //智能协作，切换到智能协作界面
    }

    var event = {};

    /**
     * 注册事件监听
     * @param name
     * @param handler
     */
    function registerEvent(name, handler) {
        if(typeof event[name] === "undefined") {
            event[name] = [];
        }
        if(typeof handler === "function") {
            event[name].push(handler);
        }
    }

    /**
     * 移除事件监听
     * @param name
     * @param handler
     */
    function removeEvent(name, handler) {
        if(!event[name]) {
            return;
        }
        if (!handler) {
            event[name] = [];
            return;
        }
        for(var i = 0; i < event[name].length; i++) {
            //if(event[name][i] === handler) {
            if(event[name][i].name && (event[name][i].name === handler.name)) {
                event[name].splice(i,1);
                break;
            }
        }
    }

    /**
     * 触发事件监听
     * @param name
     * @param data
     */
    function trigger(name, data) {
        if(!event[name]) {
            return;
        }
        for(var i = 0; i < event[name].length; i++) {
            event[name][i](data);
        }
    }

    return{
        registerEvent: registerEvent,
        removeEvent: removeEvent,
        updateOrAddUser: function(data) {
            trigger(eventName.updateOrAddUser, data);
        },
        kchartCreate: function(data) {
            trigger(eventName.kchartCreate, data);
        },
        getButelState: function(data) {
            trigger(eventName.getButelState, data);
        },
        busyCallback: function(data) {
            trigger(eventName.busyCallback, data);
        },
        readyCallback: function(data) {
            trigger(eventName.readyCallback, data);
        },
        loginCallback: function(data) {
            trigger(eventName.loginCallback, data);
        },
        loginFailCallback: function(data) {
            trigger(eventName.loginFailCallback, data);
        },
        logOutCallback: function(data) {
            trigger(eventName.logOutCallback, data);
        },
        selectUser: function(data) {
            trigger(eventName.selectUser, data);
        },
        sessionQuit: function(data) {
            trigger(eventName.sessionQuit, data);
        },
        newCustomInter: function(data) {
            trigger(eventName.newCustomInter, data);
        },
        timeOutTip: function(data) {
            trigger(eventName.timeOutTip, data);
        },
        unReadMsgNum: function(data) {
            trigger(eventName.unReadMsgNum, data);
        },
        openfireDisconnect: function() {
            trigger(eventName.openfireDisconnect);
        },
        butelAjaxError: function(data) {
            trigger(eventName.butelAjaxError, data);
        },
        autoMatchCallback: function(data) {
            trigger(eventName.autoMatchCallback, data);
        },
        openIntellCallback: function (data) {
            trigger(eventName.openIntellCallback, data);
        },
        callIn: function (data) {
            trigger(eventName.callIn, data);
        }
    }
})
