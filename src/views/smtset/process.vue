<template>
  <div class="process">
    <iframe class="iframe" style="border: none" v-bind:src="reportUrl"></iframe>
    <!-- <el-button @click="goto()">
          打开应用
      </el-button> -->
       <!-- <a href="GenericProgramEditor://">启动客户端</a>
       <a href="SOFTWARE\valorMSSFile\FeedMaint://">启动客户端1</a> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      reportUrl: "https://172.20.99.4/CamstarPortal/default.htm#/login",
    };
  },
  methods: {
    goto() {
      // window.open(this.reportUrl, "_blank");
        //  window.open('WorkSpace://');
    },
  },
};
</script>

<style lang="scss" scoped>

.process {
  width: 100%;
  height: calc(100vh - 100px);
  .iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
