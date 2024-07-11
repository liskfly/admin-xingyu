<template>
  <div class="type">
    <el-card>
      <div class="table_header">
        <el-button type="primary" @click="addOpen">添加</el-button>
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
          <el-table-column prop="PD_model" label="产品编号"> </el-table-column>
          <el-table-column prop="PN_Model" label="类型"> </el-table-column>
          <el-table-column prop="Qty" label="消耗量"> </el-table-column>
          <el-table-column prop="Dsc" label="描述"> </el-table-column>
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
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="产品编号" prop="productName">
          <el-input v-model="form.productName"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="toolsMold">
          <el-select v-model="form.toolsMold" placeholder="检查类型">
            <el-option
              v-for="item in typeList"
              :key="item.ToolsMold"
              :label="item.ToolsMold"
              :value="item.ToolsMold"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消耗量" prop="useage">
          <el-input v-model.number="form.useage"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { moldControl, specControl } from "@/api/all";
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      form: {
        productName: "",
        useage: "",
        toolsMold: "",
        remark: "",
        operationType: "I",
      },
      getText: {
        toolsMold: "*",
        remark: "",
        operationType: "Q",
      },
      getAllText: {
        toolsMold: "",
        remark: "",
        productName: "*",
        useage: 0,
        operationType: "Q",
      },
      typeList: [],
      itemPass1: "",
      titleType: "",
    };
  },
  created() {
    // this.getData();
    this.getIDdata();
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
      moldControl(this.getText).then((res) => {
        this.typeList = res.data.DataList;
      });
    },
    getIDdata() {
      this.startLoading();
      specControl(this.getAllText)
        .then(({ data }) => {
          this.endLoading();
          if (data.Status == "OK") {
            this.tableData = data.DataList;
            this.tableData.sort((a, b) => {
              return a.PD_model - b.PD_model;
            });
          }
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
      this.getData();
      //  this.$refs.form.resetFields()
      this.form.productName = "";
      this.form.useage = "";
      this.form.toolsMold = "";
      this.form.remark = "";
      this.form.operationType = "I";
      this.titleType = "添加";
      this.dialogVisible = true;
    },
    addCancel() {
      this.$refs.form.resetFields();
      this.dialogVisible = false;
      // this.$refs.form.resetFields();
    },
    handleEdit(index, row) {
      this.getData();
      this.form.operationType = "U";
      this.form.productName = row.PD_model;
      this.form.useage = row.Qty;
      this.form.toolsMold = row.PN_Model;
      this.form.remark = row.Dsc;
      this.titleType = "修改";
      this.dialogVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.startLoading();
          specControl({
            toolsMold: row.PN_Model,
            remark: row.Dsc,
            productName: row.PD_model,
            useage: row.Qty,
            operationType: "D",
          }).then(({ data }) => {
            this.endLoading();
            if (data.Status == "OK") {
              //  this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
              this.getIDdata();
              // this.dialogVisible = false;
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
    onSubmit() {
      this.$refs.form.validate((valid) => (this.itemPass1 = valid));
      if (this.itemPass1) {
        specControl(this.form).then(({ data }) => {
          if (data.Status == "OK") {
            this.$refs.form.resetFields();
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message: `${this.titleType}成功!`,
            });
            this.getIDdata();
          } else {
            this.$message({
              type: "error",
              message: `${this.titleType}添加失败!`,
            });
            this.$alert(data.Message, "错误信息", {
              confirmButtonText: "确定",
            });
          }
        });
      } else {
        this.$alert("添加失败,请完成必填项", "错误信息", {
          confirmButtonText: "确定",
        });
      }
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
.type {
  padding: 20px;
  .initBox {
    width: 500px;
  }
  .table_header {
    padding-bottom: 20px;
    display: flex;
    // gap: 30px;
    // justify-content: flex-end;
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
