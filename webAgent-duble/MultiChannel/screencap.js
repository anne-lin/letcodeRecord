/**
 * 录屏相关api
 */
define(["TLog"], function (log) {
    
    /**
     * 登陆录屏软件
     * @param params
     */
    function loginScreenRecording(params) {
        $.ajax({
            url: 'http://127.0.0.1:7880/agent',
            type: "get",
            data: {
                request: 'logon',
                extensionid: params.extensionid,
                agentid: params.agentid
            },
            dataType: "json",
            error: function (err) {
                if (err.responseText) {
                    formmatResponse(
                        err.responseText,
                        function (params) {
                            if (params.result == 0) {
                                heartBeat();
                                log.log('登陆成功');
                            }
                            log.log('登陆状态码：' + params.result);
                        });
                }
            }
        });
    }
    
    /**
     * 与录屏软件做心跳检测
     */
    function heartBeat() {
        setTimeout(function () {
            $.ajax({
                url: 'http://127.0.0.1:7880/agent',
                type: "get",
                data: {
                    request: 'heartbeat',
                },
                dataType: "json",
                error: function (err) {
                    if (err.responseText) {
                        formmatResponse(
                            err.responseText,
                            function (params) {
                                log.log('录屏心跳:' + params.status);
                            });
                    }
                }
            });
            heartBeat();
        }, 20000);
    }
    
    /**
     * 登出录屏
     */
    function logoutScreenRecording() {
        $.ajax({
            url: 'http://127.0.0.1:7880/agent',
            type: "get",
            data: {
                request: 'logoff'
            },
            dataType: "json",
            error: function (err) {
                if (err.responseText) {
                    formmatResponse(
                        err.responseText,
                        function (params) {
                            log.log('登出结果:' + params.result);
                        });
                }
            }
        });
    }
    
    /**
     * 结果格式化
     * @param res
     * @param callBack
     */
    function formmatResponse(res, callBack) {
        let str = res;
        let strArr = str.split('?');
        let paramsStrArr = strArr[1] && strArr[1].split('&');
        let params = {};
        paramsStrArr.forEach(function (item) {
            let itemArr = item.split('=');
            params[itemArr[0]] = itemArr[1];
        });
        callBack(params);
    }
    
    function startScreencap(data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: WebAgent.config.screencapApi.start,
                type: "post",
                data: JSON.stringify({
                    agentId: data.agentId,
                    extension: data.extension,
                    agentName: data.agentName,
                    entId: data.entId
                }),
                dataType: "json",
                contentType:"application/json;charset=UTF-8",
                success: function (res) {
                    console.log(res);
                    res.status == "0" ? resolve() : reject();
                },
                error: function (err) {
                    log.log('开启录屏失败:' + JSON.stringify(err));
                    reject();
                }
            });
        });
    }
    
    function stopScreencap(data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: WebAgent.config.screencapApi.stop,
                type: "post",
                data: JSON.stringify({
                    agentId: data.agentId,
                    extension: data.extension,
                    agentName: data.agentName,
                    entId: data.entId
                }),
                dataType: "json",
                contentType:"application/json;charset=UTF-8",
                success: function (res) {
                    console.log(res);
                    res.status == "0" ? resolve() : reject();
                },
                error: function (err) {
                    log.log('关闭录屏失败:' + JSON.stringify(err));
                    reject();
                }
            });
        });
    }
    
    return {
        loginScreenRecording: loginScreenRecording,
        heartBeat: heartBeat,
        logoutScreenRecording: logoutScreenRecording,
        startScreencap:startScreencap,
        stopScreencap:stopScreencap,
    };
});
