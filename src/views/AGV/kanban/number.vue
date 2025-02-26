<template>
  <div id="state">
    <div ref="state" style="width: 100%; height: 100%" class="state"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      state: "",
    };
  },
  mounted() {
    this.echartInit();
  },
  methods: {
    echartInit() {
      this.state = echarts.init(this.$refs.state);
      const option = {
        xAxis: {
          type: "category",
          data: ["2/19", "2/20", "2/21", "2/22", "2/23", "2/24", "2/25"],
          axisLine: {
            lineStyle: {
              color: "#ffffff", // 将轴线颜色设置为白色
            },
          },
          axisLabel: {
            textStyle: {
              fontSize: 20, // 设置字体大小
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#ffffff", // 将轴线颜色设置为白色
            },
          },
          axisLabel: {
            textStyle: {
              fontSize: 20, // 设置字体大小
            },
          },
        },
        series: [
          {
            data: [10, 15, 10, 10, 10, 15, 10],
            type: "bar",
          },
        ],
      };
      this.state.setOption(option);
    },
  },
};
</script>

<style lang="scss">
#state {
  width: 100%;
  height: 330px;
  // background-color: rgba(0, 213, 255, 0.3); /* 半透明白色背景 */
  // backdrop-filter: blur(10px); /* 模糊滤镜 */
  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
</style>
