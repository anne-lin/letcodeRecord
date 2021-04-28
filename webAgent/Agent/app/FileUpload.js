/**
 * Created by fei on 2015/11/26.
 */
define(["jquery", "Vm", "VmQuickReply", "util"], function($, Vm, VmQuickReply, util) {

    var percentComplete;
    function uploadFile(file) {

        var target = file;
        var targetId = file.id;
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        var fileSize = 0;

        var filepath = target.value;
        var fileMaxSize = 1024 * 5;//5M

        //允许发送的图片类型
        var imgRegx = new RegExp("\.(jpg|png|gif|jpeg|bmp|tif|tiff|wbmp|ico|svg)$", "g");

        //允许发送的文件类型
        var fileRegx = new RegExp("\.(zip|rar|7z|doc|docx|xlsx|xls|amr|wav|mp3|txt|mp4|MP4|OGG|ogg|webm|WEBM)$", "g");

        //只有webim和appim渠道可以发送文件
        if( (!filepath.match(imgRegx) && !filepath.match(fileRegx)) ||
            (!filepath.match(imgRegx) && (Vm.currentUser().channel != "webim" && Vm.currentUser().channel != "appim"))
           ) {
            alert("该类型文件不允许发送，请重新选择");
            return false;
        }

        if (isIE && !target.files) {
            try {
                var filePath = target.value;
                var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                if (!fileSystem.FileExists(filePath)) {
                    alert("附件不存在，请重新输入！");
                    return false;
                }
                var file = fileSystem.GetFile(filePath);
                fileSize = file.Size;
            } catch (e) {
                util.Log("error",e);
                return;
            }
        } else {
            fileSize = target.files[0].size;
        }

        var size = fileSize / 1024;
        if (size > fileMaxSize) {
            alert("文件超过5M，无法发送!");
            target.value = "";
            return false;
        }
        if (size <= 0) {
            alert("文件大小不能为0!");
            target.value = "";
            return false;
        }

        var fd = new FormData();
        fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        //xhr.open("post", Config.FILE_UPLOAD_URL, true);
        xhr.open("post", WebAgent.config.FILE_UPLOAD_URL, true);
        xhr.send(fd);
    }

    function uploadProgress(evt) {
        var done = evt.position || evt.loaded;
        var total = evt.totalSize || evt.total;
        if (evt.lengthComputable) {
            percentComplete = Math.round(done / total * 100) + "%";
            $("#progressNumber").show();
            $("#progressNumber").text(percentComplete);
        }
        else {
            document.getElementById('progressNumber').innerHTML = 'unable to compute';
        }
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        if($("#progressNumber").text() === "100%") {
            $("#progressNumber").hide();
        }
        var responseText = JSON.parse(evt.target.responseText);

        switch(responseText.ok.toString()) {
            case "0":
                alert(responseText.error);
                break;
            case "1":
                var originalPath = responseText.originalImagePath || responseText.originalFilePath;
                var zoomUrl = responseText.zoomImageUrl || "";

                var type = zoomUrl ? "image" : "file";

                Vm.sendMessage(type, originalPath, zoomUrl);
                break;
            case "2":
                alert(responseText.error);
                break;
            default:
                break;
        }
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.");
    }

    function uploadCanceled(evt) {
        alert("The upload has been canceled by the user or the browser dropped the connection.");
    }

    function fileSelected() {
        percentComplete = 0;
        $("#fileToUpload").val("");
        $("#fileToUpload").trigger("click");
    }

    function commLangSelected(){
        $("#commLangToUpload").val("");
        $("#commLangToUpload").trigger("click");
    }
    function uploadCommLang(){
        var formData = new FormData(),
            fileCont = document.getElementById("commLangToUpload").files[0];
        // 建立一个upload表单项，值为上传的文件
        formData.append("file", fileCont);

        var xhr = new XMLHttpRequest();
        var url = WebAgent.config.quickSmartReplyPath_sensitive +"/sentence/importSentence?entId=" + Vm.agentEntId() + "&agentId=" + Vm.agentId();
        xhr.open('POST', url);
        // 定义上传完成后的回调函数
        xhr.onload = function (evt) {
            var res = JSON.parse(evt.target.responseText);
            util.Log("info",res);
            if(res.code == 0) {
                //VmQuickReply.getGroupListForAgent();
                VmQuickReply.operateTip(res.desc);
                setTimeout(function(){
                    VmQuickReply.operateTip(null);
                    VmQuickReply.getGroupListForAgent();
                },3000)
            } else {
                VmQuickReply.operateTip(res.desc);
                setTimeout(function(){
                    VmQuickReply.operateTip(null);
                },2000)
            }
        };
        xhr.error = function(evt) {
            alert("There was an error attempting to upload the file.");
        };
        xhr.send(formData);
    }

    return {
        fileSelected: fileSelected,
        uploadFile: uploadFile,
        commLangSelected:commLangSelected,
        uploadCommLang:uploadCommLang
    };
})