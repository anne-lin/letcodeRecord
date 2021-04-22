class Cart{
  constructor(){
    this.list = [];
  }
  add(data){
    this.list.push(data);

  }
  del(id){
    this.list = this.list.filter(item=>item.id !== id);
  }
  getList(){
    return this.list;
  }
}
let getCart = function(){
  let instance;
  return function(){
    if(!instance){
      instance = new Cart(arguments);
    }
    return instance;
  }
}();
export default getCart;