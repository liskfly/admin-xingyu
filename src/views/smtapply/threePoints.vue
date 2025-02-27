<template>
  <div class="three">
    <el-card :body-style="{ padding: '8px' }">
      <div style="margin-bottom: 8px;">
        <el-date-picker
      v-model="dateValue"
      type="daterange"
     
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size="small"
      :picker-options="pickerOptions"
      value-format="yyyy-MM-dd"
      @change="changeDate"
      >
    </el-date-picker>
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        :height="tableHeight"
        style="width: 100%"
         size="small"
         highlight-current-row
      >
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column prop="lineNumber" label="线体"> </el-table-column>
        <el-table-column prop="deviceID" label="设备ID"> </el-table-column>
        <el-table-column prop="ID" label="照合ID"> </el-table-column>
        <el-table-column prop="date" label="时间"> </el-table-column>
        <el-table-column prop="photographID" label="照合设备ID"> </el-table-column>
        <el-table-column label="图片查看" width="100">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-picture-outline" size="mini" @click="emptyRecycle(scope.row)">查看</el-button>

            </template>
           </el-table-column>
      </el-table>
      <div class="block" style="margin: 8px 0">
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
      <el-table
        :data="
          tableData2
        "
        border
        :height="tableHeight2"
        style="width: 100%"
         size="small"
      >
        <el-table-column type="index" label="序号" width="55" />
    
        <el-table-column prop="parameter" label="调整参数">
        </el-table-column>
        <el-table-column prop="value" label="值"> </el-table-column>
        <el-table-column prop="unit" label="单位"> </el-table-column>
      
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {shortcuts} from "@/utils/dataMenu"
export default {
  data() {
    return {
      pickerOptions:{
        shortcuts:shortcuts
      },
      tableData:[{
        lineNumber:"Line1",
        deviceID:"102",
        ID:"2025-02-25_14-59-51e_Rev_Offset",
        date:"2025-02-25 14:59:51",
         photographID:"103"
      }],
      tableData2: [
        {
          
            parameter:"REV X",
            value:"-0.016",
            unit:"mm"
           
        },
        {
           
            parameter:"REV Y",
            value:"-0.026",
             unit:"mm"
        },
        {
           
            parameter:"REV T",
            value:"-45",
           unit:"Arc Seconds"
        }
      ],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      dateValue:[],
      tableHeight2: 0,
      getDataForm:{
        startTime:"",
        endTime:""
      }
    };
  },
  watch:{
    dateValue(value) {
      this.getDataForm.startTime = value[0];
      this.getDataForm.endTime = value[1];
      // console.log(this.getDataText);
    },
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
    getData() {},
    changeDate(val){
   
   
    },
    handleSizeChange(value) {
      this.pageSize = value;
      console.log(this.pageSize);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = (window.innerHeight - 190-40)*0.6;
        this.tableHeight2 =(window.innerHeight - 190-40)*0.4;
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
