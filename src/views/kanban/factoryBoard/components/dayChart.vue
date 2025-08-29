<template>
  <div class="flex" id="box">
    <dv-scroll-board :config="config" style="width: 100%; height: 380px" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {
        header: [],
        data: [],
        columnWidth: ['173px', '173px', '173px', '173px', '173px', '108px', '108px'],
        align: ['left', 'left', 'left', 'left', 'left', 'center', 'center'],
        rowNum: 5,
        headerBGC:"",
        waitTime:5000,
      
       
      },
    };
  },
  mounted() {
    // let box = document.getElementById("box");
    // console.log(box.clientWidth);
    this.config.header = [
      '<div style="font-size:18px;width:173px">MES工单</div>',
      '<div style="font-size:18px;width:173px">产品编码</div>',
      '<div style="font-size:18px;width:173px">产品名称</div>',
      '<div style="font-size:18px;width:173px">计划开始时间</div>',
      '<div style="font-size:18px;width:173px">实际开始时间</div>',
      '<div style="font-size:18px;width:108px">工单数量</div>',
      '<div style="font-size:18px;width:108px">工单进度</div>',
    ];
    this.getData();
  },
  methods: {
    getData() {
      let data = [
        {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },
        {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },
         {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },
         {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },
         {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },

         {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },
         {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },
         {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },
         {
          WorkOrderNo: "MES20230901001",
          ProductCode: "P20230901001",
          ProductName: "产品名称A",
          PlanStartTime: "2023-09-01 08:00",
          ActualStartTime: "2023-09-01 08:05",
          OrderQty: 1000,
          Progress: "50%",
        },
      ];
      this.config.data = data.map((item) => {
        return [
          `<div style="font-size:18px;color:#fff;width:173px">${item.WorkOrderNo}</div>`,
          `<div style="font-size:18px;color:#fff;width:173px">${item.ProductCode}</div>`,
          `<div style="font-size:18px;color:#fff;width:173px">${item.ProductName}</div>`,
          `<div style="font-size:18px;color:#fff;width:173px">${item.PlanStartTime}</div>`,
          `<div style="font-size:18px;color:#fff;width:173px">${item.ActualStartTime}</div>`,
          `<div style="font-size:18px;color:#fff;width:108px">${item.OrderQty}</div>`,
          `<div style="font-size:18px;color:#fff;width:108px">${item.Progress}</div>`,
        ];
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
