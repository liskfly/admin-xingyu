<template>
    <div class="line-container" ref="container" id="fullDiv5">
      <div class="content-wrapper" ref="content">
        <factoryIndex />
      </div>
    </div>
  </template>
  
  <script>
  import factoryIndex from "./components/index.vue";
  
  export default {
    components: {
      factoryIndex
    },
    data() {
      return {
        timer: null,
        baseWidth: 1920,
        baseHeight: 1080
      };
    },
    computed: {
      baseProportion() {
        return this.baseWidth / this.baseHeight;
      }
    },
    methods: {
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
        clearTimeout(this.timer);
        this.timer = setTimeout(this.calcScaleRatio, 200);
      }
    },
    mounted() {
      this.calcScaleRatio();
      window.addEventListener("resize", this.handleResize);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.handleResize);
      if (this.timer) {
        clearTimeout(this.timer);
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
    background-image: url("../../../assets/bg.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
  }
  
  .content-wrapper {
    color: #000;
    width: 1920px;
    height: 1080px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: left top;
  }
  </style>