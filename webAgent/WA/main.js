/**
 * Created by mengchen on 2015/12/9.
 */
(function(baseUrl, initParams, urlArgs) {
    "use strict";

    requirejs.config({
        urlArgs: urlArgs,
        baseUrl: baseUrl,
        paths: {
            "jquery"           : "MultiChannel/windowJquery",
            "wa_io"        : "WA/lib/netty-socket.io",
            //"wa_colorBlink": "WA/lib/colorBlink",
            "wa_json"      : "WA/lib/json",
            "area_code"      : "WA/lib/area-code",
            "font"         : "public_css/font-awesome.min",
            "style"        : "WA/css/WA",
            "wa_dom"       : "WA/app/WA-ui.html",

            "wa_Defaults"           : "WA/app/Defaults",
            "wa_Constant"           : "WA/app/Constant",
            "wa_Counter"            : "WA/app/Counter",
            "wa_Log"                : "WA/app/Log",
            "wa_Socket"             : "WA/app/Socket",
            "wa_Extend"             : "WA/app/Extend",
            "wa_ViewModel"          : "WA/app/ViewModel",
            "wa_Vm"                 : "WA/app/Vm",
            "wa_CheckInit"          : "WA/app/CheckInit",
            "wa_RegisterHandler"    : "WA/app/RegisterHandler",
            "wa_Tip"                : "WA/app/Tip",
            "wa_HandleEvent"        : "WA/app/HandleEvent",
            "wa_HandleCommandResult": "WA/app/HandleCommandResult",
            "wa_Storage"            : "WA/app/Storage",
            "dialog"                : "WA/app/Dialog",
            "ButelAjax"             : "MultiChannel/ButelAjax",
            "HRCookie"              : "WA/app/HRCookie",
            "RobotAgent"            : "WA/app/RobotAgent",
            "Utils"             : "MultiChannel/utils",
        }
    });

    require(["jquery", "wa_Defaults", "wa_Socket", "wa_Extend", "wa_RegisterHandler", "wa_CheckInit", "wa_Vm", "wa_Counter"], function($, defaults, socket,extend, registerHandler, checkInit, vm, counter) {
        "use strict";
        initParams = initParams || {};

        var ui = initParams.ui || !("ui" in initParams);
        var sipUseCphone = initParams.sipUseCphone || !("sipUseCphone" in initParams);
        var connect = initParams.connect || !("connect" in initParams);
        var right = typeof initParams.position == "object" && typeof initParams.position.right == "number" ? initParams.position.right : defaults.iconRight;
        var bottom = typeof initParams.position == "object" && typeof initParams.position.bottom == "number" ? initParams.position.bottom : defaults.iconBottom;
        var visible = initParams.visible || !("visible" in initParams);
        var colorObj = initParams.colorObj;
        var interval = initParams.interval;
        var loginInfo = initParams.loginInfo || {};
        var entId = loginInfo.entId || {};
        var agentId = loginInfo.agentId || {};
        var agentPassword = loginInfo.agentPassword || {};
        var agentNumber = loginInfo.agentNumber || {};
        var selectorName = initParams.selectorName;
        var outNumbersVisible = initParams.outNumbersVisible || !("outNumbersVisible" in initParams);

        //var $ = $.noConflict(true);

        if (typeof initParams.callback === "function") {
            checkInit.initSuccessCallback(initParams.callback);
        }

        //设置登录信息
        vm.entId(entId.value);
        vm.agentId(agentId.value);
        vm.agentPassword(agentPassword.value);
        vm.agentNumber(agentNumber.value);

        vm.sipUseCphone(sipUseCphone);

        //是否使用面板
        vm.ui(ui);

        // 设置计数器的输出持有者
        counter.valueHolder(vm.callDuration);

        connect && socket.initSocket();

        WebAgent.vm = vm;
        WebAgent.WaParams = initParams;
        WebAgent.extend = extend;
        WebAgent.registerEventHandler = registerHandler.registerEventHandler;
        WebAgent.registerStateListener = registerHandler.registerStateListener;
        WebAgent.registerResultHandler = registerHandler.registerResultHandler;
        WebAgent.removeEventHandler = registerHandler.removeEventHandler;
        WebAgent.removeResultHandler = registerHandler.removeResultHandler;

        if (!ui) {
            checkInit.setInitUISuccess().checkInitSuccess();
            return;
        }

        require(["text!wa_dom", "knockout", "css!style"],function(dom, ko){
            $(selectorName || document.body).append(dom);

            // 设置电话图标的位置
            //vm.icon_posRight(right + 'px');
            //vm.icon_posBottom(bottom + 'px');

            // 设置WA_div的位置
            //vm.div_posRight(right + defaults.relativeRight + 'px');
            //vm.div_posBottom(bottom + defaults.relativeBottom + 'px');

            vm.div_posRight(right + 'px');
            vm.div_posBottom(bottom + 'px');

            //设置软电话登录界面是否展示
            vm.div_visible(visible);

            //获取设置电话图标的颜色和颜色变化的时间间隔
            vm.colorObj(colorObj);
            vm.icon_interval(interval);

            //设置登录信息是否只读
            vm.entIdReadonly(Boolean(entId.readonly));
            vm.agentIdReadonly(Boolean(agentId.readonly));
            vm.agentPasswordReadonly(Boolean(agentPassword.readonly));
            vm.agentNumberReadonly(Boolean(agentNumber.readonly));

            //设置外显号是否展示
            vm.outNumbersVisible(outNumbersVisible);

            ko.applyBindings(vm, document.getElementById("WA"));
            document.getElementById("WA").style.display = "block";

            // 绑定事件
            //initEventBind($);

            //界面显示、隐藏切换
            WebAgent.WaToggle = function() {
                $("#WA-div").toggle();
            };

            checkInit.setInitUISuccess().checkInitSuccess();
        });
    });
    //
    //var initEventBind = function($) {
    //    $(function() {
    //        var $waDiv = $("#WA-div");
    //        $("#WA-icon").bind("click", function() {
    //            if ($waDiv.is(":hidden")) {
    //                $waDiv.css("width", 0).show().animate({width: 330});
    //            } else {
    //                $waDiv.animate({width: 0}, function() {
    //                    $(this).hide();
    //                });
    //            }
    //        });
    //    });
    //};

})(WebAgent.baseUrl, WebAgent.WaParams, WebAgent.urlArgs);
