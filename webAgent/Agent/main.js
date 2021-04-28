/**
 * Created by panfei on 2015/11/23.
 */
(function(urlArgs, baseUrl, initParams) {
    requirejs.config({
        urlArgs: urlArgs,
        baseUrl: baseUrl,
        paths: {
            "jquery"           : "MultiChannel/windowJquery",
            "jsjac"        : "Agent/lib/jsjac-2.1",
            // "jsjac"        : "Agent/lib/jsjac-1.4",
            "font"         : "public_css/font-awesome.min",
            //"agent"        : "Agent/scss/agent",
            "agent"        : "Agent/scss/agent-cdesk",
            "bsf"          : "Agent/css/bsf",
            //"dom"          : "Agent/app/Agent-ui.html",
            "dom"          : "Agent/app/Agent-ui-desk.html",
            "quickReplyDom": "Agent/app/Quick-reply-ui.html",
            "smartReplyDom": "Agent/app/Smart-reply-ui.html",
            //"Config"       : "Agent/app/Config",
            "FileUpload"   : "Agent/app/FileUpload",
            "Login"        : "Agent/app/Login",
            "Message"      : "Agent/app/Message",
            "User"         : "Agent/app/User",
            "ViewModel"    : "Agent/app/ViewModel",
            "Vm"           : "Agent/app/Vm",
            "ViewModelQuickReply"   : "Agent/app/ViewModelQuickReply",
            "ViewModelSmartReply"   : "Agent/app/ViewModelSmartReply",
            "VmQuickReply"           : "Agent/app/VmQuickReply",
            "VmSmartReply"           : "Agent/app/VmSmartReply",
            "IMG"          : "Agent/component/IMG",
            "Drag"         : "Agent/component/ks-drag",
            "RegisterEvent": "Agent/app/RegisterEvent",
            "ButelEvent"   : "Agent/app/ButelEvent",
            "weixinEmojiC" : "Agent/css/weixinEmoji",
            "weixinEmojiJ" : "Agent/lib/weixinEmoji",
            "weixinEmojiExtend": "Agent/lib/weixinEmojiExtend",
            "util": "Agent/lib/util"
        }
    });

    require(["jquery", "knockout", "Vm", "VmQuickReply","VmSmartReply", "Login", "FileUpload", "Drag", "RegisterEvent", "ButelEvent", "text!dom", "text!quickReplyDom","text!smartReplyDom", "css!bsf"], function($, ko, Vm, VmQuickReply, VmSmartReply, Login, FileUpload, Drag, RegisterEvent, ButelEvent, dom, quickReplyDom, smartReplyDom) {
        "use strict";

        window.vm = Vm;
        var initCallback = initParams.callback;
        var selectorName = initParams.selectorName;
        var isCheckWord = initParams.isCheckWord;
        if("isCheckWord" in initParams){
            Vm.isCheckWord=initParams.isCheckWord;
        }
        //在这里引用css文件，不会被打包到main.min.js
        require(["css!font", "css!agent"], function() {
            //把聊天窗体代码添加到body最后节点
            $(selectorName || document.body).append(dom);

            //转义表情符号
            var emojiPane = $("#emojiPane").html();
            emojiPane = emojiPane.replace(/&amp;/g,"&")
                                 .replace(/&lt;/g,"<")
                                 .replace(/&gt;/g,">")
                                 .replace(/&quot;/g,"\"");

            //转换表情
            $("#emojiPane").html(WeixinEmojiExtend.replace(emojiPane));

            //给表情绑定事件
            $("#emojiPane img").click(function() {
                var src = $(this).attr("src");
                var emojiNum = src.split("/")[src.split("/").length-1].split(".")[0];
                var emojiStr = WeixinEmojiExtend.getInverseStr(emojiNum);
                if(Vm.inputText()) {
                    Vm.inputText(Vm.inputText() + emojiStr);
                } else {
                    Vm.inputText(emojiStr);
                }
                Vm.emojiPaneDis(false);
                $("textarea.message-input").focus();
            });

            //点击表情框以外地方隐藏表情框
            $(document).click(function(event) {
                if(event.target.id != 'expressBtn') {
                    Vm.emojiPaneDis(false);
                }
                if(event.target.id != 'chat-common-word'){
                    Vm.isShowCommonWordDialog(false);
                }
            });

            //切换转接坐席列表的展示
            $(document).delegate("span.icon", "click",function() {
                if($(this).hasClass("chat-users-arrow-up")) {
                    $(this).removeClass("chat-users-arrow-up").addClass("chat-users-arrow-down");
                    $(this).parent().next().slideDown();
                    return;
                }
                if($(this).hasClass("chat-users-arrow-down")) {
                    $(this).removeClass("chat-users-arrow-down").addClass("chat-users-arrow-up");
                    $(this).parent().next().slideUp();
                    return;
                }
                if($(this).hasClass("fa-plus")) {
                    $(this).removeClass("fa-plus").addClass("fa-minus");
                    $(this).parent().next().slideDown();
                    return;
                } 
                if($(this).hasClass("fa-minus")) {
                    $(this).removeClass("fa-minus").addClass("fa-plus");
                    $(this).parent().next().slideUp();
                }
            });

            //截图粘贴事件
            var sendPic = null;
            $(document).on("paste","#textArea",function(e){
                sendPic = null;
                sendPic = Vm.pastePicFun(e);
            });
            //截图发送事件
            $(document).on("click","#sendPic",function(){
                sendPic();
            })

            //选择自动快捷回复提示图标
            $("#openAutoMatchTipIcon").hover(function(){
                $(".openAutoMatchTip").css("display","block");
            },function(){
                $(".openAutoMatchTip").css("display","none");
            });

            //选择智能协助提示图标
            $("#openIntellTipIcons").hover(function(){
                $(".openIntellTip").css("display","block");
            },function(){
                $(".openIntellTip").css("display","none");
            });

            //登录、退出接口暴露出去
            WebAgent.ChatLogin = Login.login;
            WebAgent.ChatLogout = Login.logout;

            //设置状态接口
            WebAgent.ChatSetBusy = Vm.setBusy;
            WebAgent.ChatSetReady = Vm.setReady;

            //跟踪坐席状态：用于容错时保持两端状态一致
            WebAgent.readyEnabled=false;
            //跟踪坐席是否登入，避免openfire重复登入
            WebAgent.agentOnline = Vm.agentOnline();
            //设置客户姓名
            WebAgent.setNickName = Vm.setNickName;

            //butel事件接口
            WebAgent.butelEvent = ButelEvent;

            //获取可转坐席列表
            WebAgent.getAgentList = Vm.getAgentList;
            WebAgent.transferAgent = Vm.transferAgent;

            //获取聊天记录
            WebAgent.getChatMsgs = Vm.getChatMsgs;

            //设置声音提醒
            WebAgent.setChatSoundTip = Vm.setChatSoundTip;

            //加载快捷回复DOM到指定位置
            WebAgent.loadQuickReplyDom = function(appendDom){
                $(appendDom).append(quickReplyDom);
                ko.applyBindings(VmQuickReply, $("#chat_quick_reply")[0]);
            };

            if(initParams.quickReplySelector){
                $(initParams.quickReplySelector).append(quickReplyDom);
                ko.applyBindings(VmQuickReply, $("#chat_quick_reply")[0]);
            }

            //加载快捷回复的数据
            WebAgent.loadQuickReplyData = VmQuickReply.loadQuickReplyModel;

            //加载智能回复DOM到指定位置
            if(initParams.smartReply){
                $(initParams.smartReply).append(smartReplyDom);
                ko.applyBindings(VmSmartReply, $("#chat_smart_reply")[0]);
            }

            WebAgent.loadSmartReplyDom = function(appendDom){
                $(appendDom).append(smartReplyDom);
                ko.applyBindings(VmSmartReply, $("#chat_smart_reply")[0]);
            }

            //快捷回复上传文件
            $(document).delegate("#commLangUploadBtn","click",function(){
                console.log("you have clicked commLangUploadBtn");
                FileUpload.commLangSelected();
            });
            $(document).delegate("#commLangToUpload","change",function(){
                FileUpload.uploadCommLang();
            });

            //注册事件
            WebAgent.ChatRegisterEvent = RegisterEvent.registerEvent;

            //移除事件
            WebAgent.ChatRemoveEvent = RegisterEvent.removeEvent;

            //chat置忙成功回调
            WebAgent.ChatBusyCallback = RegisterEvent.busyCallback;

            //chat置闲成功的回调
            WebAgent.ChatReadyCallback = RegisterEvent.readyCallback;

            WebAgent.ChatWorkOrderCallback = function(params){
                Vm.currentUser().workOrder.push({workId: params.workId,title: params.title, onclick: params.onclick});
            };
            WebAgent.ChatUpdateOrAddUser = RegisterEvent.updateOrAddUser;
            WebAgent.ChatKchartCreate = RegisterEvent.kchartCreate;


            //窗体显示/隐藏切换
            WebAgent.ChatToggle = function() {
                $("#chat_pane").toggle();
            }

            //初始化后的回调
            if(typeof initCallback === "function") {
                initCallback();
                WebAgent.chatInitFinished = true;
            }

            //上传文件
            $("#uploadBtn").click(function() {
                FileUpload.fileSelected();
            });

            $("#fileToUpload").change(function() {
                var file = this;
                FileUpload.uploadFile(file);
            });


            //隐藏窗体
            $("#hideChat").click(function(){
                $("#chat_pane").hide();
            })

            //窗体拖拽
            Drag.dragElement($(".ibox-title").get(0), $("#chat_pane").get(0));

            //绑定聊天框viewModel
            ko.applyBindings(Vm, $("#chat_pane")[0]);
        });

    });
})(WebAgent.urlArgs, WebAgent.baseUrl, WebAgent.ChatParams)
