<template>
  <div class="p-2">
    <el-card shadow="" :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-input v-model="input" placeholder="请输入" style="width: 400px"  />
        <el-button type="primary">查询</el-button>
      </div>
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        " :style="{ width: '100%' }" border :height="tableHeight" stripe>
        <el-table-column type="index" width="50" label="序号">
          <template v-slot="{ $index }">
            {{ $index + 1 + (currentPage - 1) * pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="baddatadetail_pcbid" label="PCB条码" />
        <el-table-column prop="MfgorderName" label="工单号" />
        <el-table-column prop="ProductName" label="产品码" />

        <el-table-column label="操作" width="100" align="center">
          <template v-slot="{ row }">
            <el-button type="primary" icon="el-icon-document" size="mini" @click="handleEdit(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'PCB：'+titleNum" :visible.sync="dialogVisible" width="75%" @close="addCancel()">
      <el-table :data="tableData1" border style="width: 100%" height="350">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>

        <el-table-column prop="baddatadetail_item" label="不良位号">
        </el-table-column>

        <el-table-column prop="badphenomena_value" label="不良现象">
        </el-table-column>
        <el-table-column prop="baddatadetail_remark" label="备注">
        </el-table-column>
      </el-table>
      <el-form label-width="auto" class="mt-2">
        <el-form-item label="报废原因" class="mb-2">
          <el-input v-model="remark" width="100%"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onSubmit('N')">不通过</el-button>
        <el-button type="primary" @click="onSubmit('Y')">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  QueryDistinctPCBIDFormScrap,
  QueryXYL_BadProductInformationScrap,
  UpdateXYL_BadProductInformationScrapRevd,
} from "@/api/repairApi";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      tableData: [],
      tableData1: [
        {
          badTags: "1",
          badPartNumber: "2",
          badPhenomenon: "3",
        },
      ],
      currentPage: 1,
      pageSize: 10,
      tableHeight: 0,
      input: "",
      dialogVisible: false,
      getForm: {
        baddata_pcbid: "",
      },
      confirmForm: {
        baddata_pcbid: "",
        data_type: "",
      },
      titleNum: '',
      remark: "",
    };
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      QueryDistinctPCBIDFormScrap(this.getForm).then((res) => {
        this.tableData = res.Data;
      });
    },
    handleEdit(row) {

      this.titleNum = row.baddatadetail_pcbid;
      // this.confirmForm.baddata_pcbid = row.baddatadetail_pcbid;
      QueryXYL_BadProductInformationScrap({
        baddata_pcbid: row.baddatadetail_pcbid,

      }).then((res) => {
        this.tableData1 = res.Data;
        this.dialogVisible = true;
      });
    },
    addCancel() {
      this.dialogVisible = false;
      this.tableData1 = [];
      this.remark = "";

    },
  
    onSubmit(val) {
      let data = {
        scapRevpList: [

        ],
        remark: this.remark,
        baddata_confirm: val,
        UserNo: getToken(),
      };
      data.scapRevpList = this.tableData1.map((item) => {
        return {
          baddata_id: item.baddatadetail_id,
        };
      });
      UpdateXYL_BadProductInformationScrapRevd(data).then((res) => {
        if (res.Success) {
          this.$notify({
            title: "提示信息",
            message: res.Msg,
            type: "success",
          });
          this.dialogVisible = false;
          this.tableData1 = [];
          this.remark = "";
          this.getData();
        } else {
          this.$notify.error({
            title: "提示信息",
            message: res.Msg,
          });
        }
      });
    },
    handleSizeChange(value) {
      this.pageSize = value;
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 230;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
