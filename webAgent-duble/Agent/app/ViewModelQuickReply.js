/**
 * Created by panfei on 2017/5/12.
 */
define(["jquery", "knockout", "User", "require", "util", "Vm"], function ($, ko, User, require, util, Vm) {
    "use strict";

    function ComLang(id, name, selected, type, typeGrop) {
        this.id = id;
        this.name = name;
        this.selected = ko.observable(selected);
        this.type = type;
        this.typeGrop = ko.observable(typeGrop);
    }

    function ajaxRequest(url, data, callback) {
        util.ajaxHelper.post(WebAgent.config.quickSmartReplyPath_sensitive + url, data, callback);
    }

    return function () {
        var self = this;

        this.Title = {
            1: "新增常用语分组",
            2: "编辑常用语分组",
            3: "新增常用语内容",
            4: "编辑常用语内容"
        };

        //操作提示语
        this.operateTip = ko.observable();

        this.quickReplySearchTxt = ko.observable();

        //选中的分组
        this.selectedGgroup = ko.observable();

        //搜索到的内容列表
        this.searchedContentList = ko.observableArray([]);

        //搜索类型
        this.searchType = ko.observable("commonSearch");

        //新增\编辑内容
        this.commLangContent = ko.observable("");

        //快捷搜索模块显示控制
        this.quickReplyDis = ko.observable(true);

        this.deleteConfirmDis = ko.observable(false);

        //新增\编辑Div显示控制
        this.commCreateDis = ko.observable(false);

        //当前新增\编辑窗 标题 key标识
        this.currentTitleKey = ko.observable();

        //当前新增\编辑窗 标题
        this.currentTitle = ko.observable();
        this.commSetTitle = ko.computed(function () {
            self.currentTitle(self.Title[self.currentTitleKey()]);
            return true;
        }, this);

        //常用语分组列表
        this.comLangGgroupList = ko.observableArray([]);

        //常用语内容列表
        this.comLangContentList = ko.observableArray([]);

        //无搜索结果下提示
        this.searchResultTip = ko.observable(false);

        //加载快捷回复页面
        this.loadQuickReplyModel = function () {
            self.quickReplyDis(true);
            self.refreshList();
        };


        //搜索常用语内容
        this.searchComLang = function (type) {
            var content;

            self.searchType(type);

            if (type == "commonSearch") {

                content = self.quickReplySearchTxt();
            }
            if (type == "autoMatch") {

                content = Vm.inputText();
            }


            //self.searchedContentList([]);

            var url = "/commonphrase/PAndSlistForSearch";
            //var data = {"entId": "7766115", "agentId":"001", "content": content};
            var data = {"entId": Vm.agentEntId(), "agentId": Vm.agentId(), "content": content};
            var callback = function (res) {
                if (res.code == 0) {
                    if (res.obj.length > 0) {
                        if (type == "autoMatch") {
                            require("RegisterEvent").autoMatchCallback();
                        }
                        self.searchedContentList([]);
                        self.searchedContentList(res.obj);
                    } else {
                        if (self.searchedContentList().length == 0) {
                            self.searchResultTip(true);
                        }
                    }
                }
            };

            if (content.trim().length > 1) { //两个字起开始匹配查找,keydown会产生一个空格，必须尾部去空格
                ajaxRequest(url, data, callback);
            }
            if (content == "") {
                self.searchedContentList([]);
                self.searchResultTip(false);
            }
        };

        //展示搜索结果
        this.searchResultShow = ko.computed(function () {
            return self.searchResultTip() || self.searchedContentList().length > 0;
        }, this);

        //选中搜索到的常用语内容
        this.handleSearchedContent = function ($data) {
            var selectedSearchContent = $data.name || $data.sentenceDto.content;

            /*if (self.searchType() == "commonSearch") {//追加
             if(Vm.inputText() != undefined){
             Vm.inputText(Vm.inputText() + selectedSearchContent);
             } else{
             Vm.inputText(selectedSearchContent);
             }
             } else if (self.searchType() == "autoMatch") {//替换
             Vm.inputText(selectedSearchContent);
             }*/

            if(Vm.currentUser().online()){
                Vm.inputText(selectedSearchContent); //替换

                if (!vm.openAutoMatch()) {
                    Vm.checkWord();
                }else {
                    $(".message-input").focus();
                }
            }else {
                util.Log("info","用户当前处于离线状态");
            }

        };

        //刷新列表
        this.refreshList = function () {
            self.getGroupListForAgent();
            self.quickReplySearchTxt("");
            self.searchedContentList([]);
            self.searchResultTip(false);
        };

        //操作设置
        this.handleSetting = function () {
            var comLangGgroupList = self.comLangGgroupList();

            self.quickReplyDis(false);
            self.selectedGgroup(null);
            self.cacheValue(null);
            self.searchedContentList([]);
            self.quickReplySearchTxt("");
            //新加
            self.searchResultTip(false);

            self.comLangContentList([]);

            comLangGgroupList = comLangGgroupList.filter(function (p1, p2, p3) {
                return !p1.typeGrop();
            });

            comLangGgroupList = comLangGgroupList.map(function (item, index) {
                return item.selected(false);
            });

            self.comLangGgroupList(comLangGgroupList);

            if(comLangGgroupList.length){
                self.getContentListForAgent(comLangGgroupList[0].id);
            }


        };

        //获取分组列表
        this.getGroupListForAgent = function () {

            var urlSet = "/group/listForAgent", urlSearch = "/commonphrasegroup/commonAndAgentlist";

            //var data = {"entId": "7766115", "agentId":"001"};
            var data = {"entId": Vm.agentEntId(), "agentId": Vm.agentId()};
            var callbackSet = function (res) {
                self.comLangGgroupList([]);
                if (res.code == 0) {
                    var tmpG, selectedGgroupId;
                    if (self.selectedGgroup() != null) {
                        selectedGgroupId = self.selectedGgroup().id;
                    }
                    res.obj.forEach(function (item, index) {
                        if (item.id == selectedGgroupId) {
                            tmpG = new ComLang(item.id, item.groupName, true, "group");
                        } else {
                            tmpG = new ComLang(item.id, item.groupName, false, "group");
                        }
                        self.comLangGgroupList.push(tmpG);
                    });

                }
            };
            var callbackSearch = function (res) {
                self.comLangGgroupList([]);
                if (res.code == 0) {
                    var tmpG, firstGroupId, isCommon, isCommonFirst;
                    if(res.obj.length){
                        res.obj.forEach(function (item, index) {
                            isCommon = item.type == "0" ? true : false;
                            if (index == 0) {
                                isCommonFirst = isCommon;
                                firstGroupId = item.group.id;
                                tmpG = new ComLang(item.group.id, item.group.groupName, true, "group", isCommon);
                            } else {
                                tmpG = new ComLang(item.group.id, item.group.groupName, false, "group", isCommon);
                            }
                            self.comLangGgroupList.push(tmpG);
                        });
                        self.getContentListForAgent(firstGroupId, isCommonFirst);
                    }
                }
            };
            if (self.quickReplyDis()) {
                ajaxRequest(urlSearch, data, callbackSearch);
            } else {
                ajaxRequest(urlSet, data, callbackSet);
            }
        };


        //获取内容列表
        this.getContentListForAgent = function (gid, isCommon) {
            self.comLangContentList([]);
            var url = "/sentence/listByGid";
            var urlCommon = "/commonphrase/listByGid";
            //var data = {"entId": "7766115", "agentId":"001", "gid": gid};
            var data = {"entId": Vm.agentEntId(), "agentId": Vm.agentId(), "gid": gid};
            var callback = function (res) {
                if (res.code == 0) {
                    res.obj.forEach(function (item, index) {
                        var tmpC = new ComLang(item.id, item.content, false, "content");
                        self.comLangContentList.push(tmpC);
                    });
                }
            };

            if (isCommon) {
                ajaxRequest(urlCommon, data, callback);
            } else {
                ajaxRequest(url, data, callback);
            }
        };

        //切换分组
        this.switchComLangGgroup = function ($data) {
            var comLangGgroupList = self.comLangGgroupList();
            comLangGgroupList = comLangGgroupList.map(function (item, index) {
                return item.selected(false);
            });
            self.comLangGgroupList(comLangGgroupList);
            $data.selected(true);
            self.selectedGgroup($data);
            self.cacheValue($data);
            self.getContentListForAgent($data.id, $data.typeGrop());
        };

        //暂存点击过的列表内容
        this.cacheValue = ko.observable(null);
        this.handleCacheValue = function ($data) {
            var comLangContentList = self.comLangContentList();
            comLangContentList = comLangContentList.map(function (item, index) {
                return item.selected(false);
            });
            self.comLangContentList(comLangContentList);
            $data.selected(true);
            self.cacheValue($data);
        };

        //打开新增常用语分组
        this.createCommLangG = function () {
            self.commCreateDis(true);
            self.currentTitleKey(1);
        };

        //打开新增常用语内容
        this.createCommLangC = function () {
            self.commCreateDis(true);
            self.currentTitleKey(3);
        };

        //编辑
        this.handleEdit = function () {
            if (self.cacheValue().type == "group") {
                self.currentTitleKey(2);
            } else {
                self.currentTitleKey(4);
            }
            self.commCreateDis(true);
            self.commLangContent(self.cacheValue().name);
        };

        this.handleDelete = function () {
            self.deleteConfirmDis(true);
        }

        this.handleReturn = function () {
            self.quickReplyDis(true);
        }
        //删除
        this.confirmDelete = function () {
            var id = self.cacheValue().id;
            var gid = self.selectedGgroup().id;
            var url = null;
            var data = {"entId": Vm.agentEntId(), "agentId": Vm.agentId(), "id": id};

            if (self.cacheValue().type == "group") {
                url = "/group/remove";
            } else {
                url = "/sentence/remove";
            }
            var callback = function (res) {
                self.deleteConfirmDis(false);

                if (res.code == 0) {
                    if (self.cacheValue().type == "group") { //删除分组，刷新分组列表
                        self.getGroupListForAgent();
                        self.comLangContentList([]);
                        self.cacheValue(null);
                    } else { //删除内容，刷新内容列表
                        self.getContentListForAgent(gid);
                        self.cacheValue(null);
                    }
                }
            };
            ajaxRequest(url, data, callback);
        };

        //新增\编辑\删除 取消操作
        this.handleCancel = function () {
            self.commCreateDis(false);
            self.commLangContent("");

            self.deleteConfirmDis(false);
        };

        var timer = "";
        var time = 3000;
        //新增\编辑 保存操作
        this.handleSave = function () {
            var content = self.commLangContent().trim();
            var type = self.currentTitleKey();
            var url = null, data = null;
            var callback = function (res) {
                if (res.code == 0) {
                    self.commCreateDis(false);
                    self.commLangContent("");
                    if (type == 1 || type == 2) { //编辑，新增分组，只刷新分组
                        self.getGroupListForAgent();
                    } else if (type == 3 || type == 4) {  //编辑，新增内容，只刷新内容
                        self.getContentListForAgent(self.selectedGgroup().id);
                    }
                } else {
                    self.operateTip(res.desc);
                    setTimeout(function () {
                        self.operateTip(null);
                    }, 2000)
                }
            };

            switch (type) {
                case 1:     //增加分组
                    url = "/group/save";
                    data = {"entId": Vm.agentEntId(), "agentId": Vm.agentId(), "groupName": content};
                    break;
                case 2:     //编辑分组
                    url = "/group/update";
                    data = {
                        "entId": Vm.agentEntId(),
                        "agentId": Vm.agentId(),
                        "id": self.selectedGgroup().id,
                        "groupName": content
                    };
                    break;
                case 3:     //增加内容
                    url = "/sentence/save";
                    data = {
                        "entId": Vm.agentEntId(),
                        "agentId": Vm.agentId(),
                        "gid": self.selectedGgroup().id,
                        "content": content
                    };
                    break;
                case 4:     //编辑内容
                    url = "/sentence/update";
                    data = {
                        "entId": Vm.agentEntId(),
                        "agentId": Vm.agentId(),
                        "gid": self.selectedGgroup().id,
                        "id": self.cacheValue().id,
                        "content": content
                    };
                    break;
                default :
                    break;
            }
            ajaxRequest(url, data, callback);

            //3秒内，只提交一次
            $("#handleSave").unbind("click");
            timer = setTimeout(function () {
                $("#handleSave").click(self.handleSave);
            }, time);

        };

        //模板下载
        this.downLoadUrl = WebAgent.config.quickSmartReplyPath_sensitive + "/template/sentence/SentenceAdd.xlsx";

        //导出
        this.handleExport = function () {
            var url = WebAgent.config.quickSmartReplyPath_sensitive + "/sentence/exportSentence?entId=" + Vm.agentEntId() + "&agentId=" + Vm.agentId();
            //window.location.href = WebAgent.config.quickSmartReplyPath_sensitive + "/sentence/exportSentence?entId=" + self.entId() + "&agentId=" + self.agentId();
            window.open(url);
        }

        //导出
        //this.exportUrl = WebAgent.config.quickSmartReplyPath_sensitive + "/sentence/exportSentence?entId=" + self.entId() + "&agentId=" + self.agentId();
    }
});