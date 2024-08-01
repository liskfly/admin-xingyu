<template>
  <div class="abnormal" :style="{ height: `${dashboardHeight}px` }">
    <div class="all-wrong" ref="wrong">
      <div class="title" ref="wrongTitle">待处理产线异常</div>
      <el-table
        :style="{ height: `${allHeight}px` }"
        :max-height="allHeight"
        :data="
          allList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
      >
        <el-table-column prop="SerialNumber" label="序列号"> </el-table-column>
        <el-table-column prop="McName" label="设备"> </el-table-column>
        <el-table-column prop="LineNumber" label="线体名"> </el-table-column>
        <el-table-column prop="StartTime" label="开始时间"> </el-table-column>
        <el-table-column prop="EndTime" label="结束时间"> </el-table-column>
        <!-- <el-table-column prop="tDuration" label="异常等级"> </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="dataMaintenancema(scope.$index, scope.row)"
              >维护</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        ref="wrongPagination"
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="allList.length"
      >
      </el-pagination>
    </div>
    <div class="today-wrong" ref="todayWrong">
      <div class="title" ref="wrongTitle">
        <div>查询已处理异常</div>
        <div>
          <el-date-picker
            v-model="searchDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTodayData()"
          >
          </el-date-picker>
        </div>
      </div>
      <el-table
        :style="{ height: `${allHeight}px` }"
        :max-height="allHeight"
        :data="
          todayList.slice(
            (todayCurrentPage - 1) * todayPageSize,
            todayCurrentPage * todayPageSize
          )
        "
      >
        <!-- <el-table-column prop="SerialNumber" label="序列号"> </el-table-column> -->
        <el-table-column prop="LineNumber" label="线体名"> </el-table-column>
        <el-table-column prop="McName" label="设备"> </el-table-column>
        <el-table-column prop="StartTime" label="开始时间"> </el-table-column>
        <el-table-column prop="EndTime" label="结束时间"> </el-table-column>
        <el-table-column prop="CloseTime" label="关闭时间"> </el-table-column>
        <el-table-column prop="ErrorLevel" label="异常等级"> </el-table-column>
        <el-table-column prop="ErrorType" label="异常类型"> </el-table-column>
        <el-table-column prop="ErrorDsc" label="处理说明"> </el-table-column>
        <el-table-column prop="ErrorCode" label="异常代码"> </el-table-column>
        <el-table-column prop="OperatorName" label="处理人"> </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="dataMaintenancema(scope.$index, scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination
        ref="wrongPagination"
        style="margin-top: 20px"
        @size-change="todaySizeChange"
        @current-change="todayCurrentChange"
        :current-page="todayCurrentPage"
        :page-size="todayPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="todayList.length"
      >
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="maintenance">
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="异常等级" prop="errorLevel">
          <el-input-number
            v-model="form.errorLevel"
            @input="handleInput"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="异常类型" prop="errorType">
            <el-select
              v-model="form.errorType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeChoice"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="处理说明" prop="errorDsc">
          <el-input v-model="form.errorDsc"></el-input>
        </el-form-item>
        <el-form-item label="异常代码" prop="errorCode">
          <el-input v-model="form.errorCode"></el-input>
        </el-form-item>
        <el-form-item label="关闭时间" prop="status">
          <el-date-picker
            v-model="form.closedTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="maintenance = false">取 消</el-button>
        <el-button
          type="primary"
          @click="(dialogFormVisible = false), handleUpdate()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delectT } from "@/utils/oeeFun";
