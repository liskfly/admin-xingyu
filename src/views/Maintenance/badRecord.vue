<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form
          ref="formRef"
          :model="getForm"
          label-width="auto"
          :inline="true"
          size="small"
        >
          <el-form-item label="" style="margin-bottom: 8px">
            <!-- <el-date-picker
              v-model="dateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker> -->
            <el-date-picker
              v-model="dateValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" style="margin-bottom: 8px"
            ><el-input
              v-model="getForm.SearchText"
              clearable
              placeholder="请输入"
              style="width: 240px"
              @clear="clearInput"
              @change="clearInput"
          /></el-form-item>
          <el-form-item style="margin-bottom: 0px">
            <el-button type="primary" @click="getData()" icon="el-icon-search"
              >查询</el-button
            ></el-form-item
          >
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        :height="tableHeight"
        style="width: 100%"
        stripe
      >
        <!-- 序号列 -->
        <el-table-column
          type="index"
          label="序号"
          width="55"
          fixed="left"
          align="center"
        >
          <template v-slot="{ $index }">
            {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
          </template>
        </el-table-column>

        <!-- 数据列 -->
        <el-table-column prop="containername" label="PCB条码" />
        <el-table-column prop="baddata_line" label="线体" />
        <el-table-column prop="baddata_equipment" label="设备" />
        <el-table-column prop="baddata_item" label="不良位号" />
        <el-table-column prop="badphenomena_value" label="不良现象" />、
        <el-table-column prop="baddata_user" label="登记人" />
        <el-table-column prop="baddata_datetime" label="登记时间" />
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex"
          :page-size="getForm.PageSize"
          :page-sizes="[10, 20, 50, 100, 200]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { QueryXYL_BadProductInformation } from "@/api/repairApi";
import {
  shortcuts,
  disabledDate,
  setTodayDate,
  setLastDate,
} from "@/utils/dataMenu";
export default {
  data() {
    return {
      tableData: [],
      //   currentPage: 1,
      //   pageSize: 10,
      total: 0,
      tableHeight: 0,
      getForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        SearchModel: {
          baddata_line: "",
          baddata_equipment: "",
          baddata_pcbid: "",
          baddata_item: "",
          baddata_code: "",
        },
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
  beforeMount() {
    this.dateValue = [setLastDate(), setTodayDate()];
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
    getData() {
      QueryXYL_BadProductInformation(this.getForm).then((res) => {
        this.tableData = res.Data.list;
        this.total = res.Data.Total;
      });
      // QueryBadTypebasicInformation(this.getForm).then((res) => {
      //     this.tableData = res.Data;
      // });
    },
    clearInput() {
      this.getForm.PageIndex = 1;
      this.getData();
    },
    handleSizeChange(value) {
      //   this.pageSize = value;
      this.getForm.PageSize = value;
      this.getData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      //   this.currentPage = val;
      this.getForm.PageIndex = val;
      this.getData();
    },
    getScreenHeight() {
      this.tableHeight = window.innerHeight - 210;
    },
  },
};
</script>

<style lang="scss" scoped></style>
