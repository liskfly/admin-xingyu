<template>
  <div id="state">
    <div
      ref="state"
      id="charAgv"
      style="width: 100%; height: 100%"
      class="state"
    ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { findKanBan, findTaskData } from "@/api/agvApi";
import { element } from "screenfull";
export default {
  data() {
    return {
      state: "",
      intervalId: null,
      arrData: [],
      option: {
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
            // color: "white", // 文字颜色
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
          data: ["异常", "已取料", "叫料中", "已完成"],
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
            data: [12, 20, 15, 8],
            barWidth: "50%", // 设置柱子的宽度
            label: {
              show: true, // 开启显示
              position: "right", // 在上方显示
              textStyle: {
                // 数值样式
                color: "white",
                fontSize: 25,
              },
              formatter: (params) => {
                return params.value > 0 ? params.value : "";
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  // 根据数据值设置不同的颜色，这里仅为示例
                  let colorList = [
                    "#C1232B",
                    "#0000ff",
                    "#FCCE10",
                    "yellowgreen",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.echartInit();
    this.getData();
    this.startLoop();
  },
  beforeDestroy() {
    this.stopLoop();
  },
  methods: {
    getData() {
      findKanBan().then((res) => {
        if (res.data.Success) {
          let data = JSON.parse(res.data.Data);
          // console.log(data);
          let count2 = 0,
            count3 = 0,
            count99 = 0;
          data.forEach((item) => {
            // 处理 taskStatus1
            if (item.taskStatus1 === "2") count2++;
            else if (item.taskStatus1 === "22") count3++;
            else if (item.taskStatus1 === "3") count99++;

            // 处理 taskStatus2
            if (item.taskStatus2 === "2") count2++;
            else if (item.taskStatus2 === "22") count3++;
            else if (item.taskStatus2 === "3") count99++;
          });

          // this.arrData = [10, count2, count3, count99];

          findTaskData().then((res) => {
            if (res.data.Success) {
              let data1 = JSON.parse(res.data.Data);
              console.log(data1);
              
              this.option.series[0].data = [
                count3,
                count99,
                count2,
                data1.length,
              ];
            } else {
              this.option.series[0].data = [count3, count99, count2, 0];
            }
            this.state.setOption(this.option);
            this.state.resize();
          });
        }
        setTimeout(() => {
          this.loading = true;
        }, 1000);
      });
    },
    echartInit() {
      this.state = echarts.init(document.getElementById("charAgv"));

      this.state.setOption(this.option);
      this.state.resize();
    },
    startLoop() {
      this.intervalId = setInterval(() => {
        this.getData();
      }, 10000); // Loop every second
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
