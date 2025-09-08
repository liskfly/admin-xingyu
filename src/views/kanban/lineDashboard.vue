<template>
  <div class="line-container" ref="container" id="fullDiv5">
    <div class="content-wrapper" ref="content" :style="contentStyle">
      <lineIndex :isVertical="isVertical"/>
    </div>
  </div>
</template>

<script>
import lineIndex from "./lineCompone/index.vue";
export default {
  components: {
    lineIndex
  },
  data() {
    return {
      timer: null,
      baseWidth: 1920,
      baseHeight: 1080,
      isVertical: false,
      windowWidth: 0,
      windowHeight: 0,
    }
  },
  computed: {
    baseProportion() {
      return this.baseWidth / this.baseHeight;
    },
    contentStyle() {
      return {
        width: this.baseWidth + 'px',
        height: this.baseHeight + 'px'
      };
    }
  },
  mounted() {
    this.checkOrientation();
    this.calcScaleRatio();
    window.addEventListener("resize", this.handleResize);

    // 初始窗口尺寸
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    checkOrientation() {
      // 判断屏幕方向
      this.isVertical = window.innerHeight > window.innerWidth;

      // 根据方向调整基准尺寸
      if (this.isVertical) {
        this.baseWidth = 1080;
        this.baseHeight = 1920;
      } else {
        this.baseWidth = 1920;
        this.baseHeight = 1080;
      }
    },
    calcScaleRatio() {
      const container = this.$refs.container;
      const content = this.$refs.content;

      if (!container || !content) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // 容器尺寸校验
      if (containerWidth === 0 || containerHeight === 0) return;

      const currentRatio = containerWidth / containerHeight;

      let scaleX, scaleY;
      if (currentRatio > this.baseProportion) {
        // 容器更宽（横向空间多）
        scaleX = (containerHeight * this.baseProportion) / this.baseWidth;
        scaleY = containerHeight / this.baseHeight;
      } else {
        // 容器更高（纵向空间多）
        scaleX = containerWidth / this.baseWidth;
        scaleY = containerWidth / (this.baseProportion * this.baseHeight);
      }

      // 应用缩放变换
      content.style.transform = `scale(${scaleX}, ${scaleY}) translate(-50%, -50%)`;
    },
    handleResize() {
      this.checkOrientation();
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.calcScaleRatio();
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
      }, 200);
    },
    toggleOrientation() {
      // 切换方向（仅用于演示）
      this.isVertical = !this.isVertical;

      // 根据方向调整基准尺寸
      if (this.isVertical) {
        this.baseWidth = 1080;
        this.baseHeight = 1920;
      } else {
        this.baseWidth = 1920;
        this.baseHeight = 1080;
      }

      this.$nextTick(() => {
        this.calcScaleRatio();
      });
    },
    refreshWindow() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.calcScaleRatio();
    }
  }
};
</script>

<style lang="scss" scoped>
.line-container {
  height: calc(100vh - 91px);
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background-image: url("../../assets/bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}

.content-wrapper {
  color: #000;
  // width: 1920px;
  // height: 1080px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: left top;
   transition: transform 0.3s ease; 
}
</style>