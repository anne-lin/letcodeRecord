var root = document.getElementById('root')
function render () {
  root.innerHTML = require('./content.js')
}
render();

//如果当前模块支持热更新的，content.js的改变触发render方法
if(module.hot){
  module.hot.accept(["./content.js"],render);
}