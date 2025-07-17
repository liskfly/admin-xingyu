<template>
    <div>
      <div id="spiPassRateChart"  style="width: 100%; height: 330px"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from "echarts";
  export default {
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
              radius: ["40%", "70%"],
              center: ["45%", "45%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: "#0c162d",
                borderWidth: 2,
              },
              label: {
                formatter: "{b}: {c}%",
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
              // labelLine: {
              //   show: false,
              // },
              data: [
                { value: 95.7, name: "直通", itemStyle: { color: "#52c41a" } },
                { value: 4.3, name: "不良", itemStyle: { color: "#ff4d4f" } },
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
    mounted() {
        this.initChart();
        this.startRefreshing();
    },
    methods: {
      getData() {
        // 模拟获取数据
      
     
          const passRate = (Math.random() * 8 + 90).toFixed(1);
      // 计算不良率(100-直通率)
      const failRate = (100 - passRate).toFixed(1);

      this.option.series[0].data = [
        { value: parseFloat(passRate), name: "直通", itemStyle: { color: "#52c41a" } },
        { value: parseFloat(failRate), name: "不良", itemStyle: { color: "#ff4d4f" } }
      ];
        this.chart.setOption(this.option);
      },
      initChart() {
        const chartDom = document.getElementById("spiPassRateChart");
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
  