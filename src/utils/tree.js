const DEFAULT_CONFIG = {
    id: 'id',
    children: 'children',
    pid: 'pid'
  }
  
  const getConfig = (config) => Object.assign({}, DEFAULT_CONFIG, config)
  
  // 列表转树形结构
  export const listToTree = (list, config = {}) => {
    const conf = getConfig(config)
    const nodeMap = new Map()
    const result = []
    const { id, children, pid } = conf
  
    for (const node of list) {
      node[children] = node[children] || []
      nodeMap.set(node[id], node)
    }
    
    for (const node of list) {
      const parent = nodeMap.get(node[pid])
      ;(parent ? parent[children] : result).push(node)
    }
    return result
  }
  
  // 树形结构转列表
  export const treeToList = (tree, config = {}) => {
    config = getConfig(config)
    const { children } = config
    const result = [...tree]
    
    for (let i = 0; i < result.length; i++) {
      if (!result[i][children]) continue
      result.splice(i + 1, 0, ...result[i][children])
    }
    return result
  }
  
  // 查找节点
  export const findNode = (tree, func, config = {}) => {
    config = getConfig(config)
    const { children } = config
    const list = [...tree]
    
    for (const node of list) {
      if (func(node)) return node
      node[children] && list.push(...node[children])
    }
    return null
  }
  
  // 查找所有匹配节点
  export const findNodeAll = (tree, func, config = {}) => {
    config = getConfig(config)
    const { children } = config
    const list = [...tree]
    const result = []
    
    for (const node of list) {
      func(node) && result.push(node)
      node[children] && list.push(...node[children])
    }
    return result
  }
  
  // 查找路径
  export const findPath = (tree, func, config = {}) => {
    config = getConfig(config)
    const path = []
    const list = [...tree]
    const visitedSet = new Set()
    const { children } = config
  
    while (list.length) {
      const node = list[0]
      if (visitedSet.has(node)) {
        path.pop()
        list.shift()
      } else {
        visitedSet.add(node)
        node[children] && list.unshift(...node[children])
        path.push(node)
        if (func(node)) return path
      }
    }
    return null
  }
  
  // 查找所有路径
  export const findPathAll = (tree, func, config = {}) => {
    config = getConfig(config)
    const path = []
    const list = [...tree]
    const result = []
    const visitedSet = new Set()
    const { children } = config
  
    while (list.length) {
      const node = list[0]
      if (visitedSet.has(node)) {
        path.pop()
        list.shift()
      } else {
        visitedSet.add(node)
        node[children] && list.unshift(...node[children])
        path.push(node)
        func(node) && result.push([...path])
      }
    }
    return result
  }
  
  // 过滤树节点
  export const filter = (tree, func, config = {}) => {
    config = getConfig(config)
    const children = config.children
  
    function listFilter(list) {
      return list
        .map(node => ({ ...node }))
        .filter(node => {
          node[children] = node[children] && listFilter(node[children])
          return func(node) || (node[children] && node[children].length)
        })
    }
    return listFilter(tree)
  }
  
  // 遍历树节点
  export const forEach = (tree, func, config = {}) => {
    config = getConfig(config)
    const list = [...tree]
    const { children } = config
  
    for (let i = 0; i < list.length; i++) {
      if (func(list[i])) return
      children && list[i][children] && list.splice(i + 1, 0, ...list[i][children])
    }
  }
  
  // 树结构映射
  export const treeMap = (treeData, opt) => {
    return treeData.map(item => treeMapEach(item, opt))
  }
  
  // 单节点映射
  export const treeMapEach = (data, { children = 'children', conversion }) => {
    const haveChildren = Array.isArray(data[children]) && data[children].length > 0
    const conversionData = conversion(data) || {}
  
    if (haveChildren) {
      return {
        ...conversionData,
        [children]: data[children].map(i =>
          treeMapEach(i, { children, conversion })
        )
      }
    }
    return { ...conversionData }
  }
  
  // 递归遍历树
  export const eachTree = (treeDatas, callBack, parentNode = {}) => {
    treeDatas.forEach(element => {
      const newNode = callBack(element, parentNode) || element
      if (element.children) {
        eachTree(element.children, callBack, newNode)
      }
    })
  }