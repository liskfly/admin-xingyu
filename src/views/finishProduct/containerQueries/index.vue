<template>
  <div class="smtinstpro">
    <div>
      <el-form ref="form" class="form" :inline="true" :model="getDataText" size="small">
        <div class="flex-container">
          <div>
            <el-form-item label="">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @change="change()"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" v-show="value === 'rid'">
              <el-input
                placeholder="请输入容器ID"
                clearable
                style="width: 400px"
                v-model="form.SearchModel.rid"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="" v-show="value === 'pcbsn'">
              <el-input
                placeholder="请输入PCB编码"
                clearable
                style="width: 400px"
                v-model="form.SearchModel.pcbsn"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="" v-show="value === 'ProductCode'">
              <el-input
                placeholder="请输入总成编码"
                clearable
                style="width: 400px"
                v-model="form.SearchModel.ProductCode"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getData()">查询</el-button>
            </el-form-item>
            <!-- <el-form-item>
            <el-button type="primary" @click="outputFile()">下载表格</el-button>
          </el-form-item> -->
          </div>
          <!-- <el-form-item>
            <el-button type="primary" @click="outputFile()">下载表格</el-button>
          </el-form-item> -->
        </div>
      </el-form>
    </div>
    <div class="table">
      <div class="btn">
        <el-button type="success" @click="outputFile()" size="small"
          >下载表格</el-button
        >
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        ref="myTable"
        :height="tableHeight"
        id="Table1"
        size="mini"
        :header-cell-style="heardStyle"
        border
        stripe
      >
        <el-table-column prop="rid" width="300" label="容器ID"></el-table-column>
        <el-table-column prop="pcbsn" width="300" label="pcb编码"></el-table-column>
        <el-table-column prop="ProductCode" width="300" label="总成编码"> </el-table-column>
        <el-table-column prop="creuser" width="150" label="操作人"> </el-table-column>
        <el-table-column prop="cretime" label="操作时间"> </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.PageIndex"
          :page-size="form.PageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import { QueryPackingData } from "@/api/wmsApi";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { getXLSX } from "@/utils/computeXLXS";
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
      pageSize: 20, // 每页的数据条数
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
      form: {
        PageIndex: 1,
        PageSize: 20,
        SearchText: "",
        SearchModel: {
          id: 0,
          rid: "",
          pcbsn: "",
          barno: "",
          creuser: "",
          ProductCode: "",
          cretime: "",
        },
        StartTime: "",
        EndTime: "",
      },
      date: [],
      total: 0,
      value:'rid',
      options: [
        {
          value: "rid",
          label: "容器ID",
        },
        {
          value: "pcbsn",
          label: "PCB编码",
        },
        {
          value: "ProductCode",
          label: "总成编码",
        },
      ],
    };
  },
  watch: {
    date(newValue) {
      if (newValue) {
        this.form.StartTime = newValue[0];
        this.form.EndTime = newValue[1] + ' 23:59:59';
      } else {
        this.form.StartTime = "";
        this.form.EndTime = "";
      }
    },
  },
  created() {
    // console.log(this.$route.query);
    // this.getDataText.seiralNumber = this.$route.query.SerialNumber; // 使用查询参数时使用
  },
  mounted() {
    this.getData();
    this.$nextTick(() => {
      this.getScreenHeight();
      //后面的50：根据需求空出的高度，自行调整
    });
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      this.startLoading();
      QueryPackingData(this.form).then(({ data }) => {
        if (data.Success) {
          this.tableData = data.Data.list;
          this.total = data.Data.Total;
        } else {
          this.tableData = [];
          this.form.PageIndex = 1;
        }
        this.endLoading();
      });
    },
    dataSubmit() {
      this.form.PageIndex = 1;
      this.form.pageSize = 20;
      this.startLoading();
      QueryPackingData(this.form).then(({ data }) => {
        if (data.Success) {
          this.tableData = data.Data.list;
          this.total = data.Data.Total;
        } else {
          this.tableData = [];
          this.form.PageIndex = 1;
        }
        this.endLoading();
      });
    },
    change() {
      this.form.SearchModel = {
          id: 0,
          rid: "",
          pcbsn: "",
          barno: "",
          creuser: "",
          cretime: "",
        }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.form.PageIndex = 1;
      this.form.pageSize = val;
      this.getData();
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.form.PageIndex = val;
      this.getData();
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
      // if (this.tableData.length === 0) {
      //   this.$message.error("列表不能为空");
      //   return;
      // }
      // this.form.pageSize = this.tableData.length;
      // this.$nextTick(function () {
      //   var ws1 = XLSX.utils.table_to_book(document.querySelector("#Table1")); //对应要导出的表格id

      //   /* get binary string as output */
      //   var wbOut = XLSX.write(ws1, {
      //     bookType: "xlsx",
      //     bookSST: true,
      //     type: "array",
      //   });
      //   try {
      //     FileSaver.saveAs(
      //       new Blob([wbOut], { type: "application/octet-stream" }),
      //       "result.xlsx"
      //     );
      //   } catch (e) {
      //     if (typeof console !== "undefined") console.log(e, wbOut);
      //   }
      //   this.form.pageSize = 20; //表格还原
      //   return wbOut;
      // });
      QueryPCBBoardData({ ...this.form, pageSize: this.total }).then((res) => {
        getXLSX(res.data.Data.list,this.$refs.myTable.columns,'包装数据')
      });
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 260;
        // this.tableHeight1 =
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

.table {
  position: relative;
  .btn {
    display: flex;
    position: absolute;
    right: 0;
    top: -2.2rem;
    z-index: 99;
  }
}
</style>
