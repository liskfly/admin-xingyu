import Vue from "vue";
import VueRouter from "vue-router";
import { omit, cloneDeep } from "lodash";

Vue.use(VueRouter);

// 使用 require.context 替代 import.meta.glob
const viewsContext = require.context("../views", true, /\.vue$/);
const modules = {};
viewsContext.keys().forEach((path) => {
  // 示例：path 值为 "./permissions/meun.vue"，处理后键为 "permissions/meun.vue"
  const normalizedKey = path.replace(/^\.\//, ""); // 移除开头的 "./"
  modules[normalizedKey] = viewsContext(path).default;
});

/* Layout */
export const Layout = () => import("@/layout/index.vue");
export const Layout1 = () => import("@/views/showingChildrene/index.vue");


export const getParentLayout = {
  name: "ParentLayout",
  render: (h) => h("router-view"),
};

export const getRawRoute = (route) => {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : [],
  };
};

// 前端控制路由生成（Vue2 适配版）
export const generateRoutesByFrontEnd = (routes, keys, basePath = "/") => {
  const res = [];

  for (const route of routes) {
    const meta = route.meta || {};
    if (meta.hidden && !meta.canTo) continue;

    let data = null;
    let onlyOneChild = null;

    if (route.children && route.children.length === 1 && !meta.alwaysShow) {
      onlyOneChild = pathResolve(
        pathResolve(basePath, route.path),
        route.children[0].path
      );
    }

    keys.forEach((item) => {
      if (onlyOneChild === item || route.path === item) {
        data = { ...route };
      } else {
        const routePath = (
          onlyOneChild || pathResolve(basePath, route.path)
        ).trim();
        if (routePath === item || meta.followRoute === item) {
          data = { ...route };
        }
      }
    });

    if (data && route.children) {
      data.children = generateRoutesByFrontEnd(
        route.children,
        keys,
        pathResolve(basePath, data.path)
      );
    }
    if (data) res.push(data);
  }
  return res;
};

// 服务端路由生成（Vue2 适配版）
export const generateRoutesByServer = (routes) => {
  const res = [];
  for (const route of routes) {
    const data = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: route.meta,
      component: resolveComponent(route.component),
    };

    if (route.children) {
      data.children = generateRoutesByServer(route.children);
    }
    res.push(data);
  }
  return res;
};
export const generateRoutesByServer1 = (routes) => {
  const res = [];

  for (const route of routes) {
    const data = {
      path: route.path,
      name: route.MenuName,
      redirect: route.redirect,
      meta: {
        title: route.title,
        icon: route.icon,
      },
      component: null,
    };

    if (route.component) {
      // const component = route.component

      // data.component =
      //   component === 'Layout' ? Layout : modules[`../views${route.component}.vue`]
      const componentPath = route.component.trim();
    
      if (componentPath === "Layout") {
        data.component = Layout;
      } else {
       
        const moduleKey = `.${componentPath}.vue`;

        if (modules[moduleKey]) {
          data.component = modules[moduleKey];
        } else {
          data.component = (resolve) =>
            require([`@/views${componentPath}`], resolve);
        }
      }
    }else{
      // console.log(route.component);
      data.component =Layout1
    }
    // if (route.childMenu != null) {
    //   data.children = generateRoutesByServer1(route.childMenu);
    // }
    if (route.childMenu && route.childMenu.length > 0) {
      data.children = generateRoutesByServer1(route.childMenu);
    }
    res.push(data);
  }
  return res;
};

const resolveComponent1 = (component) => {
  if (component === "" || component === null) return undefined;
  if (component === "Layout") return Layout;
  if (component !== "Layout" || component !== "Layout")
    return (resolve) => require([`@/views${component}`], resolve);
};

const resolveComponent = (component) => {
  if (!component) return undefined;
  if (component === "#") return Layout;
  if (component.includes("##")) return getParentLayout;

  // 处理组件路径
  const componentPath = `./${component.replace("views/", "")}.vue`;
  return modules[componentPath] || (() => import(`@/views/${component}.vue`));
};

// 路径处理函数
export const pathResolve = (parentPath, path) => {
  const childPath = path.startsWith("/") || !path ? path : `/${path}`;
  // console.log(`${parentPath}${childPath}`.replace(/\/\//g, '/'));

  return `${parentPath}${childPath}`.replace(/\/\//g, "/").trim();
};

// 路由降级处理（Vue2 适配版）
// 路由降级处理
export const flatMultiLevelRoutes = (routes) => {
  const modules = cloneDeep(routes);
  for (let index = 0; index < modules.length; index++) {
    const route = modules[index];
    if (!isMultipleRoute(route)) {
      continue;
    }
    // promoteRouteLevel(route);
  }
  return modules;
};

const isMultipleRoute = (route) => {

  if (!route || !route.children || !route.children.length) {
    return false;
  }

  const children = route.children;
  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children && child.children.length) {
      flag = true;
      break;
    }
  }
  return flag;
};

const promoteRouteLevel = (route) => {
  let router = new VueRouter({
    routes: [route],
    mode: "history",
  });

  const routes = router.options.routes;

  addToChildren(routes, route.children || [], route);
  // router = null

  // route.children = route.children?.map((item) => omit(item, 'children'))
  // console.log(routes);
};

const addToChildren = (routes, children, routeModule) => {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
};
