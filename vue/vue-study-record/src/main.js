import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Store from './min-vuex';

Vue.config.productionTip = false;

const store=new Store({
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

Vue.prototype.$store =store;

new Vue({
  router,
  //store,
  render: h => h(App)
}).$mount('#app')
