import { createRouter, createWebHistory } from 'vue-router'

const Layout      = () => import('@/components/Layout.vue')
const BoardsPage  = () => import('@/pages/BoardsPage.vue')
const BoardPage   = () => import('@/pages/BoardPage.vue')
const IssuesPage  = () => import('@/pages/IssuesPage.vue')

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: 'boards',  component: BoardsPage },
        { path: 'board/:id', component: BoardPage, props:true },
        { path: 'issues', component: IssuesPage },
        { path: '', redirect:'/boards' },
        { path: '/:pathMatch(.*)*', redirect:'/boards' }
      ]
    }
  ]
})