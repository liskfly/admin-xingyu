<template>
  <div>
    <div id="throwMChart" :style="{ height: barHeight + 'px' }"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { GetFeeder } from "@/api/kanbanApi";
// import dayjs from "dayjs";
export default {
  props: ['Line','barHeight'],
  data() {
    return {
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: "{b}: {c}",
        },
        grid: {
          left: "3%",
          right: "10%",
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
            color: "#ffffff",
            fontSize: 18,
          },
        },
        yAxis: {
          type: "category",
          data: [
            "料号1",
            "料号2",
            "料号3",
            "料号4",
            "料号5",
            "料号6",
            "料号7",
            "料号8",
            "料号9",
            "料号10"
          ],
          axisLine: {
            lineStyle: {
              color: "#8ac6ff",
            },
          },
          axisLabel: {
            color: "#ffffff",
            fontSize: 24,
            fontWeight: "bold",
            // formatter: function (value, index) {
            //     return `{${index}|${value}}`;
            // },
            // rich: (() => {
            //     var rich = {};
            //     var len = 10;
            //     for (var i = 0; i < len; i++) {
            //         var greenBlue = Math.floor(255 - (i / (len - 1)) * 255);
            //         rich[i] = {
            //             color: `rgb(255, ${greenBlue}, ${greenBlue})`,
            //             fontSize: 20,
            //             fontWeight: "bold",
            //         };
            //     }
            //     return rich;
            // })(),
          },
        },
        series: [
          {
            name: "抛料数",
            type: "bar",
            data: [
                {value:10,itemStyle:{color:"#ffd9d9"}}, 
                {value:20,itemStyle:{color:"#ffb3b3"}},
                {value:30,itemStyle:{color:"#ff9080"}},
                {value:40,itemStyle:{color:"#ff7875"}},
                {value:50,itemStyle:{color:"#ff5f5b"}},
                {value:60,itemStyle:{color:"#ff4743"}},
                {value:70,itemStyle:{color:"#ff2f2b"}},
                {value:80,itemStyle:{color:"#ff1f1b"}},
                {value:90,itemStyle:{color:"#ff0f0b"}},
                {value:100,itemStyle:{color:"#ff0000"}},
            ],
            label: {
              show: true,
              position: "right",
              color: "#ffccc7",
              fontSize: 25,
              fontWeight: "bold",
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
  watch: {
    // 监听Line属性变化
    Line: {
      immediate: true, // 立即触发一次
      handler() {
        // console.log(`生产线变更为: ${newLine}`);
        this.stopRefreshing();
        this.getData();
        this.startRefreshing();
      },
    },
    barHeight: {
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
      this.chart.clear();
    }
  },
  methods: {
    getData() {
      let color = [
        "#ffd9d9",
        "#ffb3b3",
        "#ff9080",
        "#ff7875",
        "#ff5f5b",
        "#ff4743",
        "#ff2f2b",
        "#ff1f1b",
        "#ff0f0b",
        "#ff0000",
      ];
      GetFeeder({ Line: this.Line }).then((res) => {
        if (res.Success) {
          let data = res.Data.slice().reverse();
          if(data.length<10){
            let diff=10-data.length;
            for(let i=0;i<diff;i++){
              data.push({compname:"",qty:""});
            }}
          this.option.yAxis.data = data.map((item) => item.compname);
          this.option.series[0].data = data.map((item, index) => ({
            value: item.qty,
            name: item.compname,
            itemStyle: { color: color[index] },
          }));

          this.chart.setOption(this.option);
        }
      })
    },
    initChart() {
      const chartDom = document.getElementById("throwMChart");
      this.chart = echarts.init(chartDom, null, {
        renderer: "svg",
        useDirtyRect: false, // 关闭脏矩形优化，确保 SVG 渲染正常
      });
      this.chart.setOption(this.option);
      // myChart.resize();
    },
    startRefreshing() {
      this.stopRefreshing(); // 确保只有一个定时器运行
      this.refreshing = true;
      this.timer = setInterval(() => {
        this.getData();
      }, 600000);
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
  },
};
</script>
