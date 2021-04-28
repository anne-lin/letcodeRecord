function webAgent() {
    var config = {
        host: {
            "http:": "https://icbc.ccod.com",
            "https:": "https://icbc.ccod.com"
        },
        appName: "WebAgent",
        version: {
            "GIT-BRANCH": "main-dev-BCM-poc",
            "BUILD-DATE": "2021-03-25",
            "artifactId": "webAgent",
            "GIT-Revision-SHORT": "fe01b075073",
            "version": "4.9.0.3",
            "project": "CCOD_IM"
        },
        url: {
            weixinEmojiPath: "https://icbc.ccod.com/emotion/",//表情文件地址
            quickSmartReplyPath_sensitive: "https://icbc.ccod.com/dcmse",//快捷&智能回复&敏感词校验接口地址
            getProjectDataPath: "https://icbc.ccod.com/customWebservice-manage01/mvc",//在线客服数&排队客户数&消息记录&当天下线客户列表
            // HTTP_BASE: "http://open.ccod.com:7070/http-bind/",//openfire_base
            ADD_AGENT_URL: "https://icbc.ccod.com/plugins/registerPlugin",//添加用户url
            FILE_UPLOAD_URL: "https://icbc.ccod.com/upload-manage01/WeixinFileUpload",//上传文件接口地址
            DOWN_FILE_URL: "https://icbc.ccod.com/",//下载文件IP
            HTTP_SERVER: "ccod",
            HTTP_BASE: "wss://icbc.ccod.com/ws/",
            vertoWebSocket: "wss://icbc.ccod.com/rtcsock",
            // 录屏相关api配置
            screencapApi: {
                start: 'https://icbc.ccod.com/customWebservice-manage01/mvc/vcLogScreen/startScreencap',
                stop: 'https://icbc.ccod.com/customWebservice-manage01/mvc/vcLogScreen/stopScreencap'
            }
        },
        vertoPasswrod: "43210",
    };
    this.cphoneParams = {
        cphoneUrl: "https://localhost:8097/",
        wssUrl: config.url["vertoWebSocket"],
        password: config.vertoPasswrod,
        iceParams: JSON.stringify({
            iceServers: [{
                urls: "turn:icbc.ccod.com:3478",
                username: "test001",
                credential: "test001"
            }]
        })
    };
    this.host = config.host[location.protocol];
    this.baseUrl = this.host + "/" + config.appName;
    this.version = config.version;
    this.config = config.url;
    this.vertoPasswrod = config.vertoPasswrod;
    this.initParams = {};
    this.userMessage = {
        skillList: [], // 当前坐席全部的技能组
        factSkillInfo: [] // 当前坐席选中的技能组
    };
    this.isConnect = false; // 域切换之后是否自动登陆
    this.connectNum = 14;
    this.changeCentreUrl = 'http://10.130.25.170:8199'; // 切换中心的url路径
    
    /**
     * 是否使用多方会议
     * @type {boolean}
     */
    this.isUseMpConference = true;
    
    /**
     * cchat是否初始化完成
     * @type {boolean}
     */
    this.chatInitFinished = false;
    
    if (qnTool.isBrowserLowerIE11()) {
        console.log("您的浏览器版本过低，不支持Web坐席端，建议使用现代浏览器(谷歌/火狐/Internet Explorer 11+)访问");
        return { code: -1, msg: "browser not supported." };
    }
    
}

webAgent.prototype.init = function (initParams) {
    if (initParams.useLocal) {
        this.baseUrl = ".";
    }
    //4.9优化，4.9合并默认配置
    this.initParams.webRTCConfig = initParams.webRTCConfig;
    
    try {
        this.loadMainScrip(initParams);
    } catch (e) {
        console.error("[webAgent]", e);
    }
};

