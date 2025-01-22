import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import MainMenu from '../views/MainMenu.vue'
import Failed from '../views/failed.vue'
import artUser from '../views/articles.vue'
import article from '../views/article.vue'
import Profil from '../views/Profil.vue'
import CreateArticle from '../views/CreateArticle.vue'
import EditArticle from '../views/EditArticle.vue'
import Register from '../views/Register.vue'
import EditProfil from '../views/EditProfil.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login 
        },
        {
            path: '/MainMenu',
            name: 'MainMenu',
            component: MainMenu 
        },
        {
            path: '/failed',
            name: 'failed',
            component: Failed 
        },
        {
            path:'/vos-articles',
            name: 'artUser',
            component:artUser
        },
        {
            path:'/article/:id',
            name:'article',
            component:article
        },
        {
            path: '/profil',
            name: 'Profil',
            component: Profil
        },
        {
            path: '/creer-article',
            name: 'CreateArticle',
            component: CreateArticle
        },
        {
            path: '/article/edit/:id',
            name: 'EditArticle',
            component: EditArticle
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/edit-profil',
            name: 'editProfil',
            component: EditProfil
        }
    ]
})

export default router