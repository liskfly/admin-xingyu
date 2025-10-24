<template>
  <div class="flex" id="box">
    <dv-scroll-board ref="scrollBoard" :config="config" style="width: 100%; height: 400px" />
  </div>
</template>

<script>
import { GetAOI2OEE } from "@/api/kanbanApi";
export default {
  data() {
    return {
      config: {
        header: [],
        data: [],
        // columnWidth: ['173px', '173px', '173px', '173px', '173px'],
        align: ["left", "left", "left", "center", "center", "center", "center"],
        rowNum: 7,
        headerBGC: "",
        waitTime: 5000
      },
    };
  },
  mounted() {
    let box = document.getElementById("box");
    console.log(box.clientWidth);
    this.config.header = [
      '<div style="font-size:20px;">设备</div>',
      '<div style="font-size:20px;">产线</div>',
      '<div style="font-size:20px;">A</div>',
      '<div style="font-size:20px;">P</div>',
      '<div style="font-size:20px;">Q</div>',
      '<div style="font-size:20px;">OEE</div>',
      //   '<div style="font-size:18px;width:108px">工单数量</div>',
      //   '<div style="font-size:18px;width:108px">工单进度</div>',
    ];
    this.getData();
    this.startRefreshing();
  },
  beforeDestroy() {
    this.stopRefreshing();
  },
  methods: {
    async getData() {
      // let data = [
      //   {
      //     equipment: "设备101",
      //     line: "Line1",
      //     a: "1000",
      //     q: "800",
      //     p: "11",
      //     oee: "80%",
      //   },
      //   {
      //     equipment: "设备201",
      //     line: "Line2",
      //     a: "1000",
      //     q: "800",
      //     p: "11",
      //     oee: "80%",
      //   },
      //   {
      //     equipment: "设备301",
      //     line: "Line3",
      //     a: "1000",
      //     q: "800",
      //     p: "11",
      //     oee: "80%",
      //   },
      //   {
      //     equipment: "设备401",
      //     line: "Line4",
      //     a: "1000",
      //     q: "800",
      //     p: "11",
      //     oee: "80%",
      //   },
      //   {
      //     equipment: "设备501",
      //     line: "Line5",
      //     a: "1000",
      //     q: "800",
      //     p: "11",
      //     oee: "80%",
      //   },
      //   {
      //     equipment: "设备601",
      //     line: "Line6",
      //     a: "1000",
      //     q: "800",
      //     p: "11",
      //     oee: "80%",
      //   },
      //   {
      //     equipment: "设备701",
      //     line: "Line7",
      //     a: "1000",
      //     q: "800",
      //     p: "11",
      //     oee: "80%",
      //   },
      // ];

      let data = await GetAOI2OEE().then((res) => {
        if (res.Success) {
          return res.Data;
        }
      });
      let num = 0
      this.config.data = data.map((item) => {
        num = num + Number(item.OEE_Context);
        return [
          `<div style="font-size:20px;color:#fff;">设备${item.ResourceName}</div>`,
          `<div style="font-size:20px;color:#fff;">${item.LineLine}</div>`,
          `<div style="font-size:20px;color:#fff;">${(item.A_Context * 100).toFixed(0) + '%'}</div>`,
          `<div style="font-size:20px;color:#fff;">${(item.P_Context * 100).toFixed(0) + '%'}</div>`,
          `<div style="font-size:20px;color:#fff;">${(item.Q_Context * 100).toFixed(0) + '%'}</div>`,
          `<div style="font-size:20px;color:#fff;">${(item.OEE_Context * 100).toFixed(0) + '%'}</div>`,
        ];
      });
      this.$emit('update-data',(num / 7).toFixed(2));
      this.$refs.scrollBoard.updateRows(this.config.data);
        // this.config.data = data.map((item) => {
        //   return [
        //     `<div style="font-size:20px;color:#fff;">${item.equipment}</div>`,
        //     `<div style="font-size:20px;color:#fff;">${item.line}</div>`,
        //     `<div style="font-size:20px;color:#fff;">${item.a}</div>`,
        //     `<div style="font-size:20px;color:#fff;">${item.q}</div>`,
        //     `<div style="font-size:20px;color:#fff;">${item.p}</div>`,
        //     `<div style="font-size:20px;color:#fff;">${item.oee}</div>`,
        //   ];
        // });
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

<style lang="scss" scoped></style>
