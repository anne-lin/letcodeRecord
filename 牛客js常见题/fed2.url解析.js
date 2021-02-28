function getUrlParam(sUrl, sKey) {
    let url = new URL(sUrl),res=[];
    console.log(url.search);
    if(sKey){
        console.log(new URLSearchParams(url.search).getAll(sKey));
        return res.length ? res.length == 1 ? res[0]:res:"";
    }else{
        return new URLSearchParams(url.search).entries();
    }
}
console.log(getUrlParam("http://www.nowcoder.com?key=1&key=2&key=3&test=4#hehe","key"))