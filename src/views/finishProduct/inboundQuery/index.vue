<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="form" class="form" :inline="true" :model="getDataText" size="small" label-width="80px">

          <el-form-item label="工单号" class="mb-2">
            <el-input placeholder="" clearable style="width: 200px" v-model="form.SearchModel.wo">
            </el-input>
          </el-form-item>
          <el-form-item label="PCB编码" class="mb-2">
            <el-input placeholder="" clearable style="width: 300px" v-model="form.SearchModel.pcbsn">
            </el-input>
          </el-form-item>
          <el-form-item label="检验时间" class="mb-2">
            <el-date-picker v-model="date" style="width: 350px" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="检验结果" class="mb-2">
            <el-select v-model="form.SearchModel.result" placeholder="请选择" style="width: 200px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检验人" class="mb-2">
            <el-input placeholder="" clearable style="width: 200px" v-model="form.SearchModel.checkuser">
            </el-input>
          </el-form-item>
          <el-form-item label="产品编码" class="mb-2">
            <el-input placeholder="" clearable style="width: 300px" v-model="form.SearchModel.pn"
              class="input-with-select">
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="总成编码">
              <el-input
                placeholder=""
                clearable
                style="width: 230px"
                v-model="form.SearchModel.ProductCode"
                class="input-with-select"
              >
              </el-input>
            </el-form-item> -->
          <!-- <el-form-item label="规格">
              <el-input
                placeholder=""
                clearable
                style="width: 230px"
                v-model="form.SearchModel.spec"
                class="input-with-select"
              >
              </el-input>
            </el-form-item> -->
          <!-- <div >1</div> -->
          <el-form-item class="mb-2">
            <el-button type="primary" @click="dataSubmit()">查询</el-button>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="success" @click="handleExport()" size="small">下载表格</el-button>
          </el-form-item>
          <!-- <el-form-item>
              <el-button type="primary" @click="outputFile()"
                >下载表格</el-button
              >
            </el-form-item> -->

          <!-- <el-form-item>
            <el-button type="primary" @click="outputFile()">下载表格</el-button>
          </el-form-item> -->

        </el-form>
      </div>
      <!-- <div class="table"> -->
      <!-- <div class="btn">
        <el-button type="success" @click="outputFile()" size="small"
          >下载表格</el-button
        >
      </div> -->
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        " ref="myTable" :height="tableHeight" id="Table1" size="mini" :header-cell-style="heardStyle" border stripe>
        <el-table-column label="序号" width="55" align="center" fixed>
          <template slot-scope="scope">
            <span>{{ (form.PageIndex - 1) * form.PageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <af-table-column prop="wo" label="工单号" fixed></af-table-column>
        <af-table-column prop="pcbsn" label="PCB编码" fixed></af-table-column>
        <af-table-column prop="pn" label="产品编码"> </af-table-column>
        <el-table-column prop="name" label="产品名称"> </el-table-column>
        <el-table-column prop="spec" width="260" label="规格" show-overflow-tooltip>
        </el-table-column>
        <af-table-column prop="productsn" label="成品码"> </af-table-column>
        <el-table-column prop="result" label="检验结果" width="80"> </el-table-column>
        <af-table-column prop="checktime" label="检验时间" width="150"> </af-table-column>
        <el-table-column prop="checkuser" label="检验人" width="80"> </el-table-column>
        <!-- <el-table-column prop="OperationID" label="总成编码">
          </el-table-column>
          <el-table-column prop="OperationID" label="PCB编码">
          </el-table-column>
          <el-table-column prop="OperationID" label="产品编码">
          </el-table-column> -->
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="form.PageIndex" :page-size="form.PageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <!-- </div> -->
    </el-card>
  </div>
</template>

<script>
import { QueryWarehouseInspectionData } from "@/api/wmsApi";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { getXLSX } from "@/utils/computeXLXS";
import {
  shortcuts,
  disabledDate,
  setTodayDate,
  setLastDate,
} from "@/utils/dataMenu";
import { exportTableToExcel } from "@/utils/exportExcel";
import dayjs from "dayjs";
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
        // SearchText: "string",
        SearchModel: {
          id: 0,
          wo: "",
          pn: "",
          name: "",
          spec: "",
          pcbsn: "",
          result: "",
          checkuser: "",
          checktime: "",
          ProductCode: "",
        },
        StartTime: "",
        EndTime: "",
      },
      date: [],
      total: 0,
      value: "PASS",
      options: [
        {
          value: "",
          label: "ALL",
        },
        {
          value: "PASS",
          label: "PASS",
        },
        {
          value: "FAIL",
          label: "FAIL",
        },
      ],
      pickerOptions: {
        shortcuts: shortcuts,
      }
    };
  },
  watch: {
    date(newValue) {
      if (newValue) {
        this.form.StartTime = newValue[0];
        this.form.EndTime = newValue[1] + " 23:59:59";
        // this.form.EndTime = newValue[1];
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
  beforeMount() {
    this.date = [setLastDate(), setTodayDate()]
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
      QueryWarehouseInspectionData(this.form).then(({ data }) => {
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
    async getAllData() {
      this.startLoading();
      this.tableData = [];
      await this.getData();
      await this.getDpiData();
      this.currentPage = 1;
      this.endLoading();
    },
    dataSubmit() {
      this.form.PageIndex = 1;
      this.form.PageSize = 20;
      this.startLoading();
      QueryWarehouseInspectionData(this.form).then(({ data }) => {
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
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.form.PageIndex = 1;
      this.form.PageSize = val;
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

      QueryWarehouseInspectionData({ ...this.form, PageSize: this.total }).then((res) => {
        getXLSX(res.data.Data.list, this.$refs.myTable.columns, '入库检验')
      });
    },
    async handleExport() {
      if(this.tableData.length === 0) {
       this.$notify({
          title: '提示信息',
          message: '当前列表为空，下载失败！！',
          type: 'error'
        });
       
        return;
      }
      try {
        await exportTableToExcel({
          tableRef: this.$refs.myTable,
          fetchAllData: this.fetchAllUsers,
          fileName: `入库检验${dayjs().format('YYYYMMDD-HHmmss')}`,
          styles: {
            headerBgColor: 'FF6692d9',  // 灰色表头
            headerFont: {
              color: { argb: 'FFFFFFFF' }, // 红色文字
              bold: true, size: 14
            }, // 白色文字
            cell: { numFmt: '@' } // 强制文本格式
          }
        });

      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async fetchAllUsers() {

      let data = await QueryWarehouseInspectionData({ ...this.form, PageSize: this.total }).then((res) => {

        return res.data.Data.list
        // this.handleExport(data)
      });
      return data;
      //   return this.tableData.map((item, index) => ({ 
      //   ...item,
      //   _id: index // 如果依赖 _id，确保它是数字
      // }));
    },


    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 270;
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
  justify-content: space-between;
  /* 两端对齐，使元素分布在容器的两端 */
  align-items: center;
  /* 垂直居中 */
  /* 可能需要添加额外的宽度或最大宽度，根据实际需要调整 */
  width: 100%;
  /* 或者指定其他宽度 */
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
