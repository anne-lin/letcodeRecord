/**
 * 计数器模块
 */
define([], function () {
    "use strict";

    var INTERVAL = 1000;

    var timer = null;

    var initValue;
    var value = 0;
    var valueHolder;

    var start = function () {
        if (!timer) {
            initValue = new Date().getTime();
            timer = setInterval(count, INTERVAL);
        }
        return this;
    };

    var count = function () {
        value = parseInt((new Date().getTime() - initValue) / 1000);
        valueHolder && valueHolder(value);
    };

    var stop = function () {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        return this;
    };

    var clear = function () {
        value = 0;
        valueHolder && valueHolder(value);
    };

    /**
     * 将秒转换为hh:mm:ss格式
     * @param seconds
     * @returns {string}
     */
    function getTimeFormat(seconds) {
        var hour = parseInt(seconds / 3600);
        if (hour < 10) {
            hour = "0" + hour;
        }
        var minute = parseInt((seconds - hour * 3600) / 60);
        if (minute < 10) {
            minute = "0" + minute;
        }
        var second = parseInt(seconds - hour * 3600 - minute * 60);
        if (second < 10) {
            second = "0" + second;
        }

        return hour + ":" + minute + ":" + second;
    }

    return {
        start: start,
        stop: stop,
        clear: clear,
        valueHolder: function (holder) {
            if (typeof holder === "function") {
                valueHolder = holder;
            }
            return this;
        },
        getTimeFormat: getTimeFormat
    }
});