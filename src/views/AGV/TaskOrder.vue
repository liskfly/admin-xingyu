<template>
  <div class="type">
    <el-card :body-style="{ padding: '8px' }">
      <div class="table_header" style="display: flex;justify-content: flex-end;">
        <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" size="small">
          <el-form-item label="" style="margin-bottom: 0px;">
            <el-date-picker v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" size="small" :picker-options="pickerOptions" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" style="margin-bottom: 0px;"><el-input v-model="getForm.SearchText" clearable placeholder="请输入"
              style="width: 240px;"  @clear="clearInput" @change="clearInput"/></el-form-item>
          <el-form-item style="margin-bottom: 0px;">
            <el-button type="primary" @click="getData()" icon="el-icon-search">查询</el-button></el-form-item>
        </el-form>
        <!-- <el-input style="width: 240px" v-model="line"></el-input> -->
      </div>
      <div class="table_container">
        <el-table :data="tableData" border :height="tableHeight" style="width: 100%">
          <el-table-column type="index" label="序号" width="55" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="materialPreparationID" width="200" label="备料ID"> </el-table-column>
          <el-table-column prop="workOrder" width="200" label="工单"> </el-table-column>
          <el-table-column prop="lineNumber" label="线体"> </el-table-column>
          <el-table-column prop="workstationID" label="工位" width="70"></el-table-column>
          <el-table-column prop="mtype" label="任务类型" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.mtype == 1 ? 'success' : 'info'" effect="plain">
                {{ scope.row.mtype == 1 ? "送料" : "收空车" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startPoint" label="起点" width="100" align="center"></el-table-column>
          <el-table-column prop="startName" label="起点名称"> </el-table-column>
          <!-- <el-table-column prop="endPoint" label="终点"> </el-table-column> -->
          <el-table-column prop="endName" label="终点名称"> </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag effect="dark" :color="returnStatus(scope.row.status).color">
                {{ returnStatus(scope.row.status).status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cr_user" label="操作人" width="180">
          </el-table-column>
          <el-table-column prop="cr_date" label="更新时间" width="180"></el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { findTaskPage } from "@/api/agvApi";
import { shortcuts } from "@/utils/dataMenu";
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      // currentPage: 1, // 当前页码
      // pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      total: 0,
      getForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        StartTime: "",
        EndTime: "",
      },
      dateValue: [],
      pickerOptions: {
        shortcuts: shortcuts,
      },
    };
  },
  watch: {
    dateValue(value) {

      if (value == null) {
        this.getForm.StartTime = "";
        this.getForm.EndTime = "";
      } else {
        this.getForm.StartTime = value[0];
        this.getForm.EndTime = value[1];
      }
      this.getForm.PageIndex = 1;
      this.getData();

    },
  },
  created() {
    this.getData();
    // this.getIDdata();
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      findTaskPage(this.getForm).then((res) => {
        this.tableData = [];
        this.total = 0;
        console.log(JSON.parse(res.Data));
        let data = JSON.parse(res.Data);
        this.tableData = data.list;
        this.total = data.Total;
        //  console.log(data);
      });
    },
    clearInput(){
      this.getForm.PageIndex = 1;
      this.getData()
    },
    // changeDate(){
    //     this.getData()
    // },
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
    handleSizeChange(value) {
      this.getForm.PageSize = value;
      // console.log(this.pageSize);
      this.getData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.getForm.PageIndex = val;
      this.getData();
    },

    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 220;
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
