const superagent=require("superagent");
const {ServeError}=require("../lib/errorClass");
async function login(number) {
    let resLogin= await superagent
        .post("http://kq.channelsoft.com:49527/iclock/accounts/login/")
        .set("Content-Type","application/x-www-form-urlencoded")
        .send({
            "username": number,
            "password": number,
            "logintype": "employee"
        });
    if(JSON.parse(resLogin.text).ret != 2){
        throw new ServeError(500,"登录失败");
    }
    return resLogin.headers["set-cookie"][0].split(";")[0];
}
async function getData(starttime,endtime,cookie){
    let result=await superagent
        .post(`http://kq.channelsoft.com:49527/iclock/staff/transactions/?starttime=${starttime}&endtime=${endtime}`)
        .set("cookie",cookie)
        .accept('application/json');
    return result;
}

module.exports={
    login,
    getData
};
