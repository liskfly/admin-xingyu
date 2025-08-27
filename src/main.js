import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "tailwindcss/tailwind.css";
import "./utils/directives.js";
import "font-awesome/css/font-awesome.min.css";

// 修改 el-dialog 默认点击遮照不关闭
ElementUI.Dialog.props.closeOnClickModal.default = false;

import "@/styles/index.scss";

import App from "./App";
import store from "./store";
import router from "./router/index.js";

import "@/icons"; // icon
import "@/permission.js"; // permission control

import AFTableColumn from "af-table-column";
Vue.use(AFTableColumn);

import dataV from "@jiaminghi/data-view";
Vue.use(dataV);

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

import moment from "moment";
Vue.prototype.$moment = moment;

Vue.use(ElementUI, { size: "medium" });

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
