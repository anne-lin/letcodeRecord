var videoPushUrl = "https://rtctest.channelsoft.com";
//var videoPushUrl="http://10.130.76.56";
var callInTipSetTime;
var isMute = false;
var blobImg;
var currentState = "";
let cutImgList = [];
let isGetWorkingAgentList = false;
let switchSkillSuccessText = "技能组切换成功！";
let switchSkillFAILText = "技能组切换失败！";
let videoMsgList = [{
    name: "客户资料",
    html: '<ul>' +
        '<li>姓名：小仙女</li>' +
        '<li>性别：女</li>' +
        '<li>证件类型：身份证</li>' +
        '<li>证件号码：32313213243432312</li>' +
        '<li>客户类型：vip客户</li>' +
        '</ul>'
}, {
    name: "视频推送",
    html: "<div class='data-none-tip'>暂无数据</div>"
}, {
    name: "拍照截图",
    html: function () {
        let imgListHtml = '<div >' +
            '<div style="text-align:center">' +
            '<button class="btns-qn" onClick="cutImg(\'custom\')">' +
            '<span class="icon-btn iconfont">&#xe657</span> 拍照客户' +
            '</button>' +
            '<button class="btns-qn" onClick="cutImg(\'agent\')">' +
            '<span class="icon-btn iconfont">&#xe625</span> 拍照坐席' +
            '</button>' +
            '</div>';
        if (cutImgList.length) {
            imgListHtml += '<ul class="img-cut-list">';
            cutImgList.forEach(function (item, index) {
                imgListHtml += '<li class="flex">' +
                    ' <div class="desc-show">' + item.name + '</div>' +
                    ' <div class="img-name-input"><input type="text" value="' + item.name + '" class="renameImg" id="' + index + '"></div>' +
                    '<div onClick="openRenameImg(' + index + ')" class="btn-div rename-btn">重命名</div>' +
                    ' <div onClick="renameImg( \'\',' + index + ')" class="btn-div confirm-btn" style="display:none">确认</div>' +
                    ' <div onClick="showCutImg(\'' + item.url + '\', \'view\')" class="btn-div">查看</div>' +
                    '</li>';
            });
            imgListHtml += '</ul>';
        }
        return imgListHtml;
    },
    html2: '<div class="img-cut-show">' +
        '<div style="text-align:right;cursor:pointer"><span onclick="closeShow(\'img\')">X</span></div>' +
        '<div class="img-box">' +
        '<img id="cutImg"/>' +
        '</div>' +
        '<div id="handle-img-btn">' +
        '<button class="btns-qn" onclick="saveImg()">保存</button>' +
        '<button class="btns-qn" onclick="closeShow(\'img\')">取消</button>' +
        '</div>' +
        '</div>'
}, {
    name: "网络监控",
    html: '<div class="video-data-recode">' +
        '<p>视频网络情况</p>' +
        '<div class="flex">' +
        '<ul id="upVideoData"></ul>' +
        '<ul id="downVideoData"></ul>' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<p>音频网络情况</p>' +
        '<div class="flex">' +
        '<ul id="upAudioData"></ul>' +
        '<ul id="downAudioData"></ul>' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<p>当前视频通话参数</p>' +
        '<div class="flex video-params">' +
        '<div>分辨率：<span id="currentResolution">未定义</span></div>' +
        '<div>帧率：<span id="currentFrame">未定义</span></div>' +
        '</div> ' +
        '<div style="text-align:center">' +
        '<button class="btns-qn" onclick="showVideoSetBox()">编辑参数</button>' +
        '</div>' +
        '</div>',
    html2: '<div id="set-video-params">' +
        '<p>视频通话参数设置</p>' +
        '<div class="set-params">' +
        '<p style="width:155px">分辨率:</p>' +
        '<div>' +
        '<label><input type="radio" name="resolution" value=0 />320*240</label>' +
        '<label><input type="radio" name="resolution" value=1 />240*320</label>' +
        '<label><input type="radio" name="resolution" value=2 />400*240</label>' +
        '<label><input type="radio" name="resolution" value=3 />240*400</label>' +
        '<label><input type="radio" name="resolution" value=4 />480*320</label>' +
        '<label><input type="radio" name="resolution" value=5 />320*480</label>' +
        '<label><input type="radio" name="resolution" value=6 />640*480</label>' +
        '<label><input type="radio" name="resolution" value=7 />480*640</label>' +
        '</div>' +
        '</div>' +
        '<div class="set-params">\n' +
        '            <p style=\'width:48px;text-align:center\'>帧率:</p>\n' +
        '            <div>\n' +
        '                <label><input type="radio" name="frame" value="10"/>10</label>\n' +
        '                <label><input type="radio" name="frame" value="15"/>15</label>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div style="text-align:center">\n' +
        '                <button class="btns-qn" onclick="setVideoParams()">保存</button>\n' +
        '                <button class="btns-qn" onclick="closeShow(\'video\')">取消</button>\n' +
        '        </div>        \n' +
        '    </div>'
}];
let htmlBtnList = "";
for (let i = 0; i < videoMsgList.length; i++) {
    let c = i === 0 ? 'active-nav' : '';
    htmlBtnList += '<li class="' + c + '">' + videoMsgList[i].name + '</li>';
    if (i == 0) {
        $("#tabContent").html(videoMsgList[i].html);
    }
}
$("#video-message-nav").html(htmlBtnList);


