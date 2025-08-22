import Vue from "vue";
import Vuex from "vuex";
// import createPersistedState from 'vuex-persistedstate'
import { asyncRouterMap, constantRoutes } from "@/router/index2";
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer1,
  flatMultiLevelRoutes,
} from "@/utils/routerHelper";
import { cloneDeep } from "lodash";

Vue.use(Vuex);

const state = {
  routers: [],
  addRouters: [],
  isAddRouters: false,
  showMenu: false,
  menuTabRouters: [],
};

const getters = {
  getRouters: (state) => state.routers,
  getAddRouters: (state) => flatMultiLevelRoutes(cloneDeep(state.addRouters)),
  // getAddRouters: state =>cloneDeep(state.addRouters),
  getIsAddRouters: (state) => state.isAddRouters,
  getMenuTabRouters: (state) => state.menuTabRouters,
};

const mutations = {
  SET_SHOW_MENU: (state, showMenu) => {
    state.showMenu = showMenu;
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers;
  },
  SET_ADD_ROUTERS: (state, addRouters) => {
    state.addRouters = addRouters;
  },
  SET_IS_ADD_ROUTERS: (state, status) => {
    state.isAddRouters = status;
  },
  SET_MENU_TAB_ROUTERS: (state, routers) => {
    state.menuTabRouters = routers;
  },
};

const actions = {
  generateRoutes({ commit }, { type, routers }) {
    return new Promise((resolve) => {
      let routerMap = [];
      if (type === "server") {
        routerMap = generateRoutesByServer1(routers);
      } else if (type === "frontEnd") {
        routerMap = generateRoutesByFrontEnd(
          cloneDeep(asyncRouterMap),
          routers
        );
      } else {
        routerMap = cloneDeep(asyncRouterMap);
        // console.log(routerMap);
      }

      const addRoutes = routerMap.concat([
        {
          path: "/:path(.*)*",
          redirect: "/404",
          name: "404Page",
          hidden: true,
          meta: {
            hidden: true,
          },
        },
      ]);

      commit("SET_ADD_ROUTERS", addRoutes);
      commit("SET_ROUTERS", cloneDeep(constantRoutes).concat(routerMap));
      resolve();
    });
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
