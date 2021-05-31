const http=require('http');
const url=require('url');
const querystring=require('querystring');
const router=require("./lib/route");
const zlib=require('zlib');
const io=require("socket.io");
const commonFun=require("./lib/commonFun");
const fs=require("fs");
require("./lib/routeFun");
const {HTTP_UPLOAD,HTTP_PORT,HTTP_ROOT,allowOrigin}=require("./config");


let server=http.createServer((req,res)=>{
    //解决跨域
    let {origin}=req.headers;
    if(allowOrigin[origin]){
        res.setHeader('access-control-allow-origin', '*');
    }

    res.writeJson=function (json){
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(json));
    };

    let query;
    if(req.method == 'POST'){
        let pathName=req.url;
        if(req.headers['content-type'].startsWith('application/x-www-form-urlencoded')){
        let arr=[];
        req.on("data",buffer=>{
            arr.push(buffer);
        });
        req.on("end",()=>{
            let buffer=Buffer.concat(arr);
            query=querystring.parse(buffer.toString());
            handle(req.method, pathName, {}, query,{});
        });
      }else {
        let form=new multiparty.Form({
            uploadDir:HTTP_UPLOAD
        });
        let files={};
        form.parse(req);
        form.on('filed',(name,value)=>{
            query[name]=value;
        });
        form.on("file",(name,file)=>{
            files[name]=file;
        });
        form.on('error', err=>{
                console.log(err);
        });
        form.on('close', ()=>{
            //2.找路由
            handle(req.method, pathName, {}, query,files);
        });
      }
    }else {
        let {pathname, queryJson}=url.parse(req.url, true);
        query=queryJson;
        handle(req.method, pathname, query, {}, {});
    }

    async function handle(method,url,getData,postData,files) {
        let fn=router.findRouter(method,url);
        if(!fn){
            let filepath=HTTP_ROOT+url;
            fs.stat(filepath,(err,stat)=>{
                if(err){
                    res.writeHeader(404);
                    res.write("not found");
                    res.end();
                }else {
                    let rs=fs.createReadStream(filepath);
                    let gz=zlib.createGzip();
                    rs.on("error",()=>{});
                    res.setHeader('content-encoding','gzip');
                    rs.pipe(gz).pipe(res);
                }
            })
        }else {
            try{
                await fn(res, getData, postData, files);
            }catch (e) {
                res.writeHeader(500);
                res.write('Internal Server Error');
                res.end();
            }
        }
    }
}).listen(HTTP_PORT);


let wsServer=io.listen(server);
wsServer.on("connection",(socket)=>{

    socket.on("sendMsg",msg=>{

        let response=robotAnswer[msg] ? robotAnswer[msg]:"我不知道你在说什么啦";
        commonFun.saveMsgFun({
            "direction":"req",
            "msg":msg
        });
        commonFun.saveMsgFun({
            "direction":"res",
            "msg":response
        });
        socket.emit('getMsg',response);

    });

    fs.readFile('./upload/msgList.txt', (err, data)=>{
        if(err){
            console.log('错误', err);
        }else{
            socket.emit('msgList',data.toString());
        }
    });
});
console.log("serve run",HTTP_PORT);

