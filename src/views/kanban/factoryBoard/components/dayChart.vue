<template>
  <div class="flex" id="dayChartBox">
    <dv-scroll-board
      ref="scrollBoard"
      :config="config"
      style="width: 100%; height: 420px"
    />
  </div>
</template>

<script>
import { GetDayCompleteList } from "@/api/kanbanApi";
import dayjs from "dayjs";
export default {
  data() {
    return {
      config: {
        header: [],
        data: [],
        columnWidth: [
          "60px",
          "250px",
          "360px",
          "500px",
          "200px",
          "200px",
          "108px",
          "108px",
        ],
        align: ["center","left", "left", "left", "left", "left", "center", "center"],
        rowNum: 6,
        headerBGC: "",
        // oddRowBGC:"",
        // evenRowBGC:"",
        waitTime: 5000,
        refreshing: true,
        loading: false,
        timer: null,
      },
    };
  },
  mounted() {
    this.config.header = [
      '<div style="font-size:18px;width:60px">序号</div>',
      '<div style="font-size:18px;width:250px">MES工单</div>',
      '<div style="font-size:18px;width:360px">产品编码</div>',
      '<div style="font-size:18px;width:500px">产品</div>',
      '<div style="font-size:18px;width:200px">计划开始时间</div>',
      '<div style="font-size:18px;width:200px">实际开始时间</div>',
      '<div style="font-size:18px;width:108px">工单数量</div>',
      '<div style="font-size:18px;width:108px">工单进度</div>',
    ];
    this.getData();
    this.startRefreshing();
  },
  beforeDestroy() {
    this.stopRefreshing();
  },
  methods: {
    async getData() {
      let data = await GetDayCompleteList({}).then((res) => res.Data);
      
      this.config.data = data.map((item,index) => {
        return [
          `<div style="font-size:24px;color:#fff;width:60px">${index+1}</div>`,
          `<div style="font-size:18px;color:#fff;width:250px">${item.OrderName}</div>`,
          `<div style="font-size:18px;color:#fff;width:360px"><span>${item.ProductNO}</span></div>`,
          `<div style="font-size:18px;color:#fff;width:500px"><span>${item.ProductDesc}</span></div>`,
          `<div style="font-size:18px;color:#fff;width:200px">${dayjs(item.PlannedStartTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}</div>`,
          `<div style="font-size:18px;color:#fff;width:200px">${dayjs(item.PlannedFinishTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}</div>`,
          `<div style="font-size:20px;color:#fff;width:108px">${item.WoNum}</div>`,
          `<div style="font-size:24px;width:108px" class="${this.getStatusClass(item.CompletePercent)}">${item.CompletePercent}%</div>`,
        ];
      });
      this.$refs.scrollBoard.updateRows(this.config.data);
    },
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
//  /* 关键修复：增强选择器优先级以覆盖组件默认样式 */
//     #dayChartBox ::v-deep .dv-scroll-board .rows .row-item .ceil {
//       white-space: normal !important;
//       line-height: 1.5 !important;
//       padding: 8px 5px !important;
//     }
    
//     // #dayChartBox ::v-deep .dv-scroll-board .header-item {
//     //   background-color: rgba(0, 123, 255, 0.3) !important;
//     //   font-weight: bold;
//     // }
    
//     /* 产品名称列的特殊样式 */
//     .product-name-cell {
//       display: -webkit-box !important;
//       // -webkit-box-orient: vertical !important;
//       -webkit-line-clamp: 2 !important;
//       overflow: hidden;
//       text-overflow: ellipsis !important;
//       white-space: normal !important;
//       // line-height: 1.5 !important;
//     }

     .status-completed {
      background-color: #00d26a;
    }
    
    .status-inprogress {
      background-color: #ffc107;
    }
    
    .status-pending {
      background-color: #f85c5c;
    }
</style>
