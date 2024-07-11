<template>
  <div class="aptitude">
    <div class="header">
      <el-button type="primary" @click="openAdd()">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" border :height="tableHeight" stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <af-table-column label="工号" prop="OperatorID" align="center">
        </af-table-column>
        <el-table-column label="技能" prop="Qualification" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Qualification == 1 ? '' : 'warning'">
              {{ scope.row.Qualification == 1 ? "NPM" : scope.row.Qualification == 2 ? "DEK":"AOI" }}
            </el-tag>
          </template>
        </el-table-column>
        <af-table-column label="生效时间" prop="Created" align="center">
        </af-table-column>
        <af-table-column label="过期时间" prop="Expired" align="center">
        </af-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
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
          :current-page="currentPage"
          :page-size="getlistText.pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="工号" prop="OperatorID">
          <el-input v-model="form.OperatorID" placeholder="工号"></el-input
        ></el-form-item>
        <el-form-item label="技能" prop="Qualification">
          <el-select v-model="form.Qualification" placeholder="技能类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效时间" prop="Created">
          <el-date-picker
            v-model="form.Created"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="过期时间" prop="Expired">
          <el-date-picker
            v-model="form.Expired"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCancel()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  savePersonQualification,
  deletePersonQualification,
  getPagePersonQualification,
} from "@/api/wmsApi";
export default {
  data() {
    return {
      dialogVisible: false,
      getlistText: {
        pageIndex: 0,
        pageSize: 10,
        searchText: "",
        SearchModel: {},
      },
      tableHeight: 0,
      tableData: [],
      total: 0,
      currentPage: 1, // 当前页码
      form: {
        OperatorID: "",
        Qualification: "",
        Expired: "",
        Created: "",
      },
      typeList: [
        {
          lable: "NPM",
          value: 1,
        },
        {
          lable: "DEK",
          value: 2,
        },
        {
          lable:"AOI",
          value:3
        }
      ],
      rules: {
        OperatorID: [{ required: true, message: "请输入id", trigger: "blur" }],
        Qualification: [
          { required: true, message: "请输入技能", trigger: "blur" },
        ],
        Expired: [
          { required: true, message: "请输入到期时间", trigger: "blur" },
        ],
        Created: [
          { required: true, message: "请输入生效时间", trigger: "blur" },
        ],
      },
    };
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    this.getData();
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      getPagePersonQualification(this.getlistText)
        .then(({ data }) => {
          //  console.log(data);
          if (data.Code == 200) {
            let a = data.Data;
            this.total = a.Total;
            this.tableData = a.list;
          } else {
            this.$alert(data.Msg, "提示信息", {
              confirmButtonText: "确定",
            });
          }

          this.endLoading();
          // console.log(this.tableData);
        })
        .catch(() => {
          this.endLoading();
        });
    },
    handleDelete(index, row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePersonQualification({
            OperatorID: row.OperatorID,
            Qualification: row.Qualification,
            Expired: row.Expired,
            Created: row.Created,
          }).then(({ data }) => {
            if (data.Code == 200) {
              if (
                this.tableData.length == 1 &&
                this.getlistText.pageIndex >= 0
              ) {
                this.getlistText.pageIndex--;
              }
              this.getData();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$alert(data.Msg, "提示信息", {
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          savePersonQualification(this.form)
            .then(({ data }) => {
              if (data.Code == 200) {
                this.dialogVisible = false;
                this.getData();
                this.$message({
                  type: "success",
                  message: "添加成功!",
                });
                this.$refs.form.resetFields();
              } else {
                this.$alert(data.Msg, "提示信息", {
                  confirmButtonText: "确定",
                });
              }
              this.endLoading();
            })
            .catch((error) => {
              this.endLoading();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    openAdd() {
      this.dialogVisible = true;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 260;
        // this.tableHeight1 =
      });
    },
    handleSizeChange(value) {
      this.getlistText.pageSize = value;
      this.getData();
      // console.log(this.pageSize);
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getlistText.pageIndex = value - 1;
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
      // console.log(this.loading);
      this.loading?.close();
      // this.loading.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.aptitude {
  padding: 20px;
  .header {
    margin-bottom: 20px;
  }
}
</style>
