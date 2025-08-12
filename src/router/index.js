import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const asyncRouterMap = [];

export const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
    name: 'Root',
    hidden: true,
    meta: { hidden: true }
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
    meta: { hidden: true }
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
    meta: { hidden: true }
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    name: 'Home',
    hidden: true,
    meta: { title: '首页', icon: 'el-icon-folder-add' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'index',
        hidden: true,
        meta: { title: '首页', icon: 'el-icon-folder-add', affix: true }
      }
    ]
  }
  
];

export const error404 = { path: "*", redirect: "/404", hidden: true };

const createRouter = (routes) =>
  new Router({
    mode: "history", 
    scrollBehavior: () => ({ y: 0 }),
    routes:routes|| constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}
export default router;