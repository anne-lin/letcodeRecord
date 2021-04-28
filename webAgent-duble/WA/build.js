/**
 * Created by panfei on 2016/07/16.
 */
({
    baseUrl: ".",
    paths: {
        "jquery"    : "../MultiChannel/windowJquery",
        //"jquery"    : "../public_lib/jquery-2.1.4.min",
        "knockout"  : "../public_lib/knockout-3.4.0",
        //"bootstrapJ": "../public_lib/bootstrap.min",
        //"css"       : "../public_lib/css.min",
        //"text"      : "../public_lib/text",
        "font"      : "../public_css/font-awesome.min",
        //"bootstrapC": "../public_css/bootstrap.min",
        //"dialog"    : "lib/ks-dialog",
        "colorBlink": "../public_lib/colorBlink",

        "wa_io"  : "lib/netty-socket.io",
        "wa_json": "lib/json",
        "area_code"      : "lib/area-code",
        "style"  : "css/WA",
        "wa_dom" : "app/WA-ui.html",

        "wa_Defaults"           : "app/Defaults",
        "wa_Constant"           : "app/Constant",
        "wa_Counter"            : "app/Counter",
        "wa_Log"                : "app/Log",
        "wa_Socket"             : "app/Socket",
        "wa_Extend"             : "app/Extend",
        "wa_ViewModel"          : "app/ViewModel",
        "wa_Vm"                 : "app/Vm",
        "wa_CheckInit"          : "app/CheckInit",
        "wa_RegisterHandler"    : "app/RegisterHandler",
        "wa_Tip"                : "app/Tip",
        "wa_HandleEvent"        : "app/HandleEvent",
        "wa_HandleCommandResult": "app/HandleCommandResult",
        "wa_Storage"            : "app/Storage",
        "dialog"                : "app/Dialog",
        "HRCookie"              : "app/HRCookie",
        "RobotAgent"            : "app/RobotAgent",
        "Utils"             : "../MultiChannel/utils"
    },
    out: "main.min.js",
    name: "main"
})