import { getToken } from "@/utils/auth";
import { XY_OEE_LineError, XY_OEE_LineErrorUpdate } from "@/api/all";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 10,
      todayCurrentPage: 1,
      todayPageSize: 10,
      todayTotal: 10,
      allHeight: 0,
      allList: [],
      todayList: [],
      maintenance: false,
      form: {
        operationType: "U",
        serialNumber: 1,
        errorLevel: 1,
        closedTime: "",
        errorType: "",
        errorCode: "",
        errorDsc: "",
        operatorName: getToken(),
      },
      searchDate: [],
      title: "",
      typeChoice:[
        {
          value: "设备异常",
          label: "设备异常",
        },
        {
          value: "换线停机",
          label: "换线停机",
        },
        {
          value: "维修保养",
          label: "维修保养",
        }]
    };
  },
  computed: {
    ...mapState(["dashboardHeight"]),
  },
  created() {
    this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getWrongHeight, false);
    this.$nextTick(() => {
      this.getWrongHeight();
    });
  },
  methods: {
    getTodayData() {
      XY_OEE_LineError({
        operationType: "Q1",
        tStartTime: this.searchDate[0],
        tEndTime: this.searchDate[1],
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.todayList = res.data.DataList;
            this.$message({
              message: "搜索成功",
              type: "success",
            });
          } else {
            this.todayList = [];
            this.$message({
              message: res.data.Message,
              type: "warning",
            });
          }
        })
        .catch((res) => {
          this.$message({
            message: res,
            type: "error",
          });
        });
    },
    getData() {
      XY_OEE_LineError({
        operationType: "Q",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.allList = res.data.DataList;
          } else {
            this.allList = [];
            this.$message({
              message: res.data.Message,
              type: "warning",
            });
          }
        })
        .catch((res) => {
          this.$message({
            message: res,
            type: "error",
          });
        });
    },
    //分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    todaySizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.todayCurrentPage = 1;
      this.todyPageSize = val;
    },
    todayCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.todayCurrentPage = val;
    },
    getWrongHeight() {
      this.allHeight =
        this.$refs.wrong.offsetHeight -
        this.$refs.wrongPagination.$el.offsetHeight -
        this.$refs.wrongTitle.offsetHeight -
        40;
    },
    dataMaintenancema(index, row) {
      if (row.OperatorName) {
        this.title = "修改";
        this.form = {
          operationType: 'U',
          serialNumber: row.SerialNumber,
          errorLevel: row.ErrorLevel,
          closedTime: delectT(row.CloseTime),
          errorType: row.ErrorType,
          errorCode: row.ErrorCode,
          errorDsc: row.ErrorDsc,
          operatorName: getToken(),
        };
      } else {
        this.title = "维护";
        this.form = {
          operationType: 'U',
          serialNumber: row.SerialNumber,
          errorLevel: 1,
          closedTime: "",
          errorType: "",
          errorCode: "",
          errorDsc: "",
          operatorName: getToken(),
        };
      }
      this.maintenance = true;
    },
    handleInput(value) {
      // 将输入值转换为数字
      const numericValue = parseInt(value, 10);
      // 如果输入值是有效的数字且在0到5之间，则更新数据；否则，设置为上一个有效值或0
      if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
        this.form.errorLevel = numericValue.toString();
      } else {
        this.$nextTick(() => {
          this.form.errorLevel = 1;
          this.$message({
            message: "请输入1~5范围的时间",
            type: "warning",
          });
        });
      }
    },
    handleUpdate() {
      if (this.form.closedTime === '' || this.form.errorType === '' || 
      this.form.errorDsc === '') {
          this.$message({
            message: "请输完整信息",
            type: "warning",
          });
        return;
      }
      XY_OEE_LineErrorUpdate(this.form)
        .then((res) => {
          if (res.data.Status === "OK") {
            this.maintenance = false;
            this.getData();
            this.$message({
              message: "成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.Message,
              type: "warning",
            });
          }
        })
        .catch((res) => {
          this.$message({
            message: res,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.abnormal {
  width: 100%;
  .all-wrong {
    width: 100%;
    height: 50%;
    padding: 20px;

    .title {
      // height: 2.5rem;
      font-size: 2rem;
      font-weight: 700;
    }
  }
  .today-wrong {
    width: 100%;
    height: 50%;
    padding: 20px;
    // background-color: chartreuse;

    .title {
      // height: 2.5rem;
      font-size: 2rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
    }
  }

  .popul-item {
    margin-bottom: 20px;
  }
}

/* 隐藏加号和减号 */
::v-deep .el-input-number__increase,
::v-deep .el-input-number__decrease {
  display: none;
}
</style>
