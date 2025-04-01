// store/modules/tagsView.js
import router from '@/router'
import { getRawRoute } from '@/utils/routerHelper'
import { findIndex } from '@/utils'

const state = {
  visitedViews: [],
  cachedViews: new Set(),
  selectedTag: null
}

const getters = {
  visitedViews: state => state.visitedViews,
  cachedViews: state => Array.from(state.cachedViews),
  selectedTag: state => state.selectedTag
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    if (view.meta?.noTagsView) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
  },
  UPDATE_CACHED_VIEWS: (state, views) => {
    state.cachedViews = new Set(views)
  },
  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_ALL_VISITED_VIEWS: (state, keepAffix = true) => {
    if (keepAffix) {
      state.visitedViews = state.visitedViews.filter(tag => tag?.meta?.affix)
    } else {
      state.visitedViews = []
    }
  },
  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v?.meta?.affix || v.path === view.path
    })
  },
  DEL_LEFT_VIEWS: (state, index) => {
    state.visitedViews = state.visitedViews.filter((v, i) => {
      return v?.meta?.affix || i >= index
    })
  },
  DEL_RIGHT_VIEWS: (state, index) => {
    state.visitedViews = state.visitedViews.filter((v, i) => {
      return v?.meta?.affix || i <= index
    })
  },
  UPDATE_VISITED_VIEW: (state, view) => {
    for (const v of state.visitedViews) {
      if (v.path === view.path) {
        Object.assign(v, view)
        break
      }
    }
  },
  SET_SELECTED_TAG: (state, tag) => {
    state.selectedTag = tag
  },
  SET_TITLE: (state, { path, title }) => {
    for (const v of state.visitedViews) {
      if (v.path === path) {
        v.meta.title = title
        break
      }
    }
  }
}

const actions = {
  addView({ commit, dispatch }, view) {
    commit('ADD_VISITED_VIEW', view)
    dispatch('addCachedView')
  },
  
  addCachedView({ state, commit }) {
    const cacheMap = new Set()
    for (const v of state.visitedViews) {
      const item = getRawRoute(v)
      const needCache = !item?.meta?.noCache
      if (needCache) {
        cacheMap.add(item.name)
      }
    }
    if ([...state.cachedViews].sort().toString() === [...cacheMap].sort().toString()) return
    commit('UPDATE_CACHED_VIEWS', cacheMap)
  },

  delView({ commit, dispatch }, view) {
    commit('DEL_VISITED_VIEW', view)
    dispatch('addCachedView')
  },

  delCachedView({ state, commit }) {
    const route = router.currentRoute
    const index = findIndex([...state.cachedViews], v => v === route.name)
    if (index > -1) {
      const newCached = new Set([...state.cachedViews])
      newCached.delete([...state.cachedViews][index])
      commit('UPDATE_CACHED_VIEWS', newCached)
    }
  },

  delAllViews({ commit, dispatch, rootGetters }) {
    commit('DEL_ALL_VISITED_VIEWS', !!rootGetters['user/userInfo'])
    dispatch('addCachedView')
  },

  delOthersViews({ commit, dispatch }, view) {
    commit('DEL_OTHERS_VISITED_VIEWS', view)
    dispatch('addCachedView')
  },

  delLeftViews({ commit, state, dispatch }, view) {
    const index = findIndex(state.visitedViews, v => v.path === view.path)
    if (index > -1) {
      commit('DEL_LEFT_VIEWS', index)
      dispatch('addCachedView')
    }
  },

  delRightViews({ commit, state, dispatch }, view) {
    const index = findIndex(state.visitedViews, v => v.path === view.path)
    if (index > -1) {
      commit('DEL_RIGHT_VIEWS', index)
      dispatch('addCachedView')
    }
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  },

  setSelectedTag({ commit }, tag) {
    commit('SET_SELECTED_TAG', tag)
  },

  setTitle({ commit }, { title, path }) {
    const targetPath = path || state.selectedTag?.path
    commit('SET_TITLE', { path: targetPath, title })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}