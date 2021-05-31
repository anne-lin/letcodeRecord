var fn_index=async (ctx,next)=>{
    // await next();
    console.log("hello page");
    ctx.response.type = 'text/html';
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
};

var fn_login=async (ctx,next)=>{
    // await next();
    let data=ctx.request.body;
    console.log("data:",ctx.request.body);

    let {name="",password=""} = data;

    if(name == 'yinghan' && password == "haha"){
        // ctx.response.body=`<h1>hello ${name}</h1>`
        ctx.response.type = "json";
        ctx.response.body = { data: "成功"}
    }else {
        ctx.response.body=`<h1>Login fail!</h1><p><a href="/">try again</a></p>`
    }

};

module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_login
};