const {addRouter}=require('./route');
const validator=require("./validator");
const db=require('./database');

addRouter("post","/login",async (res,get,post,files)=>{
    let errUsername=validator.username(post.username);
    let errPassword=validator.password(post.password);
    if(errUsername || errPassword){
        res.writeJson({
            code:"-1",
            desc:errUsername ? errUsername:errPassword
        });
        res.end();
    }else {
        try {
            let data=await db.query(`SELECT user_pass FROM user_table WHERE user_name='${post.username}'`);
            if(data.length && data[0]["user_pass"]==password){
                res.writeJson({
                    code:"0",
                    desc:"登录成功"
                });
            }else {
                res.writeJson({
                    code:"-1",
                    desc:"登录失败"
                });
            }
            res.end();
        }catch (e) {
            res.writeJson({
                code:"0",
                desc:"数据库异常"
            });
            res.end();
        }
    }
});
addRouter("post","/reg",async (res,get,post,files)=> {
    let errUsername=validator.username(post.username);
    let errPassword=validator.password(post.password);
    if(errUsername || errPassword){
        res.writeJson({
            code:"-1",
            desc:errUsername ? errUsername:errPassword
        });
        res.end();
    }else {
        try{
            let data=await db.query(`SELECT id FROM user_table WHERE user_name='${post.username}'`);
            if(data.length){
                res.writeJson({
                    code:"-1",
                    desc:"此用户名已被占用"
                });
                res.end();
            }else {
                await db.query(`INSERT INTO user_table (user_name, user_pass) VALUES('${post.username}', '${post.password}')`);
                res.writeJson({
                    code:"0",
                    desc:"注册成功"
                });
                res.end()
            }
        }catch (e) {
            console.log("error:",e);
            res.writeJson({
                code:"-1",
                desc:"数据库异常"
            });
            res.end();
        }
    }

});

addRouter('post',"/upload",async (res,get,post,files)=>{
    saveMsgFun({
        "direction":"req",
        "msg":fileName
    });
    res.writeJson({
        code:"0",
        desc:"成功",
        data:{
            fileName:fileName
        }
    });
    res.end()
});
