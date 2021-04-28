import Vue from 'vue'
import Vuex from 'vuex'
import cart from "./modules/cart.js"
import products from "./modules/products.js"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:0,
    username:"xxxxxxxx@qq.com"
  },
  modules:{
    cart,
    products
  },
  mutations: {
    increamemt(state,n){
      console.log(n);
      if(n){
        state.count += n;
      }else{
        state.count ++;
      }
    },
  },
  actions:{
    increamemt({state}){
      setTimeout(()=>{
        state.count++
      },3000)
    }
  },
  getters:{
    doubleCount(state){
      return state.count*2
    }
  }
})
