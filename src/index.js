import Vue from 'vue'
import App from './app.vue'

import './assets/styles/test.css'
import './assets/images/bg.jpg'
import './assets/styles/global.styl'
const root = document.createElement('div')
document.body.appendChild(root)
// render方法，数据发生变化的时候可以调用render方法重新生成html
new Vue({
  render: (h) => h(App)
}).$mount(root)
