<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="form" class="form" :inline="true" :model="getDataText">
          <el-form-item class="mb-2">
            <el-select v-model="SearchText" placeholder="检查类型">
              <el-option
                v-for="item in inquireList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="SearchText == 'W'" class="mb-2">
            <el-input
              placeholder="请输入单号"
              clearable
              style="width: 400px"
              v-model="searchForm.SearchModel.OrderNo"
              class="input-with-select"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="SearchText == 'S'" class="mb-2">
            <el-input
              placeholder="请输入seiralNumber"
              clearable
              style="width: 400px"
              v-model="searchForm.SearchModel.ContainerName"
              class="input-with-select"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-date-picker
              v-show="SearchText == 'D'"
              v-model="dateValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="线体" prop="line">
            <el-select
              v-model="searchForm.SearchModel.LineName"
              placeholder="请选择线体"
              style="width: 200px"
            >
              <el-option
                v-for="item in lineData"
                :key="item.LineName"
                :label="item.LineDesc"
                :value="item.LineName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备" prop="equipment">
            <el-select
              v-model="searchForm.SearchModel.EquipName"
              placeholder="请选择设备"
              style="width: 200px"
            >
              <el-option
                v-for="item in equipmentData"
                :key="item.EquipName"
                :label="item.EquipDesc"
                :value="item.EquipName"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getAllData()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        :height="tableHeight"
        border
        stripe
        size="small"
      >
        <!-- 表格列定义保持不变 -->
        <el-table-column prop="OrderName" label="工单"></el-table-column>
        <el-table-column
          prop="OperationID"
          label="制程ID"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="OperationName"
          label="制程名称"
          width="100"
        ></el-table-column>
        <el-table-column prop="AssemblyName" label="产品料号"></el-table-column>
        <el-table-column
          prop="LineName"
          label="线体"
          width="80"
        ></el-table-column>
        <el-table-column prop="SerialNumber" label="PCB ID"></el-table-column>
        <el-table-column
          prop="EquipmentName"
          label="设备名称"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="DateTime"
          label="过站时间"
          width="155"
          :sort-orders="['ascending', 'descending']"
        ></el-table-column>
        <el-table-column
          prop="StatusCODE"
          label="不良代码"
          width="100"
        ></el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.PageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchForm.PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  shortcuts1,
  disabledDate,
  setTodayDate,
  setLastDate,
} from "@/utils/dataMenu";
import { QueryMfgLine, QueryEquipment } from "@/api/repairApi";
import { XY_PCBAHisControl, XY_Prod_MissSNs } from "@/api/all";
import { QueryPCBDateBackTo, GetCamstarValorLine, GetCamstarValorEquip } from "@/api/assemble";
import { getContainerMoves } from "@/api/material";
import dayjs from "dayjs";
export default {
  data() {
    return {
      heardStyle: {
        background: "rgb(102, 146, 217)",
        color: "#ffffff",
      },
      tableData: [],
      getDataText: {
        seiralNumber: "",
        workOrder: "",
        operationType: "S",
      },
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      dialogVisible: false,
      inquireList: [
        {
          lable: "工单号",
          value: "W",
        },
        {
          lable: "PCBA码",
          value: "S",
        },
        {
          lable: "时间",
          value: "D",
        },
      ],
      changeForm: {
        orderName: "",
        operationName: "",
      },
      sortProp: "DateTime", // 当前排序字段
      sortOrder: "ascending", // 当前排序顺序
      sortedData: [],
      dateValue: [],
      searchForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchModel: {
          OrderNo: "",
          ContainerName: "",
          LineName: "",
          EquipName: "",
        },
        StartTime: "",
        EndTime: "",
      },
      SearchText:'S',
      total: 0,
      pickerOptions: {
        shortcuts: shortcuts1,
        // disabledDate: disabledDate,
      },
      lineData: [],
      equipmentData: [],
      changeForm: {
        line: "",
        equipment: "",
      },
    };
  },
  watch: {
    dateValue(value) {
      if (value == null) {
        this.searchForm.StartTime = "";
        this.searchForm.EndTime = "";
      } else {
        this.searchForm.StartTime = value[0];
        this.searchForm.EndTime = value[1];
      }
      this.searchForm.PageIndex = 1;
    },
    "SearchText"(newValue) {
      this.searchForm = {
        PageIndex: 1,
        PageSize: 10,
        SearchModel: {
          OrderNo: "",
          ContainerName: "",
          LineName: "",
          EquipName: "",
        },
        StartTime: "",
        EndTime: "",
      }
      if (newValue == "W") {
        // this.searchForm.SearchText = "W";
      } else if (newValue == "S") {
        // this.searchForm.SearchText = "S";
      } else {
        this.lineData = [];
        this.equipmentData = [];
        this.getLineData();
        this.getEquipmentData();
        // this.searchForm.SearchText = "D";
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
        this.dateValue = [
          dayjs(todayStart).format("YYYY-MM-DD HH:mm:ss"),
          dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ];
      }
    },
    tableData: {
      immediate: true,
      handler(newVal) {
        this.sortedData = [...newVal];
        this.sortData();
      },
    },
  },
  computed: {
    // 当前页的分页数据
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedData.slice(start, end);
    },
  },

  created() {
    console.log(this.$route.query);
    this.getLineData();
    this.getEquipmentData();
    this.searchForm.SearchModel.ContainerName = this.$route.query.SerialNumber; // 使用查询参数时使用
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
    handleSortChange({ prop, order }) {
      this.sortProp = prop;
      this.sortOrder = order || "ascending"; // 点击三次后order为null，重置为ascending
      this.sortData();
      this.currentPage = 1; // 排序后重置到第一页
    },

    getLineData() {
      GetCamstarValorLine({
        LineName: "",
      }).then((res) => {
        this.lineData = res.Data;
      });
    },
    getEquipmentData() {
      this.equipmentData = [];
      GetCamstarValorEquip({
        EquipName: "",
      }).then((res) => {
        this.equipmentData = res.Data;
      });
    },
    // 执行全局排序
    sortData() {
      this.sortedData = [...this.tableData].sort((a, b) => {
        // 处理空值
        if (a[this.sortProp] == null) return 1;
        if (b[this.sortProp] == null) return -1;

        let valA = a[this.sortProp];
        let valB = b[this.sortProp];

        // 特殊处理日期字段
        if (this.sortProp === "DateTime") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        // 特殊处理数字字段（例如OperationID）
        else if (["OperationID"].includes(this.sortProp)) {
          valA = Number(valA);
          valB = Number(valB);
        }

        // 比较逻辑
        if (valA < valB) return this.sortOrder === "ascending" ? -1 : 1;
        if (valA > valB) return this.sortOrder === "ascending" ? 1 : -1;
        return 0;
      });
    },
    getData() {
      return new Promise((resolve, reject) => {
        // console.log(
        //   this.dateCheck(this.searchForm.StartTime, this.searchForm.EndTime)
        // );
        if (
          this.SearchText == "D" &&
          this.dateCheck(this.searchForm.StartTime, this.searchForm.EndTime)
        ) {
          this.$message({
            message: "时间区间不能超过两天",
            type: "warning",
          });
          this.endLoading();
          resolve();
          return;
        }
        // if(this.changeForm.line == '' || this.changeForm.equipment == '') {
        //   this.$message({
        //     message: "必须选择线体和设备",
        //     type: "warning",
        //   });
        //   this.endLoading();
        //   resolve();
        //   return;
        // }
        QueryPCBDateBackTo(this.searchForm).then((res) => {
          if (res.Success) {
            this.tableData = res.Data.list;
            this.total = res.Data.Total;
          } else {
            this.$message({
              message: res.Msg,
              type: "warning",
            });
          }
        });
      });
    },
    dateCheck(startDate, endDate) {
      // 将日期字符串转换为Date对象
      const start = new Date(startDate);
      const end = new Date(endDate);

      // 计算两个日期之间的时间差（毫秒）
      const diffTime = Math.abs(end - start);

      // 将时间差转换为天数
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(diffDays);

      // 判断是否不超过两天
      return diffDays > 2;
    },
    async getAllData() {
      this.startLoading();
      this.tableData = [];
      await this.getData();
      // await this.getDpiData();
      this.currentPage = 1;
      this.endLoading();
    },
    getDpiData() {
      return new Promise((resolve, reject) => {
        if (this.getDataText.operationType === "S") {
          getContainerMoves(`conName=${this.getDataText.seiralNumber}`).then(
            ({ data }) => {
              this.tableData.push(...data.content);
              resolve();
            }
          );
        } else {
          getContainerMoves(`mfgOrder=${this.getDataText.workOrder}`).then(
            ({ data }) => {
              let arr = [];
              arr = data.DataList.sort((a, b) => {
                return new Date(b.DateTime) - new Date(a.DateTime);
              });
              this.tableData = arr;
              // this.tableData.push(...data.content);
              resolve();
            }
          );
        }
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
      this.searchForm.PageIndex = 1;
      this.searchForm.PageSize = val;
      this.getAllData();
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.searchForm.PageIndex = val;
      this.getAllData();
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
