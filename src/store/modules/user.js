// store/modules/user.js
import Vue from 'vue'
import Vuex from 'vuex'

import { getToken1, removeToken1 } from "@/utils/auth"
import router from '@/router/index2'

Vue.use(Vuex)

const state = {
  userInfo: null,
  tokenKey: 'Authorization',
  token: getToken1() || '',
  roleRouters: [],
  rememberMe: true,
  loginInfo: null
}

const mutations = {
  SET_TOKEN_KEY(state, tokenKey) {
    state.tokenKey = tokenKey
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  SET_ROLE_ROUTERS(state, roleRouters) {
    state.roleRouters = roleRouters
  },
  SET_REMEMBER_ME(state, rememberMe) {
    state.rememberMe = rememberMe
  },
  SET_LOGIN_INFO(state, loginInfo) {
    state.loginInfo = loginInfo
  },
  RESET(state) {
    state.token = ''
    state.userInfo = null
    state.roleRouters = []
  }
}

const actions = {
  setTokenKey({ commit }, tokenKey) {
    commit('SET_TOKEN_KEY', tokenKey)
  },
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  setUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  },
  setRoleRouters({ commit }, roleRouters) {
    commit('SET_ROLE_ROUTERS', roleRouters)
  },
  setRememberMe({ commit }, rememberMe) {
    commit('SET_REMEMBER_ME', rememberMe)
  },
  setLoginInfo({ commit }, loginInfo) {
    commit('SET_LOGIN_INFO', loginInfo)
  },

  logout({ commit }) {
    return new Promise((resolve) => {
      commit('RESET')
      removeToken1()
      localStorage.removeItem("OPCENTER_ROLE")
      
      // 如果需要清理其他模块数据
      // commit('tagsView/delAllViews', null, { root: true })
      
      router.replace('/login').then(() => {
        location.reload()
        resolve()
      })
    })
  }
}

const getters = {
  getTokenKey: state => state.tokenKey,
  getToken: state => state.token,
  getUserInfo: state => state.userInfo,
  getRoleRouters: state => state.roleRouters,
  getRememberMe: state => state.rememberMe,
  getLoginInfo: state => state.loginInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,

}