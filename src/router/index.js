import Vue from "vue";
import VueRouter from "vue-router"; // 正确导入 VueRouter

Vue.use(VueRouter);

/* Layout */
import Layout from "@/layout";

export const asyncRouterMap = [];

export const constantRoutes = [
  // 保持你原有的静态路由配置不变
  {
    path: '/',
    redirect: '/dashboard',
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
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'Dashboard',
    hidden: true,
    meta: { title: '首页', icon: 'House' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Index',
        hidden: true,
        meta: { title: '首页', icon: 'House', affix: true }
      }
    ]
  }
];

export const error404 = { path: "*", redirect: "/404", hidden: true };

// 关键修改1：导出createRouter函数（供动态路由合并时调用）
export const createRouter = (routes) => 
  new VueRouter({
    mode: 'history', // 必须与初始配置一致
    scrollBehavior: () => ({ y: 0 }),
    routes: routes || constantRoutes // 允许传入自定义路由
  });

// 关键修改2：初始化时使用createRouter
const router = createRouter(); 

// 重置路由的方法（保持原有逻辑）
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;