var videoPushUrl="https://rtctest.channelsoft.com";
//var videoPushUrl="http://10.130.76.56";
var callInTipSetTime;
var isMute=false;
var blobImg;
var currentState="";
let cutImgList=[];
let robotAgentListHtml="",stateObj={
    "ready":"空闲",
    "busy":"置忙",
    "logout":"登出",
    "talk":"通话中"
};
let currentMonitorAgent;
let videoMsgList=[{
    name:"客户资料",
    html:`<ul>
        <li>姓名：小仙女</li>
        <li>性别：女</li>
        <li>证件类型：身份证</li>
        <li>证件号码：32313213243432312</li>
        <li>客户类型：vip客户</li>
    </ul>`
},{
    name:"实时质检",
    html:`<img src="./staticDemo/img/gif120.gif" class="list-img"/>`
},{
    name:"智能流程",
    html:`<img src="./staticDemo/img/AI120.gif" class="list-img"/>`
}];
let htmlBtnList="";
videoMsgList.forEach((item,index)=>{
    htmlBtnList+=`<li ${index == 0 ? 'class="active-nav"':''}>${item.name}</li>`;
    if(index == 0){
       $("#tabContent").html(item.html);
    }
});
$("#video-message-nav").html(htmlBtnList);

window.onload=function(){
    //$("#logined-box").height(($(document).height() - 100)+"px");

    htmlBtnList="";
    let videoBtnList=[{
        name:"静音",
        img:"&#xe61a"
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
        name:"保持",
        img:"&#xe60d"
    },{
        name:"自助服务",
        img:"&#xe613"
    },{
        name:"挂机",
        img:"&#xe67e"
    }];
    videoBtnList.forEach((item,index)=>{
        if(index == (videoBtnList.length -1)){
            htmlBtnList+=`<li style="color:red"><div class="icon-btn iconfont">${item.img}</div><p>${item.name}</p></li>`
        }else{
            htmlBtnList+=`<li><div class="icon-btn iconfont">${item.img}</div><p>${item.name}</p></li>`
        }
    });
    $(".video-btn").html(htmlBtnList);
    
    $(".video-btn > li").click(function(){
        console.log("status:",$(this).find("p"));
        switch($(this).find("p").text()){
            case "取消静音":               
            case "静音":{                
                window.CR && window.CR.setMute();
                if(isMute){
                    $(this).html(`<div class="icon-btn iconfont">&#xe61a</div><p>静音</p>`);
                    $(".video-btn li:eq(0)").removeClass("hold-disabled");
                }else{
                    $(this).html(`<div class="icon-btn iconfont">&#xe665</div><p>取消静音</p>`);
                    $(".video-btn li:eq(0)").addClass("hold-disabled");
                }
                isMute=!isMute;
                break;
            }
            case "保持":
            case "取消保持":{
                if(currentState == "hold"){
                    WebAgent.extend.holdReturn();
                    $(this).find("p").text("保持");
                }else{
                    WebAgent.extend.hold();
                    $(this).find("p").text('取消保持');
                }
                break;
            }
            case "自助服务":{
                break;
            }
            case "挂机":{
                WebAgent.extend.hangup();
                break;
            }
            default:{
                break;
            }
        }
    });    
}
function showVideoSetBox(){
    $("#tabContent").html(videoMsgList[3].html2);    
}
function setVideoParams(){
    var arr=[{
        width:320,
        height:240
    },{
        width:240,
        height:3200
    },{
        width:400,
        height:240
    },{
        width:240,
        height:400
    },{
        width:480,
        height:320
    },{
        width:320,
        height:480
    },{
        width:640,
        height:480
    },{
        width:480,
        height:640
    }];
    var resolution=$(".set-params input[name=resolution]:checked").val();
    var frame=$(".set-params input[name=frame]:checked").val();
    CR.changeDevice({
        bestWidth:arr[resolution].height,
        bestHeight:arr[resolution].width,
        bestFrameRate:frame
    });    
    $("#tabContent").html(videoMsgList[3].html);   
    $("#currentResolution").text(arr[resolution].width+"*"+arr[resolution].height);
    $("#currentFrame").text(frame);
}
//获取视频推送数据
function getVideoList(data){
    $.ajax({ 
        url:videoPushUrl+"/dcmsRecord/mvc/video/queryForSkillNames",
        type:"post",
        data:JSON.stringify(data), 
        contentType:"application/json;charset=UTF-8",
        dataType:"json",
        success:function(res){
            let htmlVideoPushList="<ul>";
            if(!res.data || !res.data[0].videoList || !res.data[0].videoList.length){
                //$("#tabContent").html("<div class='data-none-tip'>暂无数据</div>");
                videoMsgList[1].html="<div class='data-none-tip'>暂无数据</div>";
                return;
            }
            res.data[0].videoList.length && res.data[0].videoList.forEach((item)=>{
                htmlVideoPushList+=`<li class="flex">
                    <div class="desc-show">${item.videoName}一</div>
                    <div onClick="pushVideo('${item.shortOriginalFilePath}')" class="btn-div">推送</div>
                </li>`
            });
            //$("#tabContent").html(htmlVideoPushList+"</ul>");
            videoMsgList[1].html=htmlVideoPushList+"</ul>";
        }
    })
}
//执行推送
function pushVideo(url){
    WebAgent.extend.pushVideo({url});
}
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
function cutImg(type){
    let canvas,options={
        left:0,
        top:0
    }
    if(type == "custom"){
        options.cutTag=document.getElementById("video-container");
        options.width=270;
        options.height=400;
        options.canvas="canvas1";
    }else{
        options.cutTag=document.getElementById("local-video");
        options.width=90;
        options.height=160;
        options.canvas="canvas2";
    }
    canvas=CR.cutImg(options);      
    showCutImg(canvas);
    blobImg=dataURLtoFile(canvas,"img.png");
}
//图片重命名
function renameImg(event,id){
    if(event && event.keyCode != 13){
        return;
    }
    let reg=/^[\u4e00-\u9fa5|\w]{1,50}$/,
     index,value;
    if(event){
        index=event.currentTarget.id;
        value=event.currentTarget.value;
    }else{
        index=id;
        value=$(".img-cut-list li:eq("+index+")").find(".renameImg").val();
    }
    console.log("index:",index);
    if(reg.test(value)){
        cutImgList[index].name=value;
        $(".img-cut-list li:eq("+index+")").find(".desc-show").text(value);
    }
    $(".img-cut-list li:eq("+index+")").find(".img-name-input").hide();
    $(".img-cut-list li:eq("+index+")").find(".desc-show").show();
    $(".img-cut-list li:eq("+index+")").find(".rename-btn").show();
    $(".img-cut-list li:eq("+index+")").find(".confirm-btn").hide();
}
////图片重命名输入框显示
function openRenameImg(index){
    $(".img-cut-list li:eq("+index+")").find(".img-name-input").show();
    $(".img-cut-list li:eq("+index+")").find(".desc-show").hide();
    $(".img-cut-list li:eq("+index+")").find(".rename-btn").hide();
    $(".img-cut-list li:eq("+index+")").find(".confirm-btn").show();
    $(".renameImg").keydown(renameImg)
}
//图片查看/截图显示
function showCutImg(url,type){
    $("#tabContent").html(videoMsgList[2].html2);   
    $("#cutImg").attr("src",url);
    if(type == "view"){
        $("#handle-img-btn").hide();
    }
}
//取消图片
function closeShow(type){
    if(type == "img"){
        $("#tabContent").html(videoMsgList[2].html);   
    }else{
        $("#tabContent").html(videoMsgList[3].html);   
    }
}
//保存图片
function saveImg(){
    if(!blobImg){
        return;
    }
    var data = new FormData();
    data.append('fileToUpload',blobImg);
    console.log("data:",data);
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
                    name:"客户"+new Date().getTime(),
                    url:res.originalImagePath
                });
                $("#tabContent").html(videoMsgList[2].html);   
            }else{
                alert("保存图片失败");
            }
        },
        error: function (e) {
           console.log("err:",e);
        }
    })
}
                  
