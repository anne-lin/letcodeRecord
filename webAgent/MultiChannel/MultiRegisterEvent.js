/**
 * Created by panfei on 2016/08/14.
 */
define([], function() {
    var eventName = {
        login: "login",
        logout:"logout",
        setAgentStateText: "setAgentStateText",
        cphoneUnlogged: "cphoneUnlogged",
        webRTCError:"webRTCError",
        onToggleMedia:"onToggleMedia"
    }

    var event = {};

    /**
     * ע���¼�����
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
     * �Ƴ��¼�����
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
            if(event[name][i] === handler) {
                event[name].splice(i,1);
                break;
            }
        }
    }

    /**
     * �����¼�����
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
        login:function(data) {
            trigger(eventName.login, data);
        },
        logout: function(data) {
            trigger(eventName.logout, data);
        },
        setAgentStateText: function(data) {
            trigger(eventName.setAgentStateText, data);
        },
        cphoneUnlogged: function (data) {
            trigger(eventName.cphoneUnlogged, data);
        },
        webRTCError: function (data) {
            trigger(eventName.webRTCError, data);
        },
        onToggleMedia: function (data) {
            trigger(eventName.onToggleMedia, data);
        }
    }
})