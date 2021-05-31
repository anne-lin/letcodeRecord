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
module.exports={
    saveMsgFun
};
