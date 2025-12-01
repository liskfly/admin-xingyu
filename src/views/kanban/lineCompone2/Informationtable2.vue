<template>
  <div class="flex" id="box">
    <dv-scroll-board ref="scrollBoard" :config="config" style="width: 100%; height: 120px" class="wrap-board" />
  </div>
</template>

<script>
import { GetAOI2OEE } from "@/api/kanbanApi";
export default {
  props: ['orderList'],
  data() {
    return {
      config: {
        header: [],
        data: [],
        columnWidth: ['300','60','1000','200','200','140'],
        rowHeight: 20,
        align: ["left", "left", "left", "center", "center", "center", "center"],
        rowNum: 3,
        headerBGC: "",
        waitTime: 5000,
        list:[],
        hoverPause:true
      },
    };
  },
  mounted() {
    let box = document.getElementById("box");
    console.log(box.clientWidth);
    this.config.header = [
      '<div style="font-size:20px;text-align: center;">生产工单</div>',
      '<div style="font-size:20px;text-align: center;">面别</div>',
      '<div style="font-size:20px;text-align: center;">产品</div>',
      '<div style="font-size:20px;text-align: center;">开始时间</div>',
      '<div style="font-size:20px;text-align: center;">结束时间</div>',
      '<div style="font-size:20px;text-align: center;">完成进度</div>',
    ];
    // this.getData();
    // this.startRefreshing();
  },
  beforeDestroy() {
    // this.stopRefreshing();
  },
  watch: {
    orderList(newVal) {
      this.config.data = newVal.map((item) => {
        return [
          `<div style="font-size:17px;color:#fff;text-align: center;">${item.OrderName}</div>`,
          `<div style="font-size:17px;color:#fff;text-align: center;">${item.Side}</div>`,
          `<div style="font-size:17px;color:#fff;text-align: center;width:100%;line-height:25px;word-wrap: break-word;white-space: normal;margin:0 auto">${item.ProductDsc}</div>`,
          `<div style="font-size:17px;color:#fff;text-align: center;">${item.ActualStartTime}</div>`,
          `<div style="font-size:17px;color:#fff;text-align: center;">${item.ActualEndTime}</div>`,
          `<div style="font-size:17px;color:#fff;text-align: center;margin:0 auto">${item.CompleteRate}</div>`,
        ];
      });
      this.$refs.scrollBoard.updateRows(this.config.data);
    }
  },
  methods: {
    getStatusClass(percent) {
          if (percent === '100') return 'status-completed';
          if (percent > '50') return 'status-inprogress';
          return 'status-pending';
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
  },
};
</script>

<style lang="scss" scoped>
// .ceil div {
//   display: flex !important;
// }
</style>