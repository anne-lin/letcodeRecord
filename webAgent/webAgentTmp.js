(function(window) {
    "use strict";

    /**
     * 服务器地址（支持http/https）
     * http默认端口80，https默认端口443
     */
    var config = {
        host: {
            //"http:" : "http://10.130.41.12:21346",
            "http:": "https://rtctest.channelsoft.com",
            "https:": "https://icbc.ccod.com"
        }
    };

    /**
     * 应用名称（默认为WebAgent）
     */
    var appName = "WebAgent";

    var WebAgent = {};

    WebAgent.host = config.host[location.protocol];

    /**
     * 判断当前浏览器是否支持
     * @returns {boolean}
     */
    function browserIsNotSupported() {
        return !(window.JSON && window.localStorage);
    }

    /**
     * 初始化入口函数
     * @param params
     */
    WebAgent.init = function(params) {
        if (browserIsNotSupported()) {
            console.log("您的浏览器版本过低，不支持Web坐席端，建议使用现代浏览器(谷歌/火狐/Internet Explorer 9+)访问");
            return { code: -1, msg: "browser not supported."};
        }

        WebAgent.initParams = params || {};

        WebAgent.baseUrl = WebAgent.initParams.useLocal ? "." : WebAgent.host + "/" + appName;

        loadScript("/Config.js?v=" + new Date().getTime(), function() {
            WebAgent.loadRequire();
        });
    };

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
        (document.head || document.getElementsByTagName("head")[0]).appendChild(script);
    }

    if (!window.WebAgent) {
        window.WebAgent = WebAgent;
    }

})(window);

