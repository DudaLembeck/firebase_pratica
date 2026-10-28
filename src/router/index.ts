import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { aguardarUsuario } from '@/services/auth';

const rotas: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/LoginPage.vue'), meta: { soDeslogado: true } },
  { path: '/cadastro', component: () => import('@/views/CadastroPage.vue'), meta: { soDeslogado: true } },
  {
    path: '/recuperar-senha',
    component: () => import('@/views/RecuperarSenhaPage.vue'),
    meta: { soDeslogado: true },
  },
  { path: '/bem-vindo', component: () => import('@/views/BemVindoPage.vue'), meta: { exigeLogin: true } },
  { path: '/perfil', component: () => import('@/views/PerfilPage.vue'), meta: { exigeLogin: true } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: rotas,
});

router.beforeEach(async (destino) => {
  const usuario = await aguardarUsuario();

  if (destino.meta.exigeLogin && !usuario) return '/login';
  if (destino.meta.soDeslogado && usuario) return '/bem-vindo';
  return true;
});

export default router;
