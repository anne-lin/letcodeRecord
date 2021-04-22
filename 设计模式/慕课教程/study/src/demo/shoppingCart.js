import getCart from "./cart";

class shoppingCart{
    constructor(app){
      this.el= $("<div>");
      this.app=app;
      this.cart = getCart();
    }
    init(){
      this.render();
    }
    render() {
      let btn = $("<button>购物车</button>");
      btn.click(()=>{
        //this.addToCart();
        console.log(this.cart.getList())
      })
       this.el.append(btn);
      this.app.el.append(this.el);
    }
}
export default shoppingCart