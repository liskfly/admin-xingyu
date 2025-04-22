import Vue from "vue";
// import VueRouter from "vue-router"; // 正确导入 VueRouter

// Vue.use(VueRouter);
import Router from "vue-router";

Vue.use(Router);

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

// // 关键修改1：导出createRouter函数（供动态路由合并时调用）
// export const createRouter = (routes) => 
//   new VueRouter({
//     mode: 'history', // 必须与初始配置一致
//     scrollBehavior: () => ({ y: 0 }),
//     routes: routes || constantRoutes // 允许传入自定义路由
//   });

// // 关键修改2：初始化时使用createRouter
// const router = createRouter(); 

// // 重置路由的方法（保持原有逻辑）
// export function resetRouter() {
//   const newRouter = createRouter();
//   router.matcher = newRouter.matcher;
// }

// export default router;
const createRouter = (routes) =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes:routes|| constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}
export default router;