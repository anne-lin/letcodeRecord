/**
 * Created by panfei on 2015/11/23.
 */

define(["knockout", "require", "Message", "util", "RegisterEvent"], function (ko, require, Message, util, registerEvent) {
    
    return function (name, ent, channel, sessionId,chatBoxType) {
        channel  = channel === null || channel === undefined ? "webim" : channel;
        sessionId  = sessionId === null || sessionId === undefined ? "" : sessionId;
        chatBoxType  = chatBoxType === null || chatBoxType === undefined ? "custom-chat" : sessionId;
    
        var self = this;
        var msgDirec; //消息方向
        var msgSource; //消息来源
        var t = null; //计时器
        var sessionT = null; // 会话时长计时器

        //标识与客户的当前这通会话
        this.sessionId = sessionId;
        /**
         * 聊天框类型
         * 与客户聊天框：custom-chat
         * 与坐席聊天框：agent-chat
         * 与客户群聊框：custom-group
         * 与坐席群聊框：agent-group
         */
        this.chatBoxType = ko.observable(chatBoxType);
        
        this.chatBoxNum = 2;
        //是否对该用户主动发送了请求评价
        this.hasSendEvalRequest = ko.observable(true);

        this.isSendEvalRequestBtnShow = ko.computed(function(){
            return self.chatBoxType() == "custom-chat" && self.hasSendEvalRequest();
        });
        //转接坐席按钮是否显示
        this.isTransferAgentBtnShow = ko.computed(function(){
            return self.chatBoxType() == "custom-chat"
        });
        //添加坐席按钮是否显示
        this.isAddAgentBtnShow =  ko.computed(function(){
            return self.chatBoxType() !== "custom-group"
        });
        this.serviceVideo = ko.observable(false);
        this.serviceAduio = ko.observable(false);
        this.isNewUser = ko.observable(true);//标识是否是新客户
        this.memberNum="";
        this.beInvited="";
        this.members=ko.observableArray([]);
        this.membersAgentIdList=[];
        
        this.name = name;
        this.ent = ent;
        this.channel = channel;
        
        this.nickName = ko.observable(""); //客户姓名
        
        this.resource = "";
        
        this.inputText = ko.observable();
        
        this.msgNumber = ko.observable(0);
        this.messages = ko.observableArray();
        
        this.webrtcNum = ko.observable("");
        this.chatType = ko.observable("chat");
        
        
        //this.lastMsg = ko.observable();
        this.visitorInfo = ko.observable({
            workOrderName: ko.observable(self.name && self.name.substring(0, 10)),
            workOrderEmail: ko.observable(),
            workOrderPhone: ko.observable()
        });
        this.visitInfo = ko.observable({
            sessionAntecedents: ko.observable(),
            geoLocation: ko.observable(),
            ipAddress: ko.observable(),
            browserType: ko.observable(),
            operatingSystem: ko.observable()
        });
        this.workOrder = ko.observableArray();
        
        this.online = ko.observable(true);
        this.skillGroupId = ko.observable();   //接入客户的技能组id
        this.skillName = "";   //接入客户的技能组名称
        
        this.isCalling = false;
        
        this.kickOff = function () {
            self.online(false);
        };
        
        //是否显示更多消息记录
        this.hasMoreHistory = ko.observable(false);
        
        //获取下一页消息记录开始时间
        this.getHistoryStartTime = "";
        
        //获取下一页消息记录开始sessionId
        this.historySessionId = "";
        
        // 当前user的会话时长
        this.sessionTime = ko.observable(0);
        this.showSessionTime = ko.observable('');
        
        this.addMessage = function (text, direction, type, time, name, source, isMoreMsg) {
            //self.messages.push(new Message(text, direction, type, time, name));
            
            if (source == "history") { //获取到的消息记录是倒序
                self.messages.unshift(new Message(text, direction, type, time, name));
            } else { //正常发送接收消息数据是正序
                self.messages.push(new Message(text, direction, type, time, name,source));
            }
            
            //不是更多消息时滚动条滚到底部
            if (!isMoreMsg) {
                //由于图片加载有延迟，滚动条滚动时图片还没加载完，导致无法滚动到底部，等图片加载完再执行滚动条滚动
                if (type == "image") {
                    var image = new Image();
                    image.onload = function () {
                        util.ScrollToBottom();
                    };
                    image.src = text.zoom || text.original;
                } else {
                    util.ScrollToBottom();
                }
                
            }
            
            msgDirec = direction;
            msgSource = source;
            
            //客户在未超时情况下发送消息，执行计时函数
            if (direction == 'recv' && !self.isTiming && self.online() && msgSource != "history") {
                self.chatBoxType()== "custom-chat" && self.agentTimeoutReply();
            }
            
            if (direction == "send" && msgSource != "history") {
                self.timeOutBack() != 'blue' ? self.timeOutBack('blue') : '';
                self.isTiming = false;
                self.isFirstTiming = false;
                self.isSecondTiming = false;
            }
            
            //if(!isMoreMsg){ //不是更多消息时滚动条滚到底部
            //    //由于图片加载有延迟，滚动条滚动时图片还没加载完，导致无法滚动到底部，等图片加载完再执行滚动条滚动
            //    if(type == "image") {
            //        var imgLen = $(".chat-send-recv-img").length;
            //        $(".chat-send-recv-img")[imgLen - 1].onload = function() {
            //            util.ScrollToBottom();
            //        };
            //    } else {
            //        util.ScrollToBottom();
            //    }
            //}
        };
        /**
         * 获取最后一条数据的方向和时间
         */
        this.getLastMessage = function () {
            var self = this;
            var result = {};
            if (self.messages().length) {
                result.previousTime = self.messages()[self.messages().length - 1].time();
                result.previousDirection = self.messages()[self.messages().length - 1].direction;
            }
            return result;
        };
        
        //最后一条消息
        this.lastMsg = ko.computed(function () {
            var self = this;
            
            if (self.messages().length) {
                var type = self.messages()[self.messages().length - 1].type;
                var text = self.messages()[self.messages().length - 1].text;
                
                switch ( type ) {
                    case "image":
                        return "[图片]";
                    case "file":
                        return "[文件]";
                    case "voice":
                        return "[语音]";
                    case "shortvideo":
                        return "[视频]";
                    default :
                        if (text && (text.indexOf("<br/>") != -1)) {
                            return (text.split("<br/>")[0] + "...");
                        } else {
                            return text;
                        }
                    //if (text && text.split("<br/>")[0]) {
                    //    return (text.split("<br/>")[0] + "...");
                    //} else {
                    //    return text;
                    //}
                    
                }
            }
        }, this);
        
        this.timeOutBack = ko.observable('blue');   //图标正常、超时、严重超时颜色
        this.timeOut1 = null;   //第一次超时时间
        this.timeOut2 = null;   //第二次超时时间
        this.isTiming = false;  //超时标志
        this.isFirstTiming = false; //第一次超时标志
        this.isSecondTiming = false; //第二次超时标志
        
        this.timing = ko.observable(0); //超时时间
        
        /**
         * 将秒转换成时分秒
         * @param timing
         */
        var formatTiming = function (timing) {
            if (timing < 60) {
                if (timing < 10) {
                    return "00:0" + timing;
                } else {
                    return "00:" + timing;
                }
            } else {
                var min = parseInt(timing / 60);
                var sec = timing % 60;
                
                if (min < 10) {
                    if (sec < 10) {
                        return "0" + min + ":0" + sec;
                    } else {
                        return "0" + min + ":" + sec;
                    }
                } else {
                    if (sec < 10) {
                        return min + ":0" + sec;
                    } else {
                        return min + ":" + sec;
                    }
                }
            }
        };
        
        // 计算时分秒
        var formatSeconds = function (value) {
            var result = parseInt(value);
            var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
            var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
            var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
            var res = '';
            if (h !== '00') res += h +':';
            res += m + ':';
            res += s;
            return res;
        };
        
        // 修改会话时长 type = open / close
        this.changeSessionTime = function (type) {
            if (type === 'open') {
                self.sessionT = setInterval(function () {
                    self.sessionTime(self.sessionTime() + 1);
                    self.showSessionTime(formatSeconds(self.sessionTime()));
                }, 1000);
            } else {
                clearInterval(self.sessionT);
                self.sessionTime(0);
                self.showSessionTime(formatSeconds(self.sessionTime()));
            }
        };
        
        /**
         * 坐席超时未回复
         */
        this.agentTimeoutReply = function () {
            //var t = null;
            var firstMsgTime = new Date().getTime();  //计时的开始时间
            var timing = 0;  //计时时间
            
            if (t) {
                clearInterval(t);
                //return;
            }
            t = setInterval(function () {
                
                timing = parseInt((new Date().getTime() - firstMsgTime) / 1000);
                self.timing(formatTiming(timing));
                
                //客户下线不再计时，关闭提醒
                if (!self.online()) {
                    self.timeOutBack('');
                    timing = 0;
                    self.timing(0);
                    self.isTiming = false;
                    self.isFirstTiming = false;
                    self.isSecondTiming = false;
                    clearInterval(t);
                    t = null;
                    //require("Vm").messageTip().close();
                    return;
                }
                
                //坐席回复消息后清除计时器
                if (msgDirec == "send" && msgSource != "history") {
                    timing = 0;
                    self.timing(0);
                    self.isTiming = false;
                    self.isFirstTiming = false;
                    self.isSecondTiming = false;
                    clearInterval(t);
                    t = null;
                    return;
                }
                
                //到达第一次超时时间，提醒坐席
                if (timing >= self.timeOut1 && !self.isFirstTiming) {
                    //旧弹出框--消息提醒
                    /* self.msgTip(self.timeOut1 / 60 + "分钟未回复" + self.name.substring(0, 10));*/
                    
                    
                    registerEvent.timeOutTip({
                        "timeout": self.timeOut1 / 60,
                        "name": self.nickName() ? self.nickName() : self.name.substring(0, 10)
                    });
                    self.isFirstTiming = true;
                    self.isTiming = true;
                    self.timeOutBack('yellow');
                    return;
                }
                
                // console.log("timeOut1:",self.timeOut2);
                
                //到达第二次超时时间，提醒坐席
                if (timing >= self.timeOut2 && !self.isSecondTiming) {
                    //旧弹出框--消息提醒
                    /* self.msgTip(self.timeOut2 / 60 + "分钟未回复" + self.name.substring(0, 10));*/
                    
                    //clearInterval(t);
                    //t = null;
                    self.isSecondTiming = true;
                    self.isTiming = true;
                    self.timeOutBack('red');
                    registerEvent.timeOutTip({
                        "timeout": self.timeOut2 / 60,
                        "name": self.nickName() ? self.nickName() : self.name.substring(0, 10)
                    });
                }
                
                //一小时未回复停止计时
                if (timing > 60 * 60 * 59) {
                    clearInterval(t);
                    t = null;
                }
                
            }, 1000);
        };
    };
});
