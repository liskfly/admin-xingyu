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
          data: ["1/3", "1/14", "1/15", "1/16", "1/17", "1/18", "1/19"],
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
            data: [120, 200, 150, 80, 70, 110, 130],
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
