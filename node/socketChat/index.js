const http=require("http");
const io=require("socket.io");
const fs=require("fs");
const multiparty=require("multiparty");

function saveMsgFun(data) {
    fs.appendFile('./msgList.txt',JSON.stringify(data), err=>{
        if(err){
            console.log('失败', err);
        }else{
            console.log('成功');
        }
    });
}
let knowledgeBase={
    "你好":"hello,小仙女",
    "几点回家":"19：41以后我们就可以回家咯",
    "谁是世界上最帅的男孩纸":"当然是董文涛哥哥啦",
    "魔镜魔镜，世界上最漂亮的小姑凉是谁":"莹含小妹妹哦",
    "董文涛曾答应过我什么":"他说今晚给你100元钱"
};
let allowOrigin={
    'http://localhost:8083': true
};
let server=http.createServer((req,res)=>{
    //解决跨域
    let {origin}=req.headers;
    if(allowOrigin[origin]){
        res.setHeader('access-control-allow-origin', '*');
    }

    if(req.url == "/upload") {
        let form=new multiparty.Form({
            uploadDir:"./upload"
        });
        let fileName;
        form.parse(req);
        form.on('field', (name, value)=>{
            console.log('字段：', name, value);
        });
        form.on('file', (name, file)=>{
            console.log('file:', name, file);
            fileName=file.originalFilename;
            //fileObj[fileName]=file.path;
        });

        form.on('close', ()=>{
            console.log("fileName:",fileName);
            saveMsgFun({
                "direction":"req",
                "msg":fileName
            });
            res.write(JSON.stringify({code:"0",desc:"成功",data:{
                    fileName:fileName
                }}));
            res.end();
        });
    }
}).listen(8089);

let wsServer=io.listen(server);
wsServer.on("connection",socket=>{
    socket.on("sendMsg",msg=>{
        console.log("msg:",msg);

        let response=knowledgeBase[msg] ? knowledgeBase[msg]:"我不知道你在说什么啦";
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

    fs.readFile('./msgList.txt', (err, data)=>{
        if(err){
            console.log('错误', err);
        }else{
            socket.emit('msgList',data.toString());
        }
    });

});

