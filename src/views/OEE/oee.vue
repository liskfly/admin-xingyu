<template>
  <div class="traceability" id="fullDiv3">
    <!-- <div v-loading="iframeloading"></div> -->
    <iframe
      class="iframe"
      id="ifra"
      style="border: none"
      v-bind:src="reportUrl"
    ></iframe>
  </div>
</template>

<script>
import { getDate } from '@/utils/getDate';
export default {
  data() {
    return {
      iframeloading: true,
      reportUrl: `http://172.20.99.29:9010?${new Date().getTime()}`,
    };
  },
  mounted() {
    const iframe = document.querySelector("#ifra");
    this.startLoading()
    // 处理兼容行问题
    if (iframe.attachEvent) {
      iframe.attachEvent("onload", () => {
          this.endLoading()
        // this.iframeloading = false;
        // iframe加载完毕以后执行操作
        console.log("iframe已加载完毕");
      });
    } else {
      iframe.onload = () => {
           this.endLoading()
        // this.iframeloading = false;
        // iframe加载完毕以后执行操作
        console.log("iframe已加载完毕");
      };
    }
  },
  methods: {
    startLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "加载中~",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.2)", //调节透明度
      });
    },
    endLoading() {
      this.loading.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.traceability {
  width: 100%;
  height: calc(100vh - 110px);
  .iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
