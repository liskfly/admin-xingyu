<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between">
        <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" @submit.native.prevent>
          <el-form-item label="时间" class="mb-2">

            <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']" :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="产品SN" class="mb-2"><el-input v-model="getForm.SearchModel.pcbid" clearable
              placeholder="请输入" style="width: 300px" @clear="clearInput"
              @keyup.enter.native="clearInput" /></el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()" icon="el-icon-search">查询</el-button></el-form-item>
        </el-form>
        <div class="mb-2"><el-button type="success" @click="deducedClick"
            :disabled="tableData.length == 0">导出</el-button>
        </div>
      </div>
      <el-table :data="tableData" border :height="tableHeight" style="width: 100%" stripe size="small"
        @cell-click="handleCellClick" highlight-current-row ref="operaRecordRef">
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="55" fixed="left" align="center">
          <template v-slot="{ $index }">
            {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
          </template>
        </el-table-column>

        <!-- 数据列 -->
        <af-table-column prop="repair_no" label="维修单号" fixed="left">
          <template v-slot="{ row }">
            <span class="underline text-cyan cursor-pointer">{{ row.repair_no }}</span>
          </template>
        </af-table-column>
        <af-table-column prop="repair_badno" label="提报单号" fixed="left">

        </af-table-column>
        <af-table-column prop="baddata_pcbid" label="产品SN" />
        <af-table-column prop="mfgordername" label="工单号"></af-table-column>
        <af-table-column prop="productname" label="产品编码"></af-table-column>
        <!-- <af-table-column prop="productvalue" label="产品名称"></af-table-column> -->
        <el-table-column prop="baddata_line" label="线体" />
        <af-table-column prop="baddata_equip" label="设备" />
        <af-table-column prop="baddatadetail_item" label="不良点位"></af-table-column>
        <af-table-column prop="baddatadetail_code" label="不良代码"></af-table-column>
        <af-table-column prop="badphenomena_value" label="不良名称"></af-table-column>
        <el-table-column prop="badphenomena_desc" label="不良描述"></el-table-column>
        <el-table-column prop="baddatadetail_remark" label="不良备注"></el-table-column>

        <!-- <el-table-column prop="baddatadetail_item" label="不良位号" />
        <el-table-column prop="badphenomena_value" label="不良现象" /> -->
        <el-table-column prop="repair_way" label="维修方法" />
        <el-table-column prop="baddata_stts" label="状态" width="100" align="center">
          <template v-slot="{ row }">
            <el-tag effect="dark" v-if="row.baddata_stts == '完成维修'" type="success">{{ row.baddata_stts }}</el-tag>
            <el-tag effect="dark" v-else-if="row.baddata_stts == '维修中'" type="primary">{{ row.baddata_stts }}</el-tag>
            <el-tag effect="dark" v-else-if="row.baddata_stts == '未维修'" type="info">{{ row.baddata_stts }}</el-tag>
            <el-tag effect="dark" v-else type="danger">{{ row.baddata_stts }}</el-tag>
          </template>
        </el-table-column>
        <af-table-column prop="baddata_user" label="维修人" />
        <af-table-column prop="repair_datetime" label="维修时间" />
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[10, 20, 50, 100, 200]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'更换物料：' + replaceForm.baddatadetail_pcbid" :visible.sync="replaceVisible" width="75%"
      @close="replaceCancel()">
      <el-form :model="replaceForm" ref="repairFormRef" label-width="auto" :inline="true">
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item label="产品SN" prop="containerName">
              <el-input v-model="replaceForm.containerName" disabled style="width: 270px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="工单号" prop="mfgordername">
              <el-input v-model="replaceForm.mfgordername" disabled readonly style="width: 270px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="产品编码" prop="productname">
              <el-input v-model="replaceForm.productname" disabled readonly style="width: 270px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">

          <el-col :span="8" :offset="0">
            <el-form-item label="产品名称" prop="baddata_productname">
              <el-input v-model="replaceForm.baddata_productname" disabled style="width: 270px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="0">
            <el-form-item label="产品描述" prop="baddata_productdsc">
              <el-input v-model="replaceForm.baddata_productdsc" disabled style="width:645px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-table :data="replaceForm.tableData" border stripe height="300">
          <af-table-column prop="repairpro_productname" label="物料编码"></af-table-column>
          <af-table-column prop="repairpro_user" label="操作人"></af-table-column>
          <af-table-column prop="repairpro_datetime" label="操作时间"></af-table-column>
        </el-table>

      </el-form>

      <span slot="footer">
        <el-button @click="replaceCancel()">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'导出数据'" :visible.sync="deducedVisible" width="75%" @close="deducedVisible = false">
      <el-select v-model="deducedVal" placeholder="请选择">
        <el-option label="当前页" :value="'1'">
        </el-option>
        <el-option label="所有" :value="'0'">
        </el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="deducedVisible = false">关闭</el-button>
        <el-button type="primary" @click="deducedClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  QueryXYL_BadProductInformationRepairRecord,
  QueryXYL_BadProductInformationRepairMaterial
} from "@/api/repairApi";
import { exportTableToExcel } from "@/utils/exportExcel";
import dayjs from "dayjs";
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
        PageSize: 50,
        SearchText: "",
        SearchModel: {
          pcbid: "",
          stts: "Y"
        },
        StartTime: "",
        EndTime: "",
      },
      dateValue: [],
      pickerOptions: {
        shortcuts: shortcuts,
        disabledDate,
      },
      replaceForm: {
        baddatadetail_pcbid: "",
        containerName: "",
        mfgordername: "",
        productname: "",
        productvalue: "",
        tableData: [],
      },
      replaceVisible: false,
      deducedVisible: false,
      deducedVal: '0'
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
      QueryXYL_BadProductInformationRepairRecord(this.getForm).then((res) => {
        if (res.Success) {
          this.tableData = res.Data.list;
          this.total = res.Data.Total;
        } else {

          this.tableData = [];
          this.total = 0;
        }

      });
      // QueryBadTypebasicInformation(this.getForm).then((res) => {
      //     this.tableData = res.Data;
      // });
    },
    clearInput() {
      this.getForm.PageIndex = 1;
      this.getData();
    },
    handleCellClick(row, column) {
      // console.log(row,column);
      if (column.label == "维修单号") {
        // console.log(row);
        this.replaceForm.baddatadetail_pcbid = row.repair_no;
        this.replaceForm.containerName = row.baddata_pcbid;
        this.replaceForm.mfgordername = row.mfgordername;
        this.replaceForm.productname = row.productname;
        this.replaceForm.productvalue = row.productvalue;
        this.replaceForm.baddata_productname = row.baddata_productname;
        this.replaceForm.baddata_productdsc = row.baddata_productdsc;
        QueryXYL_BadProductInformationRepairMaterial({ repairpro_repairno: row.repair_no }).then(res => {
          this.replaceForm.tableData = res.Data
          this.replaceVisible = true
        })

      }

    },
    replaceCancel() {
      this.replaceForm.tableData = []
      this.replaceVisible = false
    },
    deducedClick() {
      exportTableToExcel({
        tableRef: this.$refs.operaRecordRef,
        fetchAllData: this.fetchAllUsers,
        fileName: `不良维修操作记录_${dayjs().format("YYYYMMDDHHmmss")}`,
        styles: {
          headerBgColor: "", // 灰色表头
          headerFont: {
            color: { argb: "" }, // 红色文字
            bold: true,
            size: 14,
          }, // 白色文字
          cell: { numFmt: "@" }, // 强制文本格式
        },
      });
    },
    async fetchAllUsers() {
      let deduced = {
        PageIndex: this.getForm.PageIndex,
        PageSize: this.getForm.PageSize,
        SearchText: this.getForm.SearchText,
        SearchModel: this.getForm.SearchModel,
        StartTime: this.getForm.StartTime,
        EndTime: this.getForm.EndTime
      }
      if (this.deducedVal == 0) {
        deduced.PageIndex = 1
        deduced.PageSize = this.total;
      }

      let data = await QueryXYL_BadProductInformationRepairRecord(deduced).then(
        (res) => {
          return res.Data.list;
        }
      );
      return data;
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

<style lang="scss" scoped>
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>