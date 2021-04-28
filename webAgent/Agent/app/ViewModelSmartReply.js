/**
 * Created by yinghan on 2017/8/29.
 */
define(["jquery", "knockout", "User", "require", "util", "Vm"], function ($, ko, User, require, util, Vm) {
    "use strict";

    return function () {
        var self = this;

        this.smartReplySearchTxt = ko.observable("");
        this.smartReply = ko.observableArray([]);
        this.smartContent = ko.observable(false);
        this.smartTip = ko.observable("暂无内容");
        this.photoName = ko.observable(1);

        //查询
        this.searchReply = function (dataQuery,resultType,user) {
            resultType = resultType==0 ? 0 : 1;
            dataQuery = (typeof dataQuery) == "string" ? dataQuery:self.smartReplySearchTxt();

            var data = {
                question:dataQuery,
                resultType: resultType,
                entId: require('Vm').agentEntId()
            };

            if(resultType==1){
                self.smartReplySearchTxt(dataQuery);
            }

            var callback = function (data) {
                if(data.code == "0" && data.obj.answerType == "1"){
                    if(resultType == 1){
                        self.smartReply(data.obj.msg4TextResult);
                        self.smartContent(true);
                    }else {
                        self.sendSmartReply(data.obj.msg4TextResult[0],user);
                    }
                }else {
                    if(resultType==1){
                        self.photoName(-1);
                        self.smartTip("你的问题我还无法回答，请完善我的知识库");
                        self.smartContent(false);
                    }
                    console.log("[webAgent-smartReply]:",data.code == "0" ? "未找到答案":data.desc);
                }

            };
            util.ajaxHelper.post(WebAgent.config.quickSmartReplyPath_sensitive + "/intelligentQuery/query", data, callback);
        };

        //刷新
        this.reflash = function () {
            self.photoName(1);
            self.smartReply([]);
            self.smartReplySearchTxt("");
            self.smartContent(false);
            self.smartTip("暂无内容");
        };

        //发送答案
        this.sendSmartReply = function (smartAnswer,user) {

            user=user.ent ? user : Vm.currentUser();

            if(user.online()){
                //发送数据
                Vm.sendMessage("text","","",smartAnswer.answer,user,true);
                //发送图片
                /*if (smartAnswer.msgtype == "1") {
                    Vm.sendMessage("image", smartAnswer.msg4ImageTextresult,smartAnswer.msg4ImageTextresult,"",user);
                }*/
            }else {
                util.Log("warm","用户当前处于离线状态");
            }
        }
    }
});