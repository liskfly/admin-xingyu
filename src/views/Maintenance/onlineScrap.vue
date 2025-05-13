<template>
  <div class="p-2">
    <el-card shadow="" :body-style="{ padding: '8px' }">
      <div class="p-2">
        <el-input v-model="input" placeholder="请输入" style="width: 400px" />
        <el-button>查询</el-button>
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :style="{ width: '100%' }"
        border
        :height="tableHeight"
        stripe
      >
        <el-table-column type="index" width="50" label="序号">
          <template v-slot="{ $index }">
            {{ $index + 1 + (currentPage - 1) * pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="baddata_pcbid" label="PCB条码" />
        <el-table-column prop="baddata_user" label="申请人" />
        <el-table-column prop="baddata_datetime" label="申请时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="100" align="center">
          <template>
            <el-button
              type="primary"
              icon="el-icon-document"
              size="mini"
              @click="handleEdit"
            ></el-button>
          </template>
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
          layout="total,sizes, prev, pager, next"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="'PCB123456'"
      :visible.sync="dialogVisible"
      width="75%"
      @close="addCancel()"
    >
      <el-table :data="tableData1" border style="width: 100%" height="400">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>

        <el-table-column prop="baddata_item" label="不良位号">
        </el-table-column>
        <el-table-column prop="baddata_component" label="不良料号">
        </el-table-column>
        <el-table-column prop="badphenomena_value" label="不良现象">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">不通过</el-button>
        <el-button type="primary" @click="onSubmit()">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
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
        data_type: "分组",
      },
      confirmForm: {
        baddata_pcbid: "",
        data_type: "",
      },
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
        this.tableData = res.Data;
      });
    },
    handleEdit(row) {
      this.confirmForm.baddata_pcbid = row.baddata_pcbid;
      QueryXYL_BadProductInformationScrap({
        baddata_pcbid: row.baddata_pcbid,
        data_type: "",
      }).then((res) => {
        this.tableData1 = res.Data;
        this.dialogVisible = true;
      });
    },
    addCancel(){
      this.dialogVisible = false;
      this.tableData1 = [];
      
    },
    onSubmit() {
      let data = {
        scapRevpList: [
          {
            baddata_id: 0,
            baddata_confirm: "通过",
          },
        ],
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
