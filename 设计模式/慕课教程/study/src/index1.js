import data from "./demo/data.json";
var StateMachine = require('javascript-state-machine');
console.log(data);
function status(){
  return new StateMachine({
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
      },
      onDelShopp:function(){

      }
    },
  })
}
class Book{
  constructor(id,name,price,discount){
    this.id = id;
    this.name = name;
    this.price = price;
    this.discount = discount;
    this.discountPrice = price*discount.toFixed(2);
    this.status = status();
  }
}

class List{
  constructor(bookList){
    this.bookList = bookList.map(item=>new Book(item.id,item.name,item.price,item.discount));
    this.render();
    this.addBookList = [];
  }
  render() {
    let html="";
    this.bookList.forEach(element => {
      html+=`<ul><li>名称：${element.name}</li><li>价格：${element.discountPrice}</li><li><button class="addShop" id=${element.id}>${element.status.state}</button></li></ul>`;
    });
    document.getElementById("list").innerHTML = html;
    $(".addShop").click(function(e){
      list.add($(this));
    })
  }
  add(el){
    let book = this.bookList[el[0].id];
    if(book.status.is("加入购物车")){
      book.status.addShopp();
      this.addBookList.push(book);
    }else{
      book.status.onDelShopp();
      this.addBookList=this.addBookList.filter(item=>item.id !== el[0].id);
    }
    console.log(this.addBookList);
    this.render();
  }
}

let list = new List(data);
