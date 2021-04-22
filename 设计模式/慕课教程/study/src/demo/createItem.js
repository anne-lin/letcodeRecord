import Item from "../demo/item";

function createDiscount(data){
  return new Proxy(data,{
    get:function(target,key,receiver){
      if(key === "name"){
        return `${target[key]}【折扣】`
      }
      if(key === "price"){
        return target["price"]*target.discount.toFixed(2)
      }
      return target;
    }
  })
}

export default function(list,itemData){
  if(itemData.discount){
    itemData = createDiscount(itemData);
  }
  return new Item(list,itemData);
}