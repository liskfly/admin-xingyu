import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
export const asyncRouterMap =[]
export const constantRoutes = [
  {
    path: '/',
    // component: Layout,
    redirect: '/dashboard',
    name: 'Root',
    meta: {
      hidden: true,

    }
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/dashboard",
  //   children: [
  //     {
  //       path: "dashboard",
  //       name: "Dashboard",
  //       component: () => import("@/views/dashboard"),
  //       meta: { title: "首页" },
  //     },
  //     // {
  //     //   path: "changeover",
  //     //   name: "changeover",
  //     //   component: () => import("@/views/smtapply/changeover.vue"),
  //     //   meta: { title: "首c页" },
  //     // }
  //   ],
  // },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'Dashboard',
    meta: {
      title: '首页',
      icon: 'House',
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Index',
        meta: {
          title: '首页',
          icon: 'House',
          affix: true
        }
      },

    ]
  },

];
export const error404 = { path: "*", redirect: "/404", hidden: true };
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