window.onload = function () {
    
    htmlBtnList = "";
    let videoBtnList = [{
        name: "静音",
        img: "&#xe61a"
    },
        /* {
            name:"转移",
            img:"&#xe694"
        },{
            name:"屏幕共享",
            img:"&#xe60b"
        },{
            name:"会议",
            img:"&#xe69a"
        }, */
        {
            name: "保持",
            img: "&#xe60d"
        }/* ,{
        name:"自助服务",
        img:"&#xe613"
    } */, {
            name: "音频",
            img: "&#xe677"
        }, {
            name: "挂机",
            img: "&#xe67e"
        }];
    for (let i = 0; i < videoBtnList.length; i++) {
        if (i == (videoBtnList.length - 1)) {
            htmlBtnList += '<li style="color:red"><div class="icon-btn iconfont">' + videoBtnList[i].img + '</div><p>' + videoBtnList[i].name + '</p></li>';
        } else {
            htmlBtnList += '<li><div class="icon-btn iconfont">' + videoBtnList[i].img + '</div><p>' + videoBtnList[i].name + '</p></li>';
        }
    }
    $(".video-btn").html(htmlBtnList);
    
    function toggleIcon(typeTmp, beChanged, element) {
        let type = beChanged ? typeTmp : $(this).find("p").text();
        switch ( type ) {
            case "取消静音":
            case "静音": {
                window.CR && window.CR.setMute();
                if (WebAgent.vm.isMute()) {
                    $(this).html('<div class="icon-btn iconfont">&#xe61a</div><p>静音</p>');
                    $(".video-btn li:eq(0)").removeClass("hold-disabled");
                } else {
                    $(this).html('<div class="icon-btn iconfont">&#xe665</div><p>取消静音</p>');
                    $(".video-btn li:eq(0)").addClass("hold-disabled");
                }
                // isMute=!isMute;
                // console.log(WebAgent.vm.isMute(),'WebAgent.vm.isMute');
                WebAgent.vm.isMute(!WebAgent.vm.isMute());
                break;
            }
            case "保持":
            case "取消保持": {
                if (currentState == "hold") {
                    WebAgent.extend.holdReturn();
                    $(this).find("p").text("保持");
                } else {
                    WebAgent.extend.hold({ isVideo: true });
                    $(this).find("p").text('取消保持');
                }
                break;
            }
            case "自助服务": {
                break;
            }
            case "音频":
            case "视频": {
                if (type == "音频") {
                    $("#video").hide();
                    $("#video-hidden").show();
                } else {
                    $("#video-hidden").hide();
                    $("#video").show();
                }
                if (!beChanged) {
                    console.log("发送消息");
                    $(this).find("p").text(type == "音频" ? "视频" : "音频");
                    window.CR && window.CR.toggleMediaType();
                } else {
                    element.text(type == "音频" ? "视频" : "音频");
                }
                break;
            }
            case "挂机": {
                WebAgent.extend.hangup();
                break;
            }
            default: {
                break;
            }
        }
    }
    
    $(".video-btn > li").click(toggleIcon);
    
    function multiChannelLogin() {
        WebAgent.multiChannelLogin(WebAgent, {
            entId: $("#entId").val(),
            agentId: $("#agentId").val(),
            agentPassword: $("#password").val(),
            agentNumber: $("#agentNumber").val(),
            waAutoLoginResult: false,
            isLocking: isLocking,
            unLocking: unLocking
        });
    }
    
    let autoLoginData = JSON.parse(sessionStorage.getItem('autoLoginData') || '{}');
    if (WebAgent.isMulticenter) {
        console.log('开启多中心');
        $('#logInBtn').click(function () {
            WebAgent.initServer(
                { entId: $("#entId").val() },
                function () {
                    if (WebAgent.chatInitFinished) {
                        multiChannelLogin();
                    } else {
                        webAgentInit();
                    }
                }
            );
        });
        
        if (autoLoginData.isAutoLogin) {
            qnTool.initData(WebAgent, autoLoginData);
            webAgentInit();
        }
        
    } else {
        console.log('关闭多中心');
        webAgentInit();
    }
    
    function webAgentInit() {
        WebAgent.init({
            useLocal: true,
            webRTCConfig: {
                tag: 'video-container',
                ringFile: 'WA/sounds/bell_ring2.wav',
                ringTag: 'belling-ring',
                localTag: "local-video"
            },
            WaParams: {
                ui: false,
                sipUseCphone: false,
                // callNumValidate:function(callNum){
                //     return new Promise(function(resolve,reject){
                //         reject({
                //             code:"-1",
                //             msg:"校验成功"
                //         })
                //     })
                // }，
                callback: function () {
                    WebAgent.registerEventHandler(function (data) {
                        switch ( data.type ) {
                            case "EVENT_SOCKET_ABNORMAL_DISCONNECT": {
                                $("#stateText").text("socket 断开");
                                WebAgent.multiChannelLogout();
                                setTimeout(function () {
                                    console.log("执行登入");
                                    WebAgent.multiChannelLogin(WebAgent, {
                                        entId: $("#entId").val(),
                                        agentId: $("#agentId").val(),
                                        agentPassword: $("#password").val(),
                                        agentNumber: $("#agentNumber").val(),
                                        waAutoLoginResult: false,
                                        isLocking: isLocking,
                                        unLocking: unLocking,
                                    });
                                }, 2000);
                                break;
                            }
                            case "EVENT_AGENT_LOGOUT": {
                                console.log("登出成功");
                                $("#stateText").text("初始化");
                                $("#result").text("未登录");
                                $("#state").text("未登录");
                                ["logInBtn", "entId", "agentId", "password", "agentNumber"].forEach(function (item) {
                                    $("#" + item).attr('disabled', false);
                                });
                                handleDisabledBtn(true);
                                $('#screencap').text('开始录屏');
                                $("#logInBtn").removeClass('disabled');
                                $(".unlogin-content").show();
                                if (data.ext && data.ext.forceLogout == '1') {
                                    // alert("你已被强制登出");
                                    console.log("你已被强制登出");
                                }
                                break;
                            }
                            case "EVENT_MONITOR"://
                            /* case "EVENT_SINGLE_STEP_TRANSFER_ALERTING_TP":*/
                            case "EVENT_INTERNAL_CONNECTED_TP":
                            case "EVENT_INTERNAL_CONNECTED_OP":
                            case "EVENT_CONSULT_CONNECTED_TP":
                            case "EVENT_INBOUND_CONNECTED":
                            case "EVENT_TRANSFER":
                            case "EVENT_OUTBOUND_CONNECTED_TP":
                            case "EVENT_SINGLE_STEP_TRANSFER_CONNECTED_TP":
                            case "EVENT_OUTBOUND_CONNECTED_OP": {
                                if (!WebAgent.sipUseWebRTC) break;
                                if (
                                    (data.type == "EVENT_INBOUND_CONNECTED" && data.ext.peerMediaType != "2") ||
                                    $(".show-video-box").css("display") == "block" || (data.ext.reqMediaType != "2" && data.ext.mediaType != "2")
                                ) {
                                    break;
                                }
                                let isInternalCall = data.type == "EVENT_INTERNAL_CONNECTED_TP" || data.type == "EVENT_INTERNAL_CONNECTED_OP";
                                if (!isInternalCall) {
                                    $(".video-btn li:eq(0)").show();
                                    $(".video-btn li:eq(1)").show();
                                    if (WebAgent.vm.isMute()) {
                                        $(".video-btn li:eq(0)").html('<div class="icon-btn iconfont">&#xe61a</div><p>静音</p>');
                                        $(".video-btn li:eq(0)").removeClass("hold-disabled");
                                        // isMute=false;
                                        WebAgent.vm.isMute(false);
                                    }
                                    if ($(".video-btn li:eq(1)").hasClass("hold-disabled")) {
                                        $(".video-btn li:eq(1)").removeClass("hold-disabled");
                                        $(".video-btn li:eq(1) p").text("保持");
                                    }
                                } else {
                                    $(".video-btn li:eq(0)").hide();
                                    $(".video-btn li:eq(1)").hide();
                                }
                                
                                
                                /* if(data.type == "EVENT_MONITOR"){
                                    $("#local-video").addClass("set-monitor-video");
                                }else{
                                    $("#local-video").removeClass("set-monitor-video");
                                } */
                                $(".video-btn li:eq(0) div").html('<div class="icon-btn iconfont">&#xe61a</div>');
                                $("#commonLagBtn").hide();
                                $(".show-video-box").css("display", "block");
                                //$("#logined-box").width("1360px");
                                CR.getStats(upAudioCallback, upVideoCallback, downAudioCallback, downVideoCallback);
                                if ($("#video-message-nav .active-nav").text() == "网络监控") {
                                    $("#currentResolution").text("未定义");
                                    $("#currentFrame").text("未定义");
                                }
                                if ($("#video-message-nav .active-nav").text() == "拍照截图") {
                                    cutImgList = [];
                                    $("#tabContent").html(videoMsgList[2].html);
                                }
                                getVideoList(data.type == "EVENT_OUTBOUND_CONNECTED_OP" ? {
                                    skillNames: [data.ext.skillName],
                                    entId: data.entId
                                } : {
                                    skillNames: [data.ext.reqSkillId],
                                    entId: data.entId
                                });
                                WebAgent.extend.getCallData("SD", function (res) {
                                    let msgHtml = "<ul>";
                                    let resArr = res.split("|");
                                    for (let i = 0; i < resArr.length; i++) {
                                        let arr = resArr[i].split("=");
                                        switch ( arr[0] ) {
                                            case "customId": {
                                                msgHtml += '<li>客户编号：' + arr[1] + '</li>';
                                                break;
                                            }
                                            case "name": {
                                                msgHtml += '<li>客户姓名：' + arr[1] + '</li>';
                                                break;
                                            }
                                            case "tel": {
                                                msgHtml += '<li>客户电话：' + arr[1] + '</li>';
                                                break;
                                            }
                                            case "address": {
                                                msgHtml += '<li>客户地址：' + arr[1] + '</li>';
                                                break;
                                            }
                                        }
                                    }
                                    videoMsgList[0].html = msgHtml + "</ul>";
                                    if ($("#video-message-nav .active-nav").text() == "客户资料") {
                                        $("#tabContent").html(videoMsgList[0].html);
                                    }
                                });
                                break;
                            }
                            case "EVENT_AGENT_HOLD":
                            case "EVENT_AGENT_BEHOLD": {
                                $(".video-btn li:eq(1)").addClass("hold-disabled");
                                currentState = "hold";
                                console.log("保持");
                                WebAgent.sipUseWebRTC && CR.toggleOpenCam();
                                break;
                            }
                            case "EVENT_AGENT_BEUNHOLD":
                            case "EVENT_HOLD_RETRIEVE": {
                                $(".video-btn li:eq(1)").removeClass("hold-disabled");
                                currentState = "talk";
                                console.log("保持接回");
                                WebAgent.sipUseWebRTC && CR.toggleOpenCam();
                                break;
                            }
                            case "EVENT_QUIT_MONITOR_SUCCESS":
                            case "EVENT_TP_DISCONNECT":
                            case "EVENT_OP_DISCONNECT": {
                                console.log("通话结束");
                                currentState = "free";
                                $(".show-video-box").css("display", "none");
                                $("#commonLagBtn").show();
                                //$("#logined-box").width("750px");
                                break;
                            }
                            case "EVENT_AGENT_GET_LIST": {
                                let callInType = $("#selectCallInType").val();
                                let agentList = data.ext.agentList;
                                let agentListArr = agentList.split("|");
                                var agentItem;
                                if (!isGetWorkingAgentList) {
                                    let skillList = data.ext.skillList;
                                    let skillListArr = skillList.split("|");
                                    if (skillListArr.length == 0 || (skillListArr.length == 1 && skillListArr[0] == "")) {
                                        $("#tipSpanSkill").html("目前没有可呼叫技能组");
                                        $("#tipSpanSkill").hide();
                                    } else {
                                        $("#tipSpanSkill").hide();
                                    }
                                    for (var i = 0; i < skillListArr.length - 1; i++) {
                                        let skillName = skillListArr[i];
                                        $("#skillTable").append("<tr ><td onclick='transValue(this)'>*" + skillName + "</td></tr>");
                                    }
                                    $("#skillTable").hide();
                                    if (agentListArr.length == 0 || (agentListArr.length == 1 && agentListArr[0] == "")) {
                                        if (callInType == "agent") {
                                            $("#tipSpanAgent").html("目前没有可呼叫坐席");
                                            $("#tipSpanAgent").show();
                                        }
                                    } else {
                                        $("#tipSpanAgent").hide();
                                    }
                                } else {
                                    $("#workingTable").empty();
                                    if (agentListArr.length == 0 || (agentListArr.length == 1 && agentListArr[0] == "")) {
                                        $("#tipSpanWorking").html("目前没有可呼叫坐席");
                                        $("#tipSpanWorking").show();
                                    } else {
                                        $("#tipSpanWorking").hide();
                                    }
                                }
                                let targentDom = isGetWorkingAgentList ? $("#workingTable") : $("#agentTable");
                                for (var i = 0; i < agentListArr.length - 1; i++) {
                                    agentItem = agentListArr[i].split(":");
                                    let agentName = agentItem[2];
                                    let agentId = agentItem[0];
                                    targentDom.append("<tr ><td onclick='transValue(this)'>*" + agentId + "-" + agentName + "</td></tr>");
                                }
                                isGetWorkingAgentList = false;
                                break;
                            }
                            case 'EVENT_SWTCH_SKILLGROUP_SUCCESS': {
                                $('#state').text(switchSkillSuccessText);
                                break;
                            }
                            case 'EVENT_SWTCH_SKILLGROUP_FAIL': {
                                $('#state').text(switchSkillFAILText);
                                break;
                            }
                            case 'EVENT_AGENT_LOGIN': {
                                let screenRecordingType = data.ext.screenRecordingType;
                                if (screenRecordingType == 1) { // 自动录屏
                                    $('#screencap').hide();
                                } else {
                                    $('#screencap').show();
                                }
                            }
                            default: {
                                break;
                            }
                        }
                    });
                    
                    //自动登录
                    WebAgent.registerResultHandler(function (data) {
                        if (data.type == "autoLogin") {
                            function autoLogin() {
                                let t = setTimeout(function () {
                                    if (WebAgent.chatInitFinished) {
                                        if (data.code == 0) {
                                            console.log("[WebAgent]自动登录成功:" + JSON.stringify(data));
                                            var awayStatus = data && data.ext && data.ext.awayStatus;
                                            WebAgent.multiChannelLogin(WebAgent, {
                                                entId: data.ext.entId,
                                                agentId: data.ext.agentId,
                                                agentPassword: data.ext.password,
                                                agentNumber: "",
                                                waAutoLoginResult: true,
                                                waAutoLoginData: data,
                                                awayStatus: awayStatus,
                                                isLocking: isLocking,
                                                unLocking: unLocking
                                            });
                                        } else if (WebAgent.isMulticenter) {
                                            autoLoginData.isAutoLogin ? sessionStorage.removeItem('autoLoginData') : multiChannelLogin();
                                        }
                                        clearTimeout(t);
                                        t = null;
                                    } else {
                                        autoLogin();
                                    }
                                }, 500);
                            }
                            
                            autoLogin();
                        } else if (data.type == "makeCall" && data.code == "023") {
                            alert("呼叫失败，" + data.msg);
                        }
                    });
                    WebAgent.registerStateListener(function (data) {
                        $("#state").text(data.desc);
                        $("#setBusy").addClass('disabled');
                        $("#setReady").addClass('disabled');
                        $("#setAway").addClass('disabled');
                        $("#setWorking").addClass('disabled');
                        $("#callInternal").addClass('disabled');
                        $("#changeskillGroup").addClass('disabled');
                        switch ( data.desc ) {
                            case "已经置闲": {
                                $("#setBusy").removeClass('disabled');
                                $("#setReady").removeClass('disabled');
                                $("#setAway").removeClass('disabled');
                                $("#setWorking").removeClass('disabled');
                                break;
                            }
                            case "已经置忙": {
                                $("#setReady").removeClass('disabled');
                                $("#setAway").removeClass('disabled');
                                $("#setWorking").removeClass('disabled');
                                $("#callInternal").removeClass('disabled');
                                $("#changeskillGroup").removeClass('disabled');
                                break;
                            }
                            case "事后整理": {
                                $("#setBusy").removeClass('disabled');
                                $("#setReady").removeClass('disabled');
                                $("#setAway").removeClass('disabled');
                                $("#setWorking").removeClass('disabled');
                                break;
                            }
                            case "工作状态": {
                                $("#setBusy").removeClass('disabled');
                                $("#setReady").removeClass('disabled');
                                $("#setAway").removeClass('disabled');
                                $("#callInternal").removeClass('disabled');
                                break;
                            }
                        }
                        console.log("WA状态:" + JSON.stringify(data));
                    });
                }
            },
            isUseCChat: true,
            ChatParams: {
                selectorName: "#content",
                isCheckWord: true,
                quickReplySelector: "#commonLagBtn",
                // smartReply:"#smartReply"
            },
            callback: function () {
                
                $("#phoneBtn").click(function () {
                    WebAgent.WaChat.toggle();
                });
                $("#logInBtn").click(function () {
                    
                    // WebAgent.multiChannelLogin(WebAgent, {
                    //     entId: $("#entId").val(),
                    //     agentId: $("#agentId").val(),
                    //     agentPassword: $("#password").val(),
                    //     agentNumber: $("#agentNumber").val(),
                    //     waAutoLoginResult: false,
                    //     isForce: true,
                    //     isLocking: isLocking,
                    //     unLocking: unLocking
                    // });
                    
                    !WebAgent.isMulticenter && multiChannelLogin();
                });
                
                // WebAgent.multiChannelLogin(WebAgent, {
                //     entId        : "11110000",
                //     agentId      : "20181213",
                //     agentPassword: "000000",
                //     agentNumber  : "sip:1001",
                //     waAutoLoginResult: false,
                //     isLocking: isLocking,
                //     unLocking:  unLocking
                // });
                
                WebAgent.ChatToggle();
                WebAgent.WaChat.setPosition({
                    right: "15px",
                    top: "81px"
                });
                
                $("#logOutBtn").click(function (e) {
                    $('.more-options').hide();
                    WebAgent.multiChannelLogout(function () {
                        console.log('登出之后执行的回调');
                    });
                    lougoutFlag = true;
                });
                
                $("#setBusy").click(function () {
                    if ($("#state").text() == "已经置忙") {
                        return;
                    }
                    WebAgent.multiChannelState.agentBusy(function () {
                        console.log('[CDesk] 多渠道能力置忙成功');
                    }, function () {
                        console.log('[CDesk] 多渠道能力置忙失败');
                    });
                });
                
                $("#setReady").click(function () {
                    if ($("#state").text() == "已经置闲") {
                        return;
                    }
                    WebAgent.vm.dialogShow(false);
                    WebAgent.multiChannelState.agentReady(function () {
                        console.log('[CDesk] 多渠道能力置闲成功');
                    }, function () {
                        console.log('[CDesk] 多渠道能力置闲失败');
                    });
                });
                
                $("#setWorking").click(function () {
                    if ($("#state").text() == "工作状态") {
                        return;
                    }
                    // WebAgent.vm.dialogShow(false);
                    WebAgent.multiChannelState.agentWorking(function () {
                        console.log('[CDesk] 多渠道能力工作状态成功');
                    }, function () {
                        console.log('[CDesk] 多渠道能力工作状态失败');
                    });
                });
                
                $("#changeskillGroup").click(function () {
                    if ($("#state").text() != "已经置忙" &&
                        $("#state").text() != "小休状态" &&
                        $("#state").text() != switchSkillSuccessText &&
                        $("#state").text() != switchSkillFAILText &&
                        $("#changeskillGroup").hasClass('disabled')
                    ) return;
                    $('#skill-model-box').show();
                    $('.skill-model-ul').empty();
                    $('.skill-error').empty();
                    let domStr = ' <li>\n' +
                        '                     <span class="skill-model-title">技能名称</span>\n' +
                        '                </li>';
                    WebAgent.userMessage.skillList.forEach(function (item) {
                        domStr += '<li> <span class="skill-model-left"><input class="skill-model-checkbox" type="checkbox"></span> <span class="skill-model-text">' + item.skillName + '</span>\n</li>';
                    });
                    $('.skill-model-ul').html(domStr);
                    WebAgent.userMessage.skillList.forEach(function (item, index) {
                        WebAgent.userMessage.factSkillInfo.forEach(function (checkedItem) {
                            if (checkedItem.skillName == item.skillName) {
                                $(".skill-model-checkbox").eq(index).prop('checked', item.checked);
                            }
                        });
                        
                    });
                });
                
                $("#skill-closeModel").click(function () {
                    $('#skill-model-box').hide();
                });
                
                $('#changeSkillSubmit').click(function () {
                    let skillGroupStr = '';
                    $('.skill-model-checkbox').each(function (index) {
                        let checked = $(this).prop('checked');
                        if (checked) {
                            skillGroupStr += WebAgent.userMessage.skillList[index].value + ';';
                        }
                    });
                    let result = WebAgent.extend.switchSkillGroup({
                        skillGroupList: skillGroupStr
                    });
                    
                    if (result.code === 0) {
                        console.log("[webAgent-wa] 切换技能组指令发送成功");
                        $('#skill-model-box').hide();
                    } else {
                        $('.skill-error').text(result.msg);
                        console.warn("[webAgent-wa] " + result.msg);
                    }
                });
                
                $('#changeSkillCancel').click(function () {
                    $('#skill-model-box').hide();
                });
                
                $('#setModel').change(function () {
                    WebAgent.mediaType = $(this).val();
                });
                
                $("#reset").click(function () {
                    WebAgent.extend.reset();
                });
                
                $("#subSubmitBtn").click(function () {
                    let status = $("#selectStatus").val();
                    let enableTime = $("#enableTime").val();
                    if (enableTime == "") {
                        console.log("预约时间不能为空");
                        $("#errorMsgPan").html("预约时间不能为空");
                        return false;
                    } else {
                        $("#errorMsgPan").html("");
                    }
                    console.log("获取到的状态值:" + status);
                    console.log("获取到的时间:" + enableTime);
                    let now = new Date();
                    let yy = now.getFullYear(), mm = now.getMonth() + 1, dd = now.getDate();
                    // IE要以 "/" 为分隔符
                    let subscribe = new Date(yy + "/" + mm + "/" + dd + " " + enableTime + ":00");
                    let subTime = subscribe.getTime() - now.getTime();
                    if (subTime > 0) {
                        window.setTimeout(function () {
                            console.log("预约功能开始执行");
                            switch ( status ) {
                                case "busy": {
                                    if ($("#state").text() == "已经置忙") {
                                        console.log("已经置忙");
                                        break;
                                    }
                                    WebAgent.multiChannelState.agentBusy(function () {
                                        console.log('[CDesk] 多渠道能力置忙成功');
                                    }, function () {
                                        console.log('[CDesk] 多渠道能力置忙失败');
                                    });
                                    break;
                                }
                                case "reday": {
                                    if ($("#state").text() == "已经置闲") {
                                        console.log("已经置闲");
                                        break;
                                    }
                                    WebAgent.multiChannelState.agentReady(function () {
                                        console.log('[CDesk] 多渠道能力置闲成功');
                                    }, function () {
                                        console.log('[CDesk] 多渠道能力置闲失败');
                                    });
                                    break;
                                }
                                case "working": {
                                    if ($("#state").text() == "工作状态") {
                                        console.log("工作状态");
                                        break;
                                    }
                                    WebAgent.multiChannelState.agentWorking(function () {
                                        console.log('[CDesk] 多渠道能力工作状态成功');
                                    }, function () {
                                        console.log('[CDesk] 多渠道能力工作状态失败');
                                    });
                                }
                                default: {
                                    WebAgent.multiChannelState.agentAway(function () {
                                        console.log('[CDesk] 多渠道能力小休成功');
                                    }, function () {
                                        console.log('[CDesk] 多渠道能力小休失败');
                                        $("#setAway").val("");
                                        alert("状态修改失败");
                                    }, status);
                                    $("#setAway").val(status);
                                    break;
                                }
                            }
                            $("#setSubscribe").html("预约");
                            $("#setSubscribe").css("background-color", "#49abf6");
                            $("#errorMsgPan").html("");
                            subscribeFlag = false;
                        }, subTime);
                        $("#subscribe-model-box").hide();
                        $(".dateTimeWrap").hide();
                        $("#setSubscribe").html("已预约");
                        $("#setSubscribe").css("background-color", "#008800");
                        subscribeFlag = true;
                    } else {
                        console.log("预约时间必须晚于当前时间");
                        $("#errorMsgPan").html("预约时间必须晚于当前时间");
                    }
                });
                
                $("#setSubscribe").click(function () {
                    var flag = $("#logInBtn").prop("disabled");
                    if (flag == true && !subscribeFlag) {
                        $("#subscribe-model-box").show();
                    }
                });
                $("#subscribe-closeModel").click(function () {
                    $("#subscribe-model-box").hide();
                    $(".dateTimeWrap").hide();
                });
                
                $("#callInternal").click(function () {
                    var flag = ($("#state").text() == "已经置忙" || $("#state").text() == switchSkillSuccessText || $("#state").text() == switchSkillFAILText) && !$("#callInternal").hasClass('disabled');
                    $("#agentTable").empty();
                    $("#skillTable").empty();
                    $("#workingTable").empty();
                    $("#tipSpanAgent").empty();
                    $("#tipSpanSkill").empty();
                    $("#tipSpanWorking").empty();
                    isGetWorkingAgentList = false;
                    if (flag == true) {
                        var result = WebAgent.extend.agentGetList("1");
                        if (result.code === 0) {
                            console.log("[webAgent-wa]获取坐席列表命令发送成功");
                        } else {
                            console.log("[webAgent-wa] " + result.msg);
                        }
                        $("#numParam").val("");
                        $("#selectCallInType").val("agent");
                        $("#agentTable").show();
                        $("#tipSpanWorking").hide();
                        $("#workingTable").hide();
                        $("#tipSpanSkill").hide();
                        $("#callinternal-model-box").show();
                    }
                });
                $("#selectCallInType").change(function () {
                    let that = $(this);
                    let htmlSkill = $("#tipSpanSkill").html();
                    let htmlAgent = $("#tipSpanAgent").html();
                    let htmlWorking = $("#tipSpanWorking").html();
                    if (that.val() == "skill") {
                        if (htmlSkill != "") {
                            $("#tipSpanAgent").hide();
                            $("#tipSpanSkill").show();
                            $("#tipSpanWorking").hide();
                        } else {
                            $("#tipSpanAgent").hide();
                            $("#tipSpanSkill").hide();
                            $("#tipSpanWorking").hide();
                            $("#skillTable").show();
                        }
                        $("#workingTable").hide();
                        $("#agentTable").hide();
                    }
                    if (that.val() == "agent") {
                        if (htmlAgent != "") {
                            $("#tipSpanSkill").hide();
                            $("#tipSpanAgent").show();
                            $("#tipSpanWorking").hide();
                        } else {
                            $("#tipSpanAgent").hide();
                            $("#tipSpanSkill").hide();
                            $("#tipSpanWorking").hide();
                            $("#agentTable").show();
                        }
                        $("#skillTable").hide();
                        $("#workingTable").hide();
                    }
                    if (that.val() == "working") {
                        if (htmlWorking != "") {
                            $("#tipSpanSkill").hide();
                            $("#tipSpanAgent").hide();
                            $("#tipSpanWorking").show();
                        } else {
                            $("#tipSpanAgent").hide();
                            $("#tipSpanSkill").hide();
                            $("#tipSpanWorking").hide();
                            $("#workingTable").show();
                            isGetWorkingAgentList = true;
                            var result = WebAgent.extend.agentGetList("5");
                            if (result.code === 0) {
                                console.log("[webAgent-wa]获取工作状态坐席列表命令发送成功");
                            } else {
                                console.log("[webAgent-wa] " + result.msg);
                            }
                        }
                        $("#skillTable").hide();
                        $("#agentTable").hide();
                    }
                });
                $("#callInSubmitBtn").click(function () {
                    let paramVal = $("#numParam").val();
                    let type = $("#selectCallInType").val();
                    if (type == "agent" || type == "working") {
                        let agentId = paramVal.split("\-")[0];
                        let param = {
                            inCallNumber: "",
                            skillGroupName: "",
                            mediaType: WebAgent.mediaType,
                            workStateAgentId: ""
                        };
                        type == "agent" ? param.inCallNumber = agentId : param.workStateAgentId = agentId;
                        let result = WebAgent.extend.makeCallInternal(param);
                        console.log(result);
                        if (result.code == "000") {
                            $("#callinternal-model-box").hide();
                        } else {
                            console.log("内呼发起失败: " + result);
                        }
                    } else if (type == "skill") {
                        let param = {
                            inCallNumber: "",
                            skillGroupName: paramVal,
                            mediaType: WebAgent.mediaType,
                            workStateAgentId: '',
                        };
                        let result = WebAgent.extend.makeCallInternal(param);
                        console.log(result);
                        if (result.code == "000") {
                            $("#callinternal-model-box").hide();
                        } else {
                            console.log("内呼发起失败: " + result);
                        }
                    }
                });
                $("#callinternal-closeModel").click(function () {
                    $("#callinternal-model-box").hide();
                });
                
                $("#setNick").click(function () {
                    WebAgent.setNickName("C7F34F46F02000025DA55E501153109D", "8989", "webim", "yinghan");
                });
                
                
                $("#setAway").change(function () {
                    let that = $(this);
                    WebAgent.multiChannelState.agentAway(function () {
                        console.log('[CDesk] 多渠道能力小休成功');
                    }, function () {
                        console.log('[CDesk] 多渠道能力小休失败');
                        $("#setAway").val("");
                        alert("状态修改失败");
                    }, $(this).val());
                });
                
                $("#more").click(function () {
                    if ($(this).hasClass('disabled')) return;
                    $(".more-options").toggle();
                });
                
                $('.more-options p').click(function () {
                    if ($(this).hasClass('disabled')) return;
                    $(".more-options").toggle();
                });
                
                $('#screencap').click(function () {
                    let text = $(this).text();
                    let fn = text === '开始录屏' ? WebAgent.startScreencap : WebAgent.stopScreencap;
                    fn(
                        {
                            agentId: WebAgent.vm.agentId(),
                            extension: WebAgent.userMessage.nubeNum,
                            agentName: WebAgent.userMessage.agentName,
                            entId: WebAgent.vm.entId()
                        }
                    ).then(function () {
                        let resultText = text === '开始录屏' ? '结束录屏' : '开始录屏';
                        $('#screencap').text(resultText);
                    });
                    
                });
                
                //多渠道登录注册函数
                WebAgent.multiRegisterEvent("login", function (data) {
                    if (data.type == 'loginSuccess') {
                        console.log("loginSuccess");
                        var awayStatusList;
                        if (data.params.awayStatusList) {
                            awayStatusList = data.params.awayStatusList.split(";"), html = "";
                            awayStatusList.forEach(function (item) {
                                if (item) {
                                    var data = item.split("=");
                                    html += "<option value=" + data[1] + ">" + data[0] + "</option>";
                                }
                            });
                            $("#setAway").html(html);
                            let subAwayHtml = "<option value='busy'>置忙</option><option value='reday'>置闲</option><option value='working'>工作状态</option>" + html;
                            $("#selectStatus").html(subAwayHtml);
                        }
                        ["logInBtn", "entId", "agentId", "password", "agentNumber"].forEach(function (item) {
                            $("#" + item).attr('disabled', true);
                        });
                        $("#setAway").val("");
                        $("#logInBtn").addClass('disabled');
                        handleDisabledBtn(false);
                        $('#setBusy').attr('disabled', false);
                        $('#setBusy').addClass('disabled');
                        
                        $(".unlogin-content").hide();
                        $("#commonLagBtn").show();
                    }
                    if (data.type == 'loginFail') {
                        console.log(data.channel + "-loginFail");
                        $("#result").text(data.type + "," + data.msg);
                    } else {
                        $("#result").text(data.type);
                    }
                    $("#stateText").text(data.type);
                });
                
                //正在登出多渠道注册函数
                WebAgent.multiRegisterEvent("logout", function () {
                    console.log("[CDesk]:正在登出多渠道");
                });
                
                //登录过程提示
                WebAgent.multiRegisterEvent("setAgentStateText", function (data) {
                    $("#stateText").text(data.text);
                });
                WebAgent.multiRegisterEvent("webRTCError", function (data) {
                    alert("通话失败，" + data.message);
                });
                WebAgent.multiRegisterEvent("onToggleMedia", function (isCloseVideo) {
                    toggleIcon(isCloseVideo ? "音频" : "视频", true, $(".video-btn li:eq(2) p"));
                });
                
                WebAgent.ChatRegisterEvent("openfireDisconnect", function () {
                    $("#stateText").text("openfire断开");
                    alert("openfire断开");
                    WebAgent.multiChannelLogout();
                    setTimeout(function () {
                        console.log("执行登入");
                        WebAgent.multiChannelLogin(WebAgent, {
                            entId: $("#entId").val(),
                            agentId: $("#agentId").val(),
                            agentPassword: $("#password").val(),
                            agentNumber: $("#agentNumber").val(),
                            waAutoLoginResult: false,
                            isLocking: isLocking,
                            unLocking: unLocking,
                        });
                    }, 2000);
                });
                
                WebAgent.ChatRegisterEvent("butelAjaxError", function (data) {
                    console.log('butelAjaxError:' + "ButelState:" + data.ButelState + ", AgentStatus:" + data.AgentStatus);
                });
                
                /*  WebAgent.ChatRegisterEvent("autoMatchCallback", function() {
                     if($(".show-video-box").css("display")== "block"){
                         return;
                     }
                     changeQuickReplyType.apply($("#quickReply-nav li:first-child"))
                 });
             
                 WebAgent.ChatRegisterEvent("openIntellCallback", function() {
                     if($(".show-video-box").css("display")== "block"){
                         return;
                     }
                     changeQuickReplyType.apply($("#quickReply-nav li:last-child"))
                 }); */
                WebAgent.ChatRegisterEvent("callIn", function (data) {
                    $("#callInTip").show();
                    
                    callInTipSetTime = setTimeout(function () {
                        $("#callInTip").hide();
                        callInTipSetTime = "";
                    }, 30000);
                    $(".callInTip-nick").text(data.name);
                    $(".callInTip-tip").text(data.type == "video" ? "客户申请与你视频通话" : "客户申请与你语音通话");
                });
                
                WebAgent.ChatRegisterEvent("newCustomInter", function (data) {
                    //data类型为对象，属性：userId/userSource/skillGroupId/skillGroupName/isTransfer: 0：正常的新用户进来，
                    //1：转接到该坐席，导致新用户进来/transferMessage: 转移留言
                    console.log("新用户到来：" + JSON.stringify(data));
                });
            }
        });
    }
};

