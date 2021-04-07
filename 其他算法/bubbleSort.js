//冒泡排序，时间复杂度：O(n2)
function bubbleSort(num){
    for(let i=0;i<num.length-1;i++){
        for(let j=i+1;j<num.length;j++){
            if(num[i]>num[j]){
                [num[j],num[i]]=[num[i],num[j]];
            }
        }
    }
    return num;
}
console.log(bubbleSort([5,3,8,6,4]));