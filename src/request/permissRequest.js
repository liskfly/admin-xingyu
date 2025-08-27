import axios from "axios";
import { MessageBox, Message, Loading } from "element-ui";
import { getToken1, removeToken1 } from "@/utils/auth";
import router from "@/router";
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
  baseURL: "/control",
});
let source = axios.CancelToken.source();
//请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken1() || "";
    token && (config.headers["authorization"] = token);
    config.cancelToken = source.token; // 取消请求
    if (config.cancelToken && config.cancelObj && config.cancelObj.cancel) {
      config.cancelObj.cancel("中断请求");
      delete config.cancelObj;
    }
    if (!navigator.onLine) {
      // 断网提示
      source.cancel("网络故障，请检查!");
       return Promise.reject(new Error('offline'));
    }

    // 请求拦截进来调用显示loading效果
    loading.open();
    return config;
  },
  (error) => {
    loading.close();
    return Promise.reject(error);
  }
);
//响应拦截器
service.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      loading.close();
    }, 400);

    // 处理HTTP状态码错误
    if (response.status === 500) {
      Message({ message: "后台错误", type: "error", duration: 5000 });
      return Promise.reject(new Error("后台错误"));
    }
    
    if (response.status === 404) {
      Message({ message: "接口地址错误", type: "error", duration: 5000 });
      return Promise.reject(new Error("接口地址错误"));
    }
    if (response.status === 200) {
      const code = response.data.code || response.data.Code;
      
      // 401时跳转登录
      if (code === 401) {
        removeToken1();
        router.push('/login');
        return Promise.reject(new Error("会话过期"));
      }
      
      // 返回数据
      return response.data;
    }
    
    return Promise.reject(response);
  },
  (error) => {
    loading.close();
    
    // 仅针对未认证错误跳转
    if (error.response && error.response.status === 401) {
      removeToken1();
      router.push('/login');
    } else {
      // 其他错误显示提示
      const msg = error.message || "请求失败";
      MessageBox.alert(msg, "错误", { confirmButtonText: "确定" });
    }
    
    return Promise.reject(error);
  }
);

export default service;
