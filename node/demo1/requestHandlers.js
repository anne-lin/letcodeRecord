var exec=require('child_process').exec;
var querystring=require("querystring");
var fs=require("fs");
var formidable=require("formidable");


function start(response,postData){
    console.log('request handler star');  
    // exec("ls -lah",function(error,stdout,stderr){
    //     response.writeHead(200,{'content-type':'text/plain'});
    //     response.write(stdout);
    //     response.end();
    // })
    var body='<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>'+
    '</head>'+
    '<body>'+
        '<form action="/upload" method="post" enctype="multipart/form-data">'+
        '<textarea name="text" rows="20" cols="60"></textarea>'+
        '<input type="file" name="upload">'+
        '<input type="submit" value="Submit"/>'+
        '</form>'+
    '</body>'+
    '</html>';
    response.writeHead(200,{'content-type':'text/html'});
        response.write(body);
        response.end();
}
function upload(response,postData){
    console.log('request handler upload');  
    response.writeHead(200,{'content-type':'text/plain'});
        response.write(querystring.parse(postData).text);
        //response.write(postData);

        response.end();
}
function show(response,postData){
    fs.readFile("./tmp/test.jpeg","binary",function(error,file){
        if(error){
            response.writeHead(500,{"Content-Type":"text/plain"});
            response.write(error + "\n");
            response.end();
        }else{
            response.writeHead(200,{"Content-Type":"image/png"});
            response.write(file,"binary");
            response.end();
        }
    })
}

exports.upload=upload;
exports.start=start;
exports.show=show;