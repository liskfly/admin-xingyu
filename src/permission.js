import router from "./router";
import { error404 } from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken1 } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import { getAsyncRoutes } from "@/utils/asyncRouter";

import { constantRoutes } from "./router/index";
import {
  getMenu, getInfo
} from "@/api/control/index";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {

  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  // resetRouter();
  const hasToken = getToken1();
  if (hasToken) {

    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {


      let route = await store.getters['user/getRoleRouters'];
      const hasRouters = route && route.length > 0;

      //   let employeeId = localStorage.getItem("employeeId");
      if (store.getters['permission/getIsAddRouters']) {
        next();
      } else {
        // next()
        await getMenu().then(async (res) => {
          // console.log(res);
          const routerArr = res.Data || [];
          const systemRouter = routerArr.filter(
            (v) => v.MenuName == "Portal"
          );
          // console.log(systemRouter[0].childMenu);

          if (systemRouter.length == 0) {
            await store.dispatch('permission/generateRoutes', 'static')
          } else {
            store.dispatch('user/setRoleRouters', systemRouter[0].childMenu)
            await store.dispatch('permission/generateRoutes', {
              type: "server",
              routers: systemRouter[0].childMenu
            })

          }
          let dynamicRoutes=await store.getters['permission/getAddRouters']
          router.addRoutes(dynamicRoutes);
          router.options.routes =constantRoutes.concat([
            ...dynamicRoutes
          ]);
          // console.log(router.options.routes);
         
            
        })
        //  next()
        store.commit('permission/SET_IS_ADD_ROUTERS', true)
      next({ ...to, replace: true })
       
      
      
      }
     
    }
  } else {
    /* has no token*/
    // console.log(3);
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
