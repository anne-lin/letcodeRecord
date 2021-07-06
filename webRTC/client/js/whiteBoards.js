const remoteVideo = document.getElementById('remoteVideo');
const canvas = document.getElementById('canvas');
const sendCanvas = document.getElementById('sendCanvas');
const callback = {
    onaddRemoteStream: function (stream) {
        remoteVideo.srcObject = stream;
        VideoToCanvasTmp(remoteVideo,canvas);
    },
    onicecandidate: function (candidate) {
        socket.emit("candidate",candidate);
    },
    setLocalDescription: function (localDescription) {
        socket.emit("sdp",localDescription);
    },
};
let palette,rtc;
initSocket("456");

sendCanvas.onclick = function(){
    let steram = canvas.captureStream();
    rtc = new RTC({
        direction: "request",
        callback
    });
    rtc.call(steram);
    initPalette(canvas);
};

events.on("socketOnSdp", function (sdp) {
    if (rtc && rtc.direction && rtc.direction == "request") {
        rtc.saveRemoteSdp(sdp);
    } else {
        rtc = new RTC({
            direction: "response",
            callback
        });
        let steram = canvas.captureStream();
        rtc.answer(sdp, steram);
        initPalette(canvas);
    }
});
events.on("socketCandidate", (candidate) => {
    rtc.getIceMsg(candidate);
});
events.on("hangup", () => {
    //hangup
});

function initPalette(canvas) {
    palette=new Palette(canvas, {
      drawColor: 'rgba(19, 206, 102, 1)',
      drawType: 'line',
      lineWidth: 5,
      allowCallback: function (cancel, go) {
        console.log("allowCallback:",cancel, go);
      }
  });
  }

