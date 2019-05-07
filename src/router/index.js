import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import '@/assets/css/reset.css'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'
import { Message } from 'element-ui'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      }, {
        name: 'right',
        path: '/rights',
        component: Right
      }, {
        name: 'roles',
        path: '/roles',
        component: Role
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // ...判断有没有TOKEN
  // const token = localStorage.getItem('token')
  // if(!token){
  //     this.$router.push({name:'login'})
  // }
  if (to.path === '/login') { // 如果去的是登录 直接去
    next()
  } else {
    // 去的不是登录  先判断是否有TOKEN
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({
        name: 'login'
      })
      Message.success('先登录')
      return
    }
    next()
  }
})

export default router
