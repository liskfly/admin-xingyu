<template>
  <div>
    <div id="capacityChart" style="width: 100%; height: 360px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  data() {
    return {
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#8ac6ff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(138, 198, 255, 0.1)",
            },
          },
          axisLabel: {
            color: "#8ac6ff",
            fontSize: "18",
          },
        },
        yAxis: {
          type: "category",
          data: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
          axisLine: {
            lineStyle: {
              color: "#8ac6ff",
              fontSize: "18",
            },
          },
          axisLabel: {
            color: "#8ac6ff",
            fontSize: "18",
          },
        },
        series: [
          {
            name: "产能",
            type: "bar",
            data: [1250, 1320, 1410, 1530, 1420, 1480, 1370],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#1890ff",
                },
                {
                  offset: 1,
                  color: "#13c2c2",
                },
              ]),
            },
            label: {
              show: true,
              position: "right",
              color: "#e6f7ff",
              fontSize: "18",
            },
          },
        ],
      },
      timer: null,
      chart: null,
      refreshing: true,
      loading: false,
      timer: null,
    };
  },
  mounted() {
    this.initChart();
    this.startRefreshing();
  },
  methods: {
    getData() {
      // 模拟获取数据，随机生成1000到1500的数

      const randomData = Array(7)
        .fill()
        .map(
          () => Math.floor(Math.random() * 501) + 1000 // 1000-1500随机数
        );
      this.option.series[0].data = randomData;
      this.chart.setOption(this.option);
    //   console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), "数据更新");
      
    },
    initChart() {
      const chartDom = document.getElementById("capacityChart");
      this.chart = echarts.init(chartDom);
      this.chart.setOption(this.option);
      // myChart.resize();
    },
    startRefreshing() {
      this.stopRefreshing(); // 确保只有一个定时器运行
      this.refreshing = true;
      this.timer = setInterval(() => {
        this.simulateDataFetch();
      }, 5000);
    },

    stopRefreshing() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.refreshing = false;
    },

    toggleRefresh() {
      if (this.refreshing) {
        this.stopRefreshing();
      } else {
        this.startRefreshing();
      }
    },

    refreshData() {
      this.simulateDataFetch();
    },

    simulateDataFetch() {
      this.loading = true;

      // 模拟数据请求延迟
      setTimeout(() => {
        this.getData();
        this.loading = false;
      }, 800);
    },
  },
};
</script>

<style lang="scss" scoped></style>
