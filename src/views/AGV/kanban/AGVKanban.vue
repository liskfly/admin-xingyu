<template>
  <div class="traceability" id="fullDiv4" ref="box" style="position: relative">
    <div class="box" ref="appRef">
      <index></index>
    </div>
    <!-- <div v-loading="iframeloading"></div> -->
  </div>
</template>

<script>
import index from "./index.vue";
// import {
//   appRef,
//   calcRate,
//   windowDraw,
//   unWindowDraw,
//   proportion,
// } from "@/utils/useDraw";
export default {
  components: {
    index,
  },
  data() {
    return {
      iframeloading: true,
      reportUrl: `http://172.31.70.217:8088/`,
      // 指向最外层容器
      appRef: null,
      // 定时函数
      timer: 0,
      // 默认缩放值
      scale: {
        width: "1",
        height: "1",
      },
      // 设计稿尺寸（px）
      baseWidth: 1920,
      baseHeight: 1080,
      proportion: 1,
    };
  },
  computed: {
    // 需保持的比例（默认1.77778）
    baseProportion() {
      return parseFloat((this.baseWidth / this.baseHeight).toFixed(5));
    },
  },
  mounted() {
    // const iframe = document.querySelector("#ifra");
    // this.startLoading()
    // // 处理兼容行问题
    // if (iframe.attachEvent) {
    //   iframe.attachEvent("onload", () => {
    //       this.endLoading()
    //     // this.iframeloading = false;
    //     // iframe加载完毕以后执行操作
    //     console.log("iframe已加载完毕");
    //   });
    // } else {
    //   iframe.onload = () => {
    //        this.endLoading()
    //     // this.iframeloading = false;
    //     // iframe加载完毕以后执行操作
    //     console.log("iframe已加载完毕");
    //   };
    // }
    this.windowDraw();
    this.calcRate();
    // this.resize();
    // windowDraw();
    // calcRate(this.$refs.box.clientWidth,this.$refs.box.clientHeight);
  },
  beforeDestroy() {
    this.unWindowDraw();
  },
  methods: {
    calcRate() {
      // 当前宽高比
      console.log(this.$refs.box.clientHeight, this.$refs.box.clientWidth);

      this.appRef = this.$refs.appRef;
      const currentRate = parseFloat(
        (this.$refs.box.clientWidth / this.$refs.box.clientHeight).toFixed(5)
      );
      if (this.appRef) {
        if (currentRate > this.baseProportion) {
          // 表示更宽
          this.scale.width = (
            (this.$refs.box.clientHeight * this.baseProportion) /
            this.baseWidth
          ).toFixed(5);
          this.scale.height = (
            this.$refs.box.clientHeight / this.baseHeight
          ).toFixed(5);
          this.appRef.style.transform = `scale(${this.scale.width}, ${this.scale.height}) translate(-50%, -50%)`;
        } else {
          // 表示更高
          this.scale.height = (
            this.$refs.box.clientWidth /
            this.baseProportion /
            this.baseHeight
          ).toFixed(5);
          this.scale.width = (
            this.$refs.box.clientWidth / this.baseWidth
          ).toFixed(5);
          this.appRef.style.transform = `scale(${this.scale.width}, ${this.scale.height}) translate(-50%, -50%)`;
          this.proportion =
            this.$refs.box.clientWidth / this.baseProportion / this.baseHeight;
        }
      }
    },
    resize() {
      console.log(1);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.calcRate();
      }, 200);
    },
    windowDraw() {
      window.addEventListener("resize", this.resize);
    },
    unWindowDraw() {
      window.removeEventListener("resize", this.resize);
    },
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
  height: calc(100vh - 91px);
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  background-image: url("./img/bg.png");
            /* 让背景图片覆盖整个容器 */
            background-size: cover;
            /* 让背景图片保持其宽高比 */
            background-repeat: no-repeat;
            /* 让背景图片在容器中居中 */
            background-position: center;
  .iframe {
    width: 100%;
    height: 100%;
  }
}

.box {
  color: #d3d6dd;
  width: 1920px;
  height: 1080px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: left top;
}
</style>
