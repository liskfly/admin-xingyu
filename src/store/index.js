import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import addRoute from './modules/addroute'

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
      showNotice:false,
      dashboardHeight:0
  },
  mutations:{
    Set_ShowNotice(state){
      state.showNotice=!state.showNotice
      // console.log(state.showNotice);
    },
    Set_DashboardHeight(state,height){
      state.dashboardHeight=height;
    }
  },
  modules: {
    app,
    settings,
    user,
    addRoute
  },
  getters
})

export default store
