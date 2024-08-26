<template>
  <div class="smtinstpro">
    <div>
      <el-form ref="form" class="form" :inline="true" :model="getDataText">
        <!-- <el-form-item>
            <el-select v-model="getDataText.operationType" placeholder="检查类型">
              <el-option
                v-for="item in inquireList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="getDataText.operationType == 'W'">
            <el-input
              placeholder="请输入单号"
              clearable
              style="width: 400px"
              v-model="getDataText.workOrder"
              class="input-with-select"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="getDataText.operationType != 'W'">
            <el-input
              placeholder="请输入seiralNumber"
              clearable
              style="width: 400px"
              v-model="getDataText.seiralNumber"
              class="input-with-select"
            >
            </el-input>
          </el-form-item> -->
        <div class="flex-container">
          <div>
            <el-form-item label="成品码">
              <el-input
                placeholder="请输入成品码"
                clearable
                style="width: 400px"
                v-model="productNumber"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getPcbId()">查询</el-button>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="outputFile()">下载表格</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :height="tableHeight"
        id="Table1"
        size="mini"
        :header-cell-style="heardStyle"
        border
        stripe
      >
        <el-table-column prop="OrderName" label="工单"></el-table-column>
        <el-table-column prop="AssemblyName" label="产品料号">
        </el-table-column>
        <el-table-column prop="product" label="成品码">
          <template slot-scope="scope">
            <div>{{ oldProduct }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="SerialNumber" label="PCB ID"> </el-table-column>
        <el-table-column prop="OperationID" label="制程ID"> </el-table-column>
        <el-table-column prop="OperationName" label="制程名称">
        </el-table-column>
        <!-- <el-table-column prop="LineName" label="线体"> </el-table-column> -->
        <el-table-column prop="EquipmentName" label="设备名称">
        </el-table-column>
        <el-table-column prop="EquipmentID" label="设备编号"> </el-table-column>
        <el-table-column prop="DateTime" label="过站时间"> </el-table-column>
        <!-- <el-table-column prop="order" label="状态"> </el-table-column> -->
        <el-table-column prop="StatusCODE" label="结果"> </el-table-column>
        <!-- <el-table-column prop="order" label="维修代码"> </el-table-column>
          <el-table-column prop="order" label="流程卡号"> </el-table-column>
          <el-table-column prop="Name" label="成品编号"> </el-table-column> -->
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import { XY_PCBAHisControl, XY_Prod_MissSNs } from "@/api/all";
import { getContainerMoves } from "@/api/material";
import { GetCodeBYPcbSN } from "@/api/wmsApi";
import { aW } from "@fullcalendar/core/internal-common";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
export default {
  data() {
    return {
      heardStyle: {
        background: "rgb(102, 146, 217)",
        color: "#ffffff",
      },
      tableData: [],
      getDataText: {
        seiralNumber: "",
        workOrder: "",
        operationType: "S",
      },
      productNumber: "",
      oldProduct: "",
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      dialogVisible: false,
      inquireList: [
        {
          lable: "工单号",
          value: "W",
        },
        {
          lable: "PCBA码",
          value: "S",
        },
      ],
      changeForm: {
        orderName: "",
        operationName: "",
      },
    };
  },
  watch: {
    "getDataText.operationType"(newValue) {
      if (newValue == "W") {
        this.getDataText.seiralNumber = "";
      } else {
        this.getDataText.workOrder = "";
      }
    },
  },
  created() {
    // console.log(this.$route.query);
    // this.getDataText.seiralNumber = this.$route.query.SerialNumber; // 使用查询参数时使用
  },
  mounted() {
    this.$nextTick(() => {
      // console.log( window.innerHeight);
      this.tableHeight = window.innerHeight - 260;
      //后面的50：根据需求空出的高度，自行调整
    });
  },
  methods: {
    getPcbId() {
      GetCodeBYPcbSN(this.productNumber)
        .then(({ data }) => {
          if (data.Code === 200) {
            this.oldProduct = this.productNumber;
            this.getDataText.seiralNumber = data.Data;
            this.getAllData();
          } else {
            this.$message.error(data.Msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
      // Axios.post("/cm/IntactProduct/GetCodeBYPcbSN", `${this.productNumber}`, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      //   .then(({ data }) => {
      //     this.getDataText.seiralNumber = data.Data;
      //     this.getAllData();
      //   })
      //   .catch((err) => {
      //     this.$message.error(err);
      //   });
    },
    getData() {
      return new Promise((resolve, reject) => {
        XY_PCBAHisControl(this.getDataText).then(({ data }) => {
          if (data.Status !== "NG") {
            resolve();
            this.tableData.push(...data.DataList);
          } else {
            resolve();
            this.tableData = [];
          }
        });
      });
    },
    async getAllData() {
      this.startLoading();
      this.tableData = [];
      await this.getData();
      await this.getDpiData();
      this.currentPage = 1;
      this.endLoading();
    },
    getDpiData() {
      return new Promise((resolve, reject) => {
        if (this.getDataText.operationType === "S") {
          getContainerMoves(`conName=${this.getDataText.seiralNumber}`).then(
            ({ data }) => {
              this.tableData.push(...data.content);
              resolve();
            }
          );
        } else {
          getContainerMoves(`mfgOrder=${this.getDataText.workOrder}`).then(
            ({ data }) => {
              this.tableData.push(...data.content);
              resolve();
            }
          );
        }
      });
      // this.startLoading();
      // if (this.getDataText.operationType === "S") {
      //   getContainerMoves(`conName=${this.getDataText.seiralNumber}`).then(
      //     ({ data }) => {
      //       this.endLoading();
      //       this.tableData.push(...data.content);
      //     }
      //   );
      // } else {
      //   getContainerMoves(`mfgOrder=${this.getDataText.workOrder}`).then(
      //     ({ data }) => {
      //       this.endLoading();
      //       this.tableData.push(...data.content);
      //     }
      //   );
      // }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    startLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "加载中~",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.2)", //调节透明度
      });
    },
    endLoading() {
      this.loading?.close();
    },
    outputFile() {
      if (this.tableData.length === 0) {
        this.$message.error("列表不能为空");
        return;
      }
      this.pageSize = this.tableData.length;
      this.$nextTick(function () {
        var ws1 = XLSX.utils.table_to_book(document.querySelector("#Table1")); //对应要导出的表格id

        /* get binary string as output */
        var wbOut = XLSX.write(ws1, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            new Blob([wbOut], { type: "application/octet-stream" }),
            "result.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbOut);
        }
        this.pageSize = 10; //表格还原
        return wbOut;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
  // .form{
  //    display: flex;
  //     justify-content: flex-end;
  // }
}

.flex-container {
  display: flex;
  justify-content: space-between; /* 两端对齐，使元素分布在容器的两端 */
  align-items: center; /* 垂直居中 */
  /* 可能需要添加额外的宽度或最大宽度，根据实际需要调整 */
  width: 100%; /* 或者指定其他宽度 */
}
</style>
