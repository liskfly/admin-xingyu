import Vue from 'vue'
import { findPath } from '@/utils/tree'

export const getAllParentPath = (treeData, path) => {
  const menuList = findPath(treeData, (n) => n.path === path)
  return (menuList || []).map((item) => item.path)
}

export const hasOneShowingChild = (children = [], parent) => {
  let onlyOneChild = null
  
  const showingChildren = children.filter((v) => {
    const meta = v.meta || {}
    if (meta.hidden) {
      return false
    } else {
      onlyOneChild = v
      return true
    }
  })

  // 当只有一个显示的子路由时
  if (showingChildren.length === 1) {
    return {
      oneShowingChild: true,
      onlyOneChild: onlyOneChild
    }
  }

  // 没有可显示的子路由时显示父路由
  if (!showingChildren.length) {
    onlyOneChild = Vue.util.extend({}, parent, {
      path: '',
      noShowingChildren: true
    })
    return {
      oneShowingChild: true,
      onlyOneChild: onlyOneChild
    }
  }

  return {
    oneShowingChild: false,
    onlyOneChild: onlyOneChild
  }
}