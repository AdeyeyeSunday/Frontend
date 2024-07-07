import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import PostView from '@/views/PostView.vue';
import UsersView from '@/views/UsersView.vue';

const routes: Array<RouteRecordRaw> = [
  {path:'/', component: Home},
  {path:'/login', component: LoginView},
  {path:'/register', component: RegisterView},
  {path:'/posts', component:PostView},
  {path: '/users',component:UsersView}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
