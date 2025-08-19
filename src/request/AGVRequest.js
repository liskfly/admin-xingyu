import axios from "axios";
import { MessageBox, Message, Loading, alert } from "element-ui";
// import store from '@/store'
// import { getToken } from '@/utils/auth'
const loading = {
  //loading加载对象
  loadingInstance: null,
  //打开加载
  open() {
    // console.log(1);
    if (this.loadingInstance === null) {
      // 如果实例 为空，则创建
      this.loadingInstance = Loading.service({
        text: "加载中...", //加载图标下的文字
        spinner: "el-icon-loading", //加载图标
        customClass: "loading", //自定义样式的类名
        background: "rgba(0, 0, 0, 0.2)",
      });
    }
  },
  //关闭加载
  close() {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close();
    }
    this.loadingInstance = null;
  },
};


// 基地址
const service = axios.create({
  baseURL: "/agvApi"
});
let source = axios.CancelToken.source();
// console.log(source);
service.interceptors.request.use(
  (config) => {
    config.cancelToken = source.token; // 取消请求
    if (config.cancelToken && config.cancelObj && config.cancelObj.cancel) {
      config.cancelObj.cancel("中断请求");
      delete config.cancelObj;
    }
    if (!navigator.onLine) {
    
      source.cancel("网络故障，请检查!");
    }

    loading.open();

    return config;
  },

  (error) => Promise.error(error)
);
service.interceptors.response.use(
  (response) => {
    loading.close();
    if (response.status === 500) {
      Message({
        //elemen组件库中的提示组件
        message: "后台错误",
        type: "error",
        duration: 5000,
      });
      return Promise.reject(); //要返回一个promise对象出去
    }
    if (response.status === 404) {
      Message({
        message: "接口地址错误",
        type: "error",
        duration: 5000,
      });
      return Promise.reject();
    }

    if (response.status === 200) {

        return response.data;

    }
  },
  (error) => {
    loading.close();
    MessageBox.alert(error, "提示信息", {
      confirmButtonText: "确定",
    });
  }
);


export default service;
