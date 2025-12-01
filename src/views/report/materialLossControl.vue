<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="form" :inline="true" label-width="auto">
        <el-form-item class="mb-2">
          <el-date-picker
            :clearable="false"
            v-model="getDataText.Date"
            type="date"
            placeholder="选择日期"
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
          <el-input
            placeholder="请输入料号名称"
            clearable
            v-model="getDataText.PNName"
            @input="getData(false)"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getData(true)">查询</el-button>
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
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="CompName" label="部品名"></el-table-column>
        <el-table-column prop="PNName" label="料号名称"></el-table-column>
        <el-table-column prop="PNDesc" label="产品描述"></el-table-column>
        <el-table-column
          prop="TotalCount"
          sortable
          label="总数"
        ></el-table-column>
        <el-table-column prop="lossCount" sortable label="错误次数">
        </el-table-column>
        <el-table-column
          prop="lossRate"
          sortable
          label="错误率%"
        ></el-table-column>
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
  shortcuts1,
  disabledDate,
  setTodayDate,
  setLastDate,
} from "@/utils/dataMenu";
import { GetMaterialLossDetail } from "@/api/sdzApi";
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
      getDataText: {
        Line: "",
        Date: "",
        PNName: "",
      },
      ID: "",
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      lineList: [
        {
          lable: "Line1",
          value: "Line1",
        },
        {
          lable: "Line2",
          value: "Line2",
        },
        {
          lable: "Line3",
          value: "Line3",
        },
        {
          lable: "Line4",
          value: "Line4",
        },
        {
          lable: "Line5",
          value: "Line5",
        },
        {
          lable: "Line6",
          value: "Line6",
        },
        {
          lable: "Line7",
          value: "Line7",
        },
        {
          lable: "全部",
          value: "",
        },
      ],
      // pickerOptions: {
      //   shortcuts: shortcuts,
      // }
    };
  },
  watch: {},
  created() {},
  beforeMount() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    this.getDataText.Date = year + "-" + month + "-" + day;
  },
  mounted() {
    this.$nextTick(() => {
      // console.log( window.innerHeight);
      this.tableHeight = window.innerHeight - 210;
      //后面的50：根据需求空出的高度，自行调整
    });
  },
  methods: {
    getData(boolen) {
      if (this.getDataText.Line == "" || this.getDataText.Date == "") {
        if (boolen) {
          this.$message({
            message: "请选择时间和线体",
            type: "warning",
          });
        }
        return;
      }
      GetMaterialLossDetail(this.getDataText).then((res) => {
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
