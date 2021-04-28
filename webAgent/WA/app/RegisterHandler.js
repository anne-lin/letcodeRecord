/**
 * Created by fei on 2015/12/4.
 */
define([],function() {
    "use strict";

    /**
     *自定义事件的事件名
     */
    var HandlerNames = {
        event: "event",
        state: "state",
        result: "result"
    };

    /**
     * 事件处理工具类
     */
    var EventUtils = (function() {
        var listenObj = {};

        /**
         * 添加事件监听
         * @param eventName
         * @param handler
         */
        function addEventListener(eventName, handler) {
            if(typeof listenObj[eventName] === "undefined") {
                listenObj[eventName] = [];
            }
            if(typeof handler === "function") {
                listenObj[eventName].push(handler);
            }
        }

        /**
         * 移除事件监听
         * @param eventName
         * @param handler
         */
        function removeEventListen(eventName, handler) {
            if(!listenObj[eventName]) {
                return;
            }
            if (!handler) {
                listenObj[eventName] = [];
                return;
            }
            for(var i = 0; i < listenObj[eventName].length; i++) {
                //解决内部注册多次事件，执行多次的问题
                if(listenObj[eventName][i].name && (listenObj[eventName][i].name === handler.name)) {
                //if(listenObj[eventName][i] === handler) {
                    listenObj[eventName].splice(i,1);
                    break;
                }
            }
        }

        /**
         * 触发事件
         * @param eventName
         * @param data
         */
        function trigger(eventName,data) {
            if(!listenObj[eventName]) {
                return;
            }
            for(var i = 0; i < listenObj[eventName].length; i++) {
                listenObj[eventName][i](data);
            }
        }

        return {
            addEventListener: addEventListener,
            removeEventListener: removeEventListen,
            trigger: trigger
        }
    })();

    return {
        /**
         * 注册自定义事件处理函数
         * @param handler
         */
        registerEventHandler: function(handler) {
            EventUtils.addEventListener(HandlerNames.event, handler);
        },

        /**
         * 注册自定义状态监听器
         * @param listener
         */
        registerStateListener: function(listener) {
            EventUtils.addEventListener(HandlerNames.state, listener);
        },

        /**
         * 注册自定义结果处理函数
         * @param handler
         */
        registerResultHandler: function(handler) {
            EventUtils.addEventListener(HandlerNames.result, handler);
        },

        /**
         * 触发事件处理函数
         * @param data
         */
        triggerEvent: function(data) {
            EventUtils.trigger(HandlerNames.event, data);
        },

        /**
         * 触发结果处理函数
         * @param data
         */
        triggerResult: function(data) {
            EventUtils.trigger(HandlerNames.result, data)
        },

        /**
         * 触发状态处理函数
         * @param data
         */
        triggerState: function(data) {
            EventUtils.trigger(HandlerNames.state, data);
        },

        /**
         * 移除自定义事件处理函数
         * @param handler
         */
        removeEventHandler: function(handler) {
            EventUtils.removeEventListener(HandlerNames.event, handler);
        },

        /**
         * 移除自定义结果处理函数
         * @param handler
         */
        removeResultHandler: function(handler) {
            EventUtils.removeEventListener(HandlerNames.result, handler);
        }
    }
});