var socket;
function initSocket(room){
  var isInitiator;

  //room = prompt('Enter room name:'); //弹出一个输入窗口

  socket = io.connect("http://10.130.15.34:2013"); //与服务端建立socket连接

  if (room !== '') { //如果房间不空，则发送 "create or join" 消息
    console.log('Joining room ' + room);
    socket.emit('create or join', room);
  }

  socket.on('full', (room) => { //如果从服务端收到 "full" 消息
    console.log('Room ' + room + ' is full');
  });

  socket.on('empty', (room) => { //如果从服务端收到 "empty" 消息
    isInitiator = true;
    console.log('Room ' + room + ' is empty');
  });
  socket.on('sdp', (sdp) => { 
    if(direction && direction == "call"){
      rtc.saveRemoteSdp(sdp);
    }else{
      rtc=new RTC();
      direction="answer";
      mediaBox.getLocalMediaStream({
        video:true,
        audio:false
      }).then((steram)=>{        
        rtc.answer(sdp,steram);
      })
    }
  });
  socket.on('candidate', (candidate) => { 
    console.log("candidate:",candidate);
    rtc.getIceMsg(candidate);
  });
  socket.on('join', (room) => { //如果从服务端收到 “join" 消息
    console.log('Making request to join room ' + room);
    console.log('You are the initiator!');
  });
  socket.on("hangup",()=>{
    mediaBox.stopMedia();
    rtc.hangup();
  })

  socket.on('log', (array) => {
    console.log.apply(console, array);
  });
}
class RTC{
  constructor(){
    this.peerConnection=new RTCPeerConnection({
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302' // 使用谷歌的stun服务
      }]
    });
    this.remoteStream;
    this.peerConnection.onaddstream = function(event){
      remoteVideo.srcObject=event.stream;
      this.remoteStream=event.stream;
    };
    this.peerConnection.onicecandidate = function(event) {
      if (event.candidate) {
        socket.emit("candidate",event.candidate);
      }
    };
    this.getIceMsg=(candidate)=>{
      this.peerConnection.addIceCandidate(
        new RTCIceCandidate(candidate), 
        ()=>{
          console.log("save candidate success");
        }, 
        this.onError
      );
    }
  }
  
  localDescCreated(desc){
    this.peerConnection.setLocalDescription(desc, ()=>{
      socket.emit("sdp",this.peerConnection.localDescription);
    },this.onError);
  }  
  call(mediaStream){
    this.peerConnection.addStream(mediaStream);
    this.peerConnection.createOffer()
    .then((sdp)=>{
      this.localDescCreated(sdp);
    })
    .catch(this.onError);
  }
  answer(sdp,mediaStream){
    if(!sdp){
      return;
    }
    this.peerConnection.addStream(mediaStream);
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp), ()=>{
      this.peerConnection.createAnswer()
        .then((sdp)=>{
          this.localDescCreated(sdp);
        })
        .catch(this.onError);
    }, this.onError);
  }
  saveRemoteSdp(sdp){
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp), function(){
      console.log("save remote sdp success");
    },this.onError);
  }
  hangup=()=>{
    this.peerConnection.close();
    if (typeof this.remoteStream.stop == 'function') {
      this.remoteStream.stop();
    } else {
      this.remoteStream.active = false;
    }
    remoteVideo.srcObject=null;
  }
  onError(e){
    console.log(e);
  }
}
function handleMedia(){
  this.localStream;
  this.getLocalMediaStream=function(constraints){
    return new Promise((resolve,reject)=>{
      navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaStream)=>{
        localVideo.srcObject = mediaStream;
        this.localStream = mediaStream;
        resolve(mediaStream);
      })
      .catch((e)=>{
        reject(e);
      })
    });
  }
  this.stopMedia=function(){
    if(this.localStream.active){
      var tracks = this.localStream.getTracks();
      tracks.forEach((track)=>{
          track.stop();
      });
      localVideo.srcObject=null;
    }
  }
}
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');
const roomName = document.getElementById('roomName');
let rtc,direction,mediaBox;
mediaBox =new handleMedia();
startButton.onclick = function(){
  if(roomName.value){
    initSocket(roomName.value);
  }
}
callButton.onclick = function(){
  direction="call";
  mediaBox.getLocalMediaStream({
    video:true,
    audio:false
  }).then((steram)=>{
    rtc=new RTC();
    rtc.call(steram);
  })
  this.disabled = false;
};
hangupButton.onclick = function(){
  mediaBox.stopMedia();
  rtc.hangup();
  socket.emit("hangup");
}