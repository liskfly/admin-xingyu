<template>
  <div>
    <div id="aoiPassRateChart" :style="{ height: rateHeight + 'px' }"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { GetReport_LineAOIFirstPassInfo } from "@/api/kanbanApi";
import dayjs from "dayjs";
export default {
  props: ["Line", "rateHeight"],
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c}%",
        },
        legend: {
          orient: "vertical",
          x: "right", //可设定图例在左、右、居中
          y: "top",

          data: ["直通", "不良"],
          textStyle: {
            color: "#ffffff",
            fontSize: 15,
          },
        },

        series: [
          {
            name: "直通率",
            type: "pie",
            radius: ["40%", "68%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            // startAngle: 90,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#0c162d",
              borderWidth: 2,
            },
            label: {
              formatter: "{b}:{c}%",
              color: "#e6f7ff",
              fontSize: 20,
              fontWeight: "bold",
               overflow: 'break'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: "bold",
              },
            },
            data: [
              { value: 97.8, name: "直通", itemStyle: { color: "#13c2c2" } },
              { value: 2.2, name: "不良", itemStyle: { color: "#ff7a45" } },
            ],
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
    rateHeight: {
      handler(newHeight) {
        if (this.chart) {
          this.chart.resize({ height: newHeight });
        }
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
      GetReport_LineAOIFirstPassInfo({ Line: this.Line }).then((res) => {
        if (res.Success) {
          this.option.series[0].data = [
            {
              value: res.Data[0].FirstPass_Percent,
              name: "直通",
              itemStyle: { color: "#13c2c2" },
            },
            {
              value: res.Data[0].Badness_Percent,
              name: "不良",
              itemStyle: { color: "#ff7a45" },
            },
          ];
          this.chart.setOption(this.option);
        }
      });
    },
    initChart() {
      const chartDom = document.getElementById("aoiPassRateChart");
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
