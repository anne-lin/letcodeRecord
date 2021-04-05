import "./index.css";

class Test2 {
  constructor(){
    console.log("Test2");
  }
}
class Test1 extends Test2{
  constructor(){
    super();
    console.log("constructor");
  }
}
export default Test1
 