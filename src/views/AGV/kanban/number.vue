<template>
  <div id="state">
    <div ref="state" style="width: 100%; height: 100%" class="state"></div>
  </div>
</template>

<script>
import { find7DaysTaskData } from "@/api/agvApi";
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  data() {
    return {
      state: "",
      intervalId: null,
      option: {
        animation: true,
        animationDuration: 1000, // 初始动画持续时间
        animationDurationUpdate: 1000, // 数据更新时的动画持续时间
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
            data: [0, 0, 0, 0, 0, 0, 0],
            type: "bar",
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  position: "top", // 在上方显示
                  textStyle: {
                    // 数值样式
                    color: "white",
                    fontSize: 25,
                  },
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
    this.getWeekDay();
    this.getData();
    this.startLoop();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    getData() {
      // const result = [];
      // for (let i = 0; i < 7; i++) {
      //   const num = Math.floor(Math.random() * 6) + 10;
      //   result.push(num);
      // }
      find7DaysTaskData().then((res) => {
        console.log(JSON.parse(res.data.Data));
        JSON.parse(res.data.Data).map((item) => {
          this.option.xAxis.data.map((date, index) => {
            if (this.convert(item.cr_date) == date) {
              this.option.series[0].data[index]++;
            }
          });
        });

        this.state.setOption(this.option, false);
        this.state.resize();
      });
      // this.option.series[0].data = [12, 10, 17, 14, 12, 16, 13];
    },
    getWeekDay() {
      const today = dayjs();
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = today.subtract(7 - i, "day").format("M/D");
        dates.push(date);
      }
      this.option.xAxis.data = dates;
      console.log(dates);

      this.state.setOption(this.option);
      this.state.resize();
    },
    echartInit() {
      this.state = echarts.init(this.$refs.state);
      this.state.setOption(this.option);
    },
    startLoop() {
      let todayText = dayjs().subtract(1, "day").format("M/D");
      let optionDate = this.option.xAxis.data[6];

      this.intervalId = setInterval(() => {
        // this.getData();
        if (todayText != optionDate) {
          this.getWeekDay();
          this.getData();
        }
      }, 1000 * 60 * 5); // Loop every second
    },
    convert(str) {
      // 创建 Date 对象
      const date = new Date(str);

      // 使用 Intl.DateTimeFormat 格式化日期
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "numeric", // 月份格式为数字
        day: "numeric", // 日期格式为数字
      }).format(date);

      return formattedDate;
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
