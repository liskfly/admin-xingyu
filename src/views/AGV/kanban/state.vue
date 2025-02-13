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
        title: {
          // text: "横向柱状图示例",
          textStyle: {
            color: "white", // 文字颜色
            textShadowColor: "transparent", // 文字阴影颜色
            textShadowBlur: 0, // 文字阴影模糊度
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          textStyle: {
            color: "white", // 文字颜色
            textShadowColor: "transparent", // 文字阴影颜色
            textShadowBlur: 0, // 文字阴影模糊度
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
          textStyle: {
            color: "white", // 文字颜色
            textShadowColor: "transparent", // 文字阴影颜色
            textShadowBlur: 0, // 文字阴影模糊度
          },
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
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
          type: "category",
          data: ["异常", "待叫料", "叫料中", "已完成"],
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
            name: "数据",
            type: "bar",
            data: [120, 200, 150, 80],
            barWidth: "50%", // 设置柱子的宽度
            itemStyle: {
              normal: {
                color: function (params) {
                  // 根据数据值设置不同的颜色，这里仅为示例
                  var colorList = ["#C1232B", "#E87C25", "#FCCE10", "yellowgreen"];
                  return colorList[params.dataIndex];
                },
              },
            },
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
