import axios from "axios";
import { MessageBox, Message, Loading, alert } from "element-ui";
import { getToken1, removeToken1 } from "@/utils/auth";
const loading = {
  loadingInstance: null,
  //打开加载
  open() {
    
    if (this.loadingInstance === null) {
      
      this.loadingInstance = Loading.service({
        text: "加载中...", 
        spinner: "el-icon-loading", 
        customClass: "loading", 
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
  baseURL: "/cm"
});
let source = axios.CancelToken.source();
//请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken1() || '' 
    token && (config.headers['authorization'] = token)
    config.cancelToken = source.token;
    if (config.cancelToken && config.cancelObj && config.cancelObj.cancel) {
      config.cancelObj.cancel("中断请求");
      delete config.cancelObj;
    }
    if (!navigator.onLine) {
      // 断网提示
      source.cancel("网络故障，请检查!");
    }

    loading.open();

    return config;
  },

  (error) => Promise.error(error)
);
//响应拦截器
service.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      loading.close();
    }, 400);

    //错误提示
    if (response.status === 500) {
      Message({
        //elemen组件库中的提示组件
        message: "后台错误",
        type: "error",
        duration: 5000,
      });
      return Promise.reject(); 
    }
    if (response.status === 404) {
      Message({
        message: "接口地址错误",
        type: "error",
        duration: 5000,
      });
      return Promise.reject();
    }

    //成功的返回
    if (response.status === 200) {
     
        if (response.data.code === 401) {
            removeToken1()
            this.$router.push('/login');
          }
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
