function deepCopy(src){
    if(typeof src != "object"){
        return src;
    }
    let dest={};
    for (const [key, val] of Object.entries(src)) {
        dest[key]=deepCopy(val);
    }
    return dest;
}
let jack = {
    name : "jack.ma",
    age:40,
    like:{
        dog:{
            color:'black',
            age:3,
        },
        cat:{
            color:'white',
            age:2
        }
    },
    sayName:function(){
        console.log(this.name);
    }
}
let jack2 = deepCopy(jack);
jack.like.dog.color = "jack";
console.log(jack2);