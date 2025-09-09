<template>
  <div class="flex" id="box">
    <dv-scroll-board :config="config" style="width: 100%; height: 400px" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      config: {
        header: [],
        data: [],
        // columnWidth: ['173px', '173px', '173px', '173px', '173px'],
        align: [ 'left', 'left', 'left', 'center', 'center','center','center'],
        rowNum: 7,
        headerBGC:"",
        waitTime:5000,
      
       
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
      '<div style="font-size:20px;">Q</div>',
       '<div style="font-size:20px;">P</div>',
      '<div style="font-size:20px;">OEE</div>',
    //   '<div style="font-size:18px;width:108px">工单数量</div>',
    //   '<div style="font-size:18px;width:108px">工单进度</div>',
    ];
    this.getData();
  },
  methods: {
    getData() {
      let data = [
       {
        equipment: "设备101",
        line: "Line1",
        a: "1000",
        q: "800",
        p:"11",
        oee: "80%"
       },
       {
        equipment: "设备201",
        line: "Line2",
        a: "1000",
        q: "800",
         p:"11",
        oee: "80%"
       },
       {
        equipment: "设备301",
        line: "Line3",
        a: "1000",
        q: "800",
         p:"11",
        oee: "80%"
       },
       {
        equipment: "设备401",
        line: "Line4",
        a: "1000",
        q: "800",
         p:"11",
        oee: "80%"
       },
       {
        equipment: "设备501",
        line: "Line5",
        a: "1000",
        q: "800",
         p:"11",
        oee: "80%"
       },
         {
        equipment: "设备601",
        line: "Line6",
        a: "1000",
        q: "800",
         p:"11",
        oee: "80%"
       },
         {
        equipment: "设备701",
        line: "Line7",
        a: "1000",
        q: "800",
         p:"11",
        oee: "80%"
       }
      ];
      this.config.data = data.map((item) => {
        return [
          `<div style="font-size:20px;color:#fff;width:173px">${item.equipment}</div>`,
          `<div style="font-size:20px;color:#fff;width:173px">${item.line}</div>`,
          `<div style="font-size:20px;color:#fff;width:173px">${item.a}</div>`,
          `<div style="font-size:20px;color:#fff;width:173px">${item.q}</div>`,
           `<div style="font-size:20px;color:#fff;width:173px">${item.p}</div>`,
          `<div style="font-size:20px;color:#fff;width:173px">${item.oee}</div>`
        ];
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
