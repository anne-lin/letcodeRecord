import Vue from 'vue'

function Store(options={}){
    const {state={},mutations={}}=options;
    this._vm = new Vue({
        data:{
            $$state:state
        },
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