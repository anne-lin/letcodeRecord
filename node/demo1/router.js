function route(pathname,handle,response,postData){
    console.log("route request:",pathname);
    if(typeof handle[pathname] == "function"){
        return handle[pathname](response,postData);
    }else{
        console.log("no request:",pathname);
        response.writeHead(404,{'content-type':'text/plain'});
        response.write("404 not found");
        response.end();
        return ;
    }
}

exports.route=route;