<template>
  <div class="smtinstpro">
    <div>
      <el-form
        ref="form"
        class="form"
        :inline="true"
        :model="getDataText"
        size="small"
      >
        <div class="flex-container">
          <div>
            <el-form-item label="大板码">
              <el-input
                placeholder=""
                clearable
                style="width: 180px"
                v-model="form.SearchModel.PcbID"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="板内码">
              <el-input
                placeholder=""
                clearable
                style="width: 180px"
                v-model="form.SearchModel.BlockID"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="工单">
              <el-input
                placeholder=""
                clearable
                style="width: 180px"
                v-model="form.SearchModel.OrderNo"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="时间">
              <!-- <el-date-picker
                v-model="date"
                style="width: 280px"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker> -->
          <el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期" style="width:350px"
            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']"
            :clearable="false">
          </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataSubmit()">查询</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="outputFile()"
                >下载表格</el-button
              >
            </el-form-item> -->
          </div>
          <el-form-item>
            <el-button type="success" @click="outputFile()">下载表格</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- <div class="table"> -->
      <!-- <div class="btn">
        <el-button type="success" @click="outputFile()" size="small"
          >下载表格</el-button
        >
      </div> -->
      <el-table
        ref="myTable"
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
        <el-table-column prop="OrderNo" label="工单号"></el-table-column>
        <el-table-column
          prop="PcbID"
          width="310"
          label="大板码"
        ></el-table-column>
        <el-table-column prop="BlockID" width="310" label="板内码">
        </el-table-column>
        <el-table-column prop="BlockNo" width="55" label="序列">
        </el-table-column>
        <el-table-column prop="ReadTime" label="读取时间"> </el-table-column>
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
    <!-- </div> -->
  </div>
</template>

<script>
import Axios from "axios";
import { QueryPCBBoardData } from "@/api/wmsApi";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { getXLSX } from "@/utils/computeXLXS";
import { shortcuts,
  disabledDate,
  setTodayDate,
  setLastDate, } from "@/utils/dataMenu";
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
          PcbID: "",
          BlockID: "",
          OrderNo:""
        },
        StartTime: "",
        EndTime: "",
      },
      date: [],
      total: 0,
      options: [
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
        this.form.EndTime = newValue[1];
        // this.form.EndTime = newValue[1] + " ";
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
    this.date = [setLastDate(),setTodayDate()]
  },
  mounted() {
    // this.getData();
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
      QueryPCBBoardData(this.form).then(({ data }) => {
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
      this.form.pageSize = 20;
      this.startLoading();
      QueryPCBBoardData(this.form).then(({ data }) => {
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
        getXLSX(res.data.Data.list,this.$refs.myTable.columns,'拼板SN')
        // const allData = res.data.Data.list;
        // const columns = this.$refs.myTable.columns;

        // // 3. 构造 Excel 表头（与 el-table 列一致）
        // const headers = columns
        //   .filter((col) => col.property && col.label) // 过滤有效列
        //   .map((col) => ({
        //     header: col.label, // Excel 表头名称（与 el-table 列名一致）
        //     key: col.property, // 数据字段键名
        //   }));

        // // 5. 构造工作表数据（兼容 el-table 的 formatter）
        // const worksheetData = [
        //   headers.map((h) => h.header), // 第一行为表头
        //   ...allData.map((item) =>
        //     headers.map((h) => {
        //       // 查找列配置中的 formatter
        //       const column = columns.find((c) => c.property === h.key);
        //       return column?.formatter
        //         ? column.formatter(item) // 如果定义了 formatter，使用格式化后的值
        //         : item[h.key];
        //     })
        //   ),
        // ];

        // // 6. 生成 Excel 文件
        // const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        // const workbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(workbook, worksheet, "拼版SN数据");
        // XLSX.writeFile(workbook, "拼版SN数据.xlsx");
      });
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 230;
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