function showVideoSetBox() {
    $("#tabContent").html(videoMsgList[3].html2);
}

function setVideoParams() {
    var arr = [{
        width: 320,
        height: 240
    }, {
        width: 240,
        height: 3200
    }, {
        width: 400,
        height: 240
    }, {
        width: 240,
        height: 400
    }, {
        width: 480,
        height: 320
    }, {
        width: 320,
        height: 480
    }, {
        width: 640,
        height: 480
    }, {
        width: 480,
        height: 640
    }];
    var resolution = $(".set-params input[name=resolution]:checked").val();
    var frame = $(".set-params input[name=frame]:checked").val();
    CR.changeDevice({
        bestWidth: arr[resolution].height,
        bestHeight: arr[resolution].width,
        bestFrameRate: frame
    });
    $("#tabContent").html(videoMsgList[3].html);
    $("#currentResolution").text(arr[resolution].width + "*" + arr[resolution].height);
    $("#currentFrame").text(frame);
}

//获取视频推送数据
function getVideoList(data) {
    $.ajax({
        url: videoPushUrl + "/dcmsRecord/mvc/video/queryForSkillNames",
        type: "post",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (res) {
            let htmlVideoPushList = "<ul>";
            if (!res.data || !res.data[0].videoList || !res.data[0].videoList.length) {
                //$("#tabContent").html("<div class='data-none-tip'>暂无数据</div>");
                videoMsgList[1].html = "<div class='data-none-tip'>暂无数据</div>";
                return;
            }
            res.data[0].videoList.length && res.data[0].videoList.forEach(function (item) {
                htmlVideoPushList += '<li class="flex">' +
                    '<div class="desc-show">' + item.videoName + '一</div>' +
                    '<div onClick="pushVideo(' + item.shortOriginalFilePath + ')" class="btn-div">推送</div>' +
                    '</li>';
            });
            //$("#tabContent").html(htmlVideoPushList+"</ul>");
            videoMsgList[1].html = htmlVideoPushList + "</ul>";
        }
    });
}

