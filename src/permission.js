import router from "./router";
// import { error404 } from "./router";
import store from "./store";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; 
import { getToken1 } from "@/utils/auth";
import getPageTitle from "@/utils/get-page-title";

import { constantRoutes } from "./router/index";
import { getMenu } from "@/api/control/index";

NProgress.configure({ showSpinner: false }); 

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  const hasToken = getToken1();
  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (store.getters["permission/getIsAddRouters"]) {
        next();
      } else {
        //获取权限菜单
        await getMenu().then(async (res) => {
          const routerArr = res.Data || [];
          const systemRouter = routerArr.filter((v) => v.MenuName == "Portal");
          if (systemRouter.length == 0) {
            await store.dispatch("permission/generateRoutes", "static");
          } else {
            store.dispatch("user/setRoleRouters", systemRouter[0].childMenu);
            await store.dispatch("permission/generateRoutes", {
              type: "server",
              routers: systemRouter[0].childMenu,
            });
          }
          let dynamicRoutes = await store.getters["permission/getAddRouters"];
          router.addRoutes(dynamicRoutes);
          router.options.routes = constantRoutes.concat([...dynamicRoutes]);
        });
        store.commit("permission/SET_IS_ADD_ROUTERS", true);
        next({ ...to, replace: true });
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
