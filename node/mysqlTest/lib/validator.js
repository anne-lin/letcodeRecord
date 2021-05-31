module.exports={
    username(user){
       if(!user){
           return "用户名不能为空"
       }else if(!/^\w{1,30}$/.test(user)){
           return "格式不对"
       }else {
           return null;
       }
    },
    password(password){
        if(!password){
            return "密码不能为空"
        }else if(password.length>36){
            return "密码最长36位"
        }else {
            return null
        }
    }
};
