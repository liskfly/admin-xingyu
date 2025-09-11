<template>
  <div>
    <div id="weekRateChart" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { GetMonthWeekCompleteList } from "@/api/kanbanApi";
import dayjs from "dayjs";
export default {
  // props: ['Line'],
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} {d}%",
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
            radius: ["25%", "50%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#0c162d",
              borderWidth: 2,
            },
            label: {
              formatter: "{b}:\n {c} \n({d}%)",
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
  mounted() {
    this.initChart();
    this.getData();
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
       GetMonthWeekCompleteList({ datetype:"M" }).then(res => {
                if (res.Success) {

                    this.option.series[0].data =[
                        { value: res.Data.SumNum, name: '总数',itemStyle: { color: "#3f7af8" } },
                        { value: res.Data.CompNum, name: '已完成',itemStyle: { color: "#31be60" } },
                         { value: res.Data.InCompNum, name: '未完成',itemStyle: { color: "#ffc801" } },
                    ]
                    this.chart.setOption(this.option);
                }

            })
    },
    initChart() {
      const chartDom = document.getElementById("weekRateChart");
      this.chart = echarts.init(chartDom);
      this.chart.setOption(this.option);
    },
    startRefreshing() {
      this.stopRefreshing(); // 确保只有一个定时器运行
      this.refreshing = true;
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
