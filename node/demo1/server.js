var http=require("http");
var url=require('url');
var formidable=require("formidable");

function start(route,handle){
    function onRequest(request,response){
        var postData="";
        var pathname=url.parse(request.url).pathname;
        //一个服务器请求出发两次：第一次为请求favicon.ico 
        console.log("pathname:",pathname);
        
        request.setEncoding("utf8");

        request.addListener("data",function(data){
            postData+=data;
            console.log("postData:",postData);
        });

        request.addListener("end",function(){
            route(pathname,handle,response,postData)
        });
    }
    http.createServer(onRequest).listen(8080);
    console.log("haha2");
}
exports.start=start;