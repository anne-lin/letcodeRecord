var http=require("http");
var url=require('url');

function start(route,handle){
    function onRequest(request,response){
        var pathname=url.parse(request.url).pathname;
        //一个服务器请求出发两次：第一次为请求favicon.ico 
        console.log("pathname:",pathname);
        
        route(handle,pathname,response,request)
    }
    http.createServer(onRequest).listen(8888);
    console.log("haha2");
}
exports.start=start;