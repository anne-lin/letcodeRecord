WebAgent.version = {
    "GIT-BRANCH":"main-dev",
    "BUILD-DATE":"2020-07-09",
    "artifactId":"webAgent",
    "GIT-Revision-SHORT":"222de81a7656aa9999b1df02388eeaa19872e664",
    "version":"4.5.9.2_bcc",
    "project":"CCOD_IM"
}
WebAgent.config = {
    weixinEmojiPath: "https://rtctest.channelsoft.com/emotion/",//表情文件地址
    quickSmartReplyPath_sensitive: "https://open.ccod.com/dcmse",//快捷&智能回复&敏感词校验接口地址
    getProjectDataPath: "https://rtctest.channelsoft.com/customWebservice/mvc",//在线客服数&排队客户数&消息记录&当天下线客户列表
    // HTTP_BASE: "http://open.ccod.com:7070/http-bind/",//openfire_base
    ADD_AGENT_URL: "https://rtctest.channelsoft.com/plugins/registerPlugin",//添加用户url
    FILE_UPLOAD_URL: "https://rtctest.channelsoft.com/upload/WeixinFileUpload",//上传文件接口地址
    DOWN_FILE_URL: "https://rtctest.channelsoft.com/",//下载文件IP
    HTTP_SERVER:"ccod",
    HTTP_BASE:"wss://rtctest.channelsoft.com/ws/",
    vertoWebSocket:"wss://rtctest.channelsoft.com/rtcsock",
    vertoPasswrod:'43210'
}
//后期4.9优化
WebAgent.vertoPasswrod = '43210';

WebAgent.cphoneParams = {
    cphoneUrl: "https://localhost:8097/",
    wssUrl: WebAgent.config["vertoWebSocket"],
    password: WebAgent.vertoPasswrod,
    iceParams: JSON.stringify({
        iceServers: [{
            urls: "turn:icbc.ccod.com:3478",
            username: "test001",
            credential: "test001"
        }]
    })
};

webAgent.prototype.loadMainScrip =async function(initParams){
    let devMode=false;

    await qnTool.loadScript((devMode ? "/main.js" : "/main.min.js") + "?" + WebAgent.version["BUILD-DATE"] + "_" + WebAgent.version["GIT-Revision-SHORT"]);

    WebAgent.WaParams = initParams.WaParams;
    await qnTool.loadScript((devMode ? "/WA/main.js" : "/WA/main.min.js") + "?" + WebAgent.version["BUILD-DATE"] + "_" + WebAgent.version["GIT-Revision-SHORT"]);

    if(initParams.isUseCChat){
        await new Promise((resolve)=>{
            require([WebAgent.baseUrl+"/WA/theme/cchat.js?" + WebAgent.version["BUILD-DATE"] + "_" + WebAgent.version["GIT-Revision-SHORT"]],function(){
                resolve()
            })
        })
    }

    WebAgent.ChatParams = initParams.ChatParams;
    WebAgent.ChatParams.callback = initParams.callback;
    await qnTool.loadScript((devMode ? "/Agent/main.js" : "/Agent/main.min.js") + "?" + WebAgent.version["BUILD-DATE"] + "_" + WebAgent.version["GIT-Revision-SHORT"],false);
}