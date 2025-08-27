<template>
    <div>
        <div id="throwMChart" style="width: 100%; height: 360px"></div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import { GetFeeder } from "@/api/kanbanApi"
import dayjs from "dayjs";
export default {
    props: ['Line'],
    data() {
        return {
            option: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: '{b}: {c} 个'
                },
                grid: {
                    left: '3%',
                    right: '10%',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#8ac6ff'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(138, 198, 255, 0.1)'
                        }
                    },
                    axisLabel: {
                        color: '#ffffff',
                        fontSize: "18",
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ["1070200100011", "1070200100012", "1070200100013", "1070200100014", "1070200100015", "1070200100016", "1070200100017", "1070200100018", "1070200100019", "1070200100020"],
                    axisLine: {
                        lineStyle: {
                            color: '#8ac6ff'
                        }
                    },
                    axisLabel: {
                        color: '#ffffff',
                        fontSize: "18",
                    }
                },
                series: [{
                    name: '抛料数',
                    type: 'bar',
                    data: [45, 32, 28, 22, 18, 15, 12, 8, 5, 3],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#ff7875'
                        }, {
                            offset: 1,
                            color: '#ff4d4f'
                        }])
                    },
                    label: {
                        show: true,
                        position: 'right',
                        color: '#ffccc7',
                        fontSize: "18",
                    }
                }]
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
            }
        }
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

            GetFeeder({ Line: this.Line }).then(res => {
                if (res.Success) {
                    this.option.yAxis.data = res.Data.slice().reverse().map(item => item.compname);
                    this.option.series[0].data = res.Data.slice().reverse().map(item => ({
                        value: item.qty,
                        name: item.compname
                    }));
                    this.chart.setOption(this.option);
                }

            })
        },
        initChart() {
            const chartDom = document.getElementById("throwMChart");
            this.chart = echarts.init(chartDom);
            this.chart.setOption(this.option);
            // myChart.resize();
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

            // 模拟数据请求延迟
            setTimeout(() => {
                this.getData();
                this.loading = false;
            }, 800);
        }
    },
};
</script>

<style lang="scss" scoped></style>