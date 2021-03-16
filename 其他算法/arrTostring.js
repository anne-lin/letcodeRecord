//多维数组转成一维数组
let arr=[1,2,[3,4],5,[6,9,[8,9]]];

function toArr(arr){
    let newArr=[];
    for(let i=0;i<arr.length;i++){
        if(Array.isArray(arr[i])){
            newArr=newArr.concat(toArr(arr[i]));
        }else{
            newArr.push(arr[i]);
        }
    }
    return newArr
}
console.log(toArr(arr));