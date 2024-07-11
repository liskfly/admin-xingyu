<template>
  <div class="type">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div class="table_header">
        <el-button type="primary" @click="addOpen">添加</el-button>
        <div class="input_box">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="searchText"
            class="input-with-select"
            @change="getSearchData"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          border
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column prop="ToolsMold" label="类型"> </el-table-column>
          <el-table-column prop="Remark" label="描述"> </el-table-column>
          <!-- <el-table-column prop="UpdateTime" label="创建时间">
          </el-table-column> -->
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>

              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    </el-card>
    <el-dialog :title="titleType" :visible.sync="dialogVisible">
      <el-form :model="addForm" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="类型" prop="toolsMold">
          <el-input v-model="addForm.toolsMold"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { moldControl } from "@/api/all";

export default {
  data() {
    return {
      searchText: "",
      addForm: {
        toolsMold: "",
        remark: "",
        operationType: "I",
      },
      tableHeight: 0,
      getText: {
        toolsMold: "*",
        remark: "",
        operationType: "Q",
      },
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      dialogVisible: false,
      titleType: "",
      rules: {
        toolsMold: [
          { required: true, message: "请输入治具类型", trigger: "change" },
        ],
      },
      //  loading: false
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
      this.startLoading;
      moldControl(this.getText)
        .then((res) => {
          this.tableData = res.data.DataList;
          this.endLoading();
          // console.log(res.data.DataList);
          if (
            this.tableData.length % this.pageSize == 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
          }
        })
        .catch(() => {
          this.endLoading();
          this.$message.error("请求数据失败，请刷新");
        });
    },
    addOpen() {
      this.addForm.operationType = "I";
      this.titleType = "添加";
      this.dialogVisible = true;
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    addSubmit() {
      moldControl(this.addForm).then(({ data }) => {
        // console.log(data.Status);
        this.dialogVisible = false;
        if (data.Status == "OK") {
          this.getData();
          this.$message({
            type: "success",
            message: `${this.titleType}成功!`,
          });
          this.$refs.form.resetFields();
        } else {
          this.$message({
            type: "error",
            message: `${this.titleType}失败!`,
          });
          this.$alert(data.Message, "错误信息", {
            confirmButtonText: "确定",
          });
        }
      });
    },
    handleEdit(index, row) {
      this.addForm.operationType = "U";
      this.titleType = "修改";
      this.addForm.toolsMold = row.ToolsMold;
      this.addForm.remark = row.Remark;
      this.dialogVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          moldControl({
            toolsMold: row.ToolsMold,
            remark: row.Remark,
            operationType: "D",
          }).then(({ data }) => {
            if (data.Status == "OK") {
              //  this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
              this.getData();
              this.dialogVisible = false;

              this.$message({
                type: "success",
                message: `删除成功!`,
              });
            } else {
              this.$alert(data.Message, "错误信息", {
                confirmButtonText: "确定",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getSearchData() {
      if (this.searchText == "") {
        this.getText.toolsMold = "*";
      } else {
        this.getText.toolsMold = this.searchText;
      }
      this.getData();
    },
    handleSizeChange(value) {
      this.pageSize = value;
      console.log(this.pageSize);
    },
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
      if (this.loading) {
        this.loading.close();
      }
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
.type {
  padding: 20px;
  .initBox {
    width: 500px;
  }
  .table_header {
    padding-bottom: 20px;
    display: flex;
    gap: 30px;
    justify-content: space-between;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
