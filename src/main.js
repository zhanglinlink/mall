// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入饿了吗UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入axios插件
import MyServerHttp from '@/plugins/http.js'
// 导入处理时间格式
import moment from 'moment'

Vue.use(ElementUI)
Vue.use(MyServerHttp)
Vue.config.productionTip = false

// 添加全局过滤器
Vue.filter('fmtdata', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
