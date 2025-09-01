<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-input v-model="form.PSN" ref="inputRef" placeholder="请扫入大板SN" style="width: 500px;" @keyup.enter.native="getData" /> <el-button
          type="primary" @click="getData">查询</el-button>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane name="1" label="插针机">
          <el-table :data="tableData1.slice(
            (currentPage1 - 1) * pageSize1,
            currentPage1 * pageSize1
          )" style="width: 100%" stripe border :height="tableHeight" size="small">
           <el-table-column width="50" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + pageSize1 * (currentPage1- 1) + 1 }}</span>
          </template>
        </el-table-column>
            <el-table-column prop="ProgramName" label="程序名"></el-table-column>
            <el-table-column prop="Position" label="插针位"></el-table-column>
            <el-table-column prop="Head" label="插针头"></el-table-column>
            <el-table-column prop="DataValue" label="力度"></el-table-column>
            <el-table-column prop="StandardValue" label="标准值"></el-table-column>
          </el-table>
          <div class="block" style="margin-top: 8px">
            <el-pagination align="center" background @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1" :current-page="currentPage1" :page-size="pageSize1"
              :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="tableData1.length">
            </el-pagination>
          </div>

        </el-tab-pane>
        <el-tab-pane name="2" label="AOI">
          <el-table :data="tableData2.slice(
            (currentPage2 - 1) * pageSize2,
            currentPage2 * pageSize2
          )" style="width: 100%" stripe border :height="tableHeight" size="small">
          <el-table-column width="50" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + pageSize2 * (currentPage2 - 1) + 1 }}</span>
          </template>
        </el-table-column>
            
            <el-table-column prop="ReferName" label="点位名" width="80"></el-table-column>
            <el-table-column prop="Side" label="面" width="60"></el-table-column>
            <el-table-column prop="InspectDefect" label="检查缺陷"></el-table-column>
            <el-table-column prop="ReviewDefect" label="审查缺陷"></el-table-column>
            <el-table-column prop="InspectTime" label="检查时间" width="180"></el-table-column>
            <el-table-column prop="ReviewTime" label="审查时间" width="180"></el-table-column>
            <af-table-column prop="Reviewer" label="审查操作员"></af-table-column>
            <af-table-column prop="RecipeName" label="程式名"></af-table-column>
            <el-table-column prop="GoldenImage" label="Golden图"></el-table-column>
            <el-table-column prop="NGImage" label="NG图"></el-table-column>
          </el-table>
          <div class="block" style="margin-top: 8px">
            <el-pagination align="center" background @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2" :current-page="currentPage2" :page-size="pageSize2"
              :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="tableData2.length">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane name="3" label="分板机">
          <el-table :data="tableData3.slice(
            (currentPage3 - 1) * pageSize3,
            currentPage3 * pageSize3
          )" style="width: 100%" stripe border :height="tableHeight" size="small">
            <el-table-column prop="DataName" label="属性">
              <template slot-scope="scope">
                <span>{{ changeName(scope.row.DataName) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="DataValue" label="值"></el-table-column>
            <el-table-column prop="StandardValue" label="标准值"></el-table-column>

          </el-table>
          <div class="block" style="margin-top: 8px">
            <el-pagination align="center" background @size-change="handleSizeChange3"
              @current-change="handleCurrentChange3" :current-page="currentPage3" :page-size="pageSize3"
              :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="tableData3.length">
            </el-pagination>
          </div>

        </el-tab-pane>
      </el-tabs>

    </el-card>

  </div>
  <!-- <div class="traceability" id="fullDiv1">
    <div v-loading="iframeloading"></div>
    <iframe
      class="iframe"
      id="ifra"
      style="border: none"
      v-bind:src="reportUrl"
    ></iframe>
  </div> -->
</template>

<script>
import { PSNMoveParam_AOI, PSNMoveParam_dePanel, PSNMoveParam_thtPressFit } from "@/api/sdzApi"
import dayjs from "dayjs";
export default {
  data() {
    return {
      iframeloading: true,
      reportUrl: "http://172.20.99.27:8080/xymes/jsp/dipMoveParam.jsp",
      activeName: "1",
      form: {
        PSN: ""
      },
      tableData1: [],
      tableData2: [],
      tableData3: [],
      currentPage1: 1,
      pageSize1: 10,
      currentPage2: 1,
      pageSize2: 10,
      currentPage3: 1,
      pageSize3: 10,
      tableHeight: 0
    };
  },
  //  mounted() {
  // const iframe = document.querySelector("#ifra");
  // // 处理兼容行问题
  // if (iframe.attachEvent) {
  //   iframe.attachEvent("onload", () => {
  //     this.iframeloading = false;
  //     // iframe加载完毕以后执行操作
  //     console.log("iframe已加载完毕");
  //   });
  // } else {
  //   iframe.onload = () => {
  //     this.iframeloading = false;
  //     // iframe加载完毕以后执行操作
  //     console.log("iframe已加载完毕");
  //   };
  // }
  // },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {

    window.addEventListener("resize", this.getScreenHeight);
    // this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {

      if (this.activeName == 1) {
        this.tableData1 = []
        this.currentPage1=1
        PSNMoveParam_thtPressFit(this.form).then(res => {
          this.tableData1 = res.Data
        })
      } else if (this.activeName == 2) {
        this.currentPage2=1
        this.tableData2 = []
        PSNMoveParam_AOI(this.form).then(res => {
          this.tableData2 = res.Data.map(item => {
            return {
              ...item,
              InspectTime: dayjs(item.InspectTime).format("YYYY-MM-DD HH:mm:ss"),
              ReviewTime:  dayjs(item.ReviewTime).format("YYYY-MM-DD HH:mm:ss") 
              
            }})
        })

      } else if (this.activeName == 3) {
        this.currentPage3=1
        this.tableData3 = []
        PSNMoveParam_dePanel(this.form).then(res => {
          const order = [
            'ProgramName',
            'StartTime',
            'EndTime',
            'CuttingSpeed',
            'MillingCutterModel',
            'DefaultSpeed',
            'SegmentLength',
            'ToolLength',
            'BladeLength'
          ];

          const result=res.Data.map(item=>{
           if(item.DataName=="CuttingSpeed"){
            return{...item,StandardValue:"20"}
           }else if(item.DataName=="DefaultSpeed"){
            return{...item,StandardValue:"400"}
           }
           else if(item.DataName=="ToolLength"){
            return{...item,StandardValue:"1-2mm"}
           }
           else if(item.DataName=="MillingCutterModel"){
            return{...item,StandardValue:"1.2"}
           }else{
            return item
           }
          })
          this.tableData3 = result.slice().sort((a, b) => {
            return order.indexOf(a.DataName) - order.indexOf(b.DataName);
          });
        })
      }
    },
    tabClick(tab) {
      if (tab.name == 1) {
        this.currentPage1=1
        this.tableData1 = []
        PSNMoveParam_thtPressFit(this.form).then(res => {

          this.tableData1 = res.Data
        })
      } else if (tab.name == 2) {
        this.currentPage2=1
        this.tableData2 = []
        PSNMoveParam_AOI(this.form).then(res => {

          this.tableData2 = res.Data.map(item => {
            return {
              ...item,
              InspectTime: dayjs(item.InspectTime).format("YYYY-MM-DD HH:mm:ss"),
              ReviewTime:  dayjs(item.ReviewTime).format("YYYY-MM-DD HH:mm:ss") 
              
            }})
        })

      } else if (tab.name == 3) {
        this.currentPage3=1
        this.tableData3 = []
        PSNMoveParam_dePanel(this.form).then(res => {
          const order = [
            "ProgramName",
            'StartTime',
            'EndTime',
            'CuttingSpeed',
            'MillingCutterModel',
            'DefaultSpeed',
            'SegmentLength',
            'ToolLength',
            'BladeLength'
          ];
          const result=res.Data.map(item=>{
           if(item.DataName=="CuttingSpeed"){
            return{...item,StandardValue:"20"}
           }else if(item.DataName=="DefaultSpeed"){
            return{...item,StandardValue:"400"}
           }
           else if(item.DataName=="ToolLength"){
            return{...item,StandardValue:"1-2mm"}
           }
           else if(item.DataName=="MillingCutterModel"){
            return{...item,StandardValue:"1.2"}
           }else{
            return item
           }
          })
          this.tableData3 = result.slice().sort((a, b) => {
            return order.indexOf(a.DataName) - order.indexOf(b.DataName);
          });
        })
      }
    },
    changeName(val) {
      switch (val) {
        
         case "ProgramName":
          return "设备程式";
        case "BladeLength":
          return "刀韧长度";
        case "CuttingSpeed":
          return "切割速度";
        case "DefaultSpeed":
          return "空移速度";
        case "EndTime":
          return "分板结束时间";
        case "MillingCutterModel":
          return "铣刀型号";
        case "SegmentLength":
          return "每段切割长度";
        case "StartTime":
          return "分板开始时间";
        case "ToolLength":
          return "进刀长度";
      }
    },
    handleSizeChange1(value) {
      this.pageSize1 = value;
    },
    handleCurrentChange1(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage1 = val;
    },
    handleSizeChange2(value) {
      this.pageSize2 = value;
    },
    handleCurrentChange2(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage2 = val;
    },
    handleSizeChange3(value) {
      this.pageSize3 = value;
    },
    handleCurrentChange3(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage3 = val;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 280;
        // this.tableHeight1 =
      });
    },

  }
}
</script>

<style lang="scss" scoped>
.traceability {
  width: 100%;
  height: calc(100vh - 91px);

  .iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
