import Vue from 'vue';
import { getAllParentPath } from '@/components/menu/helper';
// import { isUrl } from '@/utils/is';
import cloneDeep from 'lodash/cloneDeep';

// 创建响应式对象替代 Vue3 的 reactive()
export const tabPathMap = Vue.observable({});

export function initTabMap(routes) {
  routes.forEach(v => {
    const meta = v.meta || {};
    if (!meta.hidden) {
      // Vue2 响应式对象需使用 Vue.set 添加新属性
      Vue.set(tabPathMap, v.path, []);
    }
  });
}

export function filterMenusPath(routes, allRoutes) {
  const res = [];
  routes.forEach(v => {
    const meta = v.meta || {};
    if (!meta.hidden || meta.canTo) {
      const allParentPath = getAllParentPath(allRoutes, v.path);
    //   console.log(allParentPath);
      const fullPath = allParentPath.join('/');
   
      const data = cloneDeep(v);
      
      data.path = fullPath
      // console.log( data.path);
      
      if (v.children && data) {
        // console.log();
        
        data.children = filterMenusPath(v.children, allRoutes);
      }

      if (data) {
        res.push(data);
      }

      if (allParentPath.length && Object.prototype.hasOwnProperty.call(tabPathMap, allParentPath[0])) {
        // 直接操作已存在的响应式数组
        // console.log(fullPath);
        
        tabPathMap[allParentPath[0]].push(fullPath);
        // console.log(tabPathMap[allParentPath[0]]);
        
      }
    }
  });
  // console.log(res);
  
  return res;
}