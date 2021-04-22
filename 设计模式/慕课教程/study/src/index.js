import List from "./demo/list";
import shoppCart from "./demo/shoppingCart"

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