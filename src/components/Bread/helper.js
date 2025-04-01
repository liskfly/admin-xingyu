import { pathResolve } from '@/utils/routerHelper'

export function filterBreadcrumb(routes, parentPath = '') {
  const res = []
  
  for (const route of routes) {
    const meta = route.meta || {}
    
    // 跳过隐藏且不可跳转的路由
    if (meta.hidden && !meta.canTo) {
      continue
    }

    let data = null
    const hasSingleChild = route.children && route.children.length === 1
    const isHomePage = meta.title === '首页'
    
    // 处理单子路由且非始终显示的情况
    if (!meta.alwaysShow && hasSingleChild && isHomePage) {
      const child = route.children[0]
      data = {
        ...child,
        path: pathResolve(route.path, child.path)
      }
    } else {
      data = { ...route }
    }

    // 合并父级路径
    data.path = pathResolve(parentPath, data.path)

    // 递归处理子路由
    if (data.children) {
      data.children = filterBreadcrumb(data.children, data.path)
    }

    res.push(data)
  }
  
  return res
}
