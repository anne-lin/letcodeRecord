const _products = [
  {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
  {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
  {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5}
]
export default {
  // 获取所有商品，异步模拟 ajax
  getProducts () {
    return Promise.resolve(_products);
  },

  // 结账，异步模拟 ajax
  buyProducts (products, cb, errorCb) {
    return Promise.resolve();
  }
}