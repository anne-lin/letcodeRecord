import createItem from "./createItem"
class List{
  constructor(app){
    this.app = app;
    this.el = $("<div>");
  }
  init(){
    let data=this.loadData()
    this.initItemList(data);
    this.render();
  }
  loadData(){
    return [
      {
        "id":0,
        "name":"book1",
        "price":198,
        "discount":0
      },
      {
        "id":1,
        "name":"book2",
        "price":208,
        "discount":0.7
      },
      {
        "id":2,
        "name":"book3",
        "price":298, 
        "discount":0.8
      },
      {
        "id":3,
        "name":"book4",
        "price":301,
        "discount":0.5
      }
    ]
    /* return new Promise((resolve,reject)=>{
      fetch("../api/data.json").then((response)=>{
        resolve(response.json());
      })
    }) */
  }
  initItemList(data){
    data.forEach(item=>{
      createItem(this,item);
    })
  }
  render() {
    this.app.el.append(this.el);
  }
}
export default List;