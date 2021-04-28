/**
 * CCOD 多渠道集成
 * 1.状态控制
 * 2.回调方法
 * @constructor
 * @author:zhouzy@channelsoft.com
 * @date:2016/03/16
 */
define(["Q", "require", "TLog"], function(Q, require, Log) {
    //var isWAStateLocking = 0;//软电话是否锁定（通话时） 1:不可以置闲置忙 0:可以置闲置忙
    //var WAState = 'BUSY';
    //
    //var isChatStateLocking = 0;//WebChat 是否锁定(通话、视频) 1:不可以置闲置忙 0:可以置闲置忙
    //var ChatState = 'BUSY';
    var isWAStateLocking;//软电话是否锁定（通话时） 1:不可以置闲置忙 0:可以置闲置忙
    var WAState;

    var isChatStateLocking;//WebChat 是否锁定(通话、视频) 1:不可以置闲置忙 0:可以置闲置忙
    var ChatState;

    var CCODMultiChannel = function(){
        this._WA = null;
        this._phoneStateBusyPromise = null;
        this._phoneStateReadyPromise = null;
        this._phoneStateAwayPromise = null;
        this._phoneStateWorkingPromise = null;
        this._chatStateBusyPromise = null;
        this._chatStateReadyPromise = null;
        this._setChatStateReadyProcess = null;

        this._agentReadyS = null; //坐席置闲成功回调函数
        this._agentReadyF = null; //坐席置闲失败回调函数

        this._agentBusyS = null; //坐席置忙成功回调函数
        this._agentBusyF = null; //坐席置忙失败回调函数

        this._agentAwayS = null; //坐席小休成功回调函数
        this._agentAwayF = null; //坐席小休失败回调函数
    
        this._agentWorkingS = null; //坐席工作状态成功回调函数
        this._agentWorkingF = null; //坐席工作状态失败回调函数

        this.chatLogin = false; //IM是否登录
    };

    /**
     * @param WA:
     * @param locking:状态改变回调函数
     * @param unLocking:状态改变回调函数
     * @param awayReasonList:小休待选项
     */
    CCODMultiChannel.prototype.init = function(WA,locking,unLocking,awayReasonList){
         isWAStateLocking = 0;//软电话是否锁定（通话时） 1:不可以置闲置忙 0:可以置闲置忙
         //WAState = 'BUSY';
        WAState = '';

         isChatStateLocking = 0;//WebChat 是否锁定(通话、视频) 1:不可以置闲置忙 0:可以置闲置忙
         //ChatState = 'BUSY';
         ChatState = '';

        var self = this;
        this._WA = WA;
        this._locking = locking ? locking : this._locking;
        this._unLocking = unLocking ? unLocking:this._unLocking;
        this._setAwayList(awayReasonList);

        //软电话挂事件钩子 data={type:'',ext:eventData}
        function phoneStateHook(data) {
            self._phoneStateHook(data);
        };

        WA.removeEventHandler(phoneStateHook);
        WA.registerEventHandler(phoneStateHook);
        //WA.registerEventHandler(function(data){
        //    self._phoneStateHook(data);
        //});


        //软电话自定义结果处理事件
        //WA.registerResultHandler(function(data) {
        //    if(data.type == "autoLogin" && data.code == 0) {
        //        require("MultiChannelLoginOut").multiChannelLogin({
        //            entId: data.ext.entId,
        //            agentId: data.ext.agentId,
        //            agentPassword: data.ext.agentPassword,
        //            agentNumber: data.ext && data.ext.agentNumber || "",
        //            isForce: true,
        //            waAutoLoginResult: true,
        //            waAutoLoginData: data
        //        });
        //
        //        console.log("[WebAgent]自动登录成功:" + data);
        //    }
        //});

        //IM挂事件钩子
        self._IMStateHook();
        //this._setChatBusy();
    };

    /**
     * 坐席置闲多渠道能力
     * 提供给业务层，表示坐席准备处理来自多渠道的消息
     * 手动置闲，2s无电话进入再将chat置闲
     * s:置闲成功回调
     * f:置闲异常回调
     */
    CCODMultiChannel.prototype.agentReady = function(s,f){
        var self = this;

        if(!self._agentReadyS) {
            self._agentReadyS = s;
        }

        if(!self._agentReadyF) {
            self._agentReadyF = f;
        }

        if(!window.vm.setReadyEnabled()){
            self._agentReadyF && self._agentReadyF();
            return;
        }

        if(!isWAStateLocking){
            //self._setChatStateReadyProcess = function(){
            //    var task = function(){
            //        self._setChatReady();
            //        self._setChatStateReadyProcess = null;
            //    };
            //    var _timer = null;
            //    return {
            //        start:function(){
            //            _timer || (_timer = window.setTimeout(task,2*1000));
            //        },
            //        pend:function(){
            //            if(_timer){
            //                window.clearTimeout(_timer);
            //                _timer = null;
            //            }
            //        }
            //    };
            //}();
            self._setPhoneReady().then(function(){
                if(WebAgent.licenseCustomer == "1"){
                    Log.log('[WebAgent] 多渠道座席端置闲成功');
                    //self._chatStateReadyPromise && self._chatStateReadyPromise.resolve();
                    ChatState = "READY";
                    isChatStateLocking = 0;
                    self._isLocking();
                }else {
                    self._setChatReady().then(function(){
                     //s && s.call();
                     //console.log('[WebAgent] 多渠道座席端置闲成功');
                     });
                    //self._setChatStateReadyProcess.start();
                    //s && s.call(); */
                }
            },f);
        }
    };

    /**
     * 坐席置忙多渠道能力
     * 提供给业务层，表示坐席不准备处理多渠道消息
     * 当软电话或者chat锁定时，不能置闲置忙
     * s:置忙成功回调
     * f:置忙异常回调
     */
    CCODMultiChannel.prototype.agentBusy = function(s,f){
        var self = this;

        if(!self._agentBusyS) {
            self._agentBusyS = s;
        }

        if(!self._agentBusyF) {
            self._agentBusyF = f;
        }

        if(!isWAStateLocking){
            //置忙时,清除掉10s等待置闲WebChat的计时器
            //self._chatTimer && clearTimeout(self._chatTimer);
            //self._setChatStateReadyProcess && self._setChatStateReadyProcess.pend();
            self._setPhoneBusy().then(function(){
                if(WebAgent.licenseCustomer == "1"){
                    Log.log('[WebAgent] 多渠道置忙成功');
                    //self._chatStateBusyPromise && self._chatStateBusyPromise.resolve();
                    ChatState = "BUSY";
                    isChatStateLocking = 0;
                    self._isLocking();
                }else {
                     self._setChatBusy().then(function(){
                     //s && s.call();
                     //console.log('[WebAgent] 多渠道座席端置忙成功');
                     });
                }
            }, f);
        }
    };

    /**
     * 坐席设置小休多渠道能力
     * 提供给业务层，表示坐席不准备处理多渠道消息
     * 此时软电话设置为小休状态，IM设置为置忙状态
     * s:置忙成功回调
     * f:置忙异常回调
     */
    CCODMultiChannel.prototype.agentAway = function (s,f,status) {
        var self = this;

        if(!self._agentAwayS) {
            self._agentAwayS = s;
        }

        if(!self._agentAwayF) {
            self._agentAwayF = f;
        }

        if(!isWAStateLocking){
           /* new Promise(self._setPhoneAway(status)).then(function () {
                self._setChatBusy();
            }).catch(function (re) {
                console.log("小休失败");
                self._agentAwayF(re);
            });*/

            self._setPhoneAway(status)
                .then(function () {
                    if(WebAgent.licenseCustomer == "1") {
                        Log.log('[WebAgent] 多渠道置忙成功');
                        ChatState = "BUSY";
                        isChatStateLocking = 0;
                        self._isLocking();
                    }else {
                        self._setChatBusy()
                    }
                })
                .catch(function (re) {
                    Log.log("[WebAgent] 小休失败");
                    self._agentAwayF(re);
                })
        }

    };
    
    /**
     * 坐席工作状态多渠道能力
     * 提供给业务层，表示坐席不准备处理多渠道消息
     * 此时软电话设置为小休状态，IM设置为置忙状态
     * s:置忙成功回调
     * f:置忙异常回调
     */
    CCODMultiChannel.prototype.agentWorking = function(s,f){
        var self = this;
        
        if(!self._agentWorkingS) {
            self._agentWorkingS = s;
        }
        
        if(!self._agentWorkingF) {
            self._agentWorkingF = f;
        }
        
        if(!isWAStateLocking){
            //置忙时,清除掉10s等待置闲WebChat的计时器
            //self._chatTimer && clearTimeout(self._chatTimer);
            //self._setChatStateReadyProcess && self._setChatStateReadyProcess.pend();
            self._setPhoneWorking().then(function(){
                if(WebAgent.licenseCustomer == "1"){
                    Log.log('[WebAgent] 多渠道工作状态成功');
                    //self._chatStateBusyPromise && self._chatStateBusyPromise.resolve();
                    ChatState = "READY";
                    isChatStateLocking = 0;
                    self._isLocking();
                }else{
                    self._setChatReady()
                }
            }).catch(function (re) {
                Log.log("[WebAgent] 多渠道工作状态失败");
                self._agentWorkingF(re);
            })
        }
    };

    /**
     * 软电话置忙
     * 当可以置忙时，返回置忙的Promise
     * @private
     */
    CCODMultiChannel.prototype._setPhoneBusy = function(){
        Log.log('[WebAgent] 多渠道置忙软电话');
        var self = this;
        var re = this._WA.extend.setBusy();
        WAState = '';
        if(re.code != 0){
            //如果置忙失败(多是由于已经置忙)，该Promise不会被resolve(不会拿到置忙成功事件),所以需要在此手动resolve
            window.setTimeout(function(){
                self._phoneStateBusyPromise && self._phoneStateBusyPromise.resolve();
            },0);
        }
        this._phoneStateBusyPromise = Q.defer();
        return this._phoneStateBusyPromise.promise;
    };
    
    CCODMultiChannel.prototype._setPhoneWorking = function(){
        Log.log('[WebAgent] 多渠道工作状态软电话');
        var self = this;
        var re = this._WA.extend.setWorking();
        // WAState = '';
        if(re.code != 0){
            //如果置忙失败(多是由于已经置忙)，该Promise不会被resolve(不会拿到置忙成功事件),所以需要在此手动resolve
            window.setTimeout(function(){
                self._phoneStateWorkingPromise && self._phoneStateWorkingPromise.resolve();
            },0);
        }
        this._phoneStateWorkingPromise = Q.defer();
        return this._phoneStateWorkingPromise.promise;
    };

    /**
     * 软电话小休
     * 当可以小休时，返回小休的Promise
     * @private
     */
    CCODMultiChannel.prototype._setPhoneAway = function(status){
        Log.log('[WebAgent] 多渠道小休软电话');
        var re = this._WA.extend.setAway(status);
        var self=this;
        //WAState = '';
        this._phoneStateAwayPromise = Q.defer();
        if(re.code != 0){
            window.setTimeout(function(){
                self._phoneStateAwayPromise && self._phoneStateAwayPromise.reject(new Error(JSON.stringify(re)));
            },0);
        }

        return this._phoneStateAwayPromise.promise;
    };

    /**
     * 软电话置闲
     * @private
     */
    CCODMultiChannel.prototype._setPhoneReady = function(){
        Log.log('[WebAgent] 多渠道置闲软电话');
        var self = this;
        WAState = '';
        var re = this._WA.extend.setReady();
        if(re.code != 0){
            //如果置闲失败(多是由于已经置闲)，该Promise不会被resolve(不会拿到置闲成功事件),所以需要在此手动resolve
            window.setTimeout(function(){
                self._phoneStateReadyPromise && self._phoneStateReadyPromise.resolve();
            },0);
            //this._phoneStateReadyPromise = Q.fcall();
            //return this._phoneStateReadyPromise;
        }
        this._phoneStateReadyPromise = Q.defer();
        return this._phoneStateReadyPromise.promise;
    };

    /**
     * 监听软电话底层事件钩子
     * @private
     */
    CCODMultiChannel.prototype._phoneStateHook = function(d){
        var self = this;
        var eventType = d.type;
        if(eventType === events.EVENT_AGENT_LOGIN){
            self._setAwayList(d.ext.awayStatusList);
        }
        //入呼叫，坐席振铃
        //if(eventType === events.EVENT_INBOUND_ALERTING){
        //    //判断是否chat是否将要置闲，如果是，取消置闲
        //    //this._chatTimer && window.clearTimeout(this._chatTimer);
        //    self._setChatStateReadyProcess && self._setChatStateReadyProcess.pend();
        //    //来电，置忙chat
        //    this._setChatBusy();
        //}

        if(eventType === events.EVENT_INBOUND_ALERTING ||
            eventType === events.EVENT_CONSULT_ALERTING_TP ||
            eventType === events.EVENT_INTERNAL_ALERTING_OP ||
            eventType === events.EVENT_SINGLE_STEP_TRANSFER_ALERTING_TP){
            //判断是否chat是否将要置闲，如果是，取消置闲
            //this._chatTimer && window.clearTimeout(this._chatTimer);
            //self._setChatStateReadyProcess && self._setChatStateReadyProcess.pend();
            //来电，置忙chat
            if(WebAgent.licenseCustomer != "1"){
                this._setChatBusy();
            }
        }

        if(eventType === events.EVENT_AGENT_NOTREADY){
            Log.log('[WebAgent] 多渠道软电话置忙成功');
            if(this._phoneStateBusyPromise){
                this._phoneStateBusyPromise.resolve();
                this._phoneStateBusyPromise = null;
            } else {
                if(WebAgent.licenseCustomer == "1"){
                    window.setTimeout(function(){
                        WebAgent.ChatBusyCallback();
                    },0);
                }else {
                    //登录成功、电话挂断自动置忙，chat置忙
                    self.chatLogin && self._setChatBusy()
                        .then(function () {
                            //if(WAState == "BUSY" && ChatState == "BUSY") {
                            //    self._agentBusyS && self._agentBusyS();
                            //    console.log('[WebAgent] 多渠道座席端置忙成功');
                            //}
                            //self._agentBusyS && self._agentBusyS();
                        }).catch(function () {
                            self._agentBusyF && self._agentBusyF()
                        });
                }
            }

            isWAStateLocking = 0;
            WAState = 'BUSY';
            self._isLocking();
        }
        else if(eventType === events.EVENT_AGENT_READY){
            Log.log('多渠道软电话置闲成功');
            if(this._phoneStateReadyPromise){
                this._phoneStateReadyPromise.resolve();
                this._phoneStateReadyPromise = null;
            } else {
                if(WebAgent.licenseCustomer == "1"){
                    window.setTimeout(function(){
                        WebAgent.ChatReadyCallback();
                    },0);
                }else {
                    //登录成功、电话挂断自动置闲，chat置闲
                    self.chatLogin && self._setChatReady()
                        .then(function() {
                            //if(WAState == "READY" && ChatState == "READY") {
                            //    self._agentReadyS && self._agentReadyS();
                            //    console.log('[WebAgent] 多渠道座席端置闲成功');
                            //}
                            //self._agentReadyS && self._agentReadyS();
                        })
                        .catch(function() {
                            self._agentReadyF && self._agentReadyF()
                        });
                }
            }

            isWAStateLocking = 0;
            WAState = 'READY';
            self._isLocking();
            //打完电话，软电话自动置闲的情况，检查是否有挂起的置闲WebChat进程，如果有，则执行
            //self._setChatStateReadyProcess && self._setChatStateReadyProcess.start();
        }
        else if(eventType === events.EVENT_AGENT_WORKSTATE){
            Log.log('多渠道软电话置工作状态成功');
            if(this._phoneStateWorkingPromise){
                this._phoneStateWorkingPromise.resolve();
                this._phoneStateWorkingPromise = null;
            }
    
            isWAStateLocking = 0;
            WAState = 'WORKING';
            self._isLocking();
            //打完电话，软电话自动置闲的情况，检查是否有挂起的置闲WebChat进程，如果有，则执行
            //self._setChatStateReadyProcess && self._setChatStateReadyProcess.start();
        }
        else if(eventType === events.EVENT_AGENT_AWAY){
            Log.log(' 多渠道软电话小休成功');
            if(this._phoneStateAwayPromise){
                this._phoneStateAwayPromise.resolve();
                this._phoneStateAwayPromise = null;
            }
            isWAStateLocking = 0;
            WAState = 'AWAY';
            self._isLocking();
        }if(eventType === events.EVENT_SET_AWAY_FAIL){
            Log.log(' 多渠道软电话小休失败');
            if(this._phoneStateAwayPromise){
                this._phoneStateAwayPromise.reject("多渠道软电话小休失败");
                this._phoneStateAwayPromise = null;
            }
            isWAStateLocking = 0;
            //WAState = 'AWAY';
            //self._isLocking();
        }
        else if(eventType === events.EVENT_AGENT_ACW){
            isWAStateLocking = 0;
        }
        else if(
            //当软电话的状态为非置闲置忙时，锁定置闲置忙
        //eventType === events.EVENT_INBOUND_ALERTING ||
        //eventType === events.EVENT_INBOUND_CONNECTED ||
        //eventType === events.EVENT_OUTBOUND_ALERTING_TP ||
        //eventType === events.EVENT_OUTBOUND_CONNECTED_TP ||
        //eventType === events.EVENT_OUTBOUND_ALERTING_OP ||
        //eventType === events.EVENT_OUTBOUND_CONNECTED_OP
        eventType === events.EVENT_OUTBOUND_ALERTING_TP ||
        eventType === events.EVENT_OUTBOUND_CONNECTED_TP ||
        eventType === events.EVENT_CONSULT_ALERTING_TP ||
        eventType === events.EVENT_CONSULT_CONNECTED_TP ||
        eventType === events.EVENT_MONITOR_ALERTING ||
        eventType === events.EVENT_MONITOR ||
        eventType === events.EVENT_INBOUND_ALERTING ||
        eventType === events.EVENT_INBOUND_CONNECTED ||
        eventType === events.EVENT_INTERNAL_ALERTING_TP ||
        eventType === events.EVENT_INTERNAL_ALERTING_OP ||
        eventType === events.EVENT_INTERNAL_CONNECTED_TP ||
        eventType === events.EVENT_INTERNAL_CONNECTED_OP ||
        eventType === events.EVENT_SINGLE_STEP_TRANSFER_CONNECTED_TP ||
        eventType === events.EVENT_SINGLE_STEP_TRANSFER_ALERTING_TP
        ){
            isWAStateLocking = 1;
            self._isLocking();
        }
    };
    /**
     * IM置忙
     * @private
     */
    CCODMultiChannel.prototype._setChatBusy = function(){
        Log.log('多渠道置忙IM');
        ChatState = "";
        this._chatStateBusyPromise = Q.defer();
        this._WA.ChatSetBusy();
        return this._chatStateBusyPromise.promise;
    };

    /**
     * IM置闲
     * @private
     */
    CCODMultiChannel.prototype._setChatReady = function(){
        Log.log('多渠道置闲IM');
        ChatState = "";
        this._chatStateReadyPromise = Q.defer();
        this._WA.ChatSetReady();
        return this._chatStateReadyPromise.promise;
    };

    /**
     * 监听IM底层事件钩子
     * @private
     */
    CCODMultiChannel.prototype._IMStateHook = function(){
        var self = this;

        //置忙成功回调：
        function busyCallback(){
            Log.log('多渠道置忙IM成功');
            self._chatStateBusyPromise && self._chatStateBusyPromise.resolve();
            ChatState = "BUSY";
            isChatStateLocking = 0;
            self._isLocking();
        };

        this._WA && this._WA.ChatRemoveEvent('busyCallback', busyCallback);
        this._WA && this._WA.ChatRegisterEvent('busyCallback',busyCallback);
        //this._WA && this._WA.ChatRegisterEvent('busyCallback',function(){
        //    console.log('[WebAgent] 多渠道IM置忙成功');
        //    self._chatStateBusyPromise && self._chatStateBusyPromise.resolve();
        //    ChatState = "BUSY";
        //    isChatStateLocking = 0;
        //    self._isLocking();
        //});

        //置闲成功回调
        function readyCallback(){
            Log.log('多渠道置闲IM成功');
            self._chatStateReadyPromise && self._chatStateReadyPromise.resolve();
            ChatState = "READY";
            isChatStateLocking = 0;
            self._isLocking();
        }

        this._WA && this._WA.ChatRemoveEvent('readyCallback', readyCallback);
        this._WA && this._WA.ChatRegisterEvent('readyCallback',readyCallback);
        //this._WA && this._WA.ChatRegisterEvent('readyCallback',function(){
        //    console.log('[WebAgent] 多渠道IM置闲成功');
        //    self._chatStateReadyPromise && self._chatStateReadyPromise.resolve();
        //    ChatState = "READY";
        //    isChatStateLocking = 0;
        //    self._isLocking();
        //});

        function getButelState(data){
            //console.log('[WebAgent] 多渠道Butel事件:' + JSON.stringify(data));
            //坐席振铃
            if(data.type === 'msgFromAgentButelAlerting') {
                if(WebAgent.licenseCustomer != "1"){
                    isChatStateLocking = 1;
                    self._isLocking();
                    //当Butel弹屏时，使软电话为小休
                    self._setChatBusy();
                    self._WA.extend.setAway(self._awayResonList);
                    self._WA.ChatSetBusy();
                }
            }
            //坐席接通
            if(data.type === 'msgFromAgentButelConnected') {
                isChatStateLocking = 1;
                self._isLocking();
                //self._WA.ChatSetBusy();
            }
            //坐席发送butel呼叫结束
            //坐席发送butel呼叫振铃取消，没有接听只振铃就取消了
            if(data.type === 'msgFromAgentButelEnd' || data.type === 'msgFromAgentButelAlertingAbort') {
                Log.log('多渠道Butel呼叫结束,Butel未接听');
                isChatStateLocking = 0;
                self._isLocking();
                self.agentReady();
                //self._WA.ChatSetReady();
            }
        }

        this._WA && this._WA.ChatRemoveEvent('getButelState', getButelState);
        this._WA && this._WA.ChatRegisterEvent('getButelState',getButelState);
        //this._WA && this._WA.ChatRegisterEvent('getButelState',function(data){
        //    //console.log('[WebAgent] 多渠道Butel事件:' + JSON.stringify(data));
        //    //坐席振铃
        //    if(data.type === 'msgFromAgentButelAlerting') {
        //        isChatStateLocking = 1;
        //        self._isLocking();
        //        //当Butel弹屏时，使软电话为小休
        //        self._setChatBusy();
        //        self._WA.extend.setAway(self._awayResonList);
        //        self._WA.ChatSetBusy();
        //    }
        //    //坐席接通
        //    if(data.type === 'msgFromAgentButelConnected') {
        //        isChatStateLocking = 1;
        //        self._isLocking();
        //        //self._WA.ChatSetBusy();
        //    }
        //    //坐席发送butel呼叫结束
        //    //坐席发送butel呼叫振铃取消，没有接听只振铃就取消了
        //    if(data.type === 'msgFromAgentButelEnd' || data.type === 'msgFromAgentButelAlertingAbort') {
        //        console.log('[WebAgent] 多渠道Butel呼叫结束,Butel未接听');
        //        isChatStateLocking = 0;
        //        self._isLocking();
        //        self.agentReady();
        //        //self._WA.ChatSetReady();
        //    }
        //});
    };

    /**
     * 当多渠道置闲置忙不能使用时触发
     * @private
     */
    CCODMultiChannel.prototype._isLocking = function(){
        var s;
        if(isWAStateLocking || isChatStateLocking){
            this._locking && this._locking();
            s = "LOCK";
        } else {
            if(this._unLocking){
                if(WAState == "READY" && ChatState == "READY"){
                    s = "READY";
                    this._agentReadyS && this._agentReadyS();
                    Log.log('多渠道座席端置闲成功');
                }else if(WAState == "BUSY" && ChatState == "BUSY"){
                    s =  "BUSY";
                    this._agentBusyS && this._agentBusyS();
                    Log.log('多渠道座席端置忙成功');
                }else if(WAState == "AWAY" && ChatState == "BUSY"){
                    s =  "AWAY";
                    this._agentAwayS && this._agentAwayS();
                    Log.log('多渠道座席端小休成功');
                }else if(WAState == "WORKING" && ChatState == "READY"){
                    s =  "WORKING";
                    this._agentWorkingS && this._agentWorkingS();
                    Log.log('多渠道座席端工作成功');
                }else {
                    s = "LOCK";
                    this._locking && this._locking();
                }
            }
        }

        this._unLocking(s,{
            waState:WAState,
            imState:ChatState
        });

    };

    /**
     * 设置软电话为小休
     * @param awayStatusList
     * @private
     */
    CCODMultiChannel.prototype._setAwayList = function(awayStatusList){
        if(awayStatusList){
            this._awayResonList = awayStatusList.replace(/^.+?=(\d+).*$/,"$1");
            //this._awayResonList = '1';
            Log.log('多渠道使用小休序号为:' + this._awayResonList);
        }
    };

    /**
     * 事件集
     */
    var events = {
        EVENT_AGENT_LOGIN : "EVENT_AGENT_LOGIN",            // 登录成功
        EVENT_NETTY_LOGIN_SUCCESS : "EVENT_NETTY_LOGIN_SUCCESS", // Netty方式登录成功（用于已存在http客户端登录的前提下）
        EVENT_AGENT_LOGOUT : "EVENT_AGENT_LOGOUT",          // 登出成功
        EVENT_AGENT_LOGIN_FAIL : "EVENT_AGENT_LOGIN_FAIL",  // 登录失败
        EVENT_AGENT_READY : "EVENT_AGENT_READY",             // 置闲
        EVENT_AGENT_NOTREADY : "EVENT_AGENT_NOTREADY",       // 置忙
        EVENT_AGENT_AWAY : "EVENT_AGENT_AWAY",       // 小休成功
        EVENT_SET_AWAY_FAIL : "EVENT_SET_AWAY_FAIL", //小休失败
        EVENT_OUTBOUND_ALERTING_TP : "EVENT_OUTBOUND_ALERTING_TP", // 外呼坐席振铃
        EVENT_OUTBOUND_CONNECTED_TP : "EVENT_OUTBOUND_CONNECTED_TP", // 外呼坐席接通
        EVENT_OUTBOUND_ALERTING_OP : "EVENT_OUTBOUND_ALERTING_OP",  // 外呼客户振铃
        EVENT_OUTBOUND_CONNECTED_OP : "EVENT_OUTBOUND_CONNECTED_OP", // 外呼客户接通
        EVENT_TP_DISCONNECT : "EVENT_TP_DISCONNECT",                 // 坐席挂断
        EVENT_AGENT_HOLD: "EVENT_AGENT_HOLD",                   //坐席保持
        EVENT_HOLD_RETRIEVE: "EVENT_HOLD_RETRIEVE",                 //坐席保持接回
        EVENT_CONSULT_ALTERTING_OP: "EVENT_CONSULT_ALTERTING_OP",   //咨询振铃
        EVENT_CONSULT_CONNECTED_OP: "EVENT_CONSULT_CONNECTED_OP",   //咨询接通
        EVENT_CONSULT_RETRIEVE: "EVENT_CONSULT_RETRIEVE",           //咨询接回
        EVENT_TRANSFER: "EVENT_TRANSFER",                           //转移事件
        EVENT_CONSULT_ALERTING_TP: "EVENT_CONSULT_ALERTING_TP",     //被咨询振铃
        EVENT_CONSULT_CONNECTED_TP: "EVENT_CONSULT_CONNECTED_TP",   //被咨询接通
        EVENT_MONITOR_ALERTING: "EVENT_MONITOR_ALERTING",           //监听振铃
        EVENT_MONITOR: "EVENT_MONITOR",                             //监听接通
        EVENT_INBOUND_ALERTING : "EVENT_INBOUND_ALERTING",         //呼入坐席振铃事件
        EVENT_INBOUND_CONNECTED : "EVENT_INBOUND_CONNECTED",        //呼入坐席接通事件
        EVENT_FORCE_CONNECT: "EVENT_FORCE_CONNECT",                  //强插
        EVENT_CONFERENCE: "EVENT_CONFERENCE",                        //会议
        EVENT_INTERNAL_ALERTING_TP: "EVENT_INTERNAL_ALERTING_TP",    //发起方内呼振铃
        EVENT_INTERNAL_ALERTING_OP: "EVENT_INTERNAL_ALERTING_OP",     //被内呼方振铃
        EVENT_INTERNAL_CONNECTED_TP: "EVENT_INTERNAL_CONNECTED_TP",   //发起方内呼接通
        EVENT_INTERNAL_CONNECTED_OP: "EVENT_INTERNAL_CONNECTED_OP",   //被内呼方内呼接通
        EVENT_AGENT_ACW : "EVENT_AGENT_ACW",                          // 事后整理
        EVENT_SINGLE_STEP_TRANSFER_CONNECTED_TP:"EVENT_SINGLE_STEP_TRANSFER_CONNECTED_TP",                         //单步转移接通
        EVENT_SINGLE_STEP_TRANSFER_ALERTING_TP: "EVENT_SINGLE_STEP_TRANSFER_ALERTING_TP",                          //单步转移振铃
        EVENT_AGENT_BEHOLD: "EVENT_AGENT_BEHOLD",                   //坐席被保持
        EVENT_AGENT_BEUNHOLD: "EVENT_AGENT_BEUNHOLD",                //坐席被保持接回
        EVENT_AGENT_WORKSTATE: "EVENT_AGENT_WORKSTATE", // 设置工作状态成功
    };

    return new CCODMultiChannel();
});
