<template>
  <div class="semiFinished">
    <el-card>
      <div class="table_header">
        <div class="input_box">
          <el-input
            placeholder="输入工单号"
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
          <el-table-column prop="WO" label="工单号"> </el-table-column>

          <el-table-column prop="PdModel" label="料号"> </el-table-column>
          <el-table-column prop="PlanQty" label="计划数量"> </el-table-column>
          <el-table-column prop="ReportNumber" label="报工数量">
          </el-table-column>
          <el-table-column prop="WoStatus" label="状态">
            <template slot-scope="scope">
              <span>{{ scope.row.WoStatus == 1 ? "关闭" : "开启" }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.WoStatus == 1 ? 'primary' : 'danger'"
                size="mini"
                @click="handleClose(scope.$index, scope.row)"
                >{{ scope.row.WoStatus !== 1 ? "关闭" : "开启" }}</el-button
              >
            </template>
          </el-table-column>
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
import { queryCloseOrder, closeOrder } from "@/api/wmsApi";
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
      this.startLoading();
      queryCloseOrder(this.getText)
        .then((res) => {
          this.endLoading();
          if (res.data.Code == 200) {
            let data = JSON.parse(res.data.Data);
            this.total = data.Total;
            this.tableData = data.list;
            console.log(data.list);
          } else {
            this.$alert(res.data.Msg, "错误信息", {
              confirmButtonText: "确定",
            });
          }
          // console.log(this.tableData);
        })
        .catch((error) => {
          this.$alert(error, "错误信息", {
            confirmButtonText: "确定",
          });
        });
    },
    handleClose(index, row) {
      let text = row.WoStatus == 1 ? "开启" : "关闭";
      let stat = row.WoStatus == 1 ? 0 : 1;
      this.$confirm(`确定${text}`, "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          closeOrder({
            OrderNo: row.WO,
            Stts: stat,
          })
            .then((res) => {
              if (res.data.Code == 200) {
                if (this.tableData.length == 1 && this.getText.pageIndex >= 0) {
                  this.getText.pageIndex--;
                }
                this.getData();
                this.$message({
                  type: "success",
                  message: `${text}成功!`,
                });
              } else {
                this.$alert(res.data.Msg, "错误信息", {
                  confirmButtonText: "确定",
                });
              }
            })
            .catch((error) => {
              this.$alert(error, "错误信息", {
                confirmButtonText: "确定",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消${text}`,
          });
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
.semiFinished {
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
  .el-table .success_class {
    color: green;
  }

  .el-table .error_class {
    color: red;
  }
}
</style>
