class RTC{
    constructor(){
        console.log("RTC");
    }
    enumerateDevices(){
        navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            console.log(devices);
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
    }
    getUserMedia(params){
        return new Promise((resolve,reject)=>{
            navigator.mediaDevices.getUserMedia(params).then((stream)=>{
                resolve(stream);
           }).catch(e=>{
               reject(e);
           })
        });       
    }
}
export default RTC;