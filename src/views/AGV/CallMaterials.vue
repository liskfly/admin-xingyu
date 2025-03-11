<template>
  <div class="type">
    <el-card :body-style="{ padding: '8px' }">
      <div class="table_header">
        <el-select v-model="line" placeholder="请选择" class="titleSelect">
          <el-option
            v-for="item in lineList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-button type="" @click="getData()" icon="el-icon-search"
          >查询</el-button
        >
        <el-button type="primary" @click="lineCall()" icon="el-icon-phone-outline"
          >叫料</el-button
        >
        <el-button type="danger" @click="" icon="el-icon-delete"
          >取消</el-button
        >
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
          <el-table-column prop="lineNumber" label="线体"> </el-table-column>
          <el-table-column prop="workOrder" width="200" label="工单"> </el-table-column>
          <el-table-column prop="workstationID" label="工位"> </el-table-column>
          <el-table-column prop="mtype" label="任务类型">
            <template slot-scope="scope">
              <span>{{ scope.row.mtype === "1" ? "送料" : "收空车" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startPoint" label="起点"> </el-table-column>
          <el-table-column prop="startName" label="起点名称"> </el-table-column>
          <el-table-column prop="endPoint" label="终点"> </el-table-column>
          <el-table-column prop="endName" label="终点名称"> </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag  effect="dark" :color="returnStatus(scope.row.status).color " >
                {{ returnStatus(scope.row.status).status }}
              </el-tag>
    
            </template>
          </el-table-column>
          <el-table-column prop="cr_date" width="200" label="时间"> </el-table-column>
          <el-table-column prop="ud_user" label="操作人"> </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="70"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === '1'"
                type="primary"
                icon="el-icon-phone-outline"
                size="mini"
                @click="call(scope.row.materialPreparationID)"
              ></el-button>
              <el-button
                v-if="scope.row.status !== '1'"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="cancel(scope.row.materialPreparationID)"
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
  </div>
</template>

<script>
import { findLineMaterial, taskCall, cancelTask, LinetaskCall } from "@/api/agvApi";
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
      operator: getToken(),
      callVisible: false,
    };
  },
  created() {},
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    window.addEventListener('fullscreenchange', this.getScreenHeight);
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      this.startLoading();
      findLineMaterial(this.line).then((res) => {
        if (res && res.data && res.data.Success) {
          this.tableData = JSON.parse(res.data.Data).filter((res) => {
            if (res.mtype == 1) {
              return true
            }
            return false
          });
          this.endLoading();
        } else {
          this.tableData = [];
          this.endLoading();
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
    call(materialPreparationID) {
      this.$confirm("是否叫料?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.startLoading();
          taskCall(materialPreparationID, this.operator).then((res) => {
            if (res && res.data && res.data.Success) {
              this.getData();
              this.$success({
                type: "error",
                message: res.data.Message,
              });
              this.endLoading();
            } else {
              this.$message({
                type: "error",
                message: res.data.Message,
              });
              this.endLoading();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    cancel(materialPreparationID) {
      this.$confirm("是否取消叫料?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.startLoading();
          cancelTask(materialPreparationID, this.operator).then((res) => {
            if (res && res.data && res.data.Success) {
              this.getData();
              this.$success({
                type: "error",
                message: res.data.Message,
              });
              this.endLoading();
            } else {
              this.$message({
                type: "error",
                message: res.data.Message,
              });
              this.endLoading();
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
    lineCall() {
      this.$confirm("是否叫料?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.startLoading();
          LinetaskCall(this.line, this.operator).then((res) => {
            if (res && res.data && res.data.Success) {
              this.getData();
              this.$success({
                type: "error",
                message: res.data.Message,
              });
              this.endLoading();
            } else {
              this.$message({
                type: "error",
                message: res.data.Message,
              });
              this.endLoading();
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
        this.tableHeight = window.innerHeight - 230;
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
