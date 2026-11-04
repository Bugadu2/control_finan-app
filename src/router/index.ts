
import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import TabsPage from '../views/TabsPage.vue';
import LoginPage from '../views/LoginPage.vue';
import CadastroPage from '../views/CadastroPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
  path: '/cadastro',
  component: CadastroPage
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/dashboard'
      },
      {
        path: 'dashboard',
        component: () => import('@/views/DashboardPage.vue')
      },
      {
        path: 'receitas',
        component: () => import('@/views/ReceitasPage.vue')
      },
      {
        path: 'despesas',
        component: () => import('@/views/DespesasPage.vue')
      },
      {
  path: 'orcamento',
  component: () => import('@/views/OrcamentoPage.vue')
},
      {
        path: 'perfil',
        component: () => import('@/views/PerfilPage.vue')
      } 
      
      
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
