import Vue from 'vue'
import VueRouter from 'vue-router'
import { omit, cloneDeep } from 'lodash'

Vue.use(VueRouter)

// 使用 require.context 替代 import.meta.glob
const viewsContext = require.context('../views', true, /\.vue$/)
const modules = {}
viewsContext.keys().forEach(path => {
  modules[path.replace('./', '')] = viewsContext(path).default
})

/* Layout */
export const Layout = () => import('@/layout/index.vue')

export const getParentLayout = {
  name: 'ParentLayout',
  render: h => h('router-view')
}

export const getRawRoute = (route) => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: matched
      ? matched.map(item => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : []
  }
}

// 前端控制路由生成（Vue2 适配版）
export const generateRoutesByFrontEnd = (routes, keys, basePath = '/') => {
  const res = []

  for (const route of routes) {
    const meta = route.meta || {}
    if (meta.hidden && !meta.canTo) continue

    let data = null
    let onlyOneChild = null

    if (route.children && route.children.length === 1 && !meta.alwaysShow) {
      onlyOneChild = pathResolve(pathResolve(basePath, route.path), route.children[0].path)
    }

    keys.forEach(item => {
      if (onlyOneChild === item || route.path === item) {
        data = { ...route }
      } else {
        const routePath = (onlyOneChild || pathResolve(basePath, route.path)).trim()
        if (routePath === item || meta.followRoute === item) {
          data = { ...route }
        }
      }
    })

    if (data && route.children) {
      data.children = generateRoutesByFrontEnd(
        route.children,
        keys,
        pathResolve(basePath, data.path)
      )
    }
    if (data) res.push(data)
  }
  return res
}

// 服务端路由生成（Vue2 适配版）
export const generateRoutesByServer = routes => {
  const res = []
  for (const route of routes) {
    const data = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: route.meta,
      component: resolveComponent(route.component)
    }

    if (route.children) {
      data.children = generateRoutesByServer(route.children)
    }
    res.push(data)
  }
  return res
}
export const generateRoutesByServer1 = (routes) => {
  const res = []

  for (const route of routes) {
    const data = {
      path: route.path,
      name: route.MenuName,
      redirect: route.redirect,
      meta: {
        title: route.title,
        icon: route.icon
      },
      component: null
    }
    if (route.component) {
      // const component = route.component
      // if (!comModule && !component.includes('#')) {
      //   console.error(`未找到${route.component}.vue文件或${route.component}.tsx文件，请创建`)
      // } else {
      // 动态加载路由文件，可根据实际情况进行自定义逻辑
      // console.log(route.component);
      // data.component =
      //   component === 'Layout' ? Layout : modules[`../views${route.component}.vue`]
      // }
      // console.log( data.component );
      const componentPath = route.component.trim()
      if (componentPath === 'Layout') {
        data.component = Layout
      } else {
        const moduleKey = `.${componentPath}.vue`

        if (modules[moduleKey]) {
          data.component = modules[moduleKey]
        } else {
          // console.error(`[路由错误] 组件未找到: ${componentPath}.vue`)
          // 异步加载兜底（确保文件路径正确）
          
          // data.component = () => import(/* webpackChunkName: "views-[request]" */ `@/views${componentPath}.vue`)
          data.component = resolve => require([`@/views${componentPath}`],resolve)
          // console.log(data.component);
          
        }
      }

    }
    if (route.childMenu != null) {
      data.children = generateRoutesByServer1(route.childMenu)
    }
    res.push(data)
  }
  // console.log(res);
  
  return res
}

const resolveComponent = component => {
  if (!component) return undefined
  if (component === '#') return Layout
  if (component.includes('##')) return getParentLayout
  
  // 处理组件路径
  const componentPath = `./${component.replace('views/', '')}.vue`
  return modules[componentPath] || (() => import(`@/views/${component}.vue`))
}

// 路径处理函数
export const pathResolve = (parentPath, path) => {
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  // console.log(`${parentPath}${childPath}`.replace(/\/\//g, '/'));
  
  return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}

// 路由降级处理（Vue2 适配版）
export const flatMultiLevelRoutes = routes => {
  const modules = cloneDeep(routes)
  for (let i = 0; i < modules.length; i++) {
    const route = modules[i]
    if (isMultipleRoute(route)) {
      promoteRouteLevel(route)
    }
  }
  return modules
}

const isMultipleRoute = route => {
  const children = route.children || []
  return children.some(child => child.children?.length)
}

const promoteRouteLevel = route => {
  const router = new VueRouter({
    routes: [route],
    mode: 'hash'
  })
  
  const routes = router.options.routes
  addToChildren(routes, route.children || [], route)
  route.children = route.children.map(item => omit(item, 'children'))
}

const addToChildren = (routes, children, routeModule) => {
  children.forEach(child => {
    const route = routes.find(r => r.name === child.name)
    if (route) {
      routeModule.children = routeModule.children || []
      if (!routeModule.children.some(r => r.name === route.name)) {
        routeModule.children.push(route)
      }
      if (child.children) {
        addToChildren(routes, child.children, routeModule)
      }
    }
  })
}