<template>
  <div class="three">
    <el-card :body-style="{ padding: '8px' }">
      <div style="margin-bottom: 8px">
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
      </div>
      <el-table
        :data="tableData"
        border
        :height="tableHeight"
        style="width: 100%"
      
        highlight-current-row
        @row-click="rowClick"
        size="small"
      >
        <el-table-column type="index" label="序号" width="55" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="LineName" label="线体"> </el-table-column>
        <el-table-column prop="DeviceID" label="设备ID" > </el-table-column>
        <el-table-column prop="DataName" label="照合ID" > </el-table-column>
        <el-table-column prop="InsertTime" label="时间"> </el-table-column>
        <el-table-column prop="DeviceID2" label="照合设备ID" > </el-table-column>
        <!-- <el-table-column label="图片查看" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-picture-outline"
              size="mini"
              @click="emptyRecycle(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column> -->
        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.ImageUrl" lazy   style="width: 30px;"  :preview-src-list="[scope.row.ImageUrl]"></el-image>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin: 8px 0">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex"
          :page-size="getForm.PageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
      <el-table
        :data="tableData2"
        border
        :height="tableHeight2"
        style="width: 100%"

      >
        <el-table-column type="index" label="序号" width="55" />

        <el-table-column prop="Parameter" label="调整参数"> </el-table-column>
        <el-table-column prop="Value" label="值"> </el-table-column>
        <el-table-column prop="Unit" label="单位"> </el-table-column>
        <el-table-column prop="Description" label="描述"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { shortcuts1 ,disabledDate, setTodayDate, setLastDate } from "@/utils/dataMenu";
import dayjs from "dayjs";
import { QuerySDZHHeadData, QuerySDZHDetailData } from "@/api/sdzApi";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: shortcuts1,
        disabledDate:disabledDate
      },
      tableData: [
      ],
      tableData2: [
      ],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      dateValue: [],
      tableHeight2: 0,
      getForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        StartTime: "",
        EndTime: "",
      },
      total: 0,
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
  beforeMount() {
    let end = setTodayDate()
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
    // let start= setLastDate();
    this.dateValue = [dayjs(todayStart).format("YYYY-MM-DD HH:mm:ss"), dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")];
    // console.log(this.dateValue);
    
    this.getScreenHeight();
    // this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
     
      this.tableData2 = [];
      QuerySDZHHeadData(this.getForm).then((res) => {
      
        this.tableData = res.Data.list.map(item=>{
          return {
            ...item,
            InsertTime:dayjs(item.InsertTime).format("YYYY-MM-DD HH:mm:ss"),
            ImageUrl:`http://172.20.99.21:5432/${item.ImageUrl}`
          }
        })
        this.total = res.Data.Total;
        //  console.log(data);
      });
    },
    rowClick(val) {
      let data = {
        PageIndex: 1,
        PageSize: 100,
        SearchText: "",
        SearchModel: {
          DetailGuid: "",
          DataName: val.DataName,
          Parameter: "",
          Description: "",
          Value: "",
          Unit: "",
        },
        StartTime: "",
        EndTime: "",
      };
      QuerySDZHDetailData(data).then(res=>{
        this.tableData2= res.Data.list;
      })
    },
    changeDate(val) {},
    handleSizeChange(value) {
      this.getForm.PageSize = value;
      this.getData()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      console.log(val);
      
      this.getForm.PageIndex = val;
      this.getData()
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = (window.innerHeight - 190 - 30) * 0.6;
        this.tableHeight2 = (window.innerHeight - 190 - 30) * 0.4;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.three {
  padding: 8px;
}
</style>
