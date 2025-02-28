<template>
  <div class="type">
    <el-card :body-style="{ padding: '8px' }">
      <div class="table_header">
        <el-select v-model="line" placeholder="请选择" class="titleSelect" @change="getData">
          <el-option v-for="item in lineList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-button type="" @click="getData" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="" icon="el-icon-refresh">空车回收</el-button>
        <el-button type="danger" @click="" icon="el-icon-delete">取消</el-button>
      </div>
      <div class="table_container">
        <el-table :data="tableData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
          " border :height="tableHeight" style="width: 100%" >
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="lineNumber" label="线体"> </el-table-column>

          <!-- <el-table-column prop="P" label="工位"> </el-table-column> -->
          <el-table-column prop="mtype" label="任务类型" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.mtype == 1 ? 'success' : 'info'" effect="plain">
                {{ scope.row.mtype == 1 ? "送料" : "收空车" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="workstationID" label="工位"> </el-table-column>
          <el-table-column prop="startPoint" label="起点"> </el-table-column>
          <el-table-column prop="startName" label="起点名称"> </el-table-column>
          <el-table-column prop="endPoint" label="终点"> </el-table-column>
          <el-table-column prop="endName" label="终点名称"> </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag  effect="dark" :color="returnStatus(scope.row.status).color " >
                {{ returnStatus(scope.row.status).status }}
              </el-tag>
    
            </template>
          </el-table-column>
          <el-table-column prop="cr_date" label="时间"> </el-table-column>
          <el-table-column prop="ud_user" label="工作人"> </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="emptyRecycle(scope.row)"></el-button>

              <el-button type="danger" icon="el-icon-circle-close" size="mini" @click="emptyCancel(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
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
            <el-option v-for="item in typeList" :key="item.ToolsMold" :label="item.ToolsMold"
              :value="item.ToolsMold"></el-option>
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
import { findLineMaterialk, recycleEmptyVehicles,cancelTask1 } from "@/api/agvApi";
import { getToken } from "@/utils/auth";
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
      line: "Line1",
      lineList: ["Line1", "Line2", "Line3", "Line4", "Line5", "Line6", "Line7"],
    };
  },
  created() {
    // this.getData();
  },
  beforeMount() {
    this.getScreenHeight();
    this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      findLineMaterialk(this.line).then((res) => {
        // console.log(res);
        this.tableData=[]
        if (res.Success) {
          let data = JSON.parse(res.Data);
          this.tableData = data.filter((item) => {
            if (item.mtype == 2) {
              return true
            }
            return false
          });;
          // console.log(this.tableData);
        }
      });
    },
    returnStatus(num) {
      let status = "";
  let color = "";

  switch (num) {
    case "1":
      status = "已备料";
      color = "#67c23a"; // 绿色
      break;
    case "2":
      status = "叫料中";
      color = "#FFA500"; // 橙色
      break;
    case "3":
      status = "已取料";
      color = "#0000FF"; // 蓝色
      break;
    case "99":
      status = "已完成";
      color = "#808080"; // 灰色
      break;
    case "10":
      status = "任务取消";
      color = "#FF0000"; // 红色
      break;
    case "22":
      status = "异常";
      color = "#8B0000"; // 深红色
      break;
    default:
      status = "";
      color = "#333333"; // 深灰色（替代白色，确保在白色背景可见）
      break;
  }

  return { status, color };
    },
    emptyRecycle(row) {
      this.$confirm("确定进行空车回收", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          recycleEmptyVehicles({
            materialPreparationID: row.materialPreparationID,
            cr_user: getToken(),
          }).then((res) => {
            this.$notify({
              title: "提示信息",
              message: res.Message,
              type: res.Success ? "success" : "error",
            });
            this.getData();
          });

        })
        .catch(() => {
          this.$notify({
            title: "提示信息",
            message: "取消操作",
            type: "info",
          });
        });
    },
    emptyCancel(){
      this.$confirm("确定进行取消回收", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelTask1({
            materialPreparationID: row.materialPreparationID,
            cr_user: getToken(),
          }).then((res) => {
            this.$notify({
              title: "提示信息",
              message: res.Message,
              type: res.Success ? "success" : "error",
            });
            this.getData();
          });

        })
        .catch(() => {
          this.$notify({
            title: "提示信息",
            message: "取消操作",
            type: "info",
          });
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
        this.tableHeight = window.innerHeight - 228;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.titleSelect {
  margin-right: 12px;
}

.type {
  padding: 8px;

  .initBox {
    width: 500px;
  }

  .table_header {
    padding-bottom: 8px;
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
