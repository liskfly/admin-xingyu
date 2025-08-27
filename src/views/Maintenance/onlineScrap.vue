<template>
  <div class="p-2">
    <el-card shadow="" :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-input v-model="input" placeholder="请输入" style="width: 400px" />
        <el-button type="primary">查询</el-button>
      </div>
      <el-table :data="tableData" :style="{ width: '100%' }" border :height="tableHeight" stripe size="small" tooltip-effect="light">
        <el-table-column type="index" width="50" label="序号" align="center">
          <template v-slot="{ $index }">
            {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
          </template>
        </el-table-column>

        <af-table-column prop="baddata_no" label="报废审核号" />
        <af-table-column prop="baddata_pcbid" label="PCB条码" />
        <af-table-column prop="mfgordername" label="工单号" />
        <af-table-column prop="productname" label="产品码" />
         <af-table-column prop="baddata_productname" label="产品名称"></af-table-column>
                <el-table-column prop="baddata_productdsc" label="产品描述" 
                    show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" width="100" align="center">
          <template v-slot="{ row }">
            <el-button type="primary" icon="el-icon-document" size="mini" @click.stop="handleEdit(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[10, 20, 50, 100, 200]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'PCB：' + titleNum" :visible.sync="dialogVisible" width="75%" @close="addCancel()">
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
  QueryXYL_BadProductInformationScrap,
  QueryXYL_BadProductInformationFromByNo,
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
      total: 0,
      input: "",
      dialogVisible: false,
      getForm: {
        PageIndex: 1,
        PageSize: 50,
        SearchText: "",
        SearchModel: {
          pcbid: "",
          stts: "y",
        },
        StartTime: "",
        EndTime: "",
      },
      confirmForm: {
        baddata_pcbid: "",
        data_type: "",
      },
      titleNum: "",
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
      QueryXYL_BadProductInformationScrap(this.getForm).then((res) => {
        if (res.Success) {
          this.tableData = res.Data.list;
          this.total = res.Data.Total;
        } else {
          this.tableData = []
          this.total = 0
          // this.$notify.error({
          //     title: "提示信息",
          //     message: res.Msg,
          // });
        }

      });
    },
    handleEdit(row) {


      this.titleNum = row.baddata_no;
      this.confirmForm.baddata_pcbid = row.baddata_no;
      QueryXYL_BadProductInformationFromByNo({ baddatadetail_no: row.baddata_no }).then((res) => {
  
        
        this.tableData1 = res.Data;
        // console.log(res.Data);

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
        baddatadetail_no: this.confirmForm.baddata_pcbid,
        remark: this.remark,
        baddata_confirm: val,
        UserNo: getToken(),
      };
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
      this.getForm.PageSize = value;
      this.getData();
    },
    handleCurrentChange(val) {
      this.getForm.PageIndex = val;
      this.getData();
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
