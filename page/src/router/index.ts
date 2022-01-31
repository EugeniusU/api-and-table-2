import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Contact from '../views/Contact.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    components: {
      a: Contact
    },
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
