/**
 * 迭代器模式
 */
let arr=[1,2,3];
let iterator=arr[Symbol.iterator]();
console.log(iterator);
console.log(iterator.next());
//value值，done判断数组是否结束
/* {
  "value": 2,
  "done": false
} */
console.log(iterator.next());//