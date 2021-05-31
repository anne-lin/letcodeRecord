const {robotAnswer}=require("../config");
const fs=require("fs");
function saveMsgFun(data) {
    fs.appendFile('../upload/msgList.txt',JSON.stringify(data), err=>{
        if(err){
            console.log('失败', err);
        }else{
            console.log('成功');
        }
    });
}

function socketFun(socket) {
    socket.on("sendMsg",msg=>{

        let response=robotAnswer[msg] ? robotAnswer[msg]:"我不知道你在说什么啦";
        saveMsgFun({
            "direction":"req",
            "msg":msg
        });
        saveMsgFun({
            "direction":"res",
            "msg":response
        });
        socket.emit('getMsg',response);

    });

    fs.readFile('../upload/msgList.txt', (err, data)=>{
        if(err){
            console.log('错误', err);
        }else{
            socket.emit('msgList',data.toString());
        }
    });
};
module.exports={
    socketFun,
};
