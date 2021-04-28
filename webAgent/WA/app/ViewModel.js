/**
 * Created by fei on 2015/12/3.
 */
define(["jquery", "knockout", "require", "wa_Defaults", "wa_Constant", "wa_Log", "wa_Tip", "wa_RegisterHandler", "colorBlink", "wa_Counter", "dialog"], function ($, ko, require, defaults, constant, Log, tip, registerHandler, undefined, Counter, dialog) {
    
    CR = window.CR;
    
    function getExtendModule() {
        return require("wa_Extend");
    }
    
    return function () {
        "use strict";
        
        var self = this;
        
        this.sid = "";
        
        //设置是否使用cphone
        this.sipUseCphone = ko.observable();
        
        //设置cphone心跳时间，默认60000ms，1分钟
        this.cphoneInterval = ko.observable(60000);
        
        //webRTC接通挂断box隐藏显示
        this.operBoxDisplay = ko.observable(false);
        
        this.closeOperBox = function () {
            self.operBoxDisplay(false);
        };
        //坐席列表
        this.agentList = ko.observableArray([]);
        
        //技能组列表 --2020/6/2 话路转接功能新增转接技能组
        this.skillList = ko.observableArray([]);
        
        //WA_icon的颜色
        this.colorObj = ko.observable({});
        
        //WA_icon的颜色变化的间隔
        this.icon_interval = ko.observable();
        
        //WA_icon的位置
        this.icon_posRight = ko.observable();
        this.icon_posBottom = ko.observable();
        
        //WA_div的位置
        this.div_posRight = ko.observable();
        this.div_posBottom = ko.observable();
        
        //是否展示软电话登录界面
        this.div_visible = ko.observable();
        
        //是否展示“外显号”一行
        this.outNumbersVisible = ko.observable(true);
        
        //是否展示“外呼号码”一行
        this.outCallNumberVisible = ko.observable(true);
        
        //是否展示"外呼"及“咨询”两行
        this.callConsultVisible = ko.observable(true);
        
        //登录信息是否只读
        this.entIdReadonly = ko.observable(false);
        this.agentIdReadonly = ko.observable(false);
        this.agentPasswordReadonly = ko.observable(false);
        this.agentNumberReadonly = ko.observable(false);
        
        //企业编号
        this.entId = ko.observable("");
        
        this.agentId = ko.observable("");
        this.agentPassword = ko.observable("");
        this.agentNumber = ko.observable("");
        this.forceLogin = ko.observable(false);
        
        //是否记住登录信息
        this.rememberLogin = ko.observable(false);
        
        //坐席当前是否已登录
        this.alreadyLogin = ko.observable(false);
        
        //是否执行登出
        this.handlerLogout = ko.observable(false);
        
        //坐席当前状态
        this.currentState = ko.observable(constant.states.INIT);
        
        //坐席正在状态
        this.doingState = ko.observable(null);
        
        //IVR协助节点
        this.ivrAssists = ko.observableArray([]);
        
        //IVR回转节点
        this.ivrRouters = ko.observableArray([]);
        
        //IVR节点列表
        this.ivrNodeList = ko.observableArray([]);
        
        //展示在页面中的状态
        this.stateShow = ko.computed(function () {
            return (this.doingState() || this.currentState()).desc;
        }, this);
        
        //通知外部监听器状态变化
        this.stateListener = ko.computed(function () {
            var state = this.currentState();
            registerHandler.triggerState(state);
            return state;
        }, this);
        
        //坐席角色（1普通坐席,2班长坐席,3无终端坐席）
        this.agentRole = ko.observable("1");
        
        //外呼的号码
        this.callNumber = ko.observable();
        
        //登录失败信息
        this.loginMessage = ko.observable();
        
        //外显号集合
        this.outNumbers = ko.observableArray([]);
        
        this.outNumberWa = ko.computed(function () {
            var outNumberList;
            
            outNumberList = self.outNumbers().map(function (item) {
                return item.number + item.area;
            });
            
            return outNumberList;
        });
        
        //外显号集合备份
        this.outNumbersTmp = ko.observableArray([]);
        
        //是否展示外显号list
        this.isShowNumbox = ko.observable(false);
        
        //选中的外显号:给phone面板使用
        this.disNumber = ko.observable("");
        
        //选中的外显号:给标准面板使用
        this.disNumberWa = ko.observable("");
        
        //小休子状态集合
        this.awayStatusList = ko.observableArray([]);
        
        //选中的小休状态
        this.awayStatu = ko.observable();
        
        //通话时长(秒)
        this.callDuration = ko.observable(0);
        
        //号码被保护后的原外呼号码
        this.callNumberOri = ko.observable();
        
        //设置号码被保护
        this.numberProtection = ko.observable(false);
        
        //咨询、单步转移、监听弹出框的配置参数
        this.dialogObj = ko.observable({
            title: "",
            isChecked: ko.observable(""),
            inputTitle: "",
            insideContent: "",
            outsideContent: "",
            skillGroupContent: "",
            toAgent: ko.observable(),
            handleName: ""
        });
        
        //ivr节点弹出框的配置参数
        this.ivrDialogObj = ko.observable({
            title: "",
            toIvrNode: ko.observable(),
            handleName: ""
        });
        
        //切换中心的配置参数
        this.centreDialogObj = ko.observable({
            title: "",
            text: ko.observable(),
            handleName: ""
        });
        
        //ivr输入身份证/卡号验密
        this.ivrAssistsCardId = ko.observable("");
        
        //irv协助显示输入密码框
        this.ivrObjExit = ko.observable(false);
        
        //irv协助卡号--确认按钮
        this.ivrCardBtnDisabled = ko.observable(true);
        
        //ivr验证身份证/卡号格式
        this.checkIvrCard = ko.computed(function () {
            var reg = /^\d{0,21}[\dXx]$/;
            if (self.ivrAssistsCardId()) {
                if (reg.test(self.ivrAssistsCardId())) {
                    self.ivrCardBtnDisabled(false);
                    return "";
                } else {
                    self.ivrCardBtnDisabled(true);
                    return "您输入的卡号有误，请重新输入";
                }
            } else {
                self.ivrCardBtnDisabled(true);
            }
        });
        
        //ivr协助卡号验密类型跟踪
        this.checkIvrCardIdType = ko.observable(0);
        
        //弹出框的类型
        this.dialogType = ko.observable();
        
        //弹出框展示
        this.dialogShow = ko.observable(false);
        
        //选择框是否展示
        this.choiceDilogShow = ko.observable(true);
        
        //ivr验证框是否展示
        this.ivrConfirmDialogShow = ko.observable(false);
        
        //ivr验证结果展示
        this.ivrConfirmDialogResult = ko.observable("");
        
        //聊天框确认按钮禁用情况
        this.dialogBtnDisabled = ko.computed(function () {
            switch ( self.dialogType() ) {
                case "consult":
                case "singleTransfer":
                case "observe":
                    return !self.dialogObj().toAgent();
                case "away":
                    return !self.awayStatu();
                case "assistIVR":
                case "routerToIVR":
                    return !self.ivrDialogObj().toIvrNode();
                default:
                    break;
            }
        }, this);
        
        //是否使用面板
        this.ui = ko.observable(true);
        
        this.robotAgentList = ko.observableArray([]);
        this.selectedRobotAgent = ko.observable();
        
        // 选择外显号码方式（手动或者智能选择）
        this.outCallType = ko.observable('manualSelect');
        
        // 禁用手动选择
        this.outCallTypeCss = ko.pureComputed(function () {
            return self.outCallType() != 'manualSelect';
        });
        
        //通话时长(hh:mi:ss)
        this.callDurationShow = ko.computed(function () {
            return Counter.getTimeFormat(this.callDuration());
        }, this);
        
        /**
         * 登录按钮文字展示
         */
        this.loginButtonText = ko.computed(function () {
            return (this.doingState() === constant.states.LOGINING) ? "登录中" : "登录";
        }, this);
        
        /**
         * 登录：在未登录及非登录中时可用(防止并发提交)
         */
        this.loginEnabled = ko.pureComputed(function () {
            return !(this.doingState() === constant.states.LOGINING) && !this.alreadyLogin();
        }, this);
        
        /**
         * 外呼：置忙时可用
         */
        this.callEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.BUSY);
        }, this);
        
        /**
         * 内呼：置忙时可用
         */
        this.callInternalEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.BUSY);
        }, this);
        
        /**
         * 挂断：坐席接通、双方通话、内呼接通、会议中、监听、被咨询、多人会议中可用
         */
        this.hangupEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.AGENT_CONNECTED ||
                this.currentState() == constant.states.CONNECTED ||
                this.currentState() == constant.states.INTERNAL_CONNECTED ||
                //this.currentState() == constant.states.HOLD ||
                this.currentState() == constant.states.CONFERENCED ||
                this.currentState() == constant.states.OBSERVED ||
                this.currentState() == constant.states.CONSULTED_B ||
                this.currentState() == constant.states.MP_CONFERENCE ||
                this.currentState() == constant.states.MP_CONFERENCING ||
                this.currentState() == constant.states.MP_CONFERENCE_ALERTING_TP ||
                this.currentState() == constant.states.MP_CONFERENCE_ALERTING_OP ||
                this.currentState() == constant.states.CRYPTOLALIA
            );
        }, this);
        
        this.hangupDisabled = ko.pureComputed(function () {
            return this.doingState() || (this.currentState() == constant.states.AGENT_ALERTING ||
                this.currentState() == constant.states.CUSTOM_ALERTING ||
                //this.currentState() == constant.states.CONSULT_ALERTING ||
                this.currentState() == constant.states.CONSULT_B_ALERTING ||
                this.currentState() == constant.states.OBSERVE_ALERTING ||
                this.currentState() == constant.states.AGENT_ALERTING ||
                this.currentState() == constant.states.INTERNAL_ALERTING ||
                this.currentState() == constant.states.TRANSFER_ALERTING
            );
        }, this);
        
        /**
         * 置闲：置忙，事后整理，小休时可用
         */
        this.readyEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.BUSY || this.currentState() == constant.states.ACW || this.currentState() == constant.states.AWAY || this.currentState() == constant.states.WORKING);
        }, this);
        
        /**
         * 置忙：置闲，事后整理,小休时可用
         */
        this.busyEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.READY || this.currentState() == constant.states.ACW || this.currentState() == constant.states.AWAY || this.currentState() == constant.states.WORKING);
        }, this);
        
        /**
         * 工作状态: 置闲，置忙, 事后整理, 小休时可用
         */
        this.workingEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.READY || this.currentState() == constant.states.BUSY || this.currentState() == constant.states.AWAY || this.currentState() == constant.states.ACW);
        }, this);
        
        /**
         * 小休: 置忙，置闲，事后整理，小休时可用
         */
        this.awayEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.BUSY || this.currentState() == constant.states.READY || this.currentState() == constant.states.ACW || this.currentState() == constant.states.AWAY || this.currentState() == constant.states.WORKING);
        }, this);
        
        /**
         * 登出：置忙，置闲，事后整理，正在呼叫,小休时可用
         */
        this.logoutEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.BUSY ||
                this.currentState() == constant.states.READY ||
                this.currentState() == constant.states.ACW ||
                this.currentState() == constant.states.CONNECTING ||
                this.currentState() == constant.states.AWAY
            );
        }, this);
        
        /**
         * 重置：目前一直可用
         */
        this.resetEnabled = ko.observable(true);
        
        /**
         * 保持：双方通话时可用
         */
        this.holdEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.CONNECTED || this.currentState() == constant.states.CRYPTOLALIA);
        }, this);
        
        /**
         * 保持接回：保持时可用
         */
        this.holdReturnEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.HOLD);
        }, this);
        
        /**
         * 咨询：双方通话时可用
         */
        this.consultEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.CONNECTED || this.currentState() == constant.states.CRYPTOLALIA);
        }, this);
        
        /**
         * 咨询接回：咨询振铃时可用，以前是咨询接通可用
         */
        this.consultReturnEnabled = ko.pureComputed(function () {
            //return !this.doingState() && (this.currentState() == constant.states.CONSULTED);
            return !this.doingState() && ((this.currentState() == constant.states.CONSULT_ALERTING) || (this.currentState() == constant.states.CONSULTED));
        }, this);
        
        /**
         * 会议：咨询方咨询通话时可用
         */
        this.conferenceEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.CONSULTED);
        }, this);
        
        /**
         * 转移：咨询通话时可用
         */
        this.transferEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.CONSULTED);
        }, this);
        
        /**
         * 单步转移：双方通话时可用
         */
        this.singleTransferEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.CONNECTED || this.currentState() == constant.states.CRYPTOLALIA);
        }, this);
        
        /**
         * 单步转移：双方通话时可用
         */
        this.singleConferenceEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.CONNECTED || this.currentState() == constant.states.CRYPTOLALIA);
        }, this);
        
        /**
         * 监听：班长坐席置忙时可用
         */
        this.observeEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.agentRole() == 2 && this.currentState() == constant.states.BUSY);
            //return !this.doingState() && (this.currentState() == constant.states.BUSY);
            // return true;
        }, this);
        
        /**
         * 强插：班长坐席监听中可用
         */
        this.insertEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.agentRole() == 2 && (this.currentState() == constant.states.OBSERVED || this.currentState() == constant.states.LAUNCH_CRYPTOLALIA));
        }, this);
        
        /**
         * 强拆：班长坐席监听中可用
         */
        this.forceAbortEnabled = ko.pureComputed(function () {
            return !this.doingState() &&
                (this.agentRole() == 2 && (this.currentState() == constant.states.OBSERVED || this.currentState() == constant.states.LAUNCH_CRYPTOLALIA));
        }, this);
        
        /**
         * 开启密语：班长坐席监听中可用
         */
        this.startCryptolaliaEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.agentRole() == 2 && this.currentState() == constant.states.OBSERVED);
        }, this);
        
        /**
         * 关闭密语：班长坐席在密语中可以使用
         */
        this.stopCryptolaliaEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.agentRole() == 2 && this.currentState() == constant.states.LAUNCH_CRYPTOLALIA);
        }, this);
        
        
        /**
         * 全拆：班长坐席会议中可用
         */
        this.fullAbortEnabled = ko.pureComputed(function () {
            return this.currentState() == constant.states.OBSERVED;
            //return !this.doingState() && (this.agentRole() == 2 && this.currentState() == constant.states.CONFERENCED);
        }, this);
        
        /**
         * IVR协助服务：双方通话时可用
         */
        this.assistIVREnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.CONNECTED || this.currentState() == constant.states.CRYPTOLALIA);
        }, this);
        
        /**
         * 转IVR：双方通话时可用
         */
        this.routerToIVREnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState() == constant.states.CONNECTED || this.currentState() == constant.states.CRYPTOLALIA);
        }, this);
        
        /**
         * 设置随路数据：目前一直可用
         */
        this.setCallDataEnabled = ko.pureComputed(function () {
            return true;
        }, this);
        
        /**
         * 获取随路数据：目前一直可用
         */
        this.getCallDataEnabled = ko.pureComputed(function () {
            return true;
        }, this);
        
        /**
         * 在密语的时候：高级话路按钮禁用
         */
        this.highLevelCallDisabled = ko.pureComputed(function () {
            return this.currentState() == constant.states.CRYPTOLALIA;
        }, this);
        
        /**
         * 四方会议：会议时可用
         */
        this.joinConferenceEnabled = ko.pureComputed(function () {
            return !this.doingState() && (this.currentState().key == constant.states.CONFERENCED.key) && WebAgent.isUseMpConference;
        }, this);
        
        this.joinConferenceDisabled = ko.pureComputed(function () {
            return !this.doingState() && (this.meetingNum() == this.maxMeetingNum);
        }, this);
        
        // 是否静音
        this.isMute = ko.observable(false);
        
        this.CR = ko.observable();
        
        /**
         * 是否展示开启静音的图标
         */
        this.setMuteEnabled = ko.pureComputed(function () {
            return !this.doingState()
                && this.CR()
                && !this.isMute()
                && (
                    this.currentState() != constant.states.READY &&
                    this.currentState() != constant.states.WORKING &&
                    this.currentState() != constant.states.BUSY &&
                    this.currentState() != constant.states.AWAY &&
                    this.currentState() != constant.states.ACW &&
                    this.currentState() != constant.states.INTERNAL_CONNECTED &&
                    this.currentState() != constant.states.INTERNAL_ALERTING
                );
        }, this);
        
        /**
         * 是否展示关闭静音的图标
         */
        this.stopMuteEnabled = ko.pureComputed(function () {
            return !this.doingState()
                && this.CR()
                && this.isMute()
                && (
                    this.currentState() != constant.states.READY &&
                    this.currentState() != constant.states.WORKING &&
                    this.currentState() != constant.states.BUSY &&
                    this.currentState() != constant.states.AWAY &&
                    this.currentState() != constant.states.ACW
                );
        }, this);
        
        //隐藏显示可选外显号
        this.toggleNumBox = function () {
            if (self.outCallType() == 'intelSelect') {
                return;
            }
            self.isShowNumbox(!self.isShowNumbox());
        };
        //查询外显号码
        this.searchNum = function () {
            var outNumber;
            var search = "" + self.searchNumData();
            if (search.length > 1) {
                outNumber = this.outNumbersTmp().filter(function (p1) {
                    return p1.number.includes(search);
                });
                this.outNumbers(outNumber.slice());
            } else {
                this.outNumbers(this.outNumbersTmp().slice());
            }
        };
        
        this.chooseDisnum = function () {
            self.disNumber(self.disNumberWa());
        };
        
        //选择外显号码
        this.chooseOutNum = function (data) {
            self.disNumber(data.number + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.area);
            self.disNumberWa(data.number + data.area);
            self.isShowNumbox(false);
        };
        
        /**
         * 登录
         * @returns {boolean}
         */
        this.login = function () {
            var result = getExtendModule().login({
                entId: self.entId(),
                agentId: self.agentId(),
                agentNumber: self.agentNumber(),
                agentPassword: self.agentPassword(),
                isForce: self.forceLogin()
            });
            
            if (result.code == 0) {
                Log.log("[webAgent-wa] 登录命令发送成功" + (self.forceLogin() ? "(强制登录)" : ""));
            } else {
                Log.warn("[webAgent-wa]:" + result.msg);
                self.loginMessage(result.msg);
            }
            
            return false;
        };
        
        /**
         * 登出
         */
        this.logout = function () {
            var result = getExtendModule().logout();
            
            if (result.code == 0) {
                Log.log("[webAgent-wa] 登出命令发送成功");
            } else {
                Log.warn("[webAgent-wa]:" + result.msg);
            }
        };
        
        /**
         * 置忙
         */
        this.setBusy = function () {
            var result = getExtendModule().setBusy();
            
            if (result.code == 0) {
                Log.log("[webAgent-wa] 置忙命令发送成功");
            } else {
                Log.warn("[webAgent-wa]:" + result.msg);
            }
        };
        
        /**
         * 小休
         */
        this.setAway = function () {
            if (!self.awayEnabled()) {
                Log.warn("[webAgent-wa] away denied");
                return;
            }
            
            self.awayStatu("");
            dialog.show();
            
            dialog.buildDialog("请选择小休状态：", "away", function () {
                var result = getExtendModule().setAway(self.awayStatu());
                
                if (result.code === 0) {
                    Log.log("[webAgent-wa] 小休命令发送成功");
                } else {
                    Log.warn("[webAgent-wa]:" + result.msg);
                    tip(result.msg);
                }
            });
        };
        
        /**
         * 置闲
         */
        this.setReady = function () {
            var result = getExtendModule().setReady();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 置闲命令发送成功");
            } else {
                Log.warn("[webAgent-wa]" + result.msg);
            }
        };
        
        /**
         * 外呼
         */
        this.makeCall = function () {
            
            var disNumbers = self.disNumber();
            //过滤空格
            
            if (self.callNumber()) {
                var callNumber = self.callNumber().replace(/\s/g, '');
                self.callNumber(callNumber);
            }
           var result = getExtendModule().makeCall({
                outCallNumber: self.callNumber(),
                disNumber: disNumbers.match(/\d+/)[0],
                isIntellectCall: !(self.outCallType() == 'manualSelect'),
                mediaType: WebAgent.mediaType,
            });
            
            result.then(function(res){
                Log.log("[webAgent-wa] 外呼命令发送成功");
            },function(res){
                Log.warn("[webAgent-wa]" + res.msg);
                tip(res.msg);
            })
        };
        
        /**
         * 内呼
         */
        this.makeCallInternal = function () {
            var result = getExtendModule().makeCallInternal({
                inCallNumber: self.callNumber()
            });
            
            if (result.code === 0) {
                Log.log("[webAgent-wa]内呼命令发送成功");
                self.currentState(constant.states.CONNECTING);
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
                result.code == -2 && tip(result.msg);
            }
        };
        
        /**
         * 挂断
         */
        this.hangup = function () {
            var result = getExtendModule().hangup();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 挂断命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 重置
         */
        this.reset = function () {
            var result = getExtendModule().reset();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa]重置命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 保持
         */
        this.hold = function () {
            if (self.highLevelCallDisabled()) {
                Log.warn("[webAgent-wa] hold denied");
                return;
            }
            var result = getExtendModule().hold();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa]保持命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 保持接回
         */
        this.holdReturn = function () {
            var result = getExtendModule().holdReturn();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa]保持接回命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 获取坐席列表
         */
        this.agentGetList = function (workType) {
            var result = getExtendModule().agentGetList(workType);
            
            if (result.code === 0) {
                Log.log("[webAgent-wa]获取坐席列表命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 选择坐席
         * @param data
         */
        this.selectAgent = function (data) {
            self.dialogObj().toAgent(data.agentId);
        };
        
        /**
         * 选择技能组
         * @param data
         */
        this.selectSkill = function (data) {
            self.dialogObj().toAgent(data.skillName);
        };
        
        /**
         * 切换咨询、单步转移内线
         * @returns {boolean}
         */
        this.toggleInside = function () {
            self.agentGetList('1');
            self.dialogObj().toAgent('');
            return true;
        };
        
        /**
         * 切换咨询、单步转移外线
         * @returns {boolean}
         */
        this.toggleOutside = function () {
            self.dialogObj().toAgent('');
            return true;
        };
        
        /**
         * 咨询
         */
        this.consult = function () {
            //不允许操作时直接return，不弹dialog
            if (!self.consultEnabled() || self.highLevelCallDisabled()) {
                Log.warn("[webAgent-wa] consult denied");
                return;
            }
            
            self.dialogObj({
                title: "咨询坐席",
                isChecked: ko.observable("1"),
                inputTitle: "请输入要咨询的号码",
                insideContent: "内线",
                outsideContent: "外线",
                skillGroupContent: "技能组",
                workingContent: "内部求助",
                toAgent: ko.observable(""),
                handleName: "consult"
            });
            
            self.agentGetList('1'); //咨询时，默认咨询内线，获取坐席列表
            dialog.show();
            
            dialog.buildDialog("咨询坐席：", "consult", function () {
                var result = getExtendModule().consult({
                    consultAgent: self.dialogObj().toAgent(),
                    type: self.dialogObj().isChecked()
                });
                if (result.code === 0) {
                    dialog.hide();
                    Log.log("[webAgent-wa] 咨询命令发送成功");
                } else {
                    Log.warn("[webAgent-wa] " + result.msg);
                    tip(result.msg);
                }
            });
        };
        
        /**
         * 咨询接回
         */
        this.consultReturn = function () {
            var result = getExtendModule().consultReturn();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 咨询接回命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 转移
         * 转移成功后，原坐席将收到挂断，变为事后整理；目标坐席将收到转移事件，变为双方通话
         */
        this.transfer = function () {
            var result = getExtendModule().transfer();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 转移命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 单步转移(不经过咨询直接转移)
         */
        this.singleTransfer = function () {
            //不允许操作时直接return，不弹dialog
            if (!self.singleTransferEnabled() || self.highLevelCallDisabled()) {
                Log.warn("[webAgent-wa] single transfer denied");
                return;
            }
            
            self.dialogObj({
                title: "单步转移坐席",
                isChecked: ko.observable("1"),
                inputTitle: "请输入要转移的号码",
                insideContent: "内线",
                outsideContent: "外线",
                skillGroupContent: "技能组",
                toAgent: ko.observable(""),
                handleName: "singleTransfer"
            });
            
            self.agentGetList('1'); //单步转移时，默认单转内线，获取坐席列表
            dialog.show();
            
            dialog.buildDialog("单步转移坐席：", "singleTransfer", function () {
                
                var result = getExtendModule().singleTransfer({
                    transferTo: self.dialogObj().toAgent(),
                    type: self.dialogObj().isChecked()
                });
                
                if (result.code === 0) {
                    dialog.hide();
                    Log.log("[webAgent-wa] 单步转移命令发送成功");
                } else {
                    Log.warn("[webAgent-wa] " + result.msg);
                    tip(result.msg);
                }
            });
        };
        
        
        /**
         * 单步会议(不经过咨询直接转移)
         */
        this.singleConference = function () {
            //不允许操作时直接return，不弹dialog
            if (!self.singleConferenceEnabled() || self.highLevelCallDisabled()) {
                Log.warn("[webAgent-wa] single conference denied");
                return;
            }
            
            self.dialogObj({
                title: "单步会议",
                isChecked: ko.observable("1"),
                inputTitle: "请输入加入会议的号码",
                insideContent: "坐席",
                outsideContent: "号码",
                skillGroupContent: "技能组",
                workingContent: "内部求助",
                toAgent: ko.observable(""),
                handleName: "singleConference"
            });
            
            self.agentGetList('1'); //单步转移时，默认单转内线，获取坐席列表
            dialog.show();
            
            dialog.buildDialog("单步会议：", "singleConference", function () {
                
                var result = getExtendModule().singleConference({
                    transferTo: self.dialogObj().toAgent(),
                    type: self.dialogObj().isChecked()
                });
                
                if (result.code === 0) {
                    dialog.hide();
                    Log.log("[webAgent-wa] 单步会议命令发送成功");
                } else {
                    Log.warn("[webAgent-wa] " + result.msg);
                    tip(result.msg);
                }
            });
        };
        
        
        /**
         * 监听 / 拦截
         */
        this.observe = function (workType) {
            
            if (!self.observeEnabled()) {
                Log.warn("[webAgent-wa] observe denied");
                return;
            }
            
            self.dialogObj({
                title: ko.observable("监听坐席"),
                inputTitle: "请输入要监听的坐席号码:",
                observe: "监听",
                intercept: "拦截",
                toAgent: ko.observable("1"),
                handleName: "observe",
                isChecked: ko.observable("1")
            });
            
            self.agentGetList(workType);
            dialog.show();
            
            dialog.buildDialog("监听坐席：", "observe", function () {
                let isChecked = self.dialogObj().isChecked();
                if (isChecked == 1) {
                    // 监听
                    var result = getExtendModule().observe({
                        observeAgentId: self.dialogObj().toAgent()
                    });
                } else if (isChecked == 0) {
                    // 拦截
                    var result = getExtendModule().intercept({
                        observeAgentId: self.dialogObj().toAgent()
                    });
                }
                
                if (result.code === 0) {
                    dialog.hide();
                    Log.log("[webAgent-wa] 监听命令发送成功");
                } else {
                    Log.warn("[webAgent-wa] " + result.msg);
                    tip(result.msg);
                }
            });
        };
        
        /**
         * 强插
         */
        this.forceInsert = function () {
            var result = getExtendModule().forceInsert();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa]强插命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 强拆
         */
        this.forceAbort = function () {
            var result = getExtendModule().forceAbort();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 强拆命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 全拆
         */
        this.fullAbort = function () {
            var result = getExtendModule().fullAbort();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 全拆命令发送成功");
            } else {
                Log.warn("[webAgent-wa] ", result.msg);
            }
        };
        
        /**
         * 会议
         */
        this.conference = function () {
            var result = getExtendModule().conference();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 会议命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        //选择IVR节点
        this.selectIvrNode = function (data) {
            self.ivrDialogObj().toIvrNode(data);
        };
        
        /**
         * IVR协助
         */
        this.assistIVR = function () {
            //不允许操作时直接return，不弹dialog
            if (!self.assistIVREnabled() || self.highLevelCallDisabled()) {
                Log.warn("[webAgent-wa] assist IVR denied");
                return;
            }
            
            self.ivrNodeList(self.ivrAssists());
            self.ivrObjExit(false);
            self.ivrDialogObj({
                title: "IVR节点",
                toIvrNode: ko.observable(""),
                handleName: "assistIVR"
            });
            
            dialog.show();
            
            dialog.buildDialog("IVR节点：", "assistIVR", function () {
                if (self.dialogBtnDisabled()) {
                    return;
                } else {
                    self.ivrObjExit(true);
                    self.checkIvrCardIdType(0);
                    //ivr验密--输入卡号
                    dialog.buildDialog("IVR节点：", "assistIVR", self.ivrAssistsExt);
                }
            });
        };
        
        //ivr验密--直接协助
        this.ivrAssistsDirectHelp = function () {
            self.checkIvrCardIdType(1);
            self.ivrAssistsCardId("");
            this.ivrAssistsExt();
        };
        
        //调IVR协助接口
        this.ivrAssistsExt = function () {
            if (!self.checkIvrCardIdType() && self.ivrCardBtnDisabled()) {
                return;
            }
            
            var result = getExtendModule().assistIVR({
                key: "ivrAssist",
                value: self.ivrDialogObj().toIvrNode().key,
                type: self.checkIvrCardIdType(),
                cardId: self.ivrAssistsCardId()
            });
            
            if (result.code === 0) {
                dialog.choiceDilogHide();
                dialog.ivrConfirmDialogShow();
                self.ivrObjExit(false);
                self.ivrConfirmDialogResult("load");
                Log.log("[webAgent-wa] IVR协助服务命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * IVR回转
         */
        this.routerToIVR = function () {
            //不允许操作时直接return，不弹dialog
            if (!self.routerToIVREnabled() || self.highLevelCallDisabled()) {
                Log.warn("[webAgent-wa] router to IVR denied");
                return;
            }
            
            self.ivrNodeList(self.ivrRouters());
            self.ivrDialogObj({
                title: "IVR节点",
                toIvrNode: ko.observable(""),
                handleName: "routerToIVR"
            });
            
            dialog.show();
            
            dialog.buildDialog("IVR节点：", "routerToIVR", function () {
                
                if (self.dialogBtnDisabled()) {
                    return;
                }
                
                var param = "ivrRouter=" + self.ivrDialogObj().toIvrNode().key; //拼接参数
                
                var result = getExtendModule().routerToIVR(param);
                
                if (result.code === 0) {
                    dialog.hide();
                    Log.log("[webAgent-wa] 转IVR命令发送成功");
                } else {
                    Log.warn("[webAgent-wa] " + result.msg);
                }
            });
        };
        
        //接听按钮点击一次就置灰
        this.hasAnswerBtnClicked = ko.observable(false);
        // 接听按钮可以点击：外呼坐席振铃，被咨询坐席振铃，单步转移振铃, 被内呼振铃，监听振铃, 转移振铃, 发起方内呼振铃,单步会议,四方会议
        this.answered = ko.pureComputed(function () {
            return !this.doingState() &&
                (
                    this.currentState() == constant.states.AGENT_ALERTING ||
                    this.currentState() == constant.states.CONSULT_B_ALERTING ||
                    this.currentState() == constant.states.TRANSFER_ALERTING ||
                    this.currentState() == constant.states.OBSERVE_ALERTING ||
                    this.currentState() == constant.states.TRANSFER_ALERTING ||
                    this.currentState() == constant.states.INTERNAL_ALERTING ||
                    this.currentState() == constant.states.MP_CONFERENCE_ALERTING_OP ||
                    this.currentState() == constant.states.MP_CONFERENCE_ALERTING_TP ||
                    this.currentState() == constant.states.SINGLE_STEP_CONFERENCE_ALERTING
                )
                && !this.hasAnswerBtnClicked();
        }, this);
        
        // 设置自动应答
        this.autoAnswer = ko.observable(false);
        this.callInTip = ko.observable("网路语音电话");
        this.setAutoAnswer = function () {
            console.log('设置自动应答：' + this.autoAnswer());
            CR.setAutoAnswer(this.autoAnswer());
        };
        
        this.answerVerto = function () {
            //WebAgent.sipUseWebRTC=true;
            if (this.hasAnswerBtnClicked()) {
                return;
            }
            var res = CR.answer();
            if (res.code === 0) {
                this.hasAnswerBtnClicked(true);
            }
        };
        
        this.hangupVerto = function () {
            if (!self.hangupEnabled()) {
                console.log('hangup denied');
            }
            CR.hangup();
        };
        
        /**
         * 设置电话图标的颜色
         */
        this.colors = ko.computed(function () {
            if (!self.colorObj()) {
                return [defaults.iconColor];
            }
            switch ( self.currentState() && self.currentState().key ) {
                case "INIT" :
                    return self.colorObj().init || [defaults.iconColor];
                case "READY" :
                    return self.colorObj().ready || [defaults.iconColor];
                case "AGENT_ALERTING" :
                case "CUSTOM_ALERTING" :
                case "INTERNAL_ALERTING" :
                case "CONSULT_ALERTING" :
                case "CONSULT_B_ALERTING" :
                case "TRANSFER_ALERTING" :
                case "OBSERVE_ALERTING" :
                    return self.colorObj().altering || [defaults.iconColor];
                case "CONNECTED" :
                case "INTERNAL_CONNECTED":
                case "CONSULTED":
                case "CONSULTED_B":
                case "CONFERENCED":
                    return self.colorObj().connected || [defaults.iconColor];
                default :
                    return self.colorObj().others || [defaults.iconColor];
            }
        }, this);
        
        this.searchNumData = ko.observable();
        
        /**
         * 当前会议的人数
         */
        this.meetingNum = ko.observable(0);
        
        /**
         * 这个版本的多人会议的最大人数，统一管理，方便修改
         */
        this.maxMeetingNum = ko.observable(4);
        
        /**
         * 创建多人会议
         * 多人会议：参会人数大于普通会议的人数
         */
        this.joinConference = function () {
            //不允许操作时直接return，不弹dialog
            if (!self.joinConferenceEnabled()) {
                Log.warn("[webAgent-wa] Join Conference denied");
                return;
            }
            
            self.dialogObj({
                title: "加入会议的坐席",
                isChecked: ko.observable("1"),
                inputTitle: "请输入要加入会议的号码",
                insideContent: "内线",
                outsideContent: "外线",
                skillGroupContent: "技能组",
                toAgent: ko.observable(""),
                handleName: "joinConference"
            });
            
            self.agentGetList('1');
            dialog.show();
            
            dialog.buildDialog("加入会议：", "joinConference", function () {
                var result = getExtendModule().joinConference({
                    consultAgent: self.dialogObj().toAgent(),
                    type: self.dialogObj().isChecked()
                });
                if (result.code === 0) {
                    dialog.hide();
                    Log.log("[webAgent-wa] 加入会议命令发送成功");
                } else {
                    Log.warn("[webAgent-wa] " + result.msg);
                    tip(result.msg);
                }
            });
        };
        this.toggleDialogTitle = function () {
            self.dialogObj().title(self.dialogObj().isChecked() == 1 ? '监听坐席' : '拦截坐席');
            return true;
        };
        /**
         * 开启密语
         */
        this.startCryptolalia = function () {
            if (!self.startCryptolaliaEnabled()) {
                Log.warn("[webAgent-wa] start cryptolalia denied");
                return;
            }
            var result = getExtendModule().startCrypto();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 开启密语命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        /**
         * 关闭密语
         */
        this.stopCryptolalia = function () {
            if (!self.stopCryptolaliaEnabled()) {
                Log.warn("[webAgent-wa] stop cryptolalia denied");
                return;
            }
            var result = getExtendModule().stopCrypto();
            
            if (result.code === 0) {
                Log.log("[webAgent-wa] 开启密语命令发送成功");
            } else {
                Log.warn("[webAgent-wa] " + result.msg);
            }
        };
        
        // 是否获取工作状态的坐席
        this.isGetWorkingAgent = ko.observable(false);
        
        // 工作坐席列表
        this.workingAgentList = ko.observableArray([]);
        
        /**
         * 咨询切换radio为工作状态
         */
        this.toggleWorking = function () {
            self.isGetWorkingAgent(true);
            self.agentGetList('5');
            self.dialogObj().toAgent('');
            return true;
        };
        
        /**
         * 设置静音/关闭静音
         * @param isSetMute 1 开启静音 / 2 关闭静音
         */
        this.setMute = function (isSetMute) {
            let setMuteEnabled = isSetMute ? self.setMuteEnabled() : self.stopMuteEnabled();
            if (!setMuteEnabled) {
                Log.warn("[webAgent-wa] set mute denied");
                return;
            }
            self.isMute(!self.isMute());
            if (!self.isMute()) {
                $(".video-btn > li").eq(0).html('<div class="icon-btn iconfont">&#xe61a</div><p>静音</p>');
                $(".video-btn li:eq(0)").removeClass("hold-disabled");
            } else {
                $(".video-btn > li").eq(0).html('<div class="icon-btn iconfont">&#xe665</div><p>取消静音</p>');
                $(".video-btn li:eq(0)").addClass("hold-disabled");
            }
            window.CR.setMute();
        };
        
        /**
         * 转中心
         */
        this.changeCentre = function () {
            //不允许操作时直接return，不弹dialog
            if (!self.routerToIVREnabled() || self.highLevelCallDisabled()) {
                Log.warn("[webAgent-wa] change centre denied");
                return;
            }
            
            self.centreDialogObj({
                title: "请输入提供给其他中心坐席的留言",
                text: ko.observable(""),
                handleName: "changeCentre"
            });
            
            dialog.show();
            
            dialog.buildDialog("转中心：", "changeCentre", function () {
                let number = self.callNumber().split(':');
                $.ajax({
                    url: WebAgent.changeCentreUrl + "/adapter/number/setCallData",
                    type: "post",
                    data: {
                        number: number.length === 1 ? number[0] : number[1],
                        callData: self.centreDialogObj().text(),
                    },
                    traditional: true,
                    global: false,
                    dataType: "json",
                    success: function (res) {
                        if (res.result == "00000") {
                            callback();
                        }
                    }
                });
                
                function callback() {
                    var param = "kzhzj";
                    var result = getExtendModule().routerToIVR(param);
                    if (result.code === 0) {
                        dialog.hide();
                        Log.log("[webAgent-wa] 转中心命令发送成功");
                    } else {
                        Log.warn("[webAgent-wa] " + result.msg);
                    }
                }
            });
        };
    };
});
