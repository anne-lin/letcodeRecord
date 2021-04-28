/**
 * 日志打印模块
 */
define([], function() {
    "use strict";

    var print = function(message, level) {
        if (window.console && window.console[level]) {
            window.console[level]("[webAgent-wa]",new Date().toLocaleString() + message);
            if(WebAgent.canWriteLog){
                WebAgent.ButelAjax && WebAgent.ButelAjax.ajaxFunc("WriteLogToLocal", "writeLogToLocal", "&loglevel=" + level + "&logmsg=[webAgent-wa]" + message);
            }
        }
    };

    return {
        log : function(message) {
            print(message, "log");
        },
        info : function(message) {
            print(message, "info");
        },
        warn : function(message) {
            print(message, "warn");
        },
        error : function(message) {
            print(message, "error");
        }
    };
});
