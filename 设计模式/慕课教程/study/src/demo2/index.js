class Place{
  constructor(){
    this.isEmpty=true;
  }
  in(){
    this.isEmpty=false;
  }
  out(){
    this.isEmpty=true;
  }
}
class Floor{
  constructor(){
    this.placeList=[];
    for(let i=0;i<99;i++){
      this.placeList.push(new Place());
    }
  }
  emptyPlacesNum(){
    let count=0;
    this.placeList.forEach(item=>{
      if(item.isEmpty){
        count++;
      }
    });
    return count;
  }
}
class Park{
  constructor(){
    this.floorList=[new Floor(),new Floor(),new Floor()]
  }
  showEmptyCount(){
    let count=[]
    this.floorList.forEach(item=>{
      count.push(item.emptyPlacesNum());
    }) 
    return count;
  }
  in(car){

  }
  out(car){

  }
}
class Car{
  constructor(number){
    this.number=number;
  }
}