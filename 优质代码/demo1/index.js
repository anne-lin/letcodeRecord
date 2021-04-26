import List from "../../设计模式/慕课教程/study/src/demo/list";
import shoppCart from "../../设计模式/慕课教程/study/src/demo/shoppingCart"

class App{
  constructor(el){
    this.el = $("#"+el);
  }
  init(){
    this.initShoppingCart();
    this.initList();
  }
  initShoppingCart(){
    let shoppingCart = new shoppCart(app);
    shoppingCart.init();
  }
  initList(){
    let list = new List(app);
    list.init();
  }
}

export default App;