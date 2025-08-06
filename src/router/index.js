import { createRouter, createWebHistory } from 'vue-router'
import Todolist from '../components/Todolist.vue'
import Bots from '../views/bots.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Map from '../components/Map.vue'

const routes = [
    { path: '/', component: Register },
    { path: '/Todolist', component: Todolist },
    { path: '/Login', component: Login },
    { path: '/Map', component: Map },
    {
        path: '/bots',
        component: Bots,
        beforeEnter: (to, from, next) => {
            const isAdmin = localStorage.getItem('isAdmin') === 'true'
            if (!isAdmin) {
                next('/todolist')
            } else {
                next()
            }
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
