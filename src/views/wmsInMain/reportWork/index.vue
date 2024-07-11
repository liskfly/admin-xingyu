<template>
  <div class="reportWork">
    <el-card class="box-card">
      <div class="table_header">
        <div class="input_box">
          <el-input
            placeholder="工单号，容器ID，料号"
            clearable
            v-model="getText.searchText"
            class="input-with-select"
            @input="getSearchData"
            @change="getSearchData"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table
          :data="tableData"
          :height="tableHeight"
          border
          stripe
          style="width: 100%"
        >
          <af-table-column prop="Wo" label="工单号"> </af-table-column>
          <af-table-column prop="Containerid" label="容器ID"> </af-table-column>
          <af-table-column prop="Pn" label="料号"> </af-table-column>
          <af-table-column prop="Qty" label="数量"> </af-table-column>
          <af-table-column prop="CheckResult" label="结果"> </af-table-column>
          <af-table-column prop="ReportUser" label="操作员"> </af-table-column>
          <af-table-column prop="ReportTime" sortable label="报工时间">
          </af-table-column>
        </el-table>
        <div class="block" style="margin-top: 15px">
          <el-pagination
            background
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20, 50, 100]"
            :current-page="currentPage"
            :page-size="getText.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getReportWork } from "@/api/wmsApi";
export default {
  data() {
    return {
      getText: {
        pageIndex: 0,
        pageSize: 10,
        searchText: "",
      },
      tableData: [],
      currentPage: 1,
      total: 0,
      tableHeight: 0,
    };
  },
  created() {
    this.getData();
  },
   beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      getReportWork(this.getText).then((res) => {
        if (res.data.Code == 200) {
          let data = JSON.parse(res.data.Data);
          this.total = data.Total;
          this.tableData = data.list;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
    },
    getSearchData() {
      this.getText.pageIndex = 0;
      this.getData();
    },
   handleSizeChange(value) {
      this.getText.pageSize = value;
      this.getData();
      // console.log(this.pageSize);
    },
    handleCurrentChange(value) {
      this.getText.pageIndex = value - 1;
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
      this.loading.close();
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 300;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.reportWork {
  padding: 20px;
  .table_header {
    padding-bottom: 20px;
    display: flex;
    // gap: 30px;
    justify-content: flex-end;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
}
</style>
