import shop from "../../api/shop"
import {CART,PRODUCTS} from "../mutation-types"

const state = {
    items: [],
    checkoutStatus: null
  }

const mutations={
    [CART.PUSH_PRODUCT_TO_CART] (state, { id }) {
        state.items.push({
            id,
            quantity: 1
        })
    },
    [CART.INCREMENT_ITEM_QUANTITY] (state, cartItem) {
        cartItem.quantity++
    },      
    [CART.SET_CART_ITEMS] (state, { items }) {
        state.items = items
      },
    
      [CART.SET_CHECKOUT_STATUS] (state, status) {
        state.checkoutStatus = status
      }
}
const actions ={
    addProductToCart({state,commit},product){
        if(product.inventory > 0){
            const cartItem = state.items.find(items=>items.id == product.id);
            if (!cartItem) {
                commit(CART.PUSH_PRODUCT_TO_CART, { id: product.id })
            } else {
                commit(CART.INCREMENT_ITEM_QUANTITY, cartItem)
            }
            commit(`products/${PRODUCTS.DECREMENT_PRODUCT_INVENTORY}`, { id: product.id }, { root: true })
        }
    },
    checkout ({ commit, state }, products) {
        const savedCartItems = [...state.items]
        commit(CART.SET_CHECKOUT_STATUS, null)
        // empty cart
        commit(CART.SET_CART_ITEMS, { items: [] })
        shop.buyProducts(
          products,
          () => commit(CART.SET_CHECKOUT_STATUS, 'successful'),
          () => {
            commit(CART.SET_CHECKOUT_STATUS, 'failed')
            // rollback to the cart saved before sending the request
            commit(CART.SET_CART_ITEMS, { items: savedCartItems })
          }
        )
      },
}

const getters={
    cartProducts: (state, getters, rootState) => {
        return state.items.map(({ id, quantity }) => {
          const product = rootState.products.all.find(product => product.id === id)
          return {
            title: product.title,
            price: product.price,
            quantity
          }
        })
      },
    
      cartTotalPrice: (state, getters) => {
        return getters.cartProducts.reduce((total, product) => {
          return total + product.price * product.quantity
        }, 0)
      }
}
export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations
}