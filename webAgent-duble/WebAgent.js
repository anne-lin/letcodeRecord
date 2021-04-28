function webAgent() {
    var config = {
        host: [{
            "http:": "https://icbc.ccod.com",
            "https:": "https://icbc.ccod.com"
        }],
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
            // vertoWebSocket: "wss://icbc.ccod.com/rtcsock"
            // 录屏相关api配置
            screencapApi: {
                start: 'https://icbc.ccod.com/customWebservice-manage01/mvc/vcLogScreen/startScreencap',
                stop: 'https://icbc.ccod.com/customWebservice-manage01/mvc/vcLogScreen/stopScreencap'
            }
        },
        vertoPasswrod: "43210",
    };
    this.currentHostIndex = 0; // agentProxy地址的索引
    this.host = config.host[this.currentHostIndex][location.protocol];
    this.baseUrl = this.host + "/" + config.appName;
    this.version = config.version;
    this.config = config.url;
    this.copyConfig = JSON.parse(JSON.stringify(config.url));
    this.vertoPasswrod = config.vertoPasswrod;
    this.initParams = {};
    this.userMessage = {
        skillList: [], // 当前坐席全部的技能组
        factSkillInfo: [], // 当前坐席选中的技能组
    };
    this.whiteUrl = ['screencapApi']; // 双中心不需要改变的路由
    /**
     * 静态的iceServer配置， cphone 和 webRTC共享
     * @type {{urls: string, credential: string, username: string}[]}
     */
    this.config['iceServerUrlList'] = [{
        urls: "turn:icbc.ccod.com:3478",
        username: "test001",
        credential: "test001"
    }];
    this.config['webRTCUrlList'] = [
        'wss://icbc.ccod.com/rtcsock'
    ];
    this.currentWebRTCIndex = 0;
    this.config["vertoWebSocket"] = this.config['webRTCUrlList'][this.currentWebRTCIndex];
    this.config['iceServers'] = [this.config['iceServerUrlList'][this.currentWebRTCIndex]];
    
    this.cphoneParams = {
        cphoneUrl: "https://localhost:8097/",
        wssUrl: this.config["vertoWebSocket"],
        password: config.vertoPasswrod,
        iceParams: JSON.stringify({
            iceServers: this.config['iceServers']
        })
    };
    
    /**
     * 获取服务路由的http路径的索引
     * @type {number}
     */
    this.serveUrlIndex = 0;
    
    /**
     * 获取服务路由的http路径,可配置多个
     * @type {string}
     */
    this.getServeUrl = [
        'http://10.130.76.68:8090/dcmsWebservice',
    ];
    this.isConnect = false; // 域切换之后是否自动登陆
    this.connectNum = 14;
    this.changeCentreUrl = 'http://10.130.25.170:8199'; // 切换中心的url路径
    
    /**
     * 是否使用多方会议
     * @type {boolean}
     */
    this.isUseMpConference = true;
    
    /**
     * 是否开启多中心
     * @type {boolean}
     */
    this.isMulticenter = false;
    
    /**
     * 多中心异步获取的agentProxy的地址，可以是多个
     * @type {*[]}
     */
    this.agentProxyUrlList = [];
    
    /**
     * agentProxy重连次数，到达改次数会进行改变地址
     * @type {number}
     */
    this.agentProxyReconnectNum = 1;
    
    /**
     * cchat是否初始化完成
     * @type {boolean}
     */
    this.chatInitFinished = false;
    
    if (qnTool.isBrowserLowerIE11()) {
        console.log("您的浏览器版本过低，不支持Web坐席端，建议使用现代浏览器(谷歌/火狐/Internet Explorer 11+)访问");
        return { code: -1, msg: "browser not supported." };
    }
//
//     /**
//      * 静态文件地址:js文件地址
//      * @type {string}
//      */
//     this.staticHost = 'https://rtctest.channelsoft.com';
//

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
    
    Promise.resolve().then(function () {
        if (!window.require) {
            return qnTool.loadScriptPromise("/public_lib/require-2.1.22.min.js");
        } else {
            return true;
        }
    }).then(function () {
        requirejs.onError = function (err) {
            console.error("[requirejsErrorType]-" + err.requireType);
            console.error('[requirejsErrorModules]-' + err.requireModules);
            if (err.requireType === 'timeout') {
                console.error('[requirejsErrorModules]-' + err.requireModules);
            }
            // throw err;
            console.error(err);
        };
        return qnTool.loadScriptPromise((devMode ? "/main.js" : "/main.min.js") + "?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"]);
    })
        .then(function () {
            that.WaParams = initParams.WaParams;
            return qnTool.loadScriptPromise((devMode ? "/WA/main.js" : "/WA/main.min.js") + "?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"]);
        })
        .then(function () {
            if (initParams.isUseCChat) {
                return new Promise(function (resolve) {
                    require([that.baseUrl + "/WA/theme/cchat.js?" + that.version["BUILD-DATE"] + "_" + that.version["GIT-Revision-SHORT"]], function () {
                        resolve();
                    });
                });
            } else {
                return true;
            }
        })
        .then(function () {
            that.ChatParams = initParams.ChatParams;
            that.ChatParams.callback = initParams.callback;
            return qnTool.loadScriptPromise((devMode ? "/Agent/main.js" : "/Agent/main.min.js") + "?" + WebAgent.version["BUILD-DATE"] + "_" + WebAgent.version["GIT-Revision-SHORT"]);
        });
};