//执行推送
function pushVideo(url) {
    WebAgent.extend.pushVideo({ url: url });
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while ( n-- ) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function cutImg(type) {
    let canvas, options = {
        left: 0,
        top: 0
    };
    if (type == "custom") {
        options.cutTag = document.getElementById("video-container");
        options.width = 270;
        options.height = 400;
        options.canvas = "canvas1";
    } else {
        options.cutTag = document.getElementById("local-video");
        options.width = 90;
        options.height = 160;
        options.canvas = "canvas2";
    }
    canvas = CR.cutImg(options);
    showCutImg(canvas);
    blobImg = dataURLtoFile(canvas, "img.png");
}

//图片重命名
function renameImg(event, id) {
    if (event && event.keyCode != 13) {
        return;
    }
    let reg = /^[\u4e00-\u9fa5|\w]{1,50}$/,
        index, value;
    if (event) {
        index = event.currentTarget.id;
        value = event.currentTarget.value;
    } else {
        index = id;
        value = $(".img-cut-list li:eq(" + index + ")").find(".renameImg").val();
    }
    console.log("index:", index);
    if (reg.test(value)) {
        cutImgList[index].name = value;
        $(".img-cut-list li:eq(" + index + ")").find(".desc-show").text(value);
    }
    $(".img-cut-list li:eq(" + index + ")").find(".img-name-input").hide();
    $(".img-cut-list li:eq(" + index + ")").find(".desc-show").show();
    $(".img-cut-list li:eq(" + index + ")").find(".rename-btn").show();
    $(".img-cut-list li:eq(" + index + ")").find(".confirm-btn").hide();
}

////图片重命名输入框显示
function openRenameImg(index) {
    $(".img-cut-list li:eq(" + index + ")").find(".img-name-input").show();
    $(".img-cut-list li:eq(" + index + ")").find(".desc-show").hide();
    $(".img-cut-list li:eq(" + index + ")").find(".rename-btn").hide();
    $(".img-cut-list li:eq(" + index + ")").find(".confirm-btn").show();
    $(".renameImg").keydown(renameImg);
}

//图片查看/截图显示
function showCutImg(url, type) {
    $("#tabContent").html(videoMsgList[2].html2);
    $("#cutImg").attr("src", url);
    if (type == "view") {
        $("#handle-img-btn").hide();
    }
}

//取消图片
function closeShow(type) {
    if (type == "img") {
        $("#tabContent").html(videoMsgList[2].html);
    } else {
        $("#tabContent").html(videoMsgList[3].html);
    }
}

//保存图片
function saveImg() {
    if (!blobImg) {
        return;
    }
    var data = new FormData();
    data.append('fileToUpload', blobImg);
    console.log("data:", data);
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
                cutImgList.push({
                    name: "客户" + new Date().getTime(),
                    url: res.originalImagePath
                });
                $("#tabContent").html(videoMsgList[2].html);
            } else {
                alert("保存图片失败");
            }
        },
        error: function (e) {
            console.log("err:", e);
        }
    });
}

