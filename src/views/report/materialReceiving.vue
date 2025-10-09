<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form
          ref="formRef"
          :model="getForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item label="" class="mb-2">
            <el-select v-model="searchType" placeholder="">
              <el-option
                v-for="item in inquireList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
                @change="typeChange"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="mb-2" v-show="searchType == 'W'"
            ><el-input
              v-model="getForm.mfgordername"
              clearable
              placeholder="请输入工单"
              style="width: 300px"
              @clear="clearInput"
              @keyup.enter.native="getData"
          /></el-form-item>
          <el-form-item label="" class="mb-2" v-show="searchType == 'R'"
            ><el-input
              v-model="getForm.reelid"
              clearable
              placeholder="请输入物料id"
              style="width: 300px"
              @clear="clearInput"
              @keyup.enter.native="getData"
          /></el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()" icon="el-icon-search"
              >查询</el-button
            ></el-form-item
          >
        </el-form>
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        :height="tableHeight"
        style="width: 100%"
        size="mini"
        tooltip-effect="light"
      >
        <el-table-column label="序号" width="60" align="center">
          <template #default="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <af-table-column prop="wo" label="工单" />
        <af-table-column align="center" prop="Mcid" label="设备ID" />
        <af-table-column prop="CompId" label="物料编码" />
        <af-table-column align="center" prop="ActionID" label="操作类型" />
        <af-table-column align="center" prop="Station" label="机台站点" />
        <af-table-column align="center" prop="Slot" label="主站位" />
        <af-table-column align="center" prop="SubSlot" label="子站位" />
        <af-table-column prop="FeederID" label="FeederID" />
        <el-table-column
          prop="Description"
          label="描述"
          width="100"
          show-overflow-tooltip
        />

        <af-table-column prop="OperatorID" label="操作人" />
        <el-table-column prop="Timestamp" label="时间" width="150">
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
import { GetWoOperatorTrace } from "@/api/reportApi/index";
import dayjs from "dayjs";
export default {
  data() {
    return {
      getForm: {
        mfgordername: "",
        reelid: "",
      },
      tableHeight: 0,
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 每页的数据条数
      inquireList: [
        {
          lable: "工单号",
          value: "W",
        },
        {
          lable: "物料id",
          value: "R",
        },
      ],
      searchType: "W",
    };
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
      if (this.searchType == 'W' && this.getForm.reelid == "") {
        this.$notify.error({
          title: "提示信息",
          message: "请输入物料id",
        });
        return;
      }
      if (this.searchType == 'R' && this.getForm.mfgordername == "") {
        this.$notify.error({
          title: "提示信息",
          message: "请输入工单",
        });
        return;
      }
      GetWoOperatorTrace(this.getForm).then((res) => {
        if (res.Success) {
          this.tableData = res.Data.map((item) => {
            item.Timestamp =
              item.Timestamp == null
                ? ""
                : dayjs(item.Timestamp).format("YYYY-MM-DD HH:mm:ss");
            return item;
          });
        } else {
          this.tableData = [];
          this.$notify.error({
            title: "提示信息",
            message: res.Message,
          });
        }
      });
    },
    typeChange() {
      this.getForm = {
        mfgordername: "",
        reelid: "",
      };
    },
    clearInput() {
      this.getForm.ContainerMfg = "";
      this.$refs.formRef.resetFields();
      this.tableData = [];
    },
    handleSizeChange(value) {
      this.pageSize = value;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },
  },
};
</script>
