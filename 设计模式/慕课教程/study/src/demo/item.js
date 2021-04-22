import getCart from "./cart";
import StateMachine from "javascript-state-machine";
import { log } from '../util/log'

class Item{
  constructor(list,data){
    this.el = $("<div>");
    this.list = list;
    this.data = data;
    this.cart = getCart();
    this.init();
  }
  init(){
    this.initContent();
    this.initBtn();
    this.render();
  }
  initContent(){
    let {el,data}= this;
    el.append(`<p>名称：${data.name}</p>`);
    el.append(`<p>价格：${data.price}</p>`);
  }
  initBtn(){
    let btn = $("<button>test</button>");
    let _this=this;
    let fsm = new StateMachine({
      init:"加入购物车",
      transitions:[{
        name:"addShopp",
        from:"加入购物车",
        to:"从购物车删除"
      },{
        name:"delShopp",
        from:"从购物车删除",
        to:"加入购物车"
      }],
      methods: {
        onAddShopp:function(){
          _this.addToCart();
          undateText();
        },
        onDelShopp:function(){
          _this.delToCart();
          undateText();
        }
      },
    });
    function undateText(){
      btn.text(fsm.state);
    }
    btn.click(()=>{
      if(fsm.is("加入购物车")){
        fsm.addShopp();
      }else{
        fsm.delShopp();
      }      
    })
    undateText();
    this.el.append(btn);
  }
  render() {
    this.list.el.append(this.el);
  }
  @log("add")
  addToCart(){
    this.cart.add(this.data);
  }
  @log("del")
  delToCart(){
    this.cart.del(this.data.id);
  }
}
export default Item;