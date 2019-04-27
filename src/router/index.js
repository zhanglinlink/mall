import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import '@/assets/css/reset.css'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
