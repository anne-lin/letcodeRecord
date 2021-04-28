class webAgent{
    constructor(){
        var config = {
            host: {
                 "http:": "https://rtctest.channelsoft.com",
                 "https:": "https://icbc.ccod.com"
            },
            appName:"WebAgent",
        };
        this.host = config.host[location.protocol];
        this.baseUrl = this.host + "/" + config.appName;
        this.initParams={}
        this.loadSource.bind(this);
    }    
    
    init(initParams){
        if (qnTool.browserIsNotSupported()) {
            console.log("您的浏览器版本过低，不支持Web坐席端，建议使用现代浏览器(谷歌/火狐/Internet Explorer 9+)访问");
            return { code: -1, msg: "browser not supported."};
        }
        if(initParams.useLocal){
            this.baseUrl = "."
        }
        //4.9优化，4.9合并默认配置
        this.initParams.webRTCConfig=initParams.webRTCConfig;
        try{
            this.loadSource(initParams);
        }catch(e){
            console.error("[webAgent]",e);
        }
    }

    async loadSource(initParams){
        await qnTool.loadScript("/Config.js?v=" + new Date().getTime());

        if(!window.require){
           await qnTool.loadScript("/public_lib/require-2.1.22.min.js")
        }

        await this.loadMainScrip(initParams);

        requirejs.onError = function (err) {
            console.error("[requirejsErrorType]-" + err.requireType);
            console.error('[requirejsErrorModules]-' + err.requireModules)
            if (err.requireType === 'timeout') {
                console.error('[requirejsErrorModules]-' + err.requireModules);
            }
            throw err;
        };
    }
    
}
function Tool(){
    function loadScript(url,isAsync=true) {
        return new Promise(function(resolve,reject){
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = isAsync;
            script.src = WebAgent.baseUrl+url;
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || /complete|loaded/.test(this.readyState)) {
                    console.log("script [" + url + "] load success.");
                    resolve();
                    script.onload = null;
                    script.onreadystatechange = null;
                }
            };
            (document.head || document.getElementsByTagName("head")[0]).appendChild(script);            
        })        
    }

    function browserIsNotSupported() {
        return !(window.JSON && window.localStorage);
    }

    return {
        loadScript:loadScript,
        browserIsNotSupported:browserIsNotSupported
    }
}
window.WebAgent =new webAgent();
window.qnTool=Tool();