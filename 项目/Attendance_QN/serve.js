const Koa = require('koa');
const Router=require('koa-router');
const koaBody=require("koa-body");
const config=require("./config");
const static=require("koa-static");
const path=require("path");
const fetchData=require("./routers");
const session=require("koa-session");
const fs=require("fs");

let server=new Koa();
server.listen(config.PORT);
console.log("listen:",config.PORT);

let router=new Router();
server.context.config=config;
server.use(koaBody()); 

server.keys=fs.readFileSync('.keys').toString().split('\n');
server.use(session({
    maxAge:20*60*1000,
    renew:true
},server));

//中间件
server.use(async (ctx, next)=>{
    try{
        await next();
    }catch(err){
        console.log("error");
        ctx.app.emit("error",err,ctx);
    }
});
server.on('error',require("./lib/onError"));

//静态资源获取
server.use(static(
    path.join(__dirname,"./static")
));

//前端查询接口获取
router.post("/fetchData",async (ctx)=>{
    await fetchData(ctx);
});

server.use(router.routes());

