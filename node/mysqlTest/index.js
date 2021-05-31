const http=require("http");
const mysql=require('mysql');
const co=require('co-mysql');
const url=require('url');
const queryString=require("querystring");
const validator=require("./lib/validator");

let conn=mysql.createPool({
    host:"10.130.29.10",
    user:"root",
    password:"000000",
    database:"chat",
    port:3306
});
let db=co(conn);
//服务允许访问前端应用列表
let allowOrigin={
    'http://localhost:8083': true
};
http.createServer((req,res)=>{
    //解决跨域
    let {origin}=req.headers;
    if(allowOrigin[origin]){
        res.setHeader('access-control-allow-origin', '*');
    }
    let path,query;
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

    async function complete() {
        let {username,password}=query;
        let errUsername=validator.username(username);
        let errPassword=validator.password(password);
        if(errUsername || errPassword){
            res.write(JSON.stringify({
                code:"-1",
                desc:errUsername ? errUsername:errPassword
            }));
            res.end();
        }
        if(path == "/reg"){
            try{
                let data=await db.query(`SELECT id FROM user_table WHERE user_name='${username}'`);
                console.log("data:",data);
                if(data.length){
                    res.write(JSON.stringify({
                        code:"-1",
                        desc:"此用户名已被占用"
                    }));
                }else {
                    await db.query(`INSERT INTO user_table (user_name, user_pass) VALUES('${username}', '${password}')`);
                    res.write(JSON.stringify({
                        code:"0",
                        desc:"注册成功"
                    }));
                }
            }catch (e) {
                console.log(e);
                res.write(JSON.stringify({
                    code:"0",
                    desc:"数据库异常"
                }))
            }
        }else if(path == '/login'){
            try {
                let data=await db.query(`SELECT user_pass FROM user_table WHERE user_name='${username}'`);
                if(data.length && data[0]["user_pass"]==password){
                    res.write(JSON.stringify({
                        code:"0",
                        desc:"登录成功"
                    }));
                }else {
                    res.write(JSON.stringify({
                        code:"-1",
                        desc:"登录失败"
                    }));
                }
            }catch (e) {
                console.log(e);
                res.write(JSON.stringify({
                    code:"0",
                    desc:"数据库异常"
                }))
            }

        }
        res.end();
    }

}).listen(8089);
