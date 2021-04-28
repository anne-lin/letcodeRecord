/**
 * Created by Yuan on 2016/12/23.
 */
define(["jquery"], function ($) {
    function AjaxHelper() {
        this.ajax = function (url, type, dataType, data, callback, isLocal) {
            $.ajax({
                url: isLocal ? "../../src/json" : url,
                //url: (isLocal ? "../../src/json" : WebAgent.config.quickSmartReplyPath_sensitive) + url,
                traditional: true,
                type: type,
                dataType: dataType,
                data: data,
                global: false,
                //xhrFields: {
                //    withCredentials: true
                //},
                success: callback,
                error: function (xhr, errorType, error) {
                    console.log("Ajax request error,errorType: " + errorType + ",error: " + error);
                    console.log(xhr);
                }
            })
        }
    }

    AjaxHelper.prototype.get = function (url, data, callback, isLocal) {
        this.ajax(url, "GET", "json", data, callback, isLocal);
    };
    AjaxHelper.prototype.post = function (url, data, callback) {
        this.ajax(url, "POST", "json", data, callback);
    };
    AjaxHelper.prototype.put = function (url, data, callback) {
        this.ajax(url, "PUT", "json", data, callback);
    };
    AjaxHelper.prototype.delete = function (url, data, callback) {
        this.ajax(url, "DELETE", 'json', data, callback);
    };
    AjaxHelper.prototype.jsonp = function (url, data, callback) {
        console.log(data);
        this.ajax(url, "GET", "jsonp", data, callback);
    };
    AjaxHelper.prototype.constructor = AjaxHelper;

    var ajaxHelper = new AjaxHelper();

    /**
     * 跨浏览器的事件对象
     */
    var EventUtil = {
        addHandler: function (element, type, handler) {

        },
        getEvent: function (event) {
            return event ? event : window.event;
        },
        getTarget: function (event) {
            return event.target || event.srcElement;
        },
        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        removeHandler: function () {

        },
        stopPropagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }
    };

    /**
     * 转换时间为yy-mm-dd hh:mm:ss格式
     * @param date
     * @returns {string}
     */
    var FormatDate = function(dates) {
        var year = dates.getFullYear();
        var month = (dates.getMonth() + 1) < 10 ? "0" + (dates.getMonth() + 1) : (dates.getMonth() + 1);
        var date = dates.getDate();
        var hour = dates.getHours() < 10 ? "0" + dates.getHours() : dates.getHours();
        var minutes = dates.getMinutes() < 10 ? "0" + dates.getMinutes() : dates.getMinutes();
        var seconds = dates.getSeconds() < 10 ? "0" + dates.getSeconds() : dates.getSeconds();

        return  year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds;
    };

    //滚动条滚动到底部
    var ScrollToBottom = function () {
        if ($('.scrollToBottom').length) {
            $('.scrollToBottom').scrollTop($('.scrollToBottom')[0].scrollHeight);
        }
    };

    /**
     * 配置是否开启隐藏日志
     * @param level
     * @param message
     * @constructor
     */
    var Log = function(level, message) {
        if (window.console && window.console[level] ) {
            window.console[level]("[webAgent-IM]",new Date().toLocaleString() + message);
            if(WebAgent.canWriteLog){
                WebAgent.ButelAjax && WebAgent.ButelAjax.ajaxFunc("WriteLogToLocal", "writeLogToLocal", "&loglevel=" + level + "&logmsg=[webAgent-IM]" + message);

            }
        }
    };

    return {
        ajaxHelper: ajaxHelper,
        EventUtil: EventUtil,
        FormatDate: FormatDate,
        ScrollToBottom: ScrollToBottom,
        Log: Log
    };
});


