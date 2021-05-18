import shop from "../../api/shopping"

const state={
  items:[],
  checkoutStatus: null 
}

const getters={
  cartProducts:(state,getters,rootState)=>{
    return state.items.map(({ id, quantity }) => {
      // 从商品列表中，根据 id 获取商品信息
      const product = rootState.products.all.find(product => product.id === id)
      return {
        title: product.title,
        price: product.price,
        quantity
      }
    })
  },
  cartTotalPrice: (state, getters) => {
    // reduce 的经典使用场景，求和
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }
}