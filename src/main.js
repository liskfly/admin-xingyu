import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/tailwind.css'
// import "tailwindcss/tailwind.css"
import './utils/directives.js'

// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 修改 el-dialog 默认点击遮照不关闭
ElementUI.Dialog.props.closeOnClickModal.default = false;

import '@/styles/index.scss' // global css
// import './assets/styles/reset.css'


import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import AFTableColumn from 'af-table-column'
Vue.use(AFTableColumn)
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)

import moment from "moment";
Vue.prototype.$moment = moment;

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(ElementUI,{size:"medium"})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
