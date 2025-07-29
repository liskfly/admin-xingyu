import axios from "axios";
import { MessageBox, Message, Loading, alert } from "element-ui";
import { getToken1, removeToken1 } from "@/utils/auth";
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
  baseURL: "/control"
});
let source = axios.CancelToken.source();
// console.log(source);
service.interceptors.request.use(
  (config) => {
    const token = getToken1() || '' //getToken是在另一个JS文件中封装好的方法
    token && (config.headers['authorization'] = token)
    config.cancelToken = source.token; // 取消请求
    if (config.cancelToken && config.cancelObj && config.cancelObj.cancel) {
      config.cancelObj.cancel("中断请求");
      delete config.cancelObj;
    }
    if (!navigator.onLine) {
      // 断网提示
      source.cancel("网络故障，请检查!");
    }

    // 请求拦截进来调用显示loading效果
    loading.open();

    // 配置了store持久化的就不需要取localstorage的了
    // const token = store.state.token || localStorage.getItem("token");
    // token && (config.headers.token = token);
    return config;
  },

  (error) => Promise.error(error)
);
service.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      loading.close();
    }, 400);
     //关闭加载窗口
    //建议打印一下 有些后台返回回来的数据格式不同  可根据自己的数据格式进行调整

    //错误提示
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

    //成功的返回
    if (response.status === 200) {
      // console.log(response.data);
      
      // console.log(response.data.ResultCode);
      // if (response.data.Success==true) {
        if (response.data.code === 401&&response.data.Code === 401) {
            removeToken1()
            this.$router.push('/login');
          }
        return response.data;
      // } 

    }
  },
  (error) => {
    loading.close();
    MessageBox.alert("服务器内部错误", "提示信息", {
      confirmButtonText: "确定",
    });
    this.$router.push('/login');
  }
);


export default service;
