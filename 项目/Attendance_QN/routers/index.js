const {AuthenticationError}=require("../lib/errorClass");
const {login,getData}=require("./getServeData");

function checkBaseParame(data) {
    let {number,startDate,endDate}=data;
    let dateReg=/^\d{4}-\d{2}-\d{2}$/;
    if(number && /^\d+$/.test(number) && startDate && endDate && dateReg.test(startDate) && dateReg.test(endDate)){
        return true;
    }else {
        throw new AuthenticationError(500,"输入信息有误");
    }
}
function decodeUnicode(arr) {
    let dayArr=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],index,tmp;
    arr.forEach(item=>{
        index=new Date(item[2][0]).getDay();
        item[0]=item[0].slice(1);
        item[1]=unescape(item[1].replace(/\\u/gi, '%u'));
        item[4]=unescape(item[4].replace(/\\u/gi, '%u'));
        item[5]=dayArr[index];
        item[6]=unescape(item[6].replace(/\\u/gi, '%u')).slice(0,2);
        tmp=item[2][1].split(":");
        item[7]=index == 0 || index == 6 || tmp[0] > 20 || (tmp[0] == 20 && tmp[1] > 30);
    });
    return arr;
}
function cleanData(data){
    data=data.split("], [");
    let dataTmp=[];
    data.reduce((pre,cur,item)=>{
        if(item == 1){
            pre=pre.slice(2).split('", "');
            pre[2]=pre[2].split(" ");
            dataTmp.push(pre);
            cur=cur.split('", "');
            cur[2]=cur[2].split(" ");
            return cur;
        }
        if(item == (data.length-1)){
            cur=cur.slice(0,cur.length-2).split('", "');
            cur[2]=cur[2].split(" ");
            dataTmp.push(cur);
            return cur;
        }
        cur=cur.split('", "');
        cur[2]=cur[2].split(" ");
        if(pre[2][0] != cur[2][0]){
            dataTmp.push(pre);
            dataTmp.push(cur);
        }
        return cur;
    });
    return decodeUnicode(dataTmp);
}
async function fetchDate(ctx) {
    console.log("fetch");
    let body=(typeof ctx.request.body == "string") ? JSON.parse(ctx.request.body) : ctx.request.body;
    let {number,startDate,endDate}=body;
    if(!checkBaseParame(body)){
       return;
    }
    console.log("session:",ctx.session[number]);
    if(!ctx.session[number]){
        ctx.session[number]=await login(number);
    }
    let res=await getData(startDate,endDate,ctx.session[number]);
    let result=cleanData(res.text);
    ctx.body={
        code:0,
        list:result
    }
}

module.exports=fetchDate;
