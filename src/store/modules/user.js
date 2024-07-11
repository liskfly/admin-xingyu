// import { login, getRoutes } from '@/api/login'
import { login, info, getRoutes } from "@/api/index";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { dataPro } from "@/utils/asyncRouter";
// import { xmlTagToJson } from "@/utils/xmlTojson";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    nameID: "",
    addRoutes: [],
  };
};

const state = getDefaultState();
// const getters = {
//   nameIDData: (state) => state.nameID,
// };
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROUTE(state, data) {
    // console.log(data);
    state.addRoutes = data;
  },
  SET_NAMEID(state, data) {
    // console.log(data);
    state.nameID = data;
  },
  testMutation(state, callback) {
    callback.msg = { ...state };
  },
};

const actions = {
  // user login
  login({ dispatch, commit }, userInfo) {
    // commit('SET_TOKEN', userInfo.employeeName)
    // setToken(userInfo.employeeName)
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(({ data }) => {
          // const  dataTable= xmlTagToJson(data, "Table")
          if (data.code == 100200) {
            commit("SET_TOKEN", userInfo.employeeName);
            setToken(userInfo.employeeName);
            // let routeArr = dataPro(data.content);
            // commit("SET_ROUTE", routeArr);

            // info(userInfo.employeeName).then(({ data }) => {
            //   // console.log(data.EmployeeId);
            //    sessionStorage.setItem('employeeId',data.EmployeeId )
            // });
            // commit('SET_TOKEN', userInfo.username)
            // setToken(userInfo.username)
            // dispatch("getinfo", userInfo.employeeName).then(data=>{
            //     commit('SET_NAMEID', data)
            // })
            resolve(data);
          } else {
            reject(data.msg);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getinfo({ commit, state }, text) {
    return new Promise((resolve, reject) => {
      info(text).then(({ data }) => {
        // console.log(state.nameID);
        resolve(data.EmployeeId);
      });
    });
  },
  getRoute({ commit, state }, data1) {
    return new Promise((resolve, reject) => {
      getRoutes(data1).then(({data}) => {
    // console.log(data);
        // const dataTable = xmlTagToJson(data, "Table");
        let routeArr = dataPro(data);
        commit("SET_ROUTE", routeArr);

        // state.addRoutes=dataTable
        // console.log(state.addRoutes);
        resolve(data.content);
      });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken(); // must remove  token  first
      commit("SET_ROUTE", []);
      resetRouter();
      commit("RESET_STATE");
      localStorage.removeItem("employeeId");
      resolve();
      // }).catch(error => {
      //   reject(error)
      // })
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
