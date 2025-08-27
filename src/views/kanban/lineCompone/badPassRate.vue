<template>
    <div>
        <div id="badPassRateChart" style="width: 100%; height: 300px"></div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import { GetReport_LineBadnessInfo } from "@/api/kanbanApi"
import dayjs from "dayjs";
export default {
    props: ['Line'],
    data() {
        return {
            option: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    // data: ['偏移', '少锡', '短路', '漏件', '极性反', '其他'],
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 15,
                    }
                },

                series: [{
                    name: '不良分布',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    center: ['50%', '40%'],
                    roseType: 'radius',
                    itemStyle: {
                        borderRadius: 8
                    },
                    label: {
                        formatter: '{b}: {c}',
                        color: '#e6f7ff',
                        fontSize: "18",
                        fontWeight: "bold",
                        overflow: 'none'
                    },

                    data: [{ value: 32, name: '偏移' },
                    { value: 28, name: '少锡' },
                    { value: 18, name: '短路' },
                    { value: 12, name: '漏件' },
                    { value: 8, name: '极性反' },
                    { value: 15, name: '其他' }],
                    color: ['#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#ffec3d', '#bae637']
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
  
            GetReport_LineBadnessInfo({ Line: this.Line }).then(res => {
                if (res.Success) {
                    
                    this.option.series[0].data = res.Data.map(item => ({
                        value: item.CodeCount,
                        name: item.badphenomena_value
                    }));
                    this.chart.setOption(this.option);
                }

            })
        },
        initChart() {
            const chartDom = document.getElementById("badPassRateChart");

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
            setTimeout(() => {
                this.getData();
                this.loading = false;
            }, 800);
        }
    },
};
</script>

<style lang="scss" scoped></style>