import router from "./router";
import { error404 } from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import { getAsyncRoutes } from "@/utils/asyncRouter";

import { constantRoutes } from "./router/index";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();
  // next();
  // NProgress.done();
  // return;
  // set page title
  document.title = getPageTitle(to.meta.title);
  // resetRouter();
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      // const hasGetUserInfo = getToken()
      let route = await store.state.user.addRoutes;
      // console.log( route&&route.length>0);
      const hasRouters = route && route.length > 0;
      // const hasRouters=1
      // console.log(hasRouters);
      // console.log(hasRouters);
      let employeeId = localStorage.getItem("employeeId");
      //  store.commit('user/SET_ROUTE',[])
      if (hasRouters) {
        // let routesArr = store.state.user.addRoutes;
        // const accessRoutes = getAsyncRoutes(routesArr);
        // router.addRoutes([...accessRoutes, error404]);
        // router.options.routes = constantRoutes.concat([
        //   ...accessRoutes,
        //   error404,
        // ]);
        // next({ ...to, replace: true });
        next();
      } else {
        try {
          // console.log(employeeId);
          await store.dispatch("user/getRoute", employeeId).then(() => {
            let routesArr = store.state.user.addRoutes;
            if (routesArr.length == 0) {
              router.addRoutes([...routesArr, error404]);
              router.options.routes = constantRoutes.concat([
                ...routesArr,
                error404,
              ]);
              next();
            } else {
              const accessRoutes = getAsyncRoutes(routesArr);
              router.addRoutes([...accessRoutes, error404]);
              router.options.routes = constantRoutes.concat([
                ...accessRoutes,
                error404,
              ]);
            }
          });

          // // console.log(EmployeeId);
          next({ ...to, replace: true });
        } catch (error) {
          // console.log(11);
          await store.dispatch("user/resetToken");
          // Message.error(error || "Has Error");
          // next()
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
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
