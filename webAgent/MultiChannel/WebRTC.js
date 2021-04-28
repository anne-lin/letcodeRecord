
define(["TLog","VertoFun","MultiRegisterEvent"], function(Log,VertoFun,MultiRegisterEvent) {
    var urlPrefix="/"+window.location.pathname.split("/")[1];
    var isAutoAnswer = false; //是否自动应答
    var currentCall;
    var loginCallback;
    var logoutCallback;
    var supportVideo=false;
    var supportVoice=false;
    var isVideoTalk = false;
    var RTC;
    var videoAnswerConfig={
        //useCamera:false,
        useCamera:true,
        useMic:true,
        useVideo:true
    };
    var vertoCallback = {
        permissionCallback:{
            onDenied:function(e){
                console.log("error2:",e);
                if(e.message == "Could not start video source"){
                    e.message = "摄像头不能使用";
                }
                MultiRegisterEvent.webRTCError(e);
            }
        },
        onToggleMedia:function(isCloseVideo){
            Log.log("[webRTC]onToggleMedia",isCloseVideo);
            MultiRegisterEvent.onToggleMedia(isCloseVideo);
            isVideoTalk=!isCloseVideo;
            isCloseVideo ? WebAgent.vm.callInTip("网络语音电话"):WebAgent.vm.callInTip("网络视频电话");
        },
        onWSLogin: function (verto, success) {
            console.log("webRTC登录结果：",success);
            if (success) {
               /*  var bytesToSendAndReceive = 1024 * 256;
                RTC.vertoHandle.rpcClient.speedTest(bytesToSendAndReceive, function (event, data) {
                    var upBand = Math.ceil(data.upKPS);
                    var downBand = Math.ceil(data.downKPS);
                }) */
                if(typeof loginCallback === 'function'){
                    loginCallback({ code: 0 });
                }
            } else {
                if(typeof loginCallback === 'function'){
                    loginCallback({ code: -1 })
                }
            }            
        },
        onWSClose: function () {
            if (typeof logoutCallback === 'function'){
                logoutCallback({ code: 0 })
            }
            if(currentCall){
                WebAgent.extend.hangup();
            }
        },
        onDialogState: function (d) {
            if (!currentCall) {
                currentCall = d;
            }
            switch (d.state.name) {
                case 'trying':
                    break;
                case 'answering':
                    break;
                case 'active':
                    break;
                case 'hangup':
                    Log.log('[webRTC]hangup：' + d.cause);
                    WebAgent.vm.operBoxDisplay(false);
                    WebAgent.vm.hasAnswerBtnClicked(false);
                    currentCall = null;
                    break;
                case 'ringing': {
                    if (isAutoAnswer) {                        
                        d.params.wantVideo ? currentCall.answer(videoAnswerConfig): currentCall.answer();
                        // currentCall.answer();
                    } else {
                        Log.log("webRTC振铃");
                    }
                    WebAgent.vm.operBoxDisplay(true);   
                    isVideoTalk = d.params.wantVideo;                 
                    d.params.wantVideo ? WebAgent.vm.callInTip("网络视频电话"):WebAgent.vm.callInTip("网络语音电话");                    
                    break;
                }
                case 'destroy':
                    Log.log("[webRTC]destroy");
                    document.getElementById('hangup').play();
                    currentCall = null;
                    break;
            }
        },
        onMessage: function (msg) {
            Log.log("[webRTC]error:",msg);
        }
    };
    function login(username, password, socketUrl, callback , logoutCallbackRegister) {
        RTC=new VertoFun();
        loginCallback = callback;
        logoutCallback = logoutCallbackRegister;
        RTC.login(Object.assign({
            login: username,
            passwd: password,
            socketUrl: socketUrl,
            tag: 'video-container',
            ringFile: WebAgent.baseUrl + '/WA/sounds/bell_ring2.wav',
            ringTag: 'belling-ring',
            localTag:"local-video",
            iceServers: [{
                urls: ["turn:106.75.51.230:3478"],
                username: "test001",
                credential: "test001",
            }]
           // deviceLabel:"FU Virtual Camera-Avatar"
        },WebAgent.initParams.webRTCConfig),vertoCallback);

        Promise.all([RTC.checkAudioDevice(),RTC.checkVideoDevice()])
        .then(function(resArr){
            Log.log("webRTC设备检测结果："+ resArr);
            supportVideo=resArr[1],
            supportVoice=resArr[0]
        }).catch(function(e){
            console.log("获取设备接口异常");
        });

       /*  RTC.getDevice().then(function(res){
            res.video.some(function(deviceInfo){
                if(deviceInfo.label == "FU Virtual Camera-Avatar"){
                    videoAnswerConfig.useCamera = deviceInfo.id;
                    return true;
                }
                return false;
            });  
        }) */

        return {
            code: 0,
            msg: '登录命令已发送'
        }
    }

        /**
         * 登出
         */
        function logout(callback) {
            logoutCallback = callback;
            if (RTC) {
                RTC.logout();
            }
        }

        /**
         * 设置是否自动应答
         * @param {*} isAutoAnswer
         */
        function setAutoAnswer(autoAnswer) {
            isAutoAnswer = autoAnswer;
        }

        function makeCallVideo(number){
            if (RTC) {
                RTC.makeCallVideo(number);
            }
        }
        /**
         * 应答/自动应答
         */
        function answer() {
            if (currentCall) {
                currentCall.params.wantVideo ? currentCall.answer(videoAnswerConfig): currentCall.answer(); 
                return {
                    code: 0
                }
            } else {
                return {
                    code: -1,
                    msg: 'answer denied'
                };
            }
        }
        /**
         * 挂断接口
         */
        function hangup() {
            if (currentCall) {
                currentCall.hangup();
                // ringingPanelDisplay(ringingPanelEl, false);
                WebAgent.vm.operBoxDisplay(false);
                return {
                    code: 0
                }
            } else {
                return {
                    code: -1,
                    msg: 'hangup denied'
                };
            }
        }

        /**
         * 获取媒体设备列表接口
         */
        function getDevicesList() {
            try {
                return navigator.mediaDevices.enumerateDevices();
            } catch (error) {
                log.log("[webRTC]get devices error: " + error);
            }
        }

        /**
         * 设置通信设备接口
         * @param {*} device
         */
        function setDevice(device) {
            Log.log("[webRTC]设置通信设备接口:"+device);
            if (currentCall) {
                currentCall.setAudioPlaybackDevice(device); //skid, callback, args
            }
        }
        function setMute(){
            console.log("设置声音");
            if(currentCall) {
                currentCall.setMute("toggle");
            }else{
                return "当前不在通话状态";
            }
        }
        function toggleMediaType(){
            if(currentCall && currentCall.params.wantVideo) {
                currentCall.toggleMediaType();
            }else{
                return "当前不在视频通话中";
            }
        }

        function checkDevice(){
            return {
                supportVideo:supportVideo,
                supportVoice:supportVoice
            }
        }

        function cutImg(options){
            if(RTC){
                return RTC.cutImage(options);
            }
        }
        function getStats(upAudioCallback,upVideoCallback,downAudioCallback,downVideoCallback){
            if(!currentCall){
                return "当前不处于通话中";
            }
            RTC.getStats(currentCall,1000,upAudioCallback,upVideoCallback,downAudioCallback,downVideoCallback);
        }
        function changeDevice(options){
            if(!currentCall){
                return "当前不处于通话中";
            }
            currentCall.changeDevice(options);
        }
        function toggleOpenCam(){
            if(!currentCall){
                return "当前不处于通话中";
            }
            isVideoTalk=!isVideoTalk;
            isVideoTalk ? WebAgent.vm.callInTip("网络视频电话"):WebAgent.vm.callInTip("网络语音电话");
            currentCall.toggleOpenCam();
        }
        return {
            login : login,
            logout : logout,
            answer : answer,
            setAutoAnswer : setAutoAnswer,
            hangup : hangup,
            getDevicesList : getDevicesList,
            setDevice : setDevice,
            makeCallVideo : makeCallVideo,
            setMute : setMute,
            checkDevice : checkDevice,
            cutImg : cutImg,
            getStats : getStats,
            changeDevice : changeDevice,
            toggleOpenCam : toggleOpenCam,
            toggleMediaType : toggleMediaType
        };

});