function upAudioCallback(res) {
    var packetsLostRate = res.packetsLostRate ? res.packetsLostRate.toFixed(2) : 0;
    $("#upAudioData").html('  <li>上行重传率：' + packetsLostRate + '</li>\n' +
        '    <li>上行带宽：' + res.bandwidth + 'kb/s</li>');
}

function upVideoCallback(res) {
    var packetsLostRate = res.packetsLostRate ? res.packetsLostRate.toFixed(2) : 0;
    $("#upVideoData").html('  <li>上行分辨率：' + res.resolution + '</li>\n' +
        '    <li>上行重传率：' + packetsLostRate + '</li>\n' +
        '    <li>上行带宽：' + parseInt(res.bandwidth) + 'kb/s</li>\n' +
        '    <li>上行帧率：' + res.frameRate + 'fps/s</li>');
}

function downAudioCallback(res) {
    let packetsLostRate = res.packetsLostRate ? res.packetsLostRate.toFixed(2) : 0;
    $("#downAudioData").html('<li>下行丢包率：' + packetsLostRate + '</li>\n' +
        '    <li>下行带宽：' + res.bandwidth + 'kb/s</li>\n' +
        '    <li>下行抖动：' + res.jitter + '</li>\n' +
        '    <li>下行延迟：' + res.delay + 'ms</li>');
}