function upAudioCallback(res){
    $("#upAudioData").html(`
    <li>上行重传率：${res.packetsLostRate ? res.packetsLostRate.toFixed(2):0}</li>
    <li>上行带宽：${res.bandwidth}kb/s</li>`);
}
function upVideoCallback(res){
    $("#upVideoData").html(`
    <li>上行分辨率：${res.resolution}</li>
    <li>上行重传率：${res.packetsLostRate ? res.packetsLostRate.toFixed(2):0}</li>
    <li>上行带宽：${parseInt(res.bandwidth)}kb/s</li>
    <li>上行帧率：${res.frameRate}fps/s</li>`);
}
function downAudioCallback(res){
    $("#downAudioData").html(`
    <li>下行丢包率：${res.packetsLostRate ? res.packetsLostRate.toFixed(2):0}</li>
    <li>下行带宽：${res.bandwidth}kb/s</li>
    <li>下行抖动：${res.jitter}</li>
    <li>下行延迟：${res.delay}ms</li>`);
}
function downVideoCallback(res){
    $("#downVideoData").html(`
    <li>下行分辨率：${res.resolution}</li>
    <li>下行丢包率：${res.packetsLostRate ? res.packetsLostRate.toFixed(2):0}</li>
    <li>下行带宽：${parseInt(res.bandwidth)}kb/s</li>
    <li>下行帧率：${res.frameRate}fps/s</li>
    <li>下行延迟：${res.delay}ms</li>`);
    if(res.packetsLostRate && res.delay){
        $("#video-signal").html("<span class='icon-btn iconfont'>&#xe643</span>");
    }else if(res.packetsLostRate || res.delay){
        $("#video-signal").html("<span class='icon-btn iconfont'>&#xe645</span>");
    }else{
        $("#video-signal").html("<span class='icon-btn iconfont'>&#xe644</span>");
    }
}
//最右侧列表tab切换
$("#video-message-nav li").click(function(){
    if($(this).hasClass("active-nav")){
        return;
    }
    $("#video-message-nav li").removeClass("active-nav");
    $(this).addClass("active-nav");
    let currentName=$(this).text();
    console.log($(this).text());
    /* if(currentName == "网络监控"){
        CR.getStats(upAudioCallback,upVideoCallback,downAudioCallback,downVideoCallback);
    } */
    videoMsgList.some((item)=>{
        if(item.name == currentName){
            $("#tabContent").html(item.html);
        }
        return item.name == currentName;
    });
});
$("#acceptCall").click(()=>{
    $("#callInTip").hide();
    if(callInTipSetTime && typeof callInTipSetTime == "function") {
        clearTimeout(callInTipSetTime);
    }
    WebAgent.imMakeCall();
});
$("#refusedCall").click(()=>{
    $("#callInTip").hide();
    if(callInTipSetTime && typeof callInTipSetTime == "function"){
        clearTimeout(callInTipSetTime);
    }
    WebAgent.refusedCallIn()
});