webAgent.prototype.loadMainScrip = function (initParams) {
    let devMode = true;
    let that = this;
    
    if (!window.require) {
        return qnTool.loadScriptPromise("/public_lib/require-2.1.22.min.js", loadMain);
    } else {
        loadMain();
    }
    
    function loadMain() {
        requirejs.onError = function (err) {
            console.error("[requirejsErrorType]-" + err.requireType);
            console.error('[requirejsErrorModules]-' + err.requireModules);
            if (err.requireType === 'timeout') {
                console.error('[requirejsErrorModules]-' + err.requireModules);
            }
            // throw err;
            console.error(err);
        };
        qnTool.loadScriptPromise((devMode ? "/main.js" : "/main.min.js") + "?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"], loadWa);
    }
    
    function loadWa() {
        that.WaParams = initParams.WaParams;
        return qnTool.loadScriptPromise((devMode ? "/WA/main.js" : "/WA/main.min.js") + "?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"], loadChat);
    }
    
    function loadChat() {
        if (initParams.isUseCChat) {
            require([that.baseUrl + "/WA/theme/cchat.js?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"]], loadAgent);
        }else{
            loadAgent();
        }
    }
    
    function loadAgent() {
        that.ChatParams = initParams.ChatParams;
        that.ChatParams.callback = initParams.callback;
        return qnTool.loadScriptPromise((devMode ? "/Agent/main.js" : "/Agent/main.min.js") + "?" + WebAgent.version["BUILD-DATE"] + "_" + WebAgent.version["GIT-Revision-SHORT"]);
    }
    
    // Promise.resolve().then(function(){
    //     if(!window.require){
    //         return qnTool.loadScriptPromise("/public_lib/require-2.1.22.min.js");
    //     }else{
    //         return true;
    //     }
    // }).then(function(){
    //     requirejs.onError = function (err) {
    //         console.error("[requirejsErrorType]-" + err.requireType);
    //         console.error('[requirejsErrorModules]-' + err.requireModules)
    //         if (err.requireType === 'timeout') {
    //             console.error('[requirejsErrorModules]-' + err.requireModules);
    //         }
    //         // throw err;
    //         console.error(err)
    //     };
    //     return qnTool.loadScriptPromise((devMode ? "/main.js" : "/main.min.js") + "?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"])
    // })
    //     .then(function(){
    //         that.WaParams = initParams.WaParams;
    //         return qnTool.loadScriptPromise((devMode ? "/WA/main.js" : "/WA/main.min.js") + "?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"]);
    //     })
    //     .then(function(){
    //         if(initParams.isUseCChat){
    //             return new Promise(function(resolve){
    //                 require([that.baseUrl+"/WA/theme/cchat.js?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"]],function(){
    //                     resolve()
    //                 })
    //             })
    //         }else{
    //             return true
    //         }
    //     })
    //     .then(function(){
    //         that.ChatParams = initParams.ChatParams;
    //         that.ChatParams.callback = initParams.callback;
    //         return qnTool.loadScriptPromise((devMode ? "/Agent/main.js" : "/Agent/main.min.js") + "?" + WebAgent.version["BUILD-DATE"] + "_" + WebAgent.version["GIT-Revision-SHORT"]);
    //     })
};

function Tool() {
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = url;
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || /complete|loaded/.test(this.readyState)) {
                console.log("script [" + url + "] load success.");
                callback && callback();
                script.onload = null;
                script.onreadystatechange = null;
            }
        };
        (document.head || document.getElementsByTagName("head")[0]).appendChild(script);
    }
    
    function loadScriptPromise(url, callback) {
        // return new Promise(function(resolve,reject){
        //     loadScript(WebAgent.baseUrl + url,resolve)
        // })
        loadScript(WebAgent.baseUrl + url, callback);
    }
    
    function isBrowserLowerIE11() {
        // 后期加上动态加载polyfill
        return navigator.userAgent.indexOf("Trident") != -1 && navigator.userAgent.indexOf("rv:11") == -1;
        
    }
    
    return {
        loadScriptPromise: loadScriptPromise,
        isBrowserLowerIE11: isBrowserLowerIE11
    };
}

window.qnTool = Tool();
window.WebAgent = new webAgent();
