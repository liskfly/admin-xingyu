<template>
  <div class="process">
    <!-- <iframe class="iframe" style="border: none" v-bind:src="reportUrl"></iframe> -->
    <el-button @click="goto()">
          打开应用
      </el-button>
       <!-- <a href="GenericProgramEditor://">启动客户端</a>
       <a href="SOFTWARE\valorMSSFile\FeedMaint://">启动客户端1</a> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      reportUrl: "http://172.20.99.21/ValorMSS/shopfloor/FeederErrors",
    };
  },
  methods: {
    goto() {
      // window.open(this.reportUrl, "_blank");
         window.open('MaterialConfiguration://');
    },
  },
};
</script>

<style lang="scss" scoped>

.process {
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: calc(100vh - 100px);
  .iframe {
    width: 100%;
    height: 100%;
  }
}
</style>