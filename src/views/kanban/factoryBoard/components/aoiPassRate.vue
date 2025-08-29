<template>
  <div>
    <div id="weekRateChart" style="width: 100%; height: 380px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
// import { GetReport_LineAOIFirstPassInfo } from "@/api/kanbanApi";
import dayjs from "dayjs";
export default {
  // props: ['Line'],
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c}%",
        },
        legend: {
          bottom: 10,
          left: "center",
          data: ["总数", "已完成", "未完成"],
          textStyle: {
            color: "#ffffff",
            fontSize: 15,
          },
        },

        series: [
          {
            name: "完成",
            type: "pie",
            radius: ["30%", "60%"],
            center: ["46%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#0c162d",
              borderWidth: 2,
            },
            label: {
              formatter: "{b}:\n {c}%",
              color: "#e6f7ff",
              fontSize: "18",
              fontWeight: "bold",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            data: [
              { value: 50, name: "总数", itemStyle: { color: "#3f7af8" } },
              { value: 25, name: "已完成", itemStyle: { color: "#31be60" } },
              { value: 25, name: "未完成", itemStyle: { color: "#ffc801" } }
            ],
          },
        ],
      },
      timer: null,
      chart: null,
      refreshing: true,
      loading: false,
      timer: null,
      Line: "Line1",
    };
  },
  watch: {
    // 监听Line属性变化
    Line: {
      immediate: true, // 立即触发一次
      handler(newLine) {
        // console.log(`生产线变更为: ${newLine}`);
        this.stopRefreshing();
        this.getData();
        this.startRefreshing();
      },
    },
  },
  mounted() {
    this.initChart();
    this.startRefreshing();
  },
  beforeDestroy() {
    this.stopRefreshing();
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    getData() {
      // GetReport_LineAOIFirstPassInfo({ Line: this.Line }).then((res) => {
      //   if (res.Success) {
      //     this.option.series[0].data = [
      //       {
      //         value: res.Data[0].FirstPass_Percent,
      //         name: "直通",
      //         itemStyle: { color: "#13c2c2" },
      //       },
      //       {
      //         value: res.Data[0].Badness_Percent,
      //         name: "不良",
      //         itemStyle: { color: "#ff7a45" },
      //       },
      //     ];
      //     this.chart.setOption(this.option);
      //   }
      // });
    },
    initChart() {
      const chartDom = document.getElementById("weekRateChart");
      this.chart = echarts.init(chartDom);
      this.chart.setOption(this.option);
    },
    startRefreshing() {
      this.stopRefreshing(); // 确保只有一个定时器运行
      this.refreshing = true;
      // 立即获取一次数据
      // this.getData();

      // 设置定时器，每分钟刷新一次
      this.timer = setInterval(() => {
        this.getData();
      }, 60000);
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
      setTimeout(() => {
        this.getData();
        this.loading = false;
      }, 800);
    },
  },
};
</script>

<style lang="scss" scoped></style>
