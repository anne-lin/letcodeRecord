class RTC{
    constructor(options) {
        this.direction = options.direction;
        this.callback = options && options.callback || {};
        this.peerConnection = new RTCPeerConnection({
            iceServers: [{
                urls: 'stun:stun.l.google.com:19302' // 使用谷歌的stun服务
            }]
        });        
      this.peerConnection.onaddstream = (event)=> {
        if (options.callback.onaddRemoteStream) {
              this.callback.onaddRemoteStream(event.stream);
        }
        this.remoteStream=event.stream;
      };
      this.peerConnection.onicecandidate = (event) =>{
          if (event.candidate && this.callback.onicecandidate) {
            this.callback.onicecandidate(event.candidate);
          //socket.emit("candidate",event.candidate);
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
        this.peerConnection.setLocalDescription(desc, () => {
            if (this.callback.setLocalDescription) {
                this.callback.setLocalDescription(this.peerConnection.localDescription)
          }
      },this.onError);
    }  
    call(mediaStream) {
      this.localStream = mediaStream;
      this.peerConnection.addStream(mediaStream);
      this.peerConnection.createOffer()
      .then((sdp)=>{
        this.localDescCreated(sdp);
      })
      .catch(this.onError);
    }
    answer(sdp,stream){
      if(!sdp){
        return;
      }
      this.peerConnection.addStream(stream);
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp), ()=>{
        this.peerConnection.createAnswer()
          .then((sdp) => {
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