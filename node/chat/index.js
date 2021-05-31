const http=require("http");
const queryString=require("querystring");
const fs=require("fs");
const url=require('url');
const multiparty=require("multiparty");


let knowledgeBase={
    "你好":"hello,小仙女",
    "几点回家":"19：41以后我们就可以回家咯",
    "谁是世界上最帅的男孩纸":"当然是董文涛哥哥啦",
    "魔镜魔镜，世界上最漂亮的小姑凉是谁":"莹含小妹妹哦",
    "董文涛曾答应过我什么":"他说今晚给你100元钱"
};
let fileObj={};
let serve=http.createServer((req,res) => {
    let query,path;
    if(req.url == "/upload"){
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
            fileObj[fileName]=file.path;
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
        return;
    }
    if(req.method == "POST"){
        let arr=[];
        path=req.url;
        req.on("data",buffer=>{
            arr.push(buffer)
        });
        req.on("end",()=>{
            let buffer=Buffer.concat(arr);
            query = queryString.parse(buffer.toString());
            complete();
        })
    }else if(req.method == "GET"){
        let {pathname, queryJson}=url.parse(req.url, true);
        path=pathname;
        query=queryJson;
        complete();
    }

    function saveMsgFun(data) {
        fs.appendFile('./msgList.txt',JSON.stringify(data), err=>{
            if(err){
                console.log('失败', err);
            }else{
                console.log('成功');
            }
        });
    }
    function complete() {
        console.log(path);
        if(path == "/sendMsg"){
            let response=knowledgeBase[query.msg] ? knowledgeBase[query.msg]:"我不知道你在说什么啦";
            saveMsgFun({
                "direction":"req",
                "msg":query.msg
            });
            saveMsgFun({
                "direction":"res",
                "msg":response
            });
            res.write(JSON.stringify({code:"0",data:{
                    response:response
                }}));
            res.end();
        }else if(path == "/getAllMsg"){
            fs.readFile('./msgList.txt', (err, data)=>{
                if(err){
                    console.log('错误', err);
                }else{
                    res.write(JSON.stringify({code:"0",data:{
                            list:data.toString()
                        }}));
                    res.end();
                }
            });
        }else {
            fs.readFile(`./${path}`,(err,buffer)=>{
                if(err){
                    res.writeHeader(404);
                    res.write('Not Found');
                }else {
                    res.write(buffer);
                }
                res.end();
            })
        }
    }
});
serve.listen(8089);
