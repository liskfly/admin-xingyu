<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
    
   
    <div>
      <el-form ref="form" class="form" :inline="true" :model="getDataText">
        <el-form-item class="mb-2">
          <el-select v-model="getDataText.operationType" placeholder="检查类型">
            <el-option
              v-for="item in inquireList"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="getDataText.operationType == 'W'" class="mb-2">
          <el-input
            placeholder="请输入单号"
            clearable
            style="width: 400px"
            v-model="getDataText.workOrder"
            class="input-with-select"
          >
            <!-- @change="getAllData()" -->
          </el-input>
        </el-form-item>
        <el-form-item v-show="getDataText.operationType != 'W'" class="mb-2">
          <!-- <el-time-picker
              is-range
              v-model="getDataText.date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker> -->
          <!-- <el-date-picker
            v-model="getDataText.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker> -->
          <el-date-picker v-model="getDataText.date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getAllData()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="table"> -->
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :height="tableHeight"
        size="mini"
        :header-cell-style="heardStyle"
        border
        stripe
      >
        <el-table-column prop="OrderNumber" label="工单" width="150"></el-table-column>
        <el-table-column prop="Side" label="面别"></el-table-column>
        <el-table-column prop="FinalYield" label="最终产率">
          <template #default="scope">
            {{ parseFloat(scope.row.FinalYield).toFixed(2) > 100 ? 100:scope.row.FinalYield }}
          </template>
        </el-table-column>
        <el-table-column prop="FirstYield" label="首次测试良率"> </el-table-column>
        <el-table-column prop="PlannedStartTime" label="计划开始时间">
        </el-table-column>
        <el-table-column prop="PlannedFinishTime" label="计划完成时间">
        </el-table-column>
        <el-table-column prop="ActualStarted" label="实际开始时间">
        </el-table-column>
        <el-table-column prop="ActualFinished" label="实际完成时间">
        </el-table-column>
        <el-table-column prop="QuantityOrdered" label="工单数量">
        </el-table-column>
        <el-table-column prop="QuantityProcessed" label="完成数量">
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
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
    <!-- </div> -->
  </div>
</template>

<script>
import { XY_Assembly_OrderStatus, XY_SMT_OrderStatus } from "@/api/all";
import dayjs from "dayjs";
import { shortcuts,
  disabledDate,
  setTodayDate,
  setLastDate, } from "@/utils/dataMenu";
export default {
  data() {
    return {
      heardStyle: {
        background: "rgb(102, 146, 217)",
        color: "#ffffff",
      },
      tableData: [],
      getDataText: {
        // seiralNumber: "",
        date: [],
        workOrder: "",
        operationType: "S",
      },
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      dialogVisible: false,
      inquireList: [
        {
          lable: "工单号查询",
          value: "W",
        },
        {
          lable: "时间查询",
          value: "S",
        },
      ],
      changeForm: {
        orderName: "",
        operationName: "",
      },
      pickerOptions: {
        shortcuts: shortcuts,
      }
    };
  },
  watch: {
    "getDataText.operationType"(newValue) {
      if (newValue == "W") {
        this.getDataText.date = [];
      } else {
        this.getDataText.workOrder = "";
      }
    },
  },
  created() {
    console.log(this.$route.query);
    this.getDataText.seiralNumber = this.$route.query.SerialNumber; // 使用查询参数时使用
  },
  beforeMount() {
      this.getScreenHeight();
      this.getDataText.date = [setLastDate(),setTodayDate()]
    },
    mounted() {
      window.addEventListener("resize", this.getScreenHeight);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.getScreenHeight);
    },
  methods: {
    getData() {
      return new Promise((resolve, reject) => {
        XY_SMT_OrderStatus({
          operationType: "Q1",
          orderName: this.getDataText.workOrder,
          startTime: "",
          endTime: "",
        })
          .then(({ data }) => {
            if (data.Status !== "NG") {
              resolve();
              const dataList = data.DataList.map((item) => {
                return {
                  ...item,
                  PlannedStartTime: dayjs(item.PlannedStartTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                  PlannedFinishTime: dayjs(item.PlannedFinishTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                  ActualStarted: dayjs(item.ActualStarted).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                  ActualFinished: dayjs(item.ActualFinished).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                };
              });
              this.tableData.push(...dataList);
            } else {
              resolve();
              this.tableData = [];
            }
          })
          .catch((err) => {
            resolve();
          });

        // XY_PCBAHisControl(this.getDataText).then(({ data }) => {
        //   if (data.Status !== "NG") {
        //     resolve();
        //     this.tableData.push(...data.DataList);
        //   } else {
        //     resolve();
        //     this.tableData = [];
        //   }
        // });
      });
    },
    async getAllData() {
      console.log(this.getDataText.date, this.getDataText.operationType);
      this.startLoading();
      this.tableData = [];
      if (this.getDataText.operationType == "W") {
        await this.getData();
      } else {
        await this.getDateData();
      }
      // await this.getDpiData();
      this.currentPage = 1;
      this.endLoading();
    },
    getDateData() {
      return new Promise((resolve, reject) => {
        XY_SMT_OrderStatus({
          operationType: "Q2",
          orderName: "",
          startTime: this.getDataText.date[0],
          endTime: this.getDataText.date[1],
        })
          .then(({ data }) => {
            if (data.Status !== "NG") {
              resolve();

             const dataList = data.DataList.map((item) => {
                return {
                  ...item,
                  PlannedStartTime: dayjs(item.PlannedStartTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                  PlannedFinishTime: dayjs(item.PlannedFinishTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                  ActualStarted: dayjs(item.ActualStarted).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                  ActualFinished: dayjs(item.ActualFinished).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                };
              });
              this.tableData.push(...dataList);
            } else {
              resolve();
              this.tableData = [];
            }
          })
          .catch((err) => {
            resolve();
          });
      });
      // this.startLoading();
      // if (this.getDataText.operationType === "S") {
      //   getContainerMoves(`conName=${this.getDataText.seiralNumber}`).then(
      //     ({ data }) => {
      //       this.endLoading();
      //       this.tableData.push(...data.content);
      //     }
      //   );
      // } else {
      //   getContainerMoves(`mfgOrder=${this.getDataText.workOrder}`).then(
      //     ({ data }) => {
      //       this.endLoading();
      //       this.tableData.push(...data.content);
      //     }
      //   );
      // }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    getScreenHeight() {
        this.$nextTick(() => {
          this.tableHeight = window.innerHeight - 220;
          // this.tableHeight1 =
        });
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
      this.loading?.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
  // .form{
  //    display: flex;
  //     justify-content: flex-end;
  // }
}
</style>
