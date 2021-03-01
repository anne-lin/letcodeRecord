import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:0
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
