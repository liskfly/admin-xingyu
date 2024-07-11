<template>
  <div class="type">
    <el-card shadow="always">
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
          <el-table-column prop="Tool" label="ID"> </el-table-column>
          <el-table-column prop="Model" label="类型"> </el-table-column>
          <el-table-column prop="Cell" label="储位"> </el-table-column>
          <el-table-column prop="Stts" label="状态">
            <template slot-scope="scope">
              <el-tag :type="tagType(scope.row.Stts)">
                {{ tagText(scope.row.Stts) }}
              </el-tag>
              <!-- <span>{{ scope.row.Stts == 4 ? "已发料" : "已上架" }}</span> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="Dsc" label="描述"> </el-table-column> -->
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
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="ID" prop="toolsID">
          <el-input v-model="form.toolsID"></el-input>
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
import { moldControl, iDControll } from "@/api/all";
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      form: {
        toolsID: "",
        toolsMold: "",
        remark: "",
        operationType: "I",
      },
      getText: {
        toolsMold: "*",
        remark: "",
        operationType: "Q",
      },
      getIDText: {
        toolsID: "*",
        toolsMold: "",
        remark: "",
        operationType: "Q",
      },
      typeList: [],
      titleType: "",
      rules: {
        toolsID: [
          { required: true, message: "请输入治具ID", trigger: "change" },
        ],
        toolsMold: [
          { required: true, message: "请输入治具类型", trigger: "change" },
        ],
      },
      itemPass1: "",
    };
  },
  created() {},
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getIDdata();
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
      iDControll(this.getIDText)
        .then(({ data }) => {
          this.endLoading();
          if (data.Status == "OK") {
            this.tableData = data.DataList;
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
      this.form.operationType = "I";
      this.titleType = "添加";
      this.dialogVisible = true;
    },
    addCancel() {
      // this.$refs.form.resetFields();
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    handleEdit(index, row) {
      this.getData();
      this.form.operationType = "U";
      this.form.toolsID = row.Tool;
      this.form.toolsMold = row.Model;
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
          iDControll({
            toolsID: row.Tool,
            toolsMold: row.Model,
            remark: row.Dsc,
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
        this.startLoading();
        iDControll(this.form).then(({ data }) => {
          this.endLoading();
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
    tagType(data) {
      let text = "";
      switch (data) {
        case 0:
          text = "info";
          break;
        case 1:
          text = "success";
          break;
        case 2:
          text = "";

          break;
        case 3:
          text = "info";

          break;
        case 4:
          text = "warning";

          break;
        default:
          break;
      }
      return text;
    },
    tagText(data) {
      let text = "";
      switch (data) {
        case 0:
          text = "已录入";
          break;
        case 1:
          text = "";
          break;
        case 2:
          text = "已上架";

          break;
        case 3:
          text = "已绑定";

          break;
        case 4:
          text = "已发料";

          break;
        default:
          break;
      }
      return text;
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
