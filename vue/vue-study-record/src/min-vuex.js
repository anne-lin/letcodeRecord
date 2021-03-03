import Vue from 'vue'

function Store(options={}){
    const {state={},mutations={},getters}=options;
    const computed = {};
    const store = this;
    store.getters = {};
    for(let [key,fn] of Object.defineProperties(getters)){
        computed[key] = function(){
            return fn(store.state,store.getters)
        }
        Object.defineProperty(store.getters,key,{
            get:function(){
                return store._vm[key]
            }
        })
    }
    this._vm = new Vue({
        data:{
            $$state:state
        },
        computed
    });
    this.mutations = mutations;

}
Store.prototype.commit =function(type,arg){
    if(this.mutations[type]){
        this.mutations[type](this.state,arg);
    }
}

Object.defineProperties(Store.prototype,{
    state:{
        get:function(){
            return this._vm._data.$$state
        }
    }
})
export default Store