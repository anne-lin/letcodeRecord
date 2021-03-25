let fakeIdToId={};
function workerfun(event){
    console.log("event:",event);
    let data=event.data,
        {name,fakeId}=data,        
        time;
    //一会儿详细了解
    if(data.hasOwnProperty('time')) {
        time = data.time;
    }
    switch(name){
        case "setInterval":{
            fakeIdToId[fakeId] = setInterval(() => {
                postMessage({
                    fakeId:fakeId
                })
            }, time);
            break;
        }
        case "clearInterval":{
            if(fakeIdToId[fakeId]){
                clearInterval(fakeIdToId[fakeId]);
                delete fakeIdToId[fakeId];
            }
            break;
        }
        case "setTimeout":{
            fakeIdToId[fakeId] = setTimeout(() => {
                console.log("setTimeout worker")
                postMessage({
                    fakeId:fakeId
                })
                if(fakeIdToId[fakeId]){
                    delete fakeIdToId[fakeId];
                }
            }, time);
            break;
        }
        case "clearTimeout":{
            if(fakeIdToId[fakeId]){
                clearTimeout(fakeIdToId[fakeId]);
                delete fakeIdToId[fakeId];
            }
            break;
        }
    }
}
onmessage=workerfun;