function downVideoCallback(res) {
    var packetsLostRate = res.packetsLostRate ? res.packetsLostRate.toFixed(2) : 0;
    $("#downVideoData").html(' <li>下行分辨率：' + res.resolution + '</li>\n' +
        '    <li>下行丢包率：' + packetsLostRate + '</li>\n' +
        '    <li>下行带宽：' + parseInt(res.bandwidth) + 'kb/s</li>\n' +
        '    <li>下行帧率：' + res.frameRate + 'fps/s</li>\n' +
        '    <li>下行延迟：' + res.delay + 'ms</li>');
    if (res.packetsLostRate && res.delay) {
        $("#video-signal").html("<span class='icon-btn iconfont'>&#xe643</span>");
    } else if (res.packetsLostRate || res.delay) {
        $("#video-signal").html("<span class='icon-btn iconfont'>&#xe645</span>");
    } else {
        $("#video-signal").html("<span class='icon-btn iconfont'>&#xe644</span>");
    }
}

//video最右侧列表tab切换
$("#video-message-nav li").click(function () {
    if ($(this).hasClass("active-nav")) {
        return;
    }
    $("#video-message-nav li").removeClass("active-nav");
    $(this).addClass("active-nav");
    let currentName = $(this).text();
    console.log($(this).text());
    /* if(currentName == "网络监控"){
        CR.getStats(upAudioCallback,upVideoCallback,downAudioCallback,downVideoCallback);
    } */
    for (let i = 0; i < videoMsgList.length; i++) {
        if (videoMsgList[i].name == currentName) {
            $("#tabContent").html(videoMsgList[i].html);
            return false;
        }
    }
});
/* function changeQuickReplyType(){
    if($(this).hasClass("active-nav")){
        return;
    }
    $("#quickReply-nav li").removeClass("active-nav");
    $(this).addClass("active-nav");
    if($(this).text() == "常用语"){
        $("#smartReply").hide();
        $("#commonLagBtn").show();
        WebAgent.loadQuickReplyData();
    }else{
        $("#commonLagBtn").hide();
        $("#smartReply").show();
    }
}
//常用于tab切换
$("#quickReply-nav li").click(changeQuickReplyType); */

