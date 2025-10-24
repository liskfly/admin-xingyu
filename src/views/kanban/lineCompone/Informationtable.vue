<template>
  <div class="flex" id="box">
    <dv-scroll-board ref="scrollBoard" :config="config" style="width: 99%; height: 250px" />
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
        columnWidth: ['230','60','230','200','200','140'],
        align: ["left", "left", "left", "center", "center", "center", "center"],
        rowNum: 7,
        headerBGC: "",
        waitTime: 5000,
        list:[]
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
      '<div style="font-size:20px;text-align: center;">计划开始时间</div>',
      '<div style="font-size:20px;text-align: center;">计划结束时间</div>',
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
        console.log(newVal);
      this.config.data = newVal.map((item) => {
        return [
          `<div style="font-size:20px;color:#fff;text-align: center;">${item.OrderName}</div>`,
          `<div style="font-size:20px;color:#fff;text-align: center;">${item.Side}</div>`,
          `<div style="font-size:20px;color:#fff;text-align: center;">${item.ProductDsc}</div>`,
          `<div style="font-size:20px;color:#fff;text-align: center;">${item.PlannedStartTime}</div>`,
          `<div style="font-size:20px;color:#fff;text-align: center;">${item.PlannedFinishTime}</div>`,
          `<div style="font-size:20px;color:#fff;text-align: center;">${'10%'}</div>`,
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
// ::v-deep .header-item:nth-child(4),
// ::v-deep .ceil:nth-child(4) {
// 	width: 200px!important;
// }
</style>