function isLocking() {
    console.log('[CDesk] 当前置忙置闲状态不能使用');
    $("#setBusy").addClass('disabled');
    $("#setReady").addClass('disabled');
    $("#setAway").addClass('disabled');
}

function unLocking(s,moreStates) {
    console.log('[CDesk] 当前置闲置忙状态能使用,状态为:'+s);
    $("#setBusy, #setReady,#setAway").removeClass('disabled');
    switch (s){
        case "BUSY":{
            $("#state").text('已经置忙');
            $("#phoneBtn").removeClass('disabled');
            $("#setBusy").addClass('disabled');
            $("#callInternal").removeClass("disabled");
            $("#setAway").val("");
            break;
        }
        case "READY":{
            $("#state").text('已经置闲');
            $("#setReady").addClass('disabled');
            $("#setAway").val("");
            $("#callInternal").addClass("disabled");
            if(moreStates.waState === "READY"){
                $("#phoneBtn").addClass('disabled');
            }
            break;
        }
        case "AWAY":{
            $("#state").text('小休状态');
            break;
        }
        default:{

        }
    }
}

function transValue(param){
    $("#numParam").val("");
    let innerHTML = param.innerHTML;
    let paramVal = innerHTML.replace("*","");
    $("#numParam").val(paramVal);
}



$("#logOutBtn").addClass('disabled');
$("#logOutBtn").attr('disabled',true);

