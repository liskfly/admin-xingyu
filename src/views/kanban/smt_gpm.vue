<template>
  <div class="traceability" id="fullDiv2">
    <div v-loading="iframeloading"></div>
    <iframe
      class="iframe"
      id="ifra"
      style="border: none"
      v-bind:src="reportUrl"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframeloading: true,
      reportUrl: "http://172.20.99.21/ValorMSS/shopfloor/GPM/index",
    };
  },
   mounted() {
    const iframe = document.querySelector("#ifra");
    // 处理兼容行问题
    if (iframe.attachEvent) {
      iframe.attachEvent("onload", () => {
        this.iframeloading = false;
     
      });
    } else {
      iframe.onload = () => {
        this.iframeloading = false;
      };
    }
  },
  
};
</script>

<style lang="scss" scoped>
.traceability {
  width: 100%;
  height: calc(100vh - 91px);
  .iframe {
    width: 100%;
    height: 100%;
  }
}
</style>