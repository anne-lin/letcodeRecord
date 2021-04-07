function Event(){
  var clientList={},
      listen,
      trigger,
      remove;
  listen = function(key,fn){
    if(!clientList[key]){
      clientList[key]=[];
    }
    clientList[key].push(fn);
  }

  trigger = function(key){
    var key=Array.prototype.shift.call(arguments),
        fns = clientList[key];
    if(!fns || fns.length === 0){
      return false;
    }
    for(let i=0;i<fns.length;i++){
      fns[i].apply(this,arguments)
    }
  }
  remove = function(key,fn){
    var fns=clientList[key];
    if(!fns){
      return false;
    }
    if(!fn){
      fns && (fns.length = 0)
    }else{
      for(var i=0;i<fns.length;i++){
        if(fns[i] == fn){
          fns.splice(i,1);
          return true;
        }
      }
    }
  }

  return {
    listen,
    trigger,
    remove
  }
}

let event=Event();