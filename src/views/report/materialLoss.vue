<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="form" :inline="true" label-width="auto">
        <el-form-item class="mb-2">
          <!-- <el-date-picker
            v-model="getDataText.Date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker> -->
          <el-date-picker
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
        <el-form-item class="mb-2">
          <el-select v-model="getDataText.Line" placeholder="请选择">
            <el-option
              v-for="item in lineList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getData()">查询</el-button>
          <!-- <el-button @click="">重置</el-button> -->
        </el-form-item>
      </el-form>
      <!-- <div class="table"> -->
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :height="tableHeight"
        :header-cell-style="heardStyle"
        border
        stripe
        size="mini"
      >
        <el-table-column
          prop="Line"
          label="线体"
          width="120px"
        ></el-table-column>
        <el-table-column prop="TotalCount" label="抛料数"></el-table-column>
        <el-table-column prop="PPM" label="PPM"></el-table-column>
        <el-table-column prop="LEDCount" label="LED"> </el-table-column>
        <el-table-column prop="ChipCount" label="芯片"> </el-table-column>
        <el-table-column prop="ConnectorCount" label="接插件">
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
  </div>
</template>

<script>
import {
  shortcuts2,
  disabledDate,
  setTodayDate,
  setLastDate,
} from "@/utils/dataMenu";
import { GetMaterialLossData } from "@/api/sdzApi";
import { aW, cl, el } from "@fullcalendar/core/internal-common";
import dayjs from "dayjs";
import { getDate } from "@/utils/getDate";
export default {
  data() {
    return {
      heardStyle: {
        background: "rgb(102, 146, 217)",
        color: "#ffffff",
      },
      IDList: [],
      tableData: [],
      dateValue: [],
      pickerOptions: {
        shortcuts: shortcuts2,
        // disabledDate: disabledDate,
      },
      getDataText: {
        Line: "",
        StartTime: "",
        EndTime: "",
      },
      ID: "",
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      lineList: [
        {
          value: "",
          label: "全部",
        },
        {
          label: "Line1",
          value: "Line1",
        },
        {
          label: "Line2",
          value: "Line2",
        },
        {
          label: "Line3",
          value: "Line3",
        },
        {
          label: "Line4",
          value: "Line4",
        },
        {
          label: "Line5",
          value: "Line5",
        },
        {
          label: "Line6",
          value: "Line6",
        },
        {
          label: "Line7",
          value: "Line7",
        },
      ],
      // pickerOptions: {
      //   shortcuts: shortcuts,
      // }
    };
  },
  watch: {
    dateValue(value) {
      if (value == null) {
        this.getDataText.StartTime = "";
        this.getDataText.EndTime = "";
      } else {
        this.getDataText.StartTime = value[0];
        this.getDataText.EndTime = value[1];
      }
    },
  },
  created() {},
  beforeMount() {
    // let now = new Date();
    // let year = now.getFullYear();
    // let month = now.getMonth() + 1;
    // let day = now.getDate();
    // this.getDataText.Date = year + "-" + month + "-" + day;
    const formattedRange = this.getFormattedTimeRange();
    this.dateValue = [formattedRange.start,formattedRange.end]
  },
  mounted() {
    this.$nextTick(() => {
      // console.log( window.innerHeight);
      this.tableHeight = window.innerHeight - 210;
      //后面的50：根据需求空出的高度，自行调整
    });
  },
  methods: {
    getData() {
      if (!this.dateValue || this.dateValue.length == 0) {
        this.$message({
          message: "请选择时间",
          type: "warning",
        });
        return;
      }
      if (
        this.dateCheck(this.getDataText.StartTime, this.getDataText.EndTime)
      ) {
        this.$message({
          message: "时间区间不能超过一个月",
          type: "warning",
        });
        return;
      }
      this.startLoading();
      GetMaterialLossData(this.getDataText).then((res) => {
        if (res.Success) {
          this.tableData = res.Data;
          if (res.Code != 200) {
            this.tableData = [];
          }
        } else {
          this.$notify({
            title: "提示信息",
            message: res.Msg,
            type: "error",
          });
        }
      });
      this.endLoading();
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

      // 判断是否不超过一个月
      return diffDays > 30;
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
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getFormattedTimeRange() {
      const today8AM = new Date();
      today8AM.setHours(8, 0, 0, 0);

      const yesterday8AM = new Date(today8AM);
      yesterday8AM.setDate(yesterday8AM.getDate() - 1);

      return {
        start: this.formatDate(yesterday8AM), // 如: "2025-11-2 08:00:00"
        end: this.formatDate(today8AM), // 如: "2025-11-3 08:00:00"
      };
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