var subscribeFlag=false;
var cchatUrl = "WA/theme/cchat.js";
var urlPrefix="/"+window.location.pathname.split("/")[1];
WebAgent.init({
    useLocal: true,
    webRTCConfig:{
        tag: 'video-container',
        ringFile: 'WA/sounds/bell_ring2.wav',
        ringTag: 'belling-ring',
        localTag:"local-video"
    },
    callback: function() {
        WebAgent.WaInit({
            ui: false,
            sipUseCphone:false,
            callback:function() {
                WebAgent.attachModule(cchatUrl, function() {
                    WebAgent.ChatInit({
                        //selectorName: "#content",
                        loadBootstrap: false,
                        isCheckWord:false,
                        callback: function() {
                            $("#phoneBtn").click(()=>{
                                WebAgent.WaChat.toggle();
                            });
                            $("#logInBtn").click(function(){
                               
                                WebAgent.multiChannelLogin(WebAgent, {
                                    entId        : $("#entId").val(),
                                    agentId      : $("#agentId").val(),
                                    agentPassword: $("#password").val(),
                                    agentNumber  : $("#agentNumber").val(),
                                    isForce : false,
                                    assistants:"10008|sip:1001",
                                    waAutoLoginResult: false,
                                    isLocking: isLocking,
                                    unLocking:  unLocking
                                });
                                $(".robotAgent-monitor").hide();
                                $(".robotAgent-monitor-replace").show();
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

                           // WebAgent.ChatToggle();
                            WebAgent.WaChat.setPosition({
                                right:"7px",
                                top:"81px"
                            });

                            $("#logOutBtn").click(function() {
                                WebAgent.multiChannelLogout(()=>{
                                    console.log('登出之后执行的回调')
                                });
                                lougoutFlag = true;
                            });

                            $("#setBusy").click(function() {
                                if($("#state").text() == "已经置忙"){
                                    return;
                                }
                                WebAgent.multiChannelState.agentBusy(function(){
                                    console.log('[CDesk] 多渠道能力置忙成功');
                                },function(){
                                    console.log('[CDesk] 多渠道能力置忙失败');
                                });
                            });

                            $("#setReady").click(function() {
                                if($("#state").text() == "已经置闲"){
                                    return;
                                }
                                WebAgent.multiChannelState.agentReady(function(){
                                    console.log('[CDesk] 多渠道能力置闲成功');
                                },function(){
                                    console.log('[CDesk] 多渠道能力置闲失败');
                                });
                            });
                            $("#reset").click(function() {
                                WebAgent.extend.reset();
                            });

                            $("#subSubmitBtn").click(function () {
                                let status = $("#selectStatus").val();
                                let enableTime = $("#enableTime").val();
                                if(enableTime ==""){
                                    console.log("预约时间不能为空");
                                    $("#errorMsgPan").html("预约时间不能为空");
                                    return false;
                                }else{
                                    $("#errorMsgPan").html("");
                                }
                                console.log("获取到的状态值:"+status);
                                console.log("获取到的时间:"+enableTime);
                                let now = new Date();
                                let yy = now.getFullYear(),mm = now.getMonth() + 1,dd = now.getDate();
                                let subscribe = new Date(yy+"-"+mm+"-"+dd+" "+enableTime+":00");
                                console.log(subscribe+" : "+subscribe.getTime());
                                let subTime = subscribe.getTime() - now.getTime();
                                if(subTime > 0){
                                    window.setTimeout(function () {
                                        console.log("预约功能开始执行");
                                        switch (status) {
                                            case "busy":{
                                                if($("#state").text() == "已经置忙"){
                                                    console.log("已经置忙");
                                                    break;
                                                }
                                                WebAgent.multiChannelState.agentBusy(function(){
                                                    console.log('[CDesk] 多渠道能力置忙成功');
                                                },function(){
                                                    console.log('[CDesk] 多渠道能力置忙失败');
                                                });
                                                break;
                                            }
                                            case "reday":{
                                                if($("#state").text() == "已经置闲"){
                                                    console.log("已经置闲");
                                                    break;
                                                }
                                                WebAgent.multiChannelState.agentReady(function(){
                                                    console.log('[CDesk] 多渠道能力置闲成功');
                                                },function(){
                                                    console.log('[CDesk] 多渠道能力置闲失败');
                                                });
                                                break;
                                            }
                                            default:{
                                                WebAgent.multiChannelState.agentAway(function(){
                                                    console.log('[CDesk] 多渠道能力小休成功');
                                                },function(){
                                                    console.log('[CDesk] 多渠道能力小休失败');
                                                    $("#setAway").val("");
                                                    alert("状态修改失败");
                                                },status);
                                                $("#setAway").val(status);
                                                break;
                                            }
                                        }
                                        $("#setSubscribe").html("预约");
                                        $("#setSubscribe").css("background-color","#49abf6");
                                        $("#errorMsgPan").html("");
                                        subscribeFlag=false;
                                    },subTime);
                                    $("#subscribe-model-box").hide();
                                    $("#setSubscribe").html("已预约");
                                    $("#setSubscribe").css("background-color","#008800");
                                    subscribeFlag=true;
                                }else{
                                    console.log("预约时间必须晚于当前时间");
                                    $("#errorMsgPan").html("预约时间必须晚于当前时间");
                                }
                            });

                            $("#setSubscribe").click(function(){
                                var flag =  $("#logInBtn").prop("disabled");
                                if(flag == true && !subscribeFlag){
                                    $("#subscribe-model-box").show();
                                }
                            });
                            $("#subscribe-closeModel").click(function(){
                                $("#subscribe-model-box").hide();
                            });

                            $("#callInternal").click(function(){
                                var flag =  $("#state").text() == "已经置忙";
                                $("#agentTable").empty();
                                $("#skillTable").empty();
                                if(flag == true){
                                    var result = WebAgent.extend.agentGetList("1");
                                    if (result.code === 0) {
                                        console.log("[webAgent-wa]获取坐席列表命令发送成功");
                                    } else {
                                        console.log("[webAgent-wa] "+result.msg);
                                    }
                                    $("#numParam").val("");
                                    $("#selectCallInType").val("agent");
                                    $("#agentTable").show();
                                    $("#callinternal-model-box").show();
                                }
                            });
                            $("#selectCallInType").change(function(){
                                let that=$(this);
                                let htmlSkill = $("#tipSpanSkill").html();
                                let htmlAgent = $("#tipSpanAgent").html();
                                if(that.val() == "skill"){
                                    if(htmlSkill != ""){
                                        $("#tipSpanAgent").hide();
                                        $("#tipSpanSkill").show();
                                    }else{
                                        $("#tipSpanAgent").hide();
                                        $("#tipSpanSkill").hide();
                                        $("#agentTable").hide();
                                        $("#skillTable").show();
                                    }
                                }
                                if(that.val() == "agent"){
                                    if(htmlAgent != ""){
                                        $("#tipSpanSkill").hide();
                                        $("#tipSpanAgent").show();
                                    }else{
                                        $("#tipSpanAgent").hide();
                                        $("#tipSpanSkill").hide();
                                        $("#skillTable").hide();
                                        $("#agentTable").show();
                                    }

                                }
                            });
                            $("#callInSubmitBtn").click(function () {
                                let paramVal = $("#numParam").val();
                                let type = $("#selectCallInType").val();
                                if(type == "agent"){
                                    let agentId = paramVal.split("\-")[0];
                                    let param = {
                                        inCallNumber:agentId,
                                        skillGroupName:"",
                                        mediaType:"1"
                                    };
                                    let result =  WebAgent.extend.makeCallInternal(param);
                                    console.log(result);
                                    if(result.code == "000"){
                                        $("#callinternal-model-box").hide();
                                    }else{
                                        console.log("内呼发起失败: "+ result);
                                    }
                                }else if(type == "skill"){
                                    let param = {
                                        inCallNumber:"",
                                        skillGroupName:paramVal,
                                        mediaType:"1"
                                    };
                                    let result =  WebAgent.extend.makeCallInternal(param);
                                    console.log(result);
                                    if(result.code == "000"){
                                        $("#callinternal-model-box").hide();
                                    }else{
                                        console.log("内呼发起失败: "+ result);
                                    }
                                }
                            });
                            $("#callinternal-closeModel").click(function(){
                                $("#callinternal-model-box").hide();
                            });

                            $("#setNick").click(function () {
                                WebAgent.setNickName("C7F34F46F02000025DA55E501153109D","8989","webim","yinghan");
                            });


                            $("#setAway").change(function() {
                                let that=$(this);
                                WebAgent.multiChannelState.agentAway(function(){
                                    console.log('[CDesk] 多渠道能力小休成功');
                                },function(){
                                    console.log('[CDesk] 多渠道能力小休失败');
                                    $("#setAway").val("");
                                    alert("状态修改失败");
                                },$(this).val());
                            });

                            $("#loadQuickly").click(function(){
                                WebAgent.loadQuickReplyDom("#quickReply");
                            });

                            //加载常用语数据
                            $("#commonLagBtn").click(function() {
                                WebAgent.loadQuickReplyData();
                            });

                            //加载智能回复
                            $("#smartReplyBtn").click(function(){
                                WebAgent.loadSmartReplyDom("#smartReply");
                            });                        

                            //多渠道登录注册函数
                            WebAgent.multiRegisterEvent("login", function (data) {
                                if(data.type == 'loginSuccess') {
                                    console.log("loginSuccess");
                                    var awayStatusList;
                                    if(data.params.awayStatusList){
                                        awayStatusList=data.params.awayStatusList.split(";"),html="";
                                        awayStatusList.forEach(function (item) {
                                            if(item){
                                                var data=item.split("=");
                                                html+="<option value="+data[1]+">"+data[0]+"</option>"
                                            }
                                        });
                                        $("#setAway").html(html);
                                        let subAwayHtml="<option value='busy'>置忙</option><option value='reday'>置闲</option>"+html;
                                        $("#selectStatus").html(subAwayHtml);
                                    }
                                    ["logInBtn","entId","agentId","password","agentNumber"].forEach((item)=>{
                                        $("#"+item).attr('disabled',true);
                                    });
                                    $("#setAway").val("");
                                    $("#logInBtn").addClass('disabled');
                                    $("#logOutBtn").removeClass('disabled');
                                    $("#logOutBtn").attr('disabled',false);
                                    $(".unlogin-content").hide();
                                    CR.setAutoAnswer(true);
                                }
                                if(data.type == 'loginFail') {
                                    console.log(data.channel + "-loginFail");   
                                    $("#result").text(data.type+","+data.msg);
                                }else{
                                    $("#result").text(data.type);
                                }
                                $("#stateText").text(data.type);
                            });

                            //正在登出多渠道注册函数
                            WebAgent.multiRegisterEvent("logout", function() {
                                console.log("[CDesk]:正在登出多渠道");
                            });

                            //登录过程提示
                            WebAgent.multiRegisterEvent("setAgentStateText", function(data) {
                                $("#stateText").text(data.text);
                            });
                            WebAgent.multiRegisterEvent("webRTCError", function(data) {
                                alert("通话失败，"+data.message);
                            });

                            WebAgent.ChatRegisterEvent("openfireDisconnect", function() {
                                $("#stateText").text("openfire断开");
                                alert("openfire断开");
                                WebAgent.multiChannelLogout();
                                setTimeout(function () {
                                    console.log("执行登入");
                                    WebAgent.multiChannelLogin(WebAgent, {
                                        entId        : $("#entId").val(),
                                        agentId      : $("#agentId").val(),
                                        agentPassword: $("#password").val(),
                                        agentNumber  : $("#agentNumber").val(),
                                        waAutoLoginResult: false,
                                        isLocking: isLocking,
                                        unLocking:  unLocking,
                                    });
                                },2000);
                            });

                            WebAgent.ChatRegisterEvent("butelAjaxError", function(data) {
                                console.log('butelAjaxError:' + "ButelState:" + data.ButelState + ", AgentStatus:" + data.AgentStatus);
                            });

                            WebAgent.ChatRegisterEvent("autoMatchCallback", function() {
                                console.log("快捷回复");
                            });

                            WebAgent.ChatRegisterEvent("openIntellCallback", function() {
                                console.log("智能回复");
                            });
                            WebAgent.ChatRegisterEvent("callIn", function(data) {
                                $("#callInTip").show();

                                callInTipSetTime=setTimeout(function(){
                                    $("#callInTip").hide();
                                    callInTipSetTime="";
                                },30000);
                                $(".callInTip-nick").text(data.name);
                                $(".callInTip-tip").text(data.type == "video" ? "客户申请与你视频通话":"客户申请与你语音通话");
                            });

                            WebAgent.ChatRegisterEvent("newCustomInter", function(data) {
                                //data类型为对象，属性：userId/userSource/skillGroupId/skillGroupName/isTransfer: 0：正常的新用户进来，
                                //1：转接到该坐席，导致新用户进来/transferMessage: 转移留言
                                console.log("新用户到来：" + JSON.stringify(data));
                            });
                        }
                    });
                });

                WebAgent.registerEventHandler(function(data) {
                    switch(data.type){
                        case "EVENT_SOCKET_ABNORMAL_DISCONNECT":{
                            $("#stateText").text("socket 断开");
                            WebAgent.multiChannelLogout();
                            setTimeout(function () {
                                console.log("执行登入");
                                WebAgent.multiChannelLogin(WebAgent, {
                                    entId        : $("#entId").val(),
                                    agentId      : $("#agentId").val(),
                                    agentPassword: $("#password").val(),
                                    agentNumber  : $("#agentNumber").val(),
                                    waAutoLoginResult: false,
                                    isLocking: isLocking,
                                    unLocking:  unLocking,
                                });
                            },2000);
                            break;
                        }
                        case "EVENT_AGENT_LOGOUT":{                           
                            console.log("登出成功");
                            $("#stateText").text("初始化");
                            $("#result").text("未登录");
                            $("#state").text("未登录");
                            $("#logOutBtn").addClass('disabled');
                            ["logInBtn","entId","agentId","password","agentNumber"].forEach((item)=>{
                                $("#"+item).attr('disabled',false);
                            })
                            $("#logOutBtn").attr('disabled',true);
                            $("#logInBtn").removeClass('disabled');
                            $(".unlogin-content").show();
                            if(data.ext && data.ext.forceLogout == '1'){
                                alert("你已被强制登出");
                            }
                            break;
                        }
                        case "EVENT_MONITOR":{                            
                            $(".show-video-box").css("display","block");
                            $("#logined-box").width("1360px");
                            break;
                        }
                        case "EVENT_OUTBOUND_CONNECTED_OP":{      
                            $("#forceAbortRobot").addClass('disabled');
                            $("#fullAbortRobot").text("挂断");     
                            $(".robotAgent-monitor").show();
                            $(".robotAgent-monitor-replace").hide();                       
                            break;
                        }
                        //case "EVENT_QUIT_MONITOR_SUCCESS":
                        case "EVENT_TP_DISCONNECT":
                        case "EVENT_OP_DISCONNECT":{
                            console.log("通话结束");
                            currentState="free";
                            $(".show-video-box").css("display","none");
                            $("#logined-box").width("750px");
                            break;
                        }
                        case "EVENT_AGENT_GET_LIST":{
                            let callInType = $("#selectCallInType").val();
                            let agentList = data.ext.agentList;
                            let skillList = data.ext.skillList;
                            let agentListArr = agentList.split("|");
                            let skillListArr = skillList.split("|");
                            var agentItem;
                            if(agentListArr.length == 0||(agentListArr.length==1&&agentListArr[0]=="")){
                                if(callInType=="agent"){
                                    $("#tipSpanAgent").html("目前没有可呼叫坐席");
                                    $("#tipSpanAgent").show();
                                }
                            }else{
                                $("#tipSpanAgent").hide();
                            }
                            if(skillListArr.length == 0||(skillListArr.length==1&&skillListArr[0]=="")){
                                $("#tipSpanSkill").html("目前没有可呼叫技能组");
                                $("#tipSpanSkill").hide();
                            }else{
                                $("#tipSpanSkill").hide();
                            }
                            for(var i = 0; i < agentListArr.length - 1; i++) {
                                agentItem = agentListArr[i].split(":");
                                let agentName= agentItem[2];
                                let agentId=agentItem[0];
                                $("#agentTable").append("<tr ><td onclick='transValue(this)'>*"+agentId+"-"+agentName+"</td></tr>");
                            }
                            for(var i = 0; i < skillListArr.length - 1; i++) {
                                let skillName = skillListArr[i];
                                $("#skillTable").append("<tr ><td onclick='transValue(this)'>*"+skillName+"</td></tr>");
                            }
                            $("#skillTable").hide();
                            break;
                        }
                        case "EVENT_CLEAR_CALL":
                        case "EVENT_QUIT_MONITOR_SUCCESS":{
                            $(".robotAgent-monitor").hide();
                            $(".robotAgent-monitor-replace").show();
                            $("#forceAbortRobot").removeClass('disabled');
                            $("#fullAbortRobot").text("强行挂断");
                            console.log("通话结束");
                            currentState="free";
                            $(".show-video-box").css("display","none");
                            $("#logined-box").width("750px");
                            break;
                        }
                        case "EVENT_AGENT_LOGIN_FAIL_ROBOT":
                        case "EVENT_AGENT_NOTREADY_ROBOT":
                        case "EVENT_INBOUND_CONNECTED_ROBOT":
                        case "EVENT_AGENT_READY_ROBOT":{                            
                            $("#robotAgentNum").html(WebAgent.vm.robotAgentList().length);
                            robotAgentListHtml="";
                            WebAgent.vm.robotAgentList().forEach((item,index)=>{
                                robotAgentListHtml+=`<li class="flex robotAgent" onclick="selectedRobotAgent('${index}',this)">
                                            <div class="robotAgent-logo" style="background-color:${item.state == 'logout' ? 'red':'#49ABF6'}">
                                                <span class='icon-btn iconfont'>&#xe635</span>
                                            </div>
                                            <div class="robotAgent-msg">
                                                <p>智能助手-${item.robotId}</p>
                                                <p><span>${stateObj[item.state]}</span></p>
                                            </div>
                                        </li>`
                            })
                            $("#robotAgentList").html(robotAgentListHtml);
                            if($("#state").text() == "双方通话"){
                                break;
                            }
                            if((!currentMonitorAgent) || WebAgent.vm.robotAgentList()[currentMonitorAgent.index].state != "talk"){
                                $(".robotAgent-monitor").hide();
                                $(".robotAgent-monitor-replace").show();
                                $("#forceAbortRobot").removeClass('disabled');
                                $("#fullAbortRobot").text("强行挂断");
                            }
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                });             
                 
                //自动登录
                WebAgent.registerResultHandler(function(data) {
                    if(data.type == "autoLogin") {
                        if(data.code == 0) {
                            console.log("[WebAgent]自动登录成功:" + JSON.stringify(data));
                            var awayStatus = data && data.ext && data.ext.awayStatus;
                            WebAgent.multiChannelLogin(WebAgent, {
                                entId        : data.ext.entId,
                                agentId      : data.ext.agentId,
                                agentPassword: data.ext.password,
                                agentNumber  : "",
                                waAutoLoginResult: true,
                                waAutoLoginData: data,
                                awayStatus: awayStatus,
                                isLocking: isLocking,
                                unLocking:  unLocking
                            });
                        }
                    }else if(data.type == "makeCall" && data.code == "023"){
                        alert("呼叫失败，"+data.msg);
                    }
                });
                WebAgent.registerStateListener(function(data){
                    $("#state").text(data.desc);
                    $("#setBusy").addClass('disabled');
                    $("#setReady").addClass('disabled');
                    $("#setAway").addClass('disabled');
                    $("#callInternal").addClass('disabled');
                    switch(data.desc){
                        case "已经置闲":{
                            $("#setBusy").removeClass('disabled');
                            $("#setReady").removeClass('disabled');
                            $("#setAway").removeClass('disabled');
                            break;
                        }
                        case "已经置忙":{
                            $("#setReady").removeClass('disabled');
                            $("#setAway").removeClass('disabled');
                            $("#callInternal").removeClass('disabled');
                            break;
                        }
                        case "事后整理":{
                            $("#setBusy").removeClass('disabled');
                            $("#setReady").removeClass('disabled');
                            $("#setAway").removeClass('disabled');
                            break;
                        }
                    }
                    console.log("WA状态:" + JSON.stringify(data));
                });

            }
        });
    }
});
function forceAbortRobot(){
    if($("#state").text() != "双方通话"){
        WebAgent.extend.forceAbort();
    }
}
function fullAbortRobot(){
    if($("#state").text() == "双方通话"){
        WebAgent.extend.hangup();
    }else{
        WebAgent.extend.fullAbort();
    }
}
function selectedRobotAgent(index,ele){
    let robotAgent=WebAgent.vm.robotAgentList()[index];
    if(robotAgent.state != "talk"){
        return;
    }
    if(WebAgent.vm.currentState().key == "OBSERVED"){
        WebAgent.extend.hangup();
    }
    $(".robotAgent-monitor").show();
    $(".robotAgent-monitor-replace").hide();
    currentMonitorAgent=robotAgent;
    currentMonitorAgent.index=index;
    $(".robotAgent").css("background-color","#F2F2F2");
    $(ele).css("background-color","#F2F2F2");
    WebAgent.extend.observe({
        observeAgentId:robotAgent.robotId
    });
}
