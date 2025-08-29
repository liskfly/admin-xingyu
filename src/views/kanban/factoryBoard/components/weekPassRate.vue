<template>
    <div>
        <div id="badPassRateChart" style="width: 100%; height: 380px"></div>
    </div>
</template>

<script>
import * as echarts from "echarts";
// import { GetReport_LineBadnessInfo } from "@/api/kanbanApi"
import dayjs from "dayjs";
export default {
    // props: ['Line'],
    data() {
        return {
            option: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}%'
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
                    name: '周完成',
                    type: 'pie',
                    radius: ['10%', '60%'],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    // itemStyle: {
                    //     borderRadius: 10
                    // },
                    label: {
                        formatter: '{b}:\n {c}%',
                        color: '#e6f7ff',
                        fontSize: 18,
                        fontWeight: "bold",
                        // position: 'inside',
                        overflow: 'none'
                    },
                    labelLine: {
                        show: true, // 显示引导线
                        length: 5, // 引导线长度
                        length2: 5, // 引导线末端长度
                    },

                    data: [{ value: 66.67, name: '总数' },
                    { value: 33.33, name: '已完成' },
                    ],
                    color: ['#8f6be9', '#06c0d5']
                }]
            },
            timer: null,
            chart: null,
            refreshing: true,
            loading: false,
            timer: null,
            Line: "Line1"
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

            // GetReport_LineBadnessInfo({ Line: this.Line }).then(res => {
            //     if (res.Success) {

            //         this.option.series[0].data = res.Data.map(item => ({
            //             value: item.CodeCount,
            //             name: item.badphenomena_value
            //         }));
            //         this.chart.setOption(this.option);
            //     }

            // })
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