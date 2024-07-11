<template>
  <div class="inboundRecord">
    <!-- <el-card class="box-card"> -->
    <div class="table_header">
      <!-- <div class="input_box">
        <el-input
          placeholder="工单号，容器ID"
          clearable
          v-model="getText.searchText"
          class="input-with-select"
          @input="getSearchData"
          @change="getSearchData"
        >
          <el-button
            size="small"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div> -->
    </div>
    <div class="table_container">
      <el-table
        :data="tableData"
        :height="tableHeight"
        border
        :size="innerHeight < 750 ? 'mini' : 'medium'"
        stripe
        @row-click="handle"
        class="tableAuto"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->

        <el-table-column prop="Issue_type" label="单据类型"> </el-table-column>
        <el-table-column prop="Line" label="生产线"> </el-table-column>
        <el-table-column prop="wo_group" label="单合并组"> </el-table-column>
        <el-table-column prop="PD_model" label="产品型号"> </el-table-column>
        <el-table-column prop="WO" label="工单号"> </el-table-column>
        <el-table-column prop="Issue_id" label="领料单"> </el-table-column>
        <el-table-column prop="Chkout_sht_id" label="出库单"> </el-table-column>
        <el-table-column prop="Stts" label="状态">
          <template slot-scope="scope">
            <el-tag size="small " :type="statusStyle(scope.row.Stts)">{{
              statusText(scope.row.Stts)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Plan_qty" label="计划产数量"> </el-table-column>
        <el-table-column prop="Dsc" label="描述"> </el-table-column>
        <el-table-column prop="blreason" label="补料原因"> </el-table-column>
        <el-table-column prop="auditStatus" label="审核状态">
          <template slot-scope="scope">
            <el-tag
              v-if="
                scope.row.auditStatus != null && scope.row.auditStatus != ''
              "
              style="border-color: transparent"
              size="small "
              effect="dark"
              :color="scope.row.auditStatus == 0 ? '#90a4ae' : '#00AC6A'"
              >{{ scope.row.auditStatus == 0 ? "待审核" : "已审核" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="auditUser" label="审核人"> </el-table-column>
        <el-table-column prop="auditDate" label="审核日期"> </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click.stop="handleCreate(scope.$index, scope.row)"
              >拣货</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-plus"
              @click.stop="handleCreate(scope.$index, scope.row)"
              >补料</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          background
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20, 50, 100]"
          :current-page="currentPage"
          :page-size="getText.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="box">
      <el-table
        :data="tableData1"
        :height="tableHeight1"
        border
        stripe
        :size="innerHeight < 750 ? 'mini' : 'medium'"
        class="tableAuto"
        style="width: 100%"
      >
        <!-- <el-table-column prop="Id" label="ID"> </el-table-column> -->
        <el-table-column prop="erp_wo" label="工单"> </el-table-column>
        <el-table-column prop="issue_id" label="领料单"> </el-table-column>
        <el-table-column prop="pn" label="料号"> </el-table-column>
        <el-table-column prop="Dsc" label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.pninfo.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seq" label="规格">
          <template slot-scope="scope">
            <span>{{ scope.row.pninfo.pn_spec }}</span>
            <!-- <el-tag size="small " :type="statusStyle(scope.row.Stts)">{{
              statusText(scope.row.Stts)
            }}</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="数量"> </el-table-column>
        <!-- <el-table-column prop="CreTime" sortable label="时间">
        </el-table-column> -->
      </el-table>
    </div>
    <!-- </el-card> -->
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { getDateTo } from "@/utils/getDate";
import {
  getAssembleOrderPage,
  getAssembleOrderDetail,
  saveChkOutSht,
} from "@/api/wmsApi";
export default {
  data() {
    return {
      getText: {
        pageIndex: 0,
        pageSize: 10,
        searchText: "",
      },
      tableData: [],
      currentPage: 1,
      total: 0,
      tableHeight: 0,
      tableHeight1: 0,
      tableData1: [],
      innerHeight: window.innerHeight,
      jumpForm: {
        ChkoutShtInfo: {
          id: 0,
          Sht: "",
          Out_md: "",
          Group_id: "",
          Stts: 0,
          Is_del: "",
          Crt_usr: "",
          Crt_dt: "",
          Ud_usr: "",
          Ud_dt: "",
          Dsc: "",
          WO: "",
          Color: "",
          Face: "",
          pcb_pn: "",
          qitao_percent: "",
          q111: "",
          split_cnt: "",
          chkout_cnt: "",
          rechk_cnt: "",
          rechk_pct: "",
          chkout_pct: "",
          kevin: "",
          pn_cnt: "",
          ok_pn_cnt: "",
          return_msg: "",
          erp_wo_type: "",
        },
        ChkoutShtList: [],
        ChkoutShtItemsList: [],
      },
    };
  },
  created() {
    // this.getData();
  },
  mounted() {
    //  console.log(getToken());
    this.getData();
    this.$nextTick(() => {
      this.tableHeight = (window.innerHeight - 190 - 68 - 68 + 80) * 0.6;
      this.tableHeight1 = (window.innerHeight - 190 - 68 + 80 - 50) * 0.4;
    });
  },
  methods: {
    getData() {
      getAssembleOrderPage(this.getText).then((res) => {
        if (res.data.Code == 200) {
          let data = res.data.Data;
          this.total = data.Total;
          this.tableData = data.list;
          // console.log(data.list);
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
    },
    handleCreate(index, row) {
      this.jumpForm.ChkoutShtInfo.id = 0;
      this.jumpForm.ChkoutShtInfo.Sht = row.Issue_id;
      this.jumpForm.ChkoutShtInfo.WO = row.WO;
      this.jumpForm.ChkoutShtInfo.Crt_usr = getToken();
      this.jumpForm.ChkoutShtInfo.Crt_dt = getDateTo();
      console.log(this.jumpForm);
      saveChkOutSht(this.jumpForm).then(({ data }) => {
        if (data.Code == 200) {
          this.$message({
            type: "success",
            message: "创建成功!",
          });
          this.$router.push({
            name: "AssemblePicke",
            params: { id: row.IssueId },
          });
        } else {
          this.$alert(data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
      });
    },
    getSearchData() {
      this.getText.pageIndex = 0;
      this.getData();
    },
    handleSizeChange(value) {
      this.getText.pageSize = value;
      this.getData();
      // console.log(this.pageSize);
    },
    handleCurrentChange(value) {
      this.getlistText.pageIndex = value - 1;
      this.getData();
    },
    startLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "加载中~",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.2)", //调节透明度
      });
    },
    endLoading() {
      this.loading.close();
    },
    statusText(status) {
      let text = "";
      switch (status) {
        case 0:
          text = "待创建拣货单";
          break;
        case 1:
          text = "已创建捡货单";
          break;
        case 2:
          text = "已完成";
          break;
        case 99:
          text = "作废";
          break;
        default:
          break;
      }
      return text;
    },
    statusStyle(status) {
      let text = "";
      switch (status) {
        case 0:
          text = "info";
          break;
        case 1:
          text = "warning";
          break;
        case 2:
          text = "success";
          break;
        case 99:
          text = "danger";
          break;
        default:
          break;
      }
      return text;
    },
    handle(row, column, event) {
      console.log(row);
      let text = {
        Wo: row.WO, //预留工单号
      };
      getAssembleOrderDetail(text).then((res) => {
        if (res.data.Code == 200) {
          let data = res.data.Data;
          //   this.total = data.Total;
          this.tableData1 = data;
          console.log(this.tableData1);
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.inboundRecord {
  padding: 20px;
  .table_header {
    padding-bottom: 20px;
    display: flex;
    // gap: 30px;
    justify-content: flex-end;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
  .box {
    margin-top: 20px;
  }
  //   .tableAuto.el-table .cell {
  //   white-space: nowrap;
  // }
}
</style>
