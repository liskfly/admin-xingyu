<template>
  <div>
    <div id="completionChart" :style="{ height: rateHeight + 'px' }"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { GetCompletionRate } from "@/api/kanbanApi"
import dayjs from "dayjs";
export default {
  props: ['Line','rateHeight'],
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          x: "right", //可设定图例在左、右、居中
          y: "top",

          data: ["完成", "剩余"],
          textStyle: {
            color: "#ffffff",
            fontSize: 15,
          },
        },

        series: [
          {
            name: "完成率",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#0c162d",
              borderWidth: 2,
            },
            label: {
              formatter: "{b}:{c}\n({d}%)",
              color: "#e6f7ff",
              fontSize: 20,
              fontWeight: "bold",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            // labelLine: {
            //   show: false,
            // },
            data: [
              { value: 0, name: "完成", itemStyle: { color: "#1890ff" } },
              { value: 0, name: "剩余", itemStyle: { color: "#2f4b7c" } },
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
      }
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
      GetCompletionRate({ Line: this.Line }).then(res => {
        if (res.Success) {
         
          // let completionData = ((res.Data[0].qty / res.Data[0].QuantityOrdered) * 100).toFixed(1)
          // let remainderData = (100 - completionData).toFixed(1)

          this.option.series[0].data = [
            { value: res.Data[0].qty, name: "完成", itemStyle: { color: "#1890ff" } },
            { value:(res.Data[0].QuantityOrdered-res.Data[0].qty) , name: "剩余", itemStyle: { color: "#2f4b7c" } },
          ];
          this.chart.setOption(this.option);
        }

      })
    },
    initChart() {
      const chartDom = document.getElementById("completionChart");
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
      }, 30000);


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
    }
  },
};
</script>

<style lang="scss" scoped></style>
