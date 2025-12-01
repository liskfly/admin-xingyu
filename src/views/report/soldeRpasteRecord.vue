<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="form" :inline="true" label-width="auto">
        <el-form-item class="mb-2">
          <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="mb-2">
          <!-- <el-select
            v-model="ID"
            filterable
            remote
            reserve-keyword
            placeholder=""
            :remote-method="handleChange"
            :loading="loading"
            @change="getData"
            style="width: 265px;"
          >
            <el-option
              v-for="item in IDList"
              :key="item.CompID"
              :label="item.CompID"
              :value="item.CompID"
            >
            </el-option>
          </el-select> -->
          <el-autocomplete ref="autocompleteInput" v-model="getDataText.CompID" :fetch-suggestions="remoteMethod"
            placeholder="请输入锡膏ID" @select="change1" style="width: 265px;" @clear="handleClear" clearable
            :key="autocompleteKey">
          </el-autocomplete>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getData(getDataText.CompID)">查询</el-button>
          <!-- <el-button @click="">重置</el-button> -->
        </el-form-item>
      </el-form>
      <!-- <div class="table"> -->
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        " :height="tableHeight" :header-cell-style="heardStyle" border stripe size="mini">
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            <div>{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="CompID" label="锡膏ID"></el-table-column>
        <el-table-column prop="OperationID" label="锡膏料号">
          <template slot-scope="scope">
            <div>{{ scope.row.CompID.slice(0, 13) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="DescriptionName" label="操作类型">
        </el-table-column>
        <el-table-column prop="McID" label="设备ID" width="100">
        </el-table-column>
         <!-- <el-table-column prop="uplinedate" label="上线时间" width="150">
        </el-table-column>
        <el-table-column prop="downlinedate" label="下线时间" width="150">
        </el-table-column> -->
        <el-table-column prop="OperatorID" label="操作人" width="100"> </el-table-column>
        <el-table-column prop="Timestamp" label="时间" width="150">
        </el-table-column>
       
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
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
import { GetCompId, QueryOperator } from "@/api/sdzApi";
import { getContainerMoves } from "@/api/material";
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
        CompID: "",
        InitialDate1: "",
        InitialDate2: "",
      },
      ID: "",
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
      ],
      changeForm: {
        orderName: "",
        operationName: "",
      },
      pickerOptions: {
        shortcuts: shortcuts1,
        disabledDate: disabledDate,
      },
      dateValue: [],
      loading: false,
      autocompleteKey: 0,
      // pickerOptions: {
      //   shortcuts: shortcuts,
      // }
    };
  },
  watch: {
    dateValue(value) {
      if (value == null) {
        this.getDataText.InitialDate1 = "";
        this.getDataText.InitialDate2 = "";
      } else {
        this.getDataText.InitialDate1 = value[0];
        this.getDataText.InitialDate2 = value[1];
      }
    },
  },
  created() { },
  beforeMount() {
    let end = setTodayDate();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
    this.dateValue = [
      dayjs(todayStart).subtract(7, "day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    ];
  },
  mounted() {
    this.$nextTick(() => {
      // console.log( window.innerHeight);
      this.tableHeight = window.innerHeight - 210;
      //后面的50：根据需求空出的高度，自行调整
    });
  },
  methods: {
    getData(query) {
      this.getDataText.CompID = query;
      QueryOperator({ CompID: this.getDataText.CompID }).then((res) => {
        if (res.Success) {
          this.tableData = res.Data;
          if (res.Code == 300) {
            this.tableData=[]
            this.$notify({
              title: "提示信息",
              message: "请选择具体的锡膏ID",
              type: "error",
            });
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
    handleSearch(value) { },
    handleChange(query) {
      this.getDataText.CompID = query;
      GetCompId({ ...this.getDataText, CompID: query }).then((res) => {
        if (res.Success) {
          this.IDList = res.Data;
        } else {
        }
      });
    },
    change1(val) {
      this.getDataText.CompID = val.value;
      this.getData(val.value);

    },
    handleClear() {
      this.autocompleteKey += 1;
       // 强制重新渲染
       this.$nextTick(() => {
        this.$refs.autocompleteInput.focus();
      });
    },
    remoteMethod(query, cb) {
      if (query.trim() === '') {
        cb([]); // 返回空数组，确保下拉框关闭
        return;
      }

      GetCompId({ ...this.getDataText, CompID: query }).then((res) => {
        if (res.Success) {
          if (res.Code == 300) {
            
            cb([])
            return
          }
          const searchData = res.Data.map((item) => {
            return {
              value: item.CompID
            };
          });
          
          cb(searchData);
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
    }
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