$("#acceptCall").click(function () {
    $("#callInTip").hide();
    if (callInTipSetTime && typeof callInTipSetTime == "function") {
        clearTimeout(callInTipSetTime);
    }
    WebAgent.imMakeCall();
});
$("#refusedCall").click(function () {
    $("#callInTip").hide();
    if (callInTipSetTime && typeof callInTipSetTime == "function") {
        clearTimeout(callInTipSetTime);
    }
    WebAgent.refusedCallIn();
});

function isLocking() {
    console.log('[CDesk] 当前置忙置闲状态不能使用');
    $("#setBusy").addClass('disabled');
    $("#setReady").addClass('disabled');
    $("#setAway").addClass('disabled');
    $("#setWorking").addClass('disabled');
}

function unLocking(s, moreStates) {
    console.log('[CDesk] 当前置闲置忙状态能使用,状态为:' + s);
    $("#setBusy, #setReady, #setAway, #setWorking, #changeskillGroup").removeClass('disabled');
    switch ( s ) {
        case "BUSY": {
            $("#state").text('已经置忙');
            $("#phoneBtn").removeClass('disabled');
            $("#setBusy").addClass('disabled');
            $("#callInternal").removeClass("disabled");
            $("#changeskillGroup").removeClass('disabled');
            $("#setAway").val("");
            break;
        }
        case "READY": {
            $("#state").text('已经置闲');
            $("#setReady").addClass('disabled');
            $("#setAway").val("");
            $("#callInternal").addClass("disabled");
            $("#changeskillGroup").addClass('disabled');
            if (moreStates.waState === "READY") {
                $("#phoneBtn").addClass('disabled');
            }
            break;
        }
        case "WORKING": {
            console.log('WORKING', '工作状态');
            $("#state").text('工作状态');
            $("#setWorking").addClass('disabled');
            $("#setAway").val("");
            $("#callInternal").addClass("disabled");
            $("#changeskillGroup").addClass('disabled');
            if (moreStates.waState === "READY") {
                $("#phoneBtn").addClass('disabled');
            }
            break;
        }
        case "AWAY": {
            $("#state").text('小休状态');
            break;
        }
        default: {
        
        }
    }
}

function transValue(param) {
    $("#numParam").val("");
    let innerHTML = param.innerHTML;
    let paramVal = innerHTML.replace("*", "");
    $("#numParam").val(paramVal);
    
}

// $("#logOutBtn").addClass('disabled');
// $("#logOutBtn").attr('disabled',true);
function handleDisabledBtn(flag) {
    let disabledBtnList = ['#logOutBtn', '#setBusy', '#setReady', '#reset', '#setAway', '#setSubscribe', '#callInternal', '#setModel', '#changeskillGroup', '#setWorking', "#more"];
    disabledBtnList.forEach(function (item) {
        flag ? $(item).addClass('disabled') : $(item).removeClass('disabled');
        $(item).attr('disabled', flag);
    });
}

handleDisabledBtn(true);

var subscribeFlag = false;