// 获取socket地址标示
webAgent.prototype.initServer = function (params, successCallback) {
    let that = this;
    let ajaxParams = {
        url: this.getServeUrl[this.serveUrlIndex] + '/business/glsServiceUnitAction.do',
        type: "get",
        data: 'reqCode=getGlsServiceUnitByEntId&entId=' + params.entId,
        successCallback: null,
        errorCallback: null
    };
    
    function getServerList() {
        qnTool.ajax(ajaxParams)
            .then(function (res) {
                // let res = {
                //     "code": 0,
                //     "msg": "成功",
                //     "obj": {
                //         "agentProxyServer": "icbc.ccod.com;icbc.ccod.com",
                //         "coturn": "icbc.ccod.com:3478;icbc.ccod.com:3478",
                //         "coturnAccount": "test001/test001",
                //         "rtcServer": "icbc.ccod.com/rtcsock;icbc.ccod.com/rtcsock"
                //     }
                // };
                if (res.code == '0' && res.obj.agentProxyServer) {
                    let serverData = qnTool.formatServerList(res.obj);
                    qnTool.initData(that, serverData);
                    successCallback();
                }
            })
            .catch(function (err) {
                WebAgent.serveUrlIndex++;
                if (WebAgent.serveUrlIndex >= WebAgent.getServeUrl.length) {
                    $('#result').text('登陆失败，获取服务路由失败！');
                    WebAgent.serveUrlIndex = 0;
                    return;
                }
                ajaxParams.url = WebAgent.getServeUrl[WebAgent.serveUrlIndex] + '/business/glsServiceUnitAction.do';
                getServerList();
            });
    }
    
    getServerList();
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
    
    function loadScriptPromise(url) {
        return new Promise(function (resolve, reject) {
            loadScript(WebAgent.baseUrl + url, resolve);
        });
    }
    
    function ajax(params) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: params.url,
                type: params.type,
                data: params.data,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }
    
    function formatServerList(data) {
        let agentProxyUrlList = data.agentProxyServer.split(';').map(function (item) {
            return {
                "http:": 'http://' + item,
                "https:": 'https://' + item
            };
        });
        let iceServer = formatWebRTCAndIceUrl(true, 'iceServerUrlList', 'urls', 'turn', data.coturn, ':', data.coturnAccount);
        let webRTCUrlList = formatWebRTCAndIceUrl('', 'webRTCUrlList', '', 'wss', data.rtcServer, '://', '');
        return {
            agentProxyUrlList: agentProxyUrlList,
            iceServer: iceServer,
            webRTCUrlList: webRTCUrlList
        };
    }
    
    function formatWebRTCAndIceUrl(isIceUrl, key, defaultKey, defaultAgreement, urlStr, mark, account) {
        let item = WebAgent.config[key][0];
        let agreement = item
            ? defaultKey ? item[defaultKey].split(':')[0] : item.split(':')[0]
            : defaultAgreement;
        let list = urlStr && urlStr.split(';').map(function (item) {
            return agreement + mark + item;
        });
        if (isIceUrl) {
            let coturnAccount = account.split('/');
            let iceServer = list.map(function (item) {
                return {
                    urls: item,
                    username: coturnAccount[0],
                    credential: coturnAccount[1]
                };
            });
            return iceServer;
        } else {
            return list;
        }
    }
    
    function filterUrl(index, data) {
        if (!data) return [];
        let currentIndex = data[index]
            ? index
            : 0;
        let spliceItem = data.splice(currentIndex);
        let list = spliceItem.concat(data);
        return list;
    }
    
    function initData(that, serverData) {
        that.agentProxyUrlList = qnTool.filterUrl(serverData.currentHostIndex || that.currentHostIndex, serverData.agentProxyUrlList);
        that.config.iceServerUrlList = qnTool.filterUrl(serverData.currentWebRTCIndex || that.currentWebRTCIndex, serverData.iceServer);
        that.config.webRTCUrlList = qnTool.filterUrl(serverData.currentWebRTCIndex || that.currentWebRTCIndex, serverData.webRTCUrlList);
        that.currentHostIndex = 0;
        that.currentWebRTCIndex = 0;
        that.host = that.agentProxyUrlList[that.currentHostIndex][location.protocol];
        that.config.vertoWebSocket = that.config.webRTCUrlList[that.currentWebRTCIndex];
        that.config.iceServers = [that.config.iceServerUrlList[that.currentWebRTCIndex]];
        that.cphoneParams.iceParams = JSON.stringify({ iceServers: that.config.iceServers });
        that.cphoneParams.wssUrl = that.config.vertoWebSocket;
        qnTool.initChatUrl();
    }
    
    function initChatUrl() {
        let urlMap = JSON.parse(JSON.stringify(WebAgent.copyConfig));
        let newUrlMap = {};
        
        for (let key in urlMap) {
            if (WebAgent.whiteUrl.indexOf(key) == -1) {
                let list = urlMap[key].split('://');
                list.length > 1 ? list[1] = '://' + WebAgent.host : '';
                newUrlMap[key] = list.join('');
            }
        }
        WebAgent.config.url = $.extend(WebAgent.config.url, newUrlMap);
    }
    
    function isBrowserLowerIE11() {
        // 后期加上动态加载polyfill
        return navigator.userAgent.indexOf("Trident") != -1 && navigator.userAgent.indexOf("rv:11") == -1;
        
    }
    
    return {
        loadScriptPromise: loadScriptPromise,
        isBrowserLowerIE11: isBrowserLowerIE11,
        ajax: ajax,
        formatServerList: formatServerList,
        filterUrl: filterUrl,
        initData: initData,
        initChatUrl: initChatUrl,
    };
}

window.qnTool = Tool();
window.WebAgent = new webAgent();
