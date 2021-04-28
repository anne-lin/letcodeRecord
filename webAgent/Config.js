(function(window) {
    "use strict";

    /**
     * 版本信息
     * @type {{name: string, date: string, svn: string}}
     */
    var version = {
        "Created-By":"require.js",
        "GIT-BRANCH":"main-dev",
        "BUILD-DATE":"2020-07-09",
        "artifactId":"webAgent",
        "GIT-Revision-SHORT":"c3e9ebdd",
        "version":"2.0.4.0",
        "project":"CCOD_IM",
    };

    /**
     * 是否是开发模式（上线时参数须修改为false）
     */
    var devMode = getDevMode(false);

    /**
     * 服务器地址（支持http/https）
     * http默认端口80，https默认端口443
     */
    var config = {
        weixinEmojiPath: "https://rtctest.channelsoft.com/emotion/",//表情文件地址
        quickSmartReplyPath_sensitive: "https://open.ccod.com/dcmse",//快捷&智能回复&敏感词校验接口地址
        getProjectDataPath: "https://rtctest.channelsoft.com/customWebservice/mvc",//在线客服数&排队客户数&消息记录&当天下线客户列表
        // HTTP_BASE: "http://open.ccod.com:7070/http-bind/",//openfire_base
        ADD_AGENT_URL: "https://rtctest.channelsoft.com/plugins/registerPlugin",//添加用户url
        FILE_UPLOAD_URL: "https://rtctest.channelsoft.com/upload/WeixinFileUpload",//上传文件接口地址
        DOWN_FILE_URL: "https://rtctest.channelsoft.com/",//下载文件IP
    };
    WebAgent.config = config;

    WebAgent.config["HTTP_SERVER"]="ccod";
    WebAgent.config["HTTP_BASE"]="wss://rtctest.channelsoft.com/ws/";
    WebAgent.config["vertoWebSocket"]="wss://rtctest.channelsoft.com/rtcsock";
    WebAgent.vertoPasswrod = '43210';

    WebAgent.version = version;

    WebAgent.devMode = devMode;

    /**
     * CPhone相关配置
     * @type {{wssUrl: string, password: string, iceParams: string, cphoneUrl: string}}
     */
    var cphoneParams = {
        cphoneUrl: "https://localhost:8097/",
        wssUrl: "wss://icbc.ccod.com/rtcsock",
        password: "43210",
        iceParams: JSON.stringify({
            iceServers: [{
                urls: "turn:icbc.ccod.com:3478",
                username: "test001",
                credential: "test001"
            }]
        })
    };

    WebAgent.cphoneParams = cphoneParams;

    /**
     * 是否使用多方会议
     * @type {boolean}
     */
    WebAgent.isUseMpConference = true;

    /**
     * 加载模块附加的参数，开发时增加时间戳用于清除缓存，上线后去掉或设置固定值
     */
    WebAgent.urlArgs = "v=" + (WebAgent.devMode ? new Date().getTime() : version["BUILD-DATE"] + "_" + version["GIT-Revision-SHORT"]);

    /**
    *author:linyh
    *function:过滤整理地址
    *parameter: object 配置地址
    */
    function filterUrl(config) {
        var reg=/http[s]*:/,
            protocol=location.protocol;
        if(typeof config == "object"){
            for(var key in config){
                if(config.hasOwnProperty(key)){
                    if(reg.test(config[key])){
                        config[key]=config[key].replace(reg,protocol);
                    }else {
                        config[key]=protocol + "//"+ config[key];
                    }
                }
            }
        }else {
            if(reg.test(config)){
                config=config.replace(reg,protocol);
            }else {
                config=protocol + "//"+ config;
            }
        }

        return config;
    }

    /**
     * 获取开发模式配置
     * @param devMode
     * @returns {*|boolean}
     */
    function getDevMode(devMode) {
        return devMode || localStorage.getItem("QN_WEBAGENT_DEVMODE") == "true";
    }

    /**
     * 加载requirejs文件
     */
    WebAgent.loadRequire = function() {
        loadScript("/public_lib/require-2.1.22.min.js", function() {

            //捕获在局域的errback中未捕获的异常
            requirejs.onError = function (err) {
                console.log(err);
                console.log("[requirejsErrorType]-" + err.requireType);
                console.log('[requirejsErrorModules]-' + err.requireModules)
                if (err.requireType === 'timeout') {
                    console.log('[requirejsErrorModules]-' + err.requireModules);
                }

                throw err;
            };
            loadScript((devMode ? "/main.js" : "/main.min.js") + "?" + WebAgent.urlArgs, function() {
                WebAgent.initParams.callback();
            })
        });
    }

    WebAgent.WaInit = function(param) {
        WebAgent.WaParams = param;
        loadScript((devMode ? "/WA/main.js" : "/WA/main.min.js") + "?" + WebAgent.urlArgs);
    }

    WebAgent.ChatInit = function(param) {
        WebAgent.ChatParams = param;
        loadScript((devMode ? "/Agent/main.js" : "/Agent/main.min.js") + "?" + WebAgent.urlArgs);
    }

    /**
     * cchat是否初始化完成
     * @type {boolean}
     */
    WebAgent.chatInitFinished = false;

    function log(msg) {
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
    }

    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = WebAgent.baseUrl + url;
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || /complete|loaded/.test(this.readyState)) {
                console.log("script [" + url + "] load success.");
                if (typeof callback === "function") {
                    callback();
                }
                script.onload = null;
                script.onreadystatechange = null;
            }
        };
        script.onerror = function(e) {
            if(url.split('/')[url.split('/').length - 1] == "require-2.1.22.min.js") {
                console.log('require-2.1.22.min.js加载失败，重新加载');
                WebAgent.loadRequire();
            }
            console.log(e);
        };
        (document.head || document.getElementsByTagName("head")[0]).appendChild(script);
    }

    /**
     * 附加模块
     * @param moduleName
     * @param callback
     */
    WebAgent.attachModule = function(moduleName, callback) {
        require([moduleName], function() {
            log("module [" + moduleName + "] attached success.");
            if (typeof callback === "function") {
                callback();
            }
        });
    };

})(window);

