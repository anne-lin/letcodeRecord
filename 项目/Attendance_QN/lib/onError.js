const {AuthenticationError,ServeError}=require("./errorClass");
module.exports=function(err,ctx) {
    console.log("error:",err.message);
    ctx.status = err.code || 500;
    ctx.body={
        msg:err.message
    };
    /*if (err instanceof AuthenticationError) {
        ctx.status = err.code || 500;
        ctx.body={
            msg:err.message
        };
    }
    if(err instanceof ServeError){
        ctx.status = err.code || 500;
        ctx.body={
            msg:err.message
        };
    }
    else
    {
        ctx.status = err.code || 500;
        ctx.body={
            msg:err.message
        };
    }*/
};
