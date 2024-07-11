<template>
  <div class="oee" id="fullDiv3">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4" :offset="0">
          <div class="text" :style="{ height: tableHeight1 - 40 + 'px' }">
            <div style="font-size: 14px; color: #666">总停机时数</div>
            <div>{{ stopTime }}</div>
          </div>
        </el-col>
        <el-col :span="10" :offset="0">
          <!-- <div class="text" :style="{ height: tableHeight1 - 40 + 'px' }"> -->
          <div
            :style="{
              height: tableHeight1 - 40 + 'px',
              borderRight: '1px solid rgba(230, 230, 230, 0.753)',
            }"
          >
            <oeePre :echarData="performance" title="综合性能"></oeePre>
          </div>
          <!-- </div> -->
        </el-col>
        <el-col :span="10" :offset="0">
          <oeePre :echarData="oeeData" title="设备综合效率"></oeePre>
        </el-col>
      </el-row>

      <!-- <div class="text">
        <div style="font-size: 14px; color: #666">总停机时数</div>
        <div>{{ stopTime }}</div>
      </div>
      <oeePre
        :echarData="performance"
        title="综合性能"
        :echartHeight="tableHeight1"
      ></oeePre>
      <oeePre
        :echarData="oeeData"
        title="设备综合效率"
        :echartHeight="tableHeight1"
      ></oeePre> -->
      <!-- </div> -->
    </el-card>

    <!-- <el-col :span="8" :offset="0"> -->
    <el-card>
      <div class="box">
        <div class="item">
          <div>负荷时间率</div>
          <div>{{ dateYield }}%</div>
        </div>
        <div class="item">
          <div>良率</div>
          <div>{{ yieldData }}%</div>
          <!-- <div> <dv-decoration-9 style="width:80px;height:80px;">{{ yieldData }}%</dv-decoration-9></div> -->
        </div>
        <div class="item">
          <div>产能</div>
          <div>{{ availability }}%</div>
        </div>
        <div class="item">
          <div>性能</div>
          <div>{{ performance }}%</div>
        </div>
      </div>
    </el-card>
    <!-- </el-col>
      <el-col :span="8" :offset="0"> -->
    <el-card>
      <div
        :style="{
          height: tableHeight3 + 'px',
        }"
      >
        <oeebar :echarData="barData"></oeebar>
      </div>
    </el-card>
    <!-- </el-col>
    </el-row> -->
  </div>
</template>

<script>
import oeePre from "@/components/char/oee_pre.vue";
import oeebar from "@/components/char/oee_bar.vue";
import { XY_OEE_InquiryControl } from "@/api/all";
export default {
  data() {
    return {
      getDataText: {
        startTime: "2024-03-07",
        endTime: "2024-03-07",
        operationType: "Q",
      },
      oeeData: 0,
      performance: 0, //性能
      yieldData: 0, //良率
      availability: 0, //产能效率
      dateYield: 0,
      stopTime: 0,
      barData: {
        lable: [],
        value: [],
      },
      tableHeight1: 0,
      tableHeight2: 0,
      tableHeight3: 0,
    };
  },
  mounted() {
    this.getData();
    this.getScreenHeight();
    window.addEventListener("resize", this.getScreenHeight, false);
  },
  methods: {
    getData() {
      XY_OEE_InquiryControl(this.getDataText).then(({ data }) => {
        if (data.Status == "OK") {
          let list = data.DataList;
          let oee = 0;
          let preform = 0;
          let yiel = 0;
          let availab = 0;
          let planWorkTime = 0;
          let planStopTime = 0;
          let actWorkingTime = 0;
          let dataLength = 0;
          let stopTimeText = 0;
          list.forEach((item) => {
            if (item.OEE !== 0) {
              oee = item.OEE + oee;
              preform = item.performance + preform;
              yiel = item.Yield + yiel;
              availab = item.Availability + availab;
              planWorkTime = item.PlanWorkTime + planWorkTime;
              planStopTime = item.PlanStopTime + planStopTime;
              actWorkingTime = item.ActWorkingTime + actWorkingTime;
              stopTimeText = item.ActStopTime + stopTimeText;
              dataLength++;
            }
            this.barData.lable.unshift(item.LineName);
            this.barData.value.unshift({
              value: item.OEE,
              name: item.LineName,
            });

            // if (item.performance !== 0) {

            // }
          });
          // console.log(data.DataList);
          // let num=
          this.dateYield = (
            (actWorkingTime / (planWorkTime - planStopTime)) *
            100
          ).toFixed(2);
          // this.stopTime=stopTimeText/dataLength
          this.oeeData = oee / dataLength;
          this.performance = preform / dataLength;
          this.yieldData = yiel / dataLength;
          this.availability = availab / dataLength;
          this.dataTime(stopTimeText / dataLength);
          // console.log(this.oeeData, this.performance);
        }
      });
    },
    getScreenHeight() {
      // this.$nextTick(() => {
      // console.log( window.innerHeight);
      this.tableHeight1 =
        ((window.innerHeight ||
          document.documentElement.innerHeight ||
          document.body.clientHeight) -
          150) *
        0.32;
      this.tableHeight2 =
        ((window.innerHeight ||
          document.documentElement.innerHeight ||
          document.body.clientHeight) -
          150) *
        0.14;
      this.tableHeight3 =Math.round(((window.innerHeight ||
          document.documentElement.innerHeight ||
          document.body.clientHeight) -
          150) *
          0.54 -
        50)
        
      // console.log(window.innerHeight,  document.body.clientHeight);
      //后面的50：根据需求空出的高度，自行调整
      // });
    },
    dataTime(data) {
      let d = parseInt(data / 60 / 24) >= 1 ? parseInt(data / 60 / 24) : 0;
      let h = parseInt(data / 60);
      let m = data % 60;
      let s = (data - Math.trunc(data)) * 60;

      this.stopTime = d + "d:" + h + "h:" + m + "m:" + s + "s";
      // console.log(d,h,m);
    },
  },
  components: {
    oeePre,
    oeebar,
  },
};
</script>

<style lang="scss" scoped>
.oee {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  // .pre {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  // justify-content: flex-end;
  // width: 800px;
  // height: 150px;
  .text {
    // width: 200px;
    width: 100%;
    // height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-right: 1px solid rgba(230, 230, 230, 0.753);
  }
  // }
  .box {
    display: flex;
    justify-content: space-between;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
      align-items: center;
    }
  }
}
</style>
