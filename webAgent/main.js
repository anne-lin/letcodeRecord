/**
 * Created by panfei on 2016/3/7.
 */
(function(baseUrl, urlArgs, initParams) {
    requirejs.config({
        baseUrl: baseUrl,
        urlArgs: urlArgs,
        paths: {
            "jquery"           : "MultiChannel/windowJquery",
            //"jquery"           : "public_lib/jquery-2.1.4.min",
            "knockout"         : "public_lib/knockout-3.4.0",
            "bootstrapJ"       : "public_lib/bootstrap.min",
            "css"              : "public_lib/css.min",
            "text"             : "public_lib/text",
            //"font"             : "public_css/font-awesome.min",
            "bootstrapC"       : "public_css/bootstrap.min",
            "colorBlink"       : "public_lib/colorBlink",
            "MultiChannelState": "MultiChannel/MultiChannelState",
            "Q"                : "MultiChannel/lib/q",
            "VertoFun"                : "MultiChannel/lib/vertoFun.min",
            "WebRTC"                : "MultiChannel/WebRTC",
           // "dom"          : "MultiChannel/WebRTC.html",
            "MultiChannelLoginOut": "MultiChannel/MultiChannelLoginOut",
            "MultiRegisterEvent": "MultiChannel/MultiRegisterEvent",
            "ButelAjax": "MultiChannel/ButelAjax",
            "TLog": "MultiChannel/Log",
            "Screencap": "MultiChannel/screencap",
            "Utils": "MultiChannel/utils"
        },
        shim: {
            "bootstrapJ" : {
                deps: ["jquery"]
            },
            "dialog" : {
                deps: ["jquery"]
            },
            "multiChannelState": {
                deps: ["Q"]
            }
        },
        config: {
            text: {
                useXhr: function (url, protocol, hostname, port) {
                    // 此处返回true，让text插件强制使用xhr加载，而不是通过jsonp加载
                    // （text资源位于不同域时，会默认使用jsonp，并加上.js获取）
                    // 参考：https://github.com/requirejs/text#xhr-restrictions
                    return true;
                }
            }
        }
    });

    require(["jquery", "MultiChannelLoginOut", "MultiRegisterEvent", "MultiChannelState", "ButelAjax","Screencap", "knockout", "colorBlink",(initParams.loadBootstrap || !("loadBootstrap" in initParams) ? "bootstrapJ" : ""), (initParams.loadBootstrap || !("loadBootstrap" in initParams) ? "css!bootstrapC" : "")], function($, MultiChannelLoginOut, MultiRegisterEvent, MultiChannelState, ButelAjax,Screencap) {
        "use strict";

        // 大多数页面都引入了jQuery，此处恢复$和jQuery的原始引用
        //var $ = $.noConflict(true);

        WebAgent.multiChannelLogin = MultiChannelLoginOut.multiChannelLogin;
        WebAgent.multiChannelAutoLogin = MultiChannelLoginOut.multiChannelAutoLogin;
        WebAgent.multiChannelLogout = MultiChannelLoginOut.multiChannelLogout;
        WebAgent.multiRegisterEvent = MultiRegisterEvent.registerEvent;
        WebAgent.removeEvent = MultiRegisterEvent.removeEvent;
        WebAgent.multiChannelState = MultiChannelState;
        WebAgent.ButelAjax = ButelAjax;
        //初始化cphone写日志功能开关
        WebAgent.canWriteLog = WebAgent.WaParams.sipUseCphone || false;
        // 初始化 是否使用WebRTC登陆，默认为false
        WebAgent.sipUseWebRTC = false;
        // 检测cphone是否可以使用
        // ButelAjax.ajaxFunc("getStatus", "", "");
        // 检测webRTC是否可以使用
        WebAgent.hasUseWebRtc = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCIceGatherer;
        // 媒体类型，默认是语音
        WebAgent.mediaType = '1';
        // 开启录屏方法
        WebAgent.startScreencap = Screencap.startScreencap;
        // 关闭录屏方法
        WebAgent.stopScreencap = Screencap.stopScreencap;
    });
})( WebAgent.baseUrl, WebAgent.urlArgs, WebAgent.initParams);
