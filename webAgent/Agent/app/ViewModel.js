/**
 * Created by panfei on 2015/11/23.
 */

define(["jquery", "knockout", "util", "User", "require", "IMG", "RegisterEvent", "css!weixinEmojiC", "weixinEmojiJ", "weixinEmojiExtend"], function ($, ko, util, User, require, IMG, registerEvent) {
    return function () {
        var self = this;
        
        //检测url的正则
        var regUrl = new RegExp("(http://|https://|ftp://|www.)+\\S+", "g");
        var regPro = new RegExp("^(http://|https://|ftp://)"); //判断url里是否有协议
        
        //是否开启聊天记录共享
        this.isShareMessage = ko.observable("0");
        //是否已发送过请求评价
        //this.isSendEvalRequest = ko.observable(false);
        /**
         * 聊天窗体相关信息
         */
        this.username = ko.observable();
        //this.userList = ko.observableArray([new User("001", "002", "weixin")]);
        this.userList = ko.observableArray([]);
        this.currentUser = ko.observable(new User());
        this.inputText = ko.observable();
        this.nickContent = ko.observable({});
        this.isRegister = ko.observable(false);
        this.agentOnline = ko.observable(false);
        //消息发出后确认接收相关
        var ackMessageArr = [];
        this.msgSendFail = ko.observable(false);
        this.msgContent = ko.observable("");
        
        //是否开启敏感词提示框
        this.msgTip = ko.observable(false);
        this.msgWord = ko.observable("");
        this.msgWordHead = ko.observable("");
        
        //文本会话达到最大会话数，是否将状态置忙。默认为否
        this.isMaxTalkUpSetBusy = ko.observable(false);
        //文本会话最大会话数值
        this.maxTalkNum = ko.observable(0);
        
        //截图工具
        this.imPastePicDialog = ko.observable(false); //截图预览容器
        this.imCutToolDialog = ko.observable(false);//截图工具窗
        
        //截图发送取消事件
        this.pastePicCancel = function () {
            document.querySelector("#picDiv").innerHTML = "";
            self.imPastePicDialog(false);
        };
        
        // 快捷回复相关参数
        const commonWordList = JSON.parse(localStorage.getItem('commonWordList') || '[]');
        this.commonWordList = ko.observableArray(commonWordList);
        this.commonWordValue = ko.observable('');
        this.isShowCommonWordBtn = ko.observable(true);
        this.currentCommonWord = ko.observable();
        this.isShowCommonWordDialog =  ko.observable(false);
        
        // 存储到本地
        const saveCommonWordList = function (list) {
            localStorage.setItem('commonWordList', JSON.stringify(list));
        };
        
        // 新增常用语
        this.addCommonWord = function () {
            self.isShowCommonWordBtn(false);
        };
        
        // 删除常用语
        this.delCommonWord = function (index) {
            self.commonWordList.splice(index, 1);
            saveCommonWordList(self.commonWordList());
        };
        
        // 改变常用语状态
        this.handleChangeCommonWord = function (type) {
            if (type === 'submit') {
                if (self.commonWordValue().trim() === '') {
                    self.commonWordValue('');
                    return
                };
                self.commonWordList.push({
                    word: self.commonWordValue(),
                });
                saveCommonWordList(self.commonWordList());
            }
            self.commonWordValue('');
            self.isShowCommonWordBtn(true);
        };
        
        // 点击常用语发送信息
       /*  this.sendCommonWord = function (index) {
            self.currentCommonWord(self.commonWordList()[index].word);
            self.sendMessage('commonWord');
            self.isShowCommonWordDialog(false);
        }; */
    
        // 展示常用语的弹框
        this.showCommonWordDialog = function () {
            self.isShowCommonWordDialog(true);
        }
        
        /**
         * 截图预览并返回发送接口事件
         * @param e 粘贴事件
         * @return function 截图发送事件
         * */
        this.pastePicFun = function (e) {
            var e = e.originalEvent; //使用jquery监听paste事件时加上此句，原生js不需要
            var cbd = e.clipboardData;
            var item = cbd.items[0];
            if (item.kind != "file") {
                return;
            }
            var blob = item.getAsFile();
            var size = blob.size;
            if (size == 0) {
                return;
            }
            /**
             * 图片预览
             */
            self.imPastePicDialog(true);
            //图片预览容器
            var picDiv = document.querySelector("#picDiv"),
                containerWidth = $("#picDiv").width(),
                containerHeight = $("#picDiv").height(),
                nPower = 0;
            
            var reader = new FileReader();
            var imgs = new Image();
            imgs.file = blob;
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            }(imgs));
            
            //截图适应图片容器大小
            reader.onloadend = function () {
                var realWidth = imgs.width,
                    initialWidth = imgs.width,
                    realHeight = imgs.height,
                    initialHeight = imgs.height;
                while ( (realWidth > containerWidth) || (realHeight > containerHeight) ) {
                    nPower--;
                    realWidth = initialWidth * Math.pow(1.2, nPower);
                    realHeight = initialHeight * Math.pow(1.2, nPower);
                }
                imgs.setAttribute("width", realWidth + "px");
                imgs.setAttribute("height", realHeight + "px");
            };
            reader.readAsDataURL(blob);
            picDiv.appendChild(imgs);
            
            /**
             * 使用闭包，点击发送按钮，发送图片
             * */
            var sendPic = function () {
                var data = new FormData(); //IE下，textArea不支持图片粘贴，直接使用FormData不考虑兼容性问题
                data.append('file', blob);
                $.ajax({
                    url: WebAgent.config.FILE_UPLOAD_URL,
                    type: 'POST',
                    cache: false,
                    data: data,
                    processData: false,//  不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                    contentType: false,//  不设置Content-type请求头
                    success: function (jsonObj) {
                        var res = JSON.parse(jsonObj);
                        if (res.ok == "1") {
                            var originalPath = res.originalImagePath;
                            var zoomUrl = res.zoomImageUrl;
                            self.sendMessage("image", originalPath, zoomUrl);
                        } else {
                            alert(res.error);
                        }
                        self.imPastePicDialog(false);
                        picDiv.innerHTML = "";
                    },
                    error: function (e) {
                        util.Log("log", e);
                        
                    }
                });
            };
            return sendPic;
        };
        
        //是否开启自动匹配
        this.openAutoMatch = ko.observable(false);
        
        //是否显示智能协助
        this.intellHelp = ko.observable(false);
        //是否开启智能协助（window）
        this.openIntellHelp = ko.observable(false);
        
        //企业ID
        this.agentEntId = ko.observable();
        
        //坐席ID
        this.agentId = ko.observable();
        
        //坐席超时未回复时间
        this.timeOut = ko.observable();
        
        //切换表情列表显示、隐藏
        this.emojiPaneDis = ko.observable(false);
        
        //短视频显示开关
        this.videoPlace = ko.observable(false);
        
        this.onlineVideo = ko.observable("");
        
        this.videoImg = ko.observable(WebAgent.baseUrl + "/Agent/images/video.png");
        
        //音/视频按钮显示
        this.webRTCVideo = false;
        this.webRTCAduio = false;
        
        //发送快捷键
        this.btnKeyListDis = ko.observable(false);
        
        //发送的快捷键选择列表
        this.btnKeyList = ko.observableArray([
            {
                key: "Enter",
                desc: "按Enter键发送消息",
                faCheck: ko.observable(localStorage.getItem("chat-sendKey") == "Enter" || localStorage.getItem("chat-sendKey") == null)
            },
            {
                key: "CtrlEnter",
                desc: "按Ctrl+Enter键发送消息",
                faCheck: ko.observable(localStorage.getItem("chat-sendKey") == "CtrlEnter")
            }
        ]);
        
        //置闲:状态为置忙时可用
        this.readyEnabled = ko.observable(false);
        
        //坐席列表
        this.agentList = ko.observableArray([]);

        //转坐席留言
        this.transferMsg = ko.observable();
        
        //进行中对话列表是否展开
        this.isOnlineListShow = ko.observable(true);
        
        //已结束对话列表是否展开
        this.isOfflineListShow = ko.observable(true);

        //内部沟通坐席列表是否展开
        this.isInternalChatListShow = ko.observable(false);

        //坐席列表是否展开
        this.isAgentAllListShow = ko.observable(false);
        
        //在线客服数
        this.onlineAgentNum = ko.observable(0);
        
        //排队客户数
        this.queueUserNum = ko.observable(0);
        
        //当前客户previousImSessionId
        this.currentImSessionId = ko.observable(); //当前客户previousImSessionId
        
        //上线提示音
        this.onlineTipMusic = ko.observable(WebAgent.baseUrl + '/Agent/tipMusic/onlineTip.mp3');
        
        //发送消息为空提示
        this.msgContentErrorDis = ko.observable(false);
        
        //消息提示音
        this.msgTipMusic = ko.observable(WebAgent.baseUrl + '/Agent/tipMusic/msgTip.mp3');
        
        /**
         * 设置声音提醒
         * @param param
         * onlineTip: boolean(默认false)
         * msgTip: boolean(默认false)
         */
        this.setChatSoundTip = ko.observable({ onlineTip: false, msgTip: false });
        
        
        //判断是否验证敏感词，默认为是
        this.isCheckWord = true;
        //验证敏感词
        this.checkWord = function () {
            if (!this.isCheckWord) {
                self.msgTip(false);
                self.sendMessage("text");
                $(".message-input").attr("disabled", false);
                return;
            }
            var url = WebAgent.config.quickSmartReplyPath_sensitive + "/sensitiveWords/checkSensitiveWords";
            var errorMsg = "";
            
            console.log("self.inputText():", self.inputText());
            if (self.inputText() == "" || self.inputText() == undefined || self.inputText() && $.trim(self.inputText()) == "") {
                errorMsg = "消息内容不能为空！";
            }
            if (self.inputText() && self.inputText().length > 1000) {
                errorMsg = "消息内容超出限制";
            }
            if (errorMsg) {
                self.msgContentErrorDis(errorMsg);
                setTimeout(function () {
                    self.msgContentErrorDis(false);
                }, 800);
                return;
            }
            
            if (self.inputText() == "" || self.inputText().trim() == "") {
                return;
            }
            var data = {
                message: self.inputText(),
                entId: self.agentEntId()
                //entId: "0103290014"
            };
            var callback = function (data) {
                switch ( data.code ) {
                    case "0": {
                        self.msgTip(false);
                        self.sendMessage("text");
                        $(".message-input").attr("disabled", false);
                        break;
                    }
                    case "-1": {
                        self.msgTip(true);
                        self.msgWordHead("你输入的内容包含敏感词，无法发送：");
                        self.msgWord(data.obj.join("/"));
                        $(".message-input").attr("disabled", true).css("background", "white");
                        break;
                    }
                    default: {
                        util.Log("error", data.desc);
                        
                    }
                }
            };
            util.ajaxHelper.post(url, data, callback);
        };
        
        //浏览器消息提示
        User.prototype.msgTip = function (tipMsg, isNewCustom) {
            var selfU = this;
            
            if (!('Notification' in window)) {
                alert('您的浏览器不支持桌面通知特性，请下载谷歌浏览器试用该功能');
                return;
            }
            
            Notification.requestPermission(function (status) {
                if (status === "granted") {
                    var notification = new Notification("提醒", {
                        body: tipMsg,
                        icon: WebAgent.baseUrl + '/Agent/images/qnsoft.png',
                        dir: 'auto',
                        tag: selfU.name
                    });
                    if (!isNewCustom) {
                        notification.onclick = function () {
                            self.selectUser(selfU);
                            notification.close();
                        };
                    }
                } else {
                    alert("不能弹出通知，status:" + status);
                }
            });
        };
        
        //切换列表
        this.toggleChatList = function (type) {
            //在线会话列表
            if (type == "online") {
                self.isOnlineListShow(!self.isOnlineListShow());
                $("#onlineChatList").slideToggle();
                return;
            }
            //下线会话列表
            if (type == "offline") {
                self.isOfflineListShow(!self.isOfflineListShow());
                $("#offlineChatList").slideToggle();
                return;
            }
            //坐席列表
            if(type == "agentAllList"){
                self.isAgentAllListShow(!self.isAgentAllListShow());
                $("#agentAllList").slideToggle();
                return;
            }
            //内部沟通列表
            if(type == "internalChatList"){
                self.isInternalChatListShow(!self.isInternalChatListShow());
                $("#internalChatList").slideToggle();
            }
        };
        
        //添加客户
        this.addUser = function (name, ent, channel) {
            var user = new User(name, ent, channel);
            self.userList.push(user);
            return user;
        };
        
        //切换用户
        this.selectUser = function (user) {
            var currentUser = self.currentUser();
            
            if (user.sessionId == currentUser.sessionId) {
                self.currentUser().msgNumber(0);
                return;
            } else {
                self.currentUser().inputText(self.inputText());
                self.transferMsg("");
                self.currentUser(user);
                self.currentUser().msgNumber(0);
                self.inputText(user.inputText());
                registerEvent.selectUser({
                    userId: user.name,
                    entId: user.ent,
                    channel: user.channel
                });
                
                if (user.isNewUser()) { //新客户被切换的时候，滚动条滚动到底部，老客户保持原状
                    user.isNewUser(false);
                    util.ScrollToBottom();
                }
            }
        };
        
        //判断在线的用户
        this.onlineArr = ko.computed(function () {
            return ko.utils.arrayFilter(self.userList(), function (item) {
                return item.online();
            });
        }, this);
        
        //判断不在线的用户
        this.offlineArr = ko.computed(function () {
            return ko.utils.arrayFilter(self.userList(), function (item) {
                //item.isTiming(false);  //下线之后超时清空
                return !item.online();
            });
        }, this);
        
        this.robotAgentList = ko.observableArray(WebAgent.vm.robotAgentList());

        this.agentAllList = ko.observableArray([]);

        this.selectedRobotAgent = ko.observable();
        //切换助手
        this.selectRobotAgent = function (user) {
            var currentUser = self.selectedRobotAgent();
            
            if (user.robotId == currentUser.robotId && user.robotName == currentUser.robotName) {
                return;
            } else {
                self.selectedRobotAgent(user);
            }
        };
        
        this.setReadyEnabled = ko.computed(function () {
            if (this.isMaxTalkUpSetBusy() && this.maxTalkNum() <= this.onlineArr().length && WebAgent.readyEnabled) {
                WebAgent.extend.setBusy();
            }
            return !(this.isMaxTalkUpSetBusy() && this.maxTalkNum() <= this.onlineArr().length);
        }, this);
        
        //未读消息总数
        this.msgTotal = ko.computed(function () {
            var msgTotal = 0;
            ko.utils.arrayFilter(self.userList(), function (user) {
                msgTotal += user.msgNumber();
            });
            registerEvent.unReadMsgNum({
                unReadMsgNum: msgTotal
            });
            return msgTotal;
        }, this);
        
        //设置客户姓名
        this.setNickName = function (nickName,sessionId) {
            var user = findUser(sessionId);
            user && user.nickName(nickName && nickName.substring(0, 10));
        };
        
        //置忙操作：置闲时可以用
        this.setBusy = function () {
            //if (self.busyEnabled()) {
            self.sendState("msgFromAgentSetStateBusy", "setBusy", "PC");
            //}
        };
        
        //置闲操作：置忙时可以用
        //告知dms坐席音/视频能力
        this.setReady = function () {
            if (WebAgent.callType == "webRTC") {
                self.webRTCAduio = window.CR.checkDevice().supportVoice;
                self.webRTCVideo = self.webRTCVideo && window.CR.checkDevice().supportVideo;
            }
            self.sendState("msgFromAgentSetStateFree", "setReady", "PC", {
                content: {
                    supportVoice:  WebAgent.sipUseWebRTC ? self.webRTCAduio : true,
                    supportVideo:  WebAgent.sipUseWebRTC ? self.webRTCVideo : true
                }
            });
        };
        
        //开启自动匹配，搜索常用语内容
        this.searchComLang = function (type) {
            if (self.openAutoMatch() && (require("VmQuickReply").quickReplyDis())) {
                registerEvent.autoMatchCallback();
                require("VmQuickReply").searchComLang(type);
            }
        };
        
        //后台是否开启智能协助
        this.getIntellOpen = function () {
            var url = WebAgent.config.quickSmartReplyPath_sensitive + "/intelligentQuery/getPowerInfo",
                data = {
                    entId: self.agentEntId()
                };
            var callback = function (data) {
                var isOpen;
                if (data.code == "0") {
                    isOpen = data.obj.intelligentQueryPower == "1" ? true : false;
                    self.intellHelp(isOpen);
                } else {
                    util.Log("error", data.desc);
                    
                }
            };
            util.ajaxHelper.post(url, data, callback);
        };
        
        //在快捷回复中搜索聊天内容
        this.searchSmartReply = function (data) {
            var reg = /^<img .*>$/;
            if (data.type == "text" && !reg.test(data.text)) {
                registerEvent.openIntellCallback();
                require("VmSmartReply").searchReply(data.text);
            }
        };
        /**
         * 发送chat闲忙、butel等状态
         * @param type
         * @param state
         */
        this.sendState = function (type, state, channel, data) {
            var bodyJson = null;
            switch ( type ) {
                case "msgFromAgentSetStateBusy":
                case "msgFromAgentButelLogin":
                case "msgFromAgentButelLogout":
                case "msgFromAgentCallStart":
                    bodyJson = { "type": type };
                    break;
                case "msgFromAgentButelAlerting":
                case "msgFromAgentButelConnected":
                case "msgFromAgentButelEnd":
                case "msgFromAgentButelAlertingAbort": {
                    bodyJson = { "type": type, "butelSessionId": data.butelSessionId };
                    break;
                }
                case "msgFromAgentSetStateFree":
                case "msgFromAgentCallEnd": {
                    bodyJson = {
                        "type": type,
                        "content": data.content
                    };
                    break;
                }
                case "msgFromAgentCreateMUC":{
                    bodyJson = {
                        "type": type,
                        "agentList": data
                    };
                }
                default:
                    break;
            }

            require("Login").sendState(state, self.agentEntId(), channel, JSON.stringify(bodyJson));
        };
        this.sendMUC = function(type,sessionId,data){
            var bodyJson;
            if(type == "msgFromAgentJoinMUC"){
                bodyJson={
                    type:type,
                    agentList:data.agentList,
                    customId:data.customId
                }
            }
            require("Login").sendMUC(sessionId, JSON.stringify(bodyJson));
        }
        
        //满意度调查
        this.sendSatisfy = function () {
            self.sendMessage("msgFromAgentSendSatisfy");
        };
        
        this.selectAgentForm=ko.observable({})
         //获得可添加坐席列表
         this.getAgentList = function (type){
            if(self.currentUser().chatType() != "chat"){
                return;
            }
            if(type == "transfer"){
                self.selectAgentForm({
                    title:"请选择需要转移的坐席",
                    type:"transfer"
                });
            }
            if(type == "addAgent"){
                self.selectAgentForm({
                    title:"请选择需要添加的群成员",
                    type:"customAddAgent"
                });
            }
            self.sendMessage("msgFromAgentGetAgentList");
           /*  self.agentEabledSelectLists(filterEnableCustomChatList("",self.currentUser().chatBoxType() == "custom-chat")); */
            self.hasSelectedAgents([]);
            $("#agentSection").show();
        }
        //坐席列表
        this.agentLists = ko.observableArray([]);
        //置闲坐席列表
        this.agentReadyLists = [];
        
        this.agentListsLength = ko.observable(0);
        //添加坐席--已选择坐席
        this.hasSelectedAgents = ko.observableArray([]);
        //添加坐席--可选坐席
        this.agentEabledSelectLists = ko.observableArray([]);
        //添加坐席--搜索内容绑定
        this.agentSearchText=ko.observable("");
        //添加坐席--处理搜索坐席
        this.searchText = function(type){
            if(type == "agentListSearch"){
                self.agentEabledSelectLists(filterEnableCustomChatList(self.agentSearchText(),self.currentUser().chatBoxType() == "custom-chat"))
            }
        }

        //内部聊天坐席列表
        this.internalChatList = ko.observableArray([]);

        //选择坐席进行聊天
        this.selectAgentChat = function (user) {
            var currentUser=self.internalChatList().length && self.internalChatList().find(function(item){
                return item.memberNum == 2 && item.membersAgentIdList.includes(user.agentId);
            })
            //所选坐席已存在沟通列表
            if(currentUser){
                self.currentUser(currentUser);
            }else{
                self.sendState("msgFromAgentCreateMUC", "msgFromAgentCreateMUC", "PC", user.agentId);
            }
        };
        
        //转接坐席
        this.confirmAgent = function () {
            var data,agentListStr;
            if (!self.hasSelectedAgents().length) {
                return false;
            }
            $("#agentSection").hide();
            //转移坐席
            if(self.selectAgentForm().type == "transfer"){
                data=self.hasSelectedAgents()[0];
                self.sendMessage("msgFromAgentTransferAgent", '{"destAgentId":"' + data.agentId + '","entId":"' + self.agentEntId() + '","skillGroupId":"' + data.skillGroupId + '","transferMessage":"' + self.transferMsg() + '"}');
                self.transferMsg("");

                //后期删除
                /* user.kickOff();
                self.sendMessage("tip", "", "", "该会话已经转接给客服" + self.hasSelectedAgents()[0].agentName, user); */
                return;
            }
            
            //添加坐席
            agentListStr  = self.currentUser().chatBoxType() == "custom-chat" ?
                            self.hasSelectedAgents()[0].agentId :
                            self.hasSelectedAgents().reduce(function(preItem,curItem){
                                return preItem + "," + curItem.agentId;
                            },"");

            require("Login").sendMUC(self.currentUser().sessionId,{
                type:"msgFromAgentJoinMUC",
                agentList:agentListStr,
                customId:self.currentUser().name+":"+self.agentEntId()+":"+self.currentUser().channel
            })
        };
        
        this.closeTip = function (type) {
            switch (type){
                case "agentSession":{
                    $("#agentSection").hide();
                    break;
                }
                case "sensitive":{
                    self.msgTip(false);
                    $(".message-input").attr("disabled", false);
                    break;
                }
                case "chatClose":{
                    self.keepChatTip({
                        keepchatTipShow:false,
                        beInvitedAgentId:""
                    });
                    break;
                }
                case "chatKeep":{
                    self.sendState("msgFromAgentCreateMUC", "msgFromAgentCreateMUC", "PC", self.keepChatTip().beInvitedAgentId);
                    self.keepChatTip({
                        keepchatTipShow:false,
                        beInvitedAgentId:""
                    });
                    break;
                }
            }
            
        };
        
        this.keepChatTip = ko.observable({
            keepchatTipShow:false,
            beInvitedAgentId:""
        });

        /**
         * 发送文本、图片、语音、文件消息
         * @param type
         * @param originalPath
         * @param zoomUrl
         * @returns {boolean}
         */
        this.sendMessage = function (type, originalPath, zoomUrl, tipText, user, isIntellHelp) {
            var reg = /.*<.+>.*/i,msgContent;
            if (self.inputText() === '' && type === "text" && !tipText) {
                return false;
            }
            if (type == "text" && reg.test(self.inputText())) {
                self.msgContentErrorDis("您输入的内容存在非法字符");
                setTimeout(function () {
                    self.msgContentErrorDis(false);
                }, 1500);
                return;
            }
            //var user = self.currentUser();
            var user = user ? user : self.currentUser();
            var currName = user.name;
            var currEnt = user.ent;
            var currChannel = user.channel;
            var currResource = user.resource;
            
            var previousMessage = user.getLastMessage();
            var bodyJson = null;
            switch ( type ) {
                case "text":
                    if (tipText) {
                        msgContent = tipText;
                        bodyJson = { "type": type, "content": tipText };
                    } else {
                        msgContent = self.inputText() && self.inputText().replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/\"/g, "&quot;");
                        msgContent = WeixinEmojiExtend.replace(self.checkUrl(msgContent));
                        bodyJson = { "type": type, "content": encodeURI(self.inputText()) };
                        self.inputText("");
                    }
                    
                   // user.addMessage(text, "send", "text", new Date(),self.username());
                    break;
                case "tip":
                    bodyJson = { "type": type, "content": tipText };
                    user.addMessage(tipText, "tip", "text", new Date());
                    break;
                case "voice":
                    break;
                case "image":
                    bodyJson = { "type": type, "content": originalPath, "compressPicUrl": zoomUrl };
                    msgContent={
                        "original": replaceDownUrlIp(originalPath),
                        "zoom": replaceDownUrlIp(zoomUrl)
                    };
                    /* user.addMessage({
                        "original": replaceDownUrlIp(originalPath),
                        "zoom": replaceDownUrlIp(zoomUrl)
                    }, "send", "image", new Date(), self.username()); */
                    break;
                case "file":
                    type = /\.(mp4|MP4|OGG|ogg|WEBM|webm)$/.test(originalPath) ? "video" : "file";
                    bodyJson = { "type": type, "content": originalPath };
                    msgContent=replaceDownUrlIp(originalPath);
                    //user.addMessage(replaceDownUrlIp(originalPath), "send", type, new Date(), self.username());
                    break;
                case "msgFromAgentkickCustom":
                    bodyJson = { "type": type };
                    user.kickOff();
                    user.changeSessionTime('close');
                    
                    user.addMessage("您结束了会话", "tip", "text", new Date());
                    //self.sendMessage("tip", "", "", "您结束了会话", user);
                    
                    registerEvent.sessionQuit({
                        userId: user.name,
                        messages: user.messages()
                    });
                    break;
                case "msgFromAgentTransferAgent":
                    user.changeSessionTime('close');
                    bodyJson = { "type": type, "content": originalPath };
                    break;
                case "msgFromAgentSendSatisfy":
                case "msgFromAgentGetAgentList":
                case "msgFromAgentSatisfySend":
                case "msgFromAgentRefuseCall":
                case "msgFromAgentAcceptCall":
                case "msgFromAgentCallCustom":
                case "msgFromAgentAcceptVideo":
                case "msgFromAgentAskForVideo":
                case "msgFromAgentRefuseVideo":
                case "welcome":
                    bodyJson = { "type": type };
                    break;
                case "msgFromAgentMessageWithdraw":{
                    bodyJson = {
                        "type":type,
                        "content":originalPath
                    }
                }
                // case "commonWord":
                //     bodyJson = { "type": 'text', "content": encodeURI(self.currentCommonWord()) };
                //     user.addMessage(self.currentCommonWord(), "send", "text", new Date());
                
                default:
                    break;
            }
            if (isIntellHelp != true) {
                user.msgNumber(0);
            }
            bodyJson.previousTime = previousMessage.previousTime ? previousMessage.previousTime : "";
            if (previousMessage.previousDirection === "recv") {
                bodyJson.previousDirection = '1';
            } else if (previousMessage.previousDirection === "send" || previousMessage.previousDirection === "tip") {
                bodyJson.previousDirection = '2';
            } else {
                bodyJson.previousDirection = '';
            }
            // bodyJson.previousDirection = previousMessage.previousDirection ? previousMessage.previousDirection : "";
            if(["text","image","file","video"].includes(type)){
                bodyJson.messageId=new Date().getTime();
                user.addMessage(msgContent, "send", type, new Date(), self.username(),bodyJson.messageId);
            }
            if (["text","image","file"].includes(type)) {                
                ackMessageArr.push({
                    username: currName,
                    content: bodyJson.content,
                    type: type,
                    index: ackMessageArr.length,
                    setTimeFun: function (isClear) {
                        if (isClear) {
                            clearTimeout(t);
                            return;
                        }
                        t = setTimeout(function () {
                            var msg = type == "text" ? text : (type == "image" ? "图片" : "文件");
                            ackMessageArr.splice(this.index, 1);
                            self.msgTip(true);
                            self.msgWordHead(currName.slice(0, 10) + "客户消息未发送成功:");
                            self.msgWord(msg);
                            $(".message-input").attr("disabled", true).css("background", "white");
                        }, 1500);
                    }
                });
                ackMessageArr[ackMessageArr.length - 1].setTimeFun(false);
            }
            if(user.chatBoxType() == "custom-chat" || type == "msgFromAgentGetAgentList"){
                require("Login").sendMessage(currName, currEnt, currChannel, JSON.stringify(bodyJson), currResource);
            }else{
                require("Login").sendMUC(user.sessionId, bodyJson);
            }
        };
        
        this.withdrawBtn = function(messageId,direction,user){
            var index;
            if(direction == "send"){
                user = self.currentUser();
            }
            index =user.messages().findIndex(function(item){
                return item.messageId == messageId && item.direction == direction;
            });
            if(index){
                direction == "send" && this.sendMessage('msgFromAgentMessageWithdraw', messageId);
                user.messages.splice(index,1);
            }
        }

        /**
         * ctrl+ enter键发送
         * @param data
         * @param event
         * @returns {boolean}
         */
        this.sendMessageByKey = function (data, event) {
            var chatSendKey = localStorage.getItem("chat-sendKey") || "Enter";
            
            if (self.imPastePicDialog()) {
                return;
            }
            switch ( chatSendKey ) {
                case "Enter":
                    if (event.keyCode === 13 && !event.ctrlKey) {
                        event.preventDefault();
                        
                        self.checkWord();
                        //self.sendMessage("text");
                    }
                    if (event.keyCode === 13 && event.ctrlKey) {
                        self.inputText(self.inputText() + "\n");
                    }
                    break;
                case "CtrlEnter":
                    if (event.keyCode === 13 && event.ctrlKey) {
                        self.checkWord();
                        //self.sendMessage("text");
                    }
                    break;
                default :
                    break;
                
            }
            
            return true;    // Allow event default behavior
        };
        
        /**
         * 切换发送快捷键列表
         */
        this.toggleBtnKeyList = function () {
            self.btnKeyListDis(!self.btnKeyListDis());
        };
        
        /**
         * 选择发送的快捷键
         * @param $data
         */
        this.choseSendKey = function ($data) {
            for (var i = 0; i < self.btnKeyList().length; i++) {
                if (self.btnKeyList()[i].key != $data.key) {
                    self.btnKeyList()[i].faCheck(false);
                } else {
                    self.btnKeyList()[i].faCheck(true);
                }
            }
            self.btnKeyListDis(false);
            localStorage.setItem("chat-sendKey", $data.key);
        };
        
        //将url地址转换为链接形式
        this.checkUrl = function (content) {
            
            if (content && content.match(regUrl)) {
                content = content.replace(regUrl, function (char) {
                    return "<a target='_blank' href='" + (regPro.exec(char) ? char : ("http://" + char)) + "'>" + char + "</a>";
                });
            }
            return content;
        };
        
        //替换文件下载地址ip
        var replaceDownUrlIp = function (url) {
            
            if (regPro.test(url)) {
                var urlArr = url.split('/');
                
                urlArr.splice(0, 3);
                url = WebAgent.config.DOWN_FILE_URL + urlArr.join('/');  // ip+截取的除ip之外字符串
            } else {
                url = WebAgent.config.DOWN_FILE_URL + url;
            }
            
            return url;
        };
        
        var formatTiming = function (timing) {
            if (timing < 60) {
                return timing + "秒";
            } else {
                var min = parseInt(timing / 60);
                var sec = timing % 60;
                
                return min + "分 " + sec + "秒";
            }
        };
        
        //重构转接坐席/机器人聊天记录
        this.refactorMsgs = function (historyChats) {
            var tmpMsg = null;
            var direction = null;
            var name = null;
            var refactorMsg = [];
            
            historyChats.forEach(function (item, index) {
                tmpMsg = null;
                
                //客户发送消息给坐席
                if (item.direction == "1") {
                    direction = "recv";
                    name = item.customId;
                }
                
                //坐席发送消息给客户
                if (item.direction == "2") {
                    direction = "send";
                    name = item.agentName;
                }
                
                //item.time = "2017-09-19 15:22:24";
                switch ( item.contentType ) {
                    case "1":  //文本
                        tmpMsg = {
                            msg: WeixinEmojiExtend.replace(self.checkUrl(item.content)),
                            direction: direction,
                            type: "text",
                            time: item.time,
                            timeMillis: item.timeMillis,
                            name: name,
                            imSessionId: item.imSessionId,
                            contentType: item.contentType
                        };
                        break;
                    case "2":  //图片
                        tmpMsg = {
                            msg: { "zoom": replaceDownUrlIp(item.content), "original": replaceDownUrlIp(item.content) },
                            direction: direction,
                            type: "image",
                            time: item.time,
                            timeMillis: item.timeMillis,
                            name: name,
                            imSessionId: item.imSessionId,
                            contentType: item.contentType
                        };
                        break;
                    case "3": //语音
                        tmpMsg = {
                            msg: replaceDownUrlIp(item.content),
                            direction: direction,
                            type: "voice",
                            time: item.time,
                            timeMillis: item.timeMillis,
                            name: name,
                            imSessionId: item.imSessionId,
                            contentType: item.contentType
                        };
                        break;
                    case "4": //文件
                        tmpMsg = {
                            msg: replaceDownUrlIp(item.content),
                            direction: direction,
                            type: "file",
                            time: item.time,
                            timeMillis: item.timeMillis,
                            name: name,
                            imSessionId: item.imSessionId,
                            contentType: item.contentType
                        };
                        break;
                    case "5": //访客信息
                        tmpMsg = {
                            timeMillis: item.timeMillis,
                            imSessionId: item.imSessionId,
                            contentType: item.contentType
                        };
                        break;
                    case "6": //欢迎语
                        tmpMsg = {
                            msg: item.content,
                            direction: "tip",
                            type: "text",
                            time: item.time,
                            timeMillis: item.timeMillis,
                            name: name,
                            imSessionId: item.imSessionId,
                            contentType: item.contentType
                        };
                        break;
                    case "7": //提示语
                        tmpMsg = {
                            msg: item.content,
                            direction: "tip",
                            type: "text",
                            time: item.time,
                            timeMillis: item.timeMillis,
                            name: name,
                            imSessionId: item.imSessionId,
                            previousImSessionId: item.previousImSessionId,
                            contentType: item.contentType
                        };
                        break;
                    default:
                        break;
                }
                
                if (tmpMsg) {
                    refactorMsg.push(tmpMsg);
                }
            });
            return refactorMsg;
        };
        
        /**
         * 转换channel为英文
         * @param channel
         * @returns {*}
         */
        var switchChannelToEng = function (channel) {
            switch ( channel ) {
                case "2":
                    return "webim";
                case "3":
                    return "weixin";
                case "4":
                    return "butel";
                case "5":
                    return "appim";
                case "7":
                    return "weixinim";
                default :
                    break;
            }
        };
        
        /**
         * 转换channel为数字
         * @param channel
         * @returns {*}
         */
        var switchChannelToNum = function (channel) {
            switch ( channel ) {
                case "webim":
                case "internal-chat":
                    return "2";
                case "weixin":
                    return "3";
                case "butel":
                    return "4";
                case "appim":
                    return "5";
                case "weixinim":
                    return "7";
                default :
                    break;
            }
        };
        
        /**
         * 查询在线客服数、排队客户数
         */
        this.getCuAmount = function () {
            var url = WebAgent.config.getProjectDataPath + "/cuAmount/getCuAmount.do";
            var data = {
                entId: self.agentEntId()
            };
            
            var callback = function (data) {
                switch ( data.code ) {
                    case "0":
                        if (data.result) {
                            self.onlineAgentNum(data.result.onLine);
                            self.queueUserNum(data.result.queue);
                        } else {
                            util.Log("info", "获取在线客服数/排队客户数结果为空");
                        }
                        break;
                    case "-1":
                        util.Log("error", "获取在线客服数/排队客户数接口异常，" + data.result);
                        break;
                    default :
                        break;
                }
            };
            util.ajaxHelper.post(url, data, callback);
        };
        
        /**
         * 获取当天下线客户列表
         */
        this.getOfflineList = function () {
            var url = WebAgent.config.getProjectDataPath + "/stateDetailForAgentId/queryForAgent.do";
            var data = {
                entId: self.agentEntId(),
                agentId: self.agentId()
            };
            
            var callback = function (data) {
                var code = data.code;
                var result = data.result;
                var user = null;
                
                switch ( code ) {
                    case "0":
                        util.Log("log", "下线客户列表：" + JSON.stringify(data));
                        if (result.length) {
                            result.forEach(function (item, index) {
                                user = self.addUser(item.customerId, item.entId, switchChannelToEng(item.channel));
                                user.online(false);
                                
                                getHistoryChats(user);
                            });
                        } else {
                            util.Log("info", "获取当天下线客户列表为空");
                        }
                        break;
                    case "-1":
                        util.Log("error", "获取当天下线客户列表接口异常，" + result);
                        break;
                    default :
                        break;
                }
            };
            
            util.ajaxHelper.post(url, data, callback);
        };
        
        /**
         * 获取历史消息（客户接入等方式）
         * @param user
         */
        function getHistoryChats(user, renderHistoryCallback) {
            var url = WebAgent.config.getProjectDataPath + "/chatLogInfo/queryChatLogInfo.do";
            
            //新用户到来、坐席转接坐席第一次获取消息记录的时候不传时间参数
            if (typeof renderHistoryCallback == "function") {
                user.getHistoryStartTime = "";
            } else { //下线客户列表第一次获取消息记录的时候传时间参数
                user.getHistoryStartTime = new Date().getTime();
            }
            console.log("chatBoxType:",user.chatBoxType());
            var data={
                entId: self.agentEntId(),
                customId: user.name,
                channel: switchChannelToNum(user.channel),
                agentId: self.isShareMessage() === "1" ||  user.chatBoxType() == "custom-group" ? "" : self.agentId(),
                pageSize: 10,
                time: user.getHistoryStartTime,
                imSessionId: user.chatBoxType() == "custom-group" ? user.sessionId : user.historySessionId
            }

            var callback = function (data) {
                var code = data.code;
                var result = data.result;
                
                switch ( code ) {
                    case "0":
                        if (result.length) {
                            user.messages([]);
                            user.hasMoreHistory(true);
                            
                            var refactorMsg = self.refactorMsgs(result);
                            
                            refactorMsg.forEach(function (item, index) {
                                if (index == (refactorMsg.length - 1)) {
                                    user.getHistoryStartTime = item.timeMillis;
                                    
                                    //获取更多消息时，当是“以上内容为机器人会话内容”，需要传previousImSessionId
                                    if (item.contentType == "7" && item.msg == "以上内容为机器人会话内容") {
                                        user.historySessionId = item.previousImSessionId;
                                    } else {
                                        user.historySessionId = item.imSessionId;
                                    }
                                }
                                
                                user.addMessage(item.msg, item.direction, item.type, item.time, item.direction == "recv" ? user.name.substring(0, 10) : item.name, "history");
                                
                            });
                            
                            if (typeof renderHistoryCallback == "function") {
                                renderHistoryCallback(true);
                                util.Log("log", user.name + "消息记录" + JSON.stringify(result, null, 4));
                            } else {
                                //user.addMessage("以上内容为历史消息", "tip", "text", new Date());
                                util.Log("log", "下线客户" + user.name + "消息记录" + JSON.stringify(result, null, 4));
                            }
                        } else {
                            user.hasMoreHistory(false);
                            renderHistoryCallback && renderHistoryCallback(false);
                            util.Log("info", user.name + "聊天记录为空");
                        }
                        break;
                    case "-1":
                        util.Log("error", "获取消息记录接口异常，" + result);
                        break;
                    default :
                        break;
                }
            };
            
            util.ajaxHelper.post(url, data, callback);
        };
        
        /**
         * 获取更多历史消息（点击获取）
         */
        this.getMoreHistoryChats = function () {
            var url = WebAgent.config.getProjectDataPath + "/chatLogInfo/queryChatLogInfo.do";
            var user = self.currentUser();
            var data={
                entId: self.agentEntId(),
                customId: user.name,
                channel: user.chatBoxType() == "custom-group" ? "":switchChannelToNum(user.channel),
                agentId: self.isShareMessage() === "1" ||  user.chatBoxType() == "custom-group" ? "" : self.agentId(),
                pageSize: 10,
                time: user.getHistoryStartTime,
                imSessionId: user.chatBoxType() == "custom-group" ? user.sessionId : user.historySessionId
            }
            //获取更多历史消息之前的滚动条高度
            var lastScrollHeighht = $('.scrollToBottom')[0].scrollHeight;
            
            var callback = function (data) {
                var code = data.code;
                var result = data.result;
                
                switch ( code ) {
                    case "0":
                        if (result.length) {
                            util.Log("log", user.name + "更多消息记录" + JSON.stringify(result, null, 4));
                            
                            user.hasMoreHistory(true);
                            
                            var refactorMsg = self.refactorMsgs(result);
                            
                            refactorMsg.forEach(function (item, index) {
                                if (index == (refactorMsg.length - 1)) {
                                    user.getHistoryStartTime = item.timeMillis;
                                    
                                    //获取更多消息时，当是“以上内容为机器人会话内容”，需要传previousImSessionId
                                    if (item.contentType == "7" && item.msg == "以上内容为机器人会话内容") {
                                        user.historySessionId = item.previousImSessionId;
                                    } else {
                                        user.historySessionId = item.imSessionId;
                                    }
                                }
                                user.addMessage(item.msg, item.direction, item.type, item.time, item.direction == "recv" ? user.name.substring(0, 10) : item.name, "history", true);
                            });
                            
                        } else {
                            user.hasMoreHistory(false);
                            user.addMessage("无更多消息记录", "tip", "text", new Date(), "", "history", true);
                        }
                        
                        //获取更多消息之后，设置滚动条位置，多显示一条消息
                        $('.scrollToBottom').scrollTop($('.scrollToBottom')[0].scrollHeight - lastScrollHeighht - 30);
                        
                        break;
                    case "-1":
                        util.Log("error", "获取更多消息记录接口异常，" + result);
                        break;
                    default :
                        break;
                }
                ;
            };
            
            util.ajaxHelper.post(url, data, callback);
        };
        
        /**
         * 获取聊天记录，暴露给cdesk
         * @param userName
         */
        this.getChatMsgs = function (userName) {
            var messages;
            
            if (self.userList().length) {
                self.userList().forEach(function (user, index) {
                    if (userName == user.name) {
                        messages = self.userList()[index].messages();
                    }
                });
                return messages;
            }
        };
        
        //整理坐席列表数据
        function filterAgentList(agentList){
            var skillGrounp = {},
                agent = {},
                agentsObj,
                skillGroupList=[];
            for (var agentListKey in agentList) {
                skillGrounp["skillGroupName"] = agentList[agentListKey]["skillGroupName"];
                skillGrounp["skillGroupId"] = agentListKey;
                skillGrounp["agents"] = [];
                agentsObj = agentList[agentListKey].agents;
                self.username()
                for (var agentKey in agentsObj) {
                    if(agentKey != self.agentId()){
                        agent = agentsObj[agentKey];
                        agent.agentId = agentKey;
                        agent.skillGroupId = agentListKey;
                        agent.skillGroupName = skillGrounp["skillGroupName"];
                        skillGrounp["agents"].push(agent);
                    }
                }
                if(skillGrounp["agents"].length){
                    skillGroupList.push(skillGrounp);
                }
                skillGrounp = {};
            }
            return skillGroupList;
        }

        //筛选出满足：坐席置闲且会话量未满的坐席
        function filterEnableCustomChatList(agentName,isCustonChat){
            agentName  = agentName || "";
            isCustonChat  = isCustonChat || false;
            var agentListNew =[],
            agentList=self.agentReadyLists,
            exceptAgentIdList=self.currentUser().membersAgentIdList;
            console.log(self.currentUser());
            agentList.length && agentList.forEach(function(skillGrounp){
                var agents=[];
                agents=skillGrounp.agents.length && skillGrounp.agents.filter(function(agent){
                    if( exceptAgentIdList.length && exceptAgentIdList.includes(agent.agentId)){
                        return false;
                    }
                    return  isCustonChat ?
                    (agent.currentServiceNum < agent.maxServiceNum && agent.agentName.includes(agentName)) : agent.agentName.includes(agentName);
                });
                if(agents.length){
                    agentListNew.push({
                        "skillGroupName":skillGrounp.skillGroupName,
                        "skillGroupId":skillGrounp.skillGroupId,
                        "agents":agents
                    })
                }
            })
            return agentListNew;
        }
        function findUser(sessionId,name,ent,channel){
            var user,
            userList=self.internalChatList().concat(self.userList());
            user=userList.length && userList.find(function(item){
                if(name){
                    return  name === item.name && ent === item.ent && channel === item.channel || item.sessionId == sessionId;
                }else{
                    return item.sessionId == sessionId;
                }
            });
            return user ? user:false;
        }
        /* //判断用户是否在列表里
        this.isInUserList = function (sessionId,type) {
            var result = ko.utils.arrayFilter(self.userList(), function (item) {
                return name === item.name && ent === item.ent && channel === item.channel && sessionId == item.sessionId;
            });
            
            return result.length > 0 ? result[0] : false;
        }; */
        function getAgentListName(agentList){
            return agentList.reduce(function(pre,cur){
                return pre == "" ? cur.agentName : pre +","+ cur.agentName;
            },"")
        }
        function handleMUCMessage(type,msgBody, nickContent, resource){
            var sessionId = nickContent.split(":")[1],
            user=findUser(sessionId),
            name="",
            message="",
            beInvitedStr="",
            customIdMesg;
            msgBodyContent=msgBody.content,
            membersAgentIdList=[];
            //坐席间的聊天
            if(type == "msgFromDmsEnterMUC" && !msgBodyContent.customId){
                name=getAgentListName(msgBodyContent.members);
                if(!user){
                    user=new User(name, self.agentEntId(), "internal-chat", sessionId, "agent-chat");
                    user.resource=resource;
                    self.internalChatList.push(user);
                }else{
                    user.name=name;
                }
                user.nickName(name);
                user.memberNum=msgBodyContent.memberNum;
                user.beInvited=msgBodyContent.beInvited;
                user.members(msgBodyContent.members);
                user.membersAgentIdList=msgBodyContent.members.map(function(item){
                    return item.agentId;
                });
                if(msgBodyContent.memberNum > 2){
                    beInvitedStr=getAgentListName(msgBodyContent.beInvited);
                    user.chatBoxType("agent-group");
                    //邀请方
                    if(msgBodyContent.inviter.agentId == self.agentId() ){
                        user.addMessage(beInvitedStr+"已加入群聊", "tip", "text", new Date());
                    }
                    //被邀请方：获取群聊记录
                    else if(msgBodyContent.beInvited.some(function(item){
                        return item.agentId == self.agentId()
                    })){
                        user.addMessage(msgBodyContent.inviter.agentName+"邀请你加入群聊", "tip", "text", new Date());
                        user.msgNumber(1);
                    }
                    //已在群聊中
                    else{
                        user.addMessage(msgBodyContent.inviter.agentName+"邀请"+beInvitedStr+"加入群聊", "tip", "text", new Date());
                    }
                }

                return false;
            }
            //坐席和客户群聊
            if(type == "msgFromDmsEnterMUC" && msgBodyContent.customId){
                customIdMesg=msgBodyContent.customId.split(":");
                //user=self.isInUserList(customIdMesg[0],customIdMesg[1],customIdMesg[2]);
                if(msgBodyContent.inviter.agentId == self.agentId()){
                    user.addMessage(msgBodyContent.beInvited[0].agentName+"已加入群聊", "tip", "text", new Date());
                    user.chatBoxType("custom-group");
                }else{
                    if(!user){
                        user = self.addUser(customIdMesg[0],self.agentEntId(),msgBodyContent.customInfo.split(":")[2]);
                    }else{
                        user.online(true);
                        user.isNewUser(true);
                    }
                    user.sessionId=sessionId;
                    user.chatBoxType("custom-group");
                    getHistoryChats(user, function () {
                        user.addMessage(msgBodyContent.inviter.agentName+"邀请你加入群聊", "tip", "text", new Date());
                        user.msgNumber(1);
                    });
                    
                }
                user.memberNum=msgBodyContent.memberNum;
                user.beInvited=msgBodyContent.beInvited;
                user.members(msgBodyContent.members);
                return;
            }
            //一方退出群聊
            if(type == "msgFromDmsAgentQuitMUC" && user){
                if(user.memberNum == 2 && user.chatBoxType() == "agent-chat"){
                    self.internalChatList(self.internalChatList().filter(function(item){
                        return item.sessionId !== user.sessionId;
                    }));
                    self.currentUser().kickOff();
                    user.changeSessionTime('close');
                    return;
                }
                user.members(user.members().filter(function(item){
                    if(item.agentId !== msgBodyContent.agentId){
                        membersAgentIdList.push(item.agentId);
                        return true;
                    }else{
                        return false;
                    }
                }));
                if(user.chatBoxType() != "custom-group"){
                    name=getAgentListName(user.members());
                    user.nickName(name);
                }
                user.membersAgentIdList=membersAgentIdList;
                user.memberNum--;
                user.addMessage(msgBodyContent.agentName+"退出了群聊", "tip", "text", new Date());
                if(user.memberNum == 2){
                    user.chatBoxType(user.chatBoxType() == "custom-group" ? "custom-chat":"agent-chat");
                }
                return;
            }
            if(type == "msgFromDmsSessionIdChange" && user){
                user.sessionId = msgBodyContent;
                return;
            }
            //自个退出群聊
            if(type == "msgFromDmsQuitMUCSuccess" && user){
                if(user.chatBoxType() == "custom-group"){
                    self.userList(self.userList().filter(function(item){
                        return item.sessionId != sessionId;
                    }));
                }else{
                    self.internalChatList(self.internalChatList().filter(function(item){
                        return item.sessionId != user.sessionId;
                    }));
                }
                
                if(self.currentUser().sessionId == sessionId){
                    self.currentUser().name="";
                    self.currentUser().kickOff();
                    self.currentUser().changeSessionTime('close');
                    self.currentUser().sessionId="";
                }
                return;
            }
            if(type == "msgAck"){
                var index = -1;
                if(user){
                    for(var i = 0; i < ackMessageArr.length; i++){
                        if ((msgBodyContent.msgType == "text" && ackMessageArr[i].type == msgBodyContent.msgType && ackMessageArr[i].username == user.name && decodeURI(ackMessageArr[i].content).trim() == msgBodyContent.msgContent.trim()) || ((msgBodyContent.msgType == "image" || msgBodyContent.msgType == "file") && ackMessageArr[i].username == user.name)) {
                            ackMessageArr[i].setTimeFun(true);
                            index = i;
                            break;
                        }
                    }
                    if (index != -1) {
                        ackMessageArr.splice(index, 1);
                    }
                }
                return false;
            }
            //接收消息
            if(type == "text" || type == "image" || type == "file"){
                switch (type){
                    case "text":{
                        message = WeixinEmojiExtend.replace(self.checkUrl(msgBodyContent));
                        break;
                    }
                    case "image":{
                        message = {
                            "original": replaceDownUrlIp(msgBodyContent),
                            "zoom": replaceDownUrlIp(msgBodyContent)
                        };
                        break;
                    }
                    case "file":{
                        message = replaceDownUrlIp(msgBody.content);
                        break;
                    }
                }
                if(user){
                    user.addMessage(message, "recv", type, new Date(), msgBody.spokesman);
                    user.sessionId !== self.currentUser().sessionId && user.msgNumber(user.msgNumber() + 1);
                }
                return;
            }

            if(type == "msgFromDmsCreateMUCFailed" || type == "msgFromDmsJoinMUCFailed"){
                self.msgTip(true);
                self.msgWordHead("邀请坐席失败：");
                self.msgWord(msgBodyContent);
                $(".message-input").attr("disabled", true).css("background", "white");
                return;
            }
            
        }
        
        /**
         * 处理接收到的消息
         * @param msgBody
         * @param nickContent
         */
        this.handleMessage = function (msgBody, nickContent, resource) {
            
            util.Log("log", "msgBody, nickContent, resource:" + msgBody + "," + nickContent + "," + resource);
            var visitorBaseInfo = "";
            var nickArray = nickContent.split(":");
            console.log(nickArray);
            var name = nickArray[0];
            var ent = nickArray[1];
            var channel = nickArray[2];
            var sessionId = nickArray[3];
            var type = msgBody.type;
            if(name == "MUC" || type == "msgFromDmsEnterMUC"){
                handleMUCMessage(type,msgBody, nickContent, resource);
                return false;
            }
            
            //判断用户是否在列表里
            var user = findUser(sessionId,name,ent,channel);
            var newUserFlag = false;
            var newUserType = null;
            var message = null;
            
            if (channel === "butel") {
                return;
            }
            
            //发消息的用户在用户列表，先把原来位置删除，然后追加到前面
            if (user && !["msgFromDmsSetStateFreeSuccsess","msgFromDmsSetStateBusySuccess","msgFromDmsAgentLoginSuccess","msgAck","msgFromCustomMessageWithdraw","msgFromDmsGetAgentListResponse","msgFromCustomMessageWithdraw"].includes(type)) {
                self.userList().forEach(function (item, index) {
                    if (user == item) {
                        self.userList.splice(index, 1);
                        self.userList.unshift(user);
                    }
                });
            }

            if (!user && (type == "msgFromDmsNewCustomInter")) {
                user = self.addUser(name, ent, channel);
            }
            
            var visitorInfo = user && user.visitorInfo();
            var visitInfo = user && user.visitInfo();
            switch ( type ) {
                case "image":
                    message = {
                        "original": replaceDownUrlIp(msgBody.content),
                        "zoom": replaceDownUrlIp(msgBody.compressPicUrl)
                    };
                    break;
                case "text":
                    message = WeixinEmojiExtend.replace(self.checkUrl(msgBody.content));
                    break;
                case "msgFromCustomAskForCallFail": {
                    message = "客户要求与你进行语音电话失败";
                    type = "text";
                    break;
                }
                case "msgFromCustomAskForVideoFail": {
                    message = "客户要求与你进行视频电话失败";
                    type = "text";
                    break;
                }
                case "file":
                case "voice":
                case "video":
                    
                    message = replaceDownUrlIp(msgBody.content);
                    if (type == "file" && /\.(mp4|MP4|OGG|ogg|WEBM|webm)$/.test(msgBody.content)) {
                        type = "video";
                    }
                    break;
                case "msgFromDmsNewCustomInter"://新客户接入
                    var info = JSON.parse(msgBody.content);
                    var cad = info.cad;
                    util.Log("log", "新用户到来随路数据info:" + msgBody.content);
                    
                    //是否开启消息共享
                    self.isShareMessage(cad.isShareMessage);
                    
                    newUserType = info.isTransfer; //客户接入方式
                    newUserFlag = true;
                    user.online(true);
                    user.webrtcNum(cad.webrtcNum);
                    user.chatBoxType("custom-chat");
                    if(WebAgent.sipUseWebRTC){
                        user.serviceVideo((cad.supportVideo == "true" || false) && self.webRTCVideo);
                        user.serviceAduio((cad.supportVoice == "true" || false) && self.webRTCAduio);
                    }else{
                        util.Log("log", "chpone开启摄像头和音频");
                        user.serviceVideo(cad.supportVideo == "true" || false);
                        user.serviceAduio(cad.supportVoice == "true" || false);
                    }
                    user.isNewUser(true);
                    user.skillGroupId(info.groupId);
                    user.skillName = info.groupName;
                    type = "text";
                    if (!user.timeOut1 || !user.timeOut2) {
                        user.timeOut1 = self.timeOut() && self.timeOut().agentFirstTimeout;
                        user.timeOut2 = self.timeOut() && self.timeOut().agentSecondTimeout;
                    }
                    
                    //客户在下线列表中作为当前用户，客户再上线的时候不再作为当前用户
                    var currentUser = self.currentUser();
                    
                    if (user.name == currentUser.name && user.ent == currentUser.ent && user.channel == currentUser.channel) {
                        self.currentUser(new User());
                    }
                    //if(user == self.currentUser()) {
                    //    self.currentUser(new User());
                    //}
                    
                    //机器人开启、坐席转接坐席，previousImSessionId存在，user.sessionId为previousImSessionId
                    //机器人不开启previousImSessionId为null，user.sessionId为info.sessionId
                    if (cad && cad.previousImSessionId) {
                        user.sessionId = cad.previousImSessionId;
                        user.historySessionId = cad.previousImSessionId;
                    } else {
                        user.sessionId = info.sessionId;
                        user.historySessionId = info.sessionId;
                    }
                    
                    switch ( newUserType ) {
                        case 0:   //
                            getHistoryChats(user, function (hasHistoryChats) {
                                newCustomInterTip(hasHistoryChats);   // 有聊天记录为true,否则为false
                            });
                            break;
                        case 1:  // 转接进来的客户
                            getHistoryChats(user, function () {
                                newCustomInterTip();
                            });
                            break;
                        default:
                            break;
                    }
                    
                    var newCustom = {
                        userId: user.name, //客户Id
                        userSource: cad && cad.source, //客户来源
                        skillGroupId: info.groupId, //技能组Id
                        skillGroupName: info.groupName, //技能组名
                        isTransfer: info.isTransfer, //是否转坐席
                        transferMessage: info.transferMessage, //转坐席留言
                        sessionId: info.sessionId, //会话ID
                        cesssionId: self.agentEntId() + ":" + user.channel + ":" + user.name,
                        channel: user.channel, // 客户渠道
                        attachment: info.attachment
                    };
                    
                    visitInfo.sessionAntecedents(info.sessionAntecedents);
                    visitInfo.geoLocation(info.geoLocation);
                    visitInfo.ipAddress(info.ipAddress);
                    visitInfo.browserType(info.browserType);
                    visitInfo.operatingSystem(info.operatingSystem);
                    
                    registerEvent.newCustomInter(newCustom);
                    
                    //user.msgTip("有新客户" + user.name.substring(0, 10) + "到达", true);
                    
                    //新用户到达提示音
                    if (self.setChatSoundTip() && self.setChatSoundTip().onlineTip) {
                        setTimeout(function () {
                            document.getElementById("chat_online_tip").play();
                        }, 100);
                    }
                    
                    user.resource = resource;
                    user.changeSessionTime('open');
                
                function newCustomInterTip(hasPreviousImSessionId) {
                    switch ( newUserType ) {
                        case 0: //技能组id接入，机器人转入
                            if (hasPreviousImSessionId) {
                                if (cad.robotPower == "1") {  //"1":开启机器人，"0":关闭机器人
                                    self.sendMessage("tip", "", "", "以上内容为机器人会话内容", user);
                                }
                            }
                            var newUserComeTip = "新客户到达，客服" + self.username() + "为客户服务";
                            var queueTime = formatTiming(parseInt(cad.queueTime / 1000));
                            self.sendMessage("tip", "", "", newUserComeTip, user);
                            
                            if (channel == "webim") {
                                visitorBaseInfo += "服务渠道：" + channel
                                    + "<br/>服务技能组：" + info.groupName
                                    + "<br/>城市来源：" + cad.geoLocation
                                    + "<br/>业务来源：" + cad.businessSource
                                    + "<br/>网站名称：" + cad.websiteName
                                    + "<br/>排队时长：" + queueTime
                                    + "<br/>发起页面：" + cad.sessionAntecedents;
                            }
                            
                            if (channel == "weixin" || channel == "weixinim") {
                                visitorBaseInfo += "服务渠道：" + channel
                                    + "<br/>服务技能组：" + info.groupName
                                    + "<br/>城市来源：" + cad.geoLocation
                                    //+ "<br/>浏览器类型：" + cad.browserType
                                    //+ "<br/>IP：" + cad.ipAddress
                                    //+ "<br/>操作系统：" + cad.operatingSystem
                                    + "<br/>业务来源：" + cad.businessSource
                                    + "<br/>公众号名称：" + cad.websiteName
                                    + "<br/>排队时长：" + queueTime;
                            }
                            
                            if (channel == "appim") {
                                visitorBaseInfo += "服务渠道：" + channel
                                    + "<br/>服务技能组：" + info.groupName
                                    + "<br/>城市来源：" + cad.geoLocation
                                    //+ "<br/>浏览器类型：" + cad.browserType
                                    //+ "<br/>IP：" + cad.ipAddress
                                    //+ "<br/>操作系统：" + cad.operatingSystem
                                    + "<br/>业务来源：" + cad.businessSource
                                    + "<br/>应用名称：" + cad.websiteName
                                    + "<br/>排队时长：" + queueTime;
                            }
                            
                            if (visitorBaseInfo) {
                                self.sendMessage("tip", "", "", visitorBaseInfo, user);
                            }
                            
                            if (cad.welcomeTip) {
                                user.addMessage(cad.welcomeTip, "send", "text", new Date()); //配置的欢迎语添加到消息列表
                                self.sendMessage("welcome", "", "", "", user); //配置的欢迎语给dms发送welcome事件
                            }
                            break;
                        case 1: //坐席转入
                            var transferTip = "以上内容为客服" + info.transferAgentName + "与客户的聊天内容<br/>"
                                + "该会话转接自客服" + info.transferAgentName + " <br/>转接留言：" + info.transferMessage;
                            self.sendMessage("tip", "", "", transferTip, user);
                            break;
                        default:
                            break;
                    }
                    user.msgNumber(1); //新用户到来，消息数为1，不算历史消息
                }
                    
                    break;
                case "msgFromCustomSessionQuit":
                    user.kickOff();
                    self.isShowCommonWordDialog(false);
                    user.addMessage("对方结束了会话", "tip", "text", new Date());
                    //self.sendMessage("tip", "", "", "对方结束了会话", user);
                    
                    self.emojiPaneDis(false);//隐藏表情选择框
                    
                    registerEvent.sessionQuit({
                        userId: user.name,
                        messages: user.messages()
                    });
                    user.changeSessionTime('close');
                    if(user.chatBoxType() == "custom-group"){
                        self.keepChatTip({
                            keepchatTipShow:true,
                            beInvitedAgentId:user.beInvited[0].agentId
                        });
                    }
                    break;
                case "visitorInformation":
                    var info = JSON.parse(msgBody.content);
                    visitorInfo.workOrderName(info.workOrderName && info.workOrderName.substring(0, 10));
                    visitorInfo.workOrderEmail(info.workOrderEmail);
                    visitorInfo.workOrderPhone(info.workOrderPhone);
                    break;
                case "msgFromDmsSetStateFreeSuccsess":
                    WebAgent.readyEnabled = true;
                    registerEvent.readyCallback();
                    if (this.isMaxTalkUpSetBusy() && this.maxTalkNum() <= this.onlineArr().length && WebAgent.readyEnabled) {
                        WebAgent.extend.setBusy();
                    }
                    return;
                case "msgFromDmsSetStateBusySuccess":
                    WebAgent.readyEnabled = false;
                    registerEvent.busyCallback();
                    return;
                case "msgFromDmsGetOnlineAgentListResponse":
                    var agentListRes = JSON.parse(msgBody.content);
                    self.agentLists(filterAgentList(agentListRes.agentsList));
                    self.agentListsLength(agentListRes.agentsNum-1);
                    break;
                case "msgFromDmsGetAgentListResponse":
                    var agentListRes = JSON.parse(msgBody.content);
                    self.agentReadyLists=filterAgentList(agentListRes);
                    self.agentEabledSelectLists(filterEnableCustomChatList("",self.currentUser().chatBoxType() == "custom-chat"));
                    break;
                case "msgFromDmsTransferAgentSuccess":
                    user = findUser("",name,ent,channel);
                    user.kickOff();
                    if(user.name == self.currentUser().name){
                        self.currentUser().kickOff();
                    }
                    self.sendMessage("tip", "", "", "该会话已经转接给客服" + self.hasSelectedAgents()[0].agentName, user);
                    break;
                case "msgFromDmsAgentLoginSuccess":
                    var content = JSON.parse(msgBody.content);
                    var agentFirstTimeout = content.agentTimeout && content.agentTimeout.agentFirstTimeout;
                    var agentSecondTimeout = content.agentTimeout && content.agentTimeout.agentSecondTimeout;
                    self.isMaxTalkUpSetBusy(content.agentAutoStatus == 2);
                    self.maxTalkNum(content.webChatCount);
                    self.webRTCVideo = content.availableVideo == "1" || false;
                    self.timeOut({
                        agentFirstTimeout: (agentFirstTimeout * 60) || (3 * 60), //默认三分钟
                        agentSecondTimeout: (agentSecondTimeout * 60) || (5 * 60) //默认五分钟
                    });
                    self.username(content.agentName);
                    util.Log("info", "坐席登录成功后，设置的超时未回复时间agentFirstTimeout:" + agentFirstTimeout + ",agentSecondTimeout:" + agentSecondTimeout);
                    
                    break;
                case "msgAck": {
                    var msgBody = JSON.parse(msgBody.content);
                    var index = -1;
                    for(var i = 0; i < ackMessageArr.length; i++){
                        if ((msgBody.msgType == "text" && ackMessageArr[i].type == msgBody.msgType && ackMessageArr[i].username == name && decodeURI(ackMessageArr[i].content).trim() == msgBody.msgContent.trim()) || ((msgBody.msgType == "image" || msgBody.msgType == "file") && ackMessageArr[i].username == name)) {
                            ackMessageArr[i].setTimeFun(true);
                            index = i;
                            break;
                        }
                    }
                    if (index != -1) {
                        ackMessageArr.splice(index, 1);
                    }
                    break;
                }
                //客户语音入呼
                case "msgFromCustomAskForCall": {
                    console.log("webrtcNum:", msgBody.webrtcNum);
                    //坐席当前状态不能外呼（eg:通话中）
                    if (!WebAgent.vm.callEnabled() && !WebAgent.vm.busyEnabled()) {
                        //当前状态不可执行外呼，直接拒绝
                        self.sendMessage("msgFromAgentRefuseCall", "", "", "", user);
                    } else {
                        user.webrtcNum(msgBody.webrtcNum);
                        user.chatType("audio");
                        self.callInUser(user);
                        registerEvent.callIn({
                            name: name,
                            type: "audio"
                        });
                    }
                    break;
                }
                //客户视频入呼
                case "msgFromCustomAskForVideo": {
                    if (!WebAgent.vm.callEnabled() && !WebAgent.vm.busyEnabled()) {
                        //当前状态不可执行外呼，直接拒绝
                        self.sendMessage("msgFromAgentRefuseVideo", "", "", "", user);
                    } else {
                        user.webrtcNum(msgBody.webrtcNum);
                        user.chatType("video");
                        self.callInUser(user);
                        registerEvent.callIn({
                            name: name,
                            type: "video"
                        });
                    }
                    break;
                }
                //客户侧消息撤回
                case "msgFromCustomMessageWithdraw":{
                    self.withdrawBtn(msgBody.content,"recv",user);
                    return;
                    break;
                }
                default:
                    break;
            }
            
            if (message) {
                if (!newUserFlag) {
                    user.addMessage(message, "recv", type, new Date(), user.nickName()
                        ? user.nickName() : user.name.substring(0, 10), msgBody.messageId);
                }
                
                //智能协助
                if (self.openIntellHelp() && type == "text") {
                    require("VmSmartReply").searchReply(message, 0, user);
                }
                
                if (name != (self.currentUser() && self.currentUser().name)) {
                    user.msgNumber(user.msgNumber() + 1);
                }
                
                //消息提示音
                if (self.setChatSoundTip() && self.setChatSoundTip().msgTip) {
                    setTimeout(function () {
                        document.getElementById("chat_msg_tip").play();
                    }, 100);
                }
            }
        };
        
        this.kickoffUser = function () {
            if(self.currentUser().chatBoxType() == "custom-chat"){
                self.sendMessage("msgFromAgentkickCustom");
            }else{
                require("Login").sendMUC(self.currentUser().sessionId,{
                    type:"msgFromAgentQuitMUC"
                });
               /*  self.internalChatList(self.internalChatList().filter(function(item){
                    return item.sessionId != self.currentUser().sessionId;
                }));
                self.currentUser().name="";
                self.currentUser().kickOff();
                self.currentUser().changeSessionTime('close'); */
            }
        };
        
        //来电弹屏提示框隐藏显示
        this.callInTip = ko.observable(false);
        
        this.callInUser = ko.observable(new User());
        
        //客户入呼音频：拒接
        WebAgent.refusedCallIn = function () {
            if (self.callInUser().chatType() == "video") {
                self.sendMessage("msgFromAgentRefuseVideo", "", "", "", self.callInUser());
            } else {
                self.sendMessage("msgFromAgentRefuseCall", "", "", "", self.callInUser());
            }
            self.callInUser().chatType("chat");
        };
        
        /**
         * 呼叫
         * 根据类型判断获取外呼号码
         */
        //WebAgent.imMakeCall=self.makeCall;
        this.makeCallAudio = handleMakeCall.bind(handleMakeCall, "audioCallOut");
        this.makeCallVideo = handleMakeCall.bind(handleMakeCall, "videoCallOut");
        
        function handleMakeCall(type) {
            var user;
            if (type == "audioCallOut" || type == "videoCallOut") {
                user = self.currentUser();
                self.currentUser().chatType(type == "videoCallOut" ? "video" : "audio");
            } else {
                user = self.callInUser();
            }
            
            var setBusyCallBack = function () {
                user.isCalling = true;
                switch ( type ) {
                    case "callIn": {
                        self.callInUser().chatType() == "video" ? self.sendMessage("msgFromAgentAcceptVideo", "", "", "", self.callInUser()) : self.sendMessage("msgFromAgentAcceptCall", "", "", "", self.callInUser());
                        //self.callInUser().isCalling=true;
                        break;
                    }
                    case "audioCallOut": {
                        self.sendMessage("msgFromAgentCallCustom");
                        break;
                    }
                    case "videoCallOut": {
                        self.sendMessage("msgFromAgentAskForVideo");
                        break;
                    }
                    default: {
                        break;
                    }
                }
                util.Log("info", "IM侧发起外呼");
                
                WebAgent.extend.makeCall({
                    outCallNumber: "sip:" + user.webrtcNum(),
                    disNumber: WebAgent.vm.disNumber().match(/\d+/)[0],
                    userData: user.sessionId,
                    mediaType: user.chatType() == "video" ? "2" : "1",
                    ignoreTimeQuantumsCallLimit: "true"
                });
            };
            
            if (WebAgent.vm.disNumber() == "") {
                util.Log("error", "外呼失败，外显号码不存在");
                return;
            }
            if (WebAgent.vm.callEnabled()) {
                setBusyCallBack();
            } else if (WebAgent.vm.busyEnabled()) {
                WebAgent.extend.setBusy(setBusyCallBack);
            } else {
                util.Log("info", "当前状态不可呼叫");
            }
        }
        
        WebAgent.imMakeCall = function () {
            handleMakeCall("callIn");
        };
        
        this.callEnd = function (strDnis) {
            if (self.callInUser() && self.callInUser().isCalling) {
                self.callInUser().isCalling = false;
            } else if (self.currentUser() && self.currentUser().isCalling) {
                self.currentUser().isCalling = false;
            }
            self.sendState("msgFromAgentCallEnd", "msgFromAgentCallEnd", "PC", {
                content: {
                    number: strDnis
                }
            });
        };
        
        //请求评价
        this.requestEvaluate = function () {
            if (!self.currentUser().isSendEvalRequestBtnShow()) {
                return;
            }
            self.sendMessage("msgFromAgentSatisfySend");
            self.currentUser().hasSendEvalRequest(false);
            //self.isSendEvalRequest(true);
            self.currentUser().addMessage("已经向客户发起评价请求", "tip", "text", new Date());
        };
        
        this.previewImg = function (data) {
            IMG.show(data.text.original);
        };
        
        this.palyVideo = function (data, event) {
            
            //将原下载地址转变为可播放的地址
            var arrTmp = data.text.split("/");
            arrTmp.splice(3, 0, "play");
            var playUrl = arrTmp.join("/");
            
            var videoHtml = "<video width='400' height='300'  controls autoplay id='videoShow'>" +
                "<source src='" + playUrl + "' type='video/mp4'/>" +
                "<source src='" + playUrl + "' data-bind='attr: {src: onlineVideo}' type='video/webm'/>" +
                "<source src='" + playUrl + "' data-bind='attr: {src: onlineVideo}' type='video/ogg'/>" +
                "</video>";
            
            $("#videoPlay").html(videoHtml);
            
            $(event.currentTarget).parent(".videoImg").addClass("showLoading");
            
            $(".showLoading .video-loader-box").show();
            
            document.getElementById("videoShow").addEventListener("canplaythrough", function () {
                self.videoPlace(true);
                $(".video-loader-box").hide();
                $(event.currentTarget).parent(".videoImg").removeClass("showLoading");
            });
            
        };
        
        this.closeVideo = function () {
            self.videoPlace(false);
            $("#videoPlay").html("");
        };
        
        /**
         * 创建工单
         * @returns {boolean}
         */
        this.kchartCreate = function () {
            var currentUser = self.currentUser();
            var visitorInfo = currentUser.visitorInfo();
            
            if (!visitorInfo.workOrderEmail()) {
                alert("此访客未填写邮箱地址，无法创建工单！");
                return;
            }
            
            var params = {
                title: "来自" + visitorInfo.workOrderName() + "的聊天对话",
                content: currentUser.messages(),
                issue: currentUser.messages(),
                customServiceName: self.username(),
                creatorId: currentUser.name,
                creatorName: visitorInfo.workOrderName(),
                creatorEmail: visitorInfo.workOrderEmail(),
                email: visitorInfo.workOrderEmail(),
                telphone: visitorInfo.workOrderPhone()
            };
            registerEvent.kchartCreate(params);
            return true;
        };
    };
});
