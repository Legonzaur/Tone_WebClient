import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const ServerView = () => import('../views/ServerView.vue')
const PlayerView = () => import('../views/PlayerView.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: PlayerView
  },
  {
    path: '/servers',
    name: 'servers',
    component: ServerView
  }
  // {
  //   path: '/players',
  //   name: 'players',
  //   component: PlayerView
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
