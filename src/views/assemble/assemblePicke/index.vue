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
        <af-table-column prop="Sht" label="拣货单号" align="center">
        </af-table-column>
        <af-table-column prop="WO" label="工单号" align="center">
        </af-table-column>
        <af-table-column prop="Line" label="生产线" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.erp_wo_info.Line }}</span>
          </template>
        </af-table-column>
        <af-table-column prop="PD_dsc" label="成品描述" align="center">
        </af-table-column>
        <af-table-column prop="ChkoutShtId" label="工单批量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.erp_wo_info.Plan_qty }}</span>
          </template>
        </af-table-column>
        <!-- <af-table-column prop="split_cnt" label="待分盘盘数" align="center">
        </af-table-column> -->
        <af-table-column prop="chkout_cnt" label="配料盘数" align="center">
        </af-table-column>
        <af-table-column prop="chkout_pct" label="齐套率" align="center">
        </af-table-column>
        <af-table-column prop="rechk_cnt" label="复核盘数" align="center">
        </af-table-column>
        <af-table-column prop="rechk_pct" label="复核进度" align="center">
        </af-table-column>
        <af-table-column prop="Stts" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :color="statusColor(scope.row.Stts)"
              :type="statusStyle(scope.row.Stts)"
              >{{ statusText(scope.row.Stts) }}</el-tag
            >
          </template>
        </af-table-column>
        <af-table-column prop="Dsc" label="备注"> </af-table-column>
        <af-table-column prop="Crt_usr" label="最后操作员"> </af-table-column>
        <af-table-column prop="Crt_dt" label="最后操作时间"> </af-table-column>
        <af-table-column prop="return_msg" label="ERP回传信息">
        </af-table-column>

        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="计算并锁定"
              placement="top-start"
            >
              <el-button
                plain
                type="primary"
                size="mini"
                icon="el-icon-lock"
                @click.stop="handleCreate(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="作废"
              placement="top-start"
            >
              <el-button
                plain
                type="info"
                size="mini"
                icon="el-icon-document-delete"
                @click.stop="handleCreate(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="工单完结"
              placement="top-start"
            >
              <el-button
                plain
                type="success"
                size="mini"
                icon="el-icon-circle-check"
                @click.stop="handleCreate(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
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
      <el-tabs v-model="activeName">
        <el-tab-pane label="配料状态" name="first">
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
            <el-table-column prop="PN" label="料号"> </el-table-column>
            <el-table-column prop="Group_id" label="料号组"> </el-table-column>
            <el-table-column prop="Pn" label="规格">
              <template slot-scope="scope">
                <span>{{ scope.row.PnInfo.pn_spec }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Dsc" label="物料等级">
              <template slot-scope="scope">
                <span>{{ scope.row.PnInfo.Lv }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Plan_qty" label="需求数量">
            </el-table-column>
            <el-table-column prop="Act_qty" label="实发数量"> </el-table-column>
            <el-table-column prop="Extra_qty" label="超发数量">
            </el-table-column>
            <el-table-column prop="Dsc" label="备注"> </el-table-column>
            <el-table-column prop="Stts" label="状态"> </el-table-column>
            <el-table-column prop="Qty" label="待复核盘数"> </el-table-column>
            <el-table-column prop="www" label="发料盘数"> </el-table-column>
            <el-table-column prop="www" label="待分盘出数量"> </el-table-column>
            <!-- <el-table-column prop="CreTime" sortable label="时间">
        </el-table-column> -->
          </el-table></el-tab-pane
        >
        <el-tab-pane label="发料明细清单" name="second">
          <el-table
            :data="tableData2"
            :height="tableHeight1"
            border
            stripe
            :size="innerHeight < 750 ? 'mini' : 'medium'"
            class="tableAuto"
            style="width: 100%"
          >
            <!-- <el-table-column prop="Id" label="ID"> </el-table-column> -->
            <el-table-column prop="Sht" label="拣货单"> </el-table-column>
            <el-table-column prop="Material" label="物料ID"> </el-table-column>
            <el-table-column prop="PN" label="料号"> </el-table-column>
            <el-table-column prop="Group_id" label="物料组"> </el-table-column>
            <el-table-column prop="" label="规格">
              <template slot-scope="scope">
                <span>{{ scope.row.PnInfo.pn_spec }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Dsc" label="描述">
              <template slot-scope="scope">
                <span>{{ scope.row.PnInfo.pn_dsc }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Qty" label="数量"> </el-table-column>
            <el-table-column prop="Crt_dt" label="物料生产日期">
              <template slot-scope="scope">
                <span>{{ scope.row.MaterInfo.DateCode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="批次">
              <template slot-scope="scope">
                <span>{{ scope.row.MaterInfo.Batch }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Cell_id" label="当前储位"> </el-table-column>
            <el-table-column prop="vendor" label="供应商">
              <template slot-scope="scope">
                <span>{{ scope.row.MaterInfo.Vendor }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Stts" label="复核状态">
                <template slot-scope="scope">
                <span>{{ scope.row.Stts==1?'未复核':'已复核' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Ud_dt" label="数据更新时间">
            </el-table-column>
            <el-table-column prop="Ud_usr" label="更新人"> </el-table-column>
            <el-table-column prop="" label="备注"> </el-table-column>
            <el-table-column prop="Crt_dt" label="配料时间"> </el-table-column>
            <el-table-column prop="" label="复核时间"> </el-table-column>
            <el-table-column prop="return_msg" label="ERP回传信息">
            </el-table-column>
            <!-- <el-table-column prop="CreTime" sortable label="时间">
        </el-table-column> -->
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- </el-card> -->
  </div>
</template>

<script>
import {
  getChkOutShtPage,
  getChkOutShtItemDetail,
  getChkOutShtListDetail,
  batching,
} from "@/api/wmsApi";
import { getToken } from "@/utils/auth";
import { getDateTo } from "@/utils/getDate";
export default {
  data() {
    return {
      getText: {
        pageIndex: 0,
        pageSize: 10,
        searchText: "",
      },
      activeName: "first",
      tableData: [],
      currentPage: 1,
      total: 0,
      tableHeight: 0,
      tableHeight1: 0,
      tableData1: [],
      tableData2: [],
      innerHeight: window.innerHeight,
    };
  },
  created() {
    // this.getData();
  },
  mounted() {
    // console.log( this.$route.params.id);
    this.getText.searchText = this.$route.params.id;
    this.getData();
    this.$nextTick(() => {
      this.tableHeight = (window.innerHeight - 190 - 68 - 68 + 80 - 40) * 0.6;
      this.tableHeight1 = (window.innerHeight - 190 - 68 + 80 - 50 - 40) * 0.4;
    });
  },
  methods: {
    getData() {
      getChkOutShtPage(this.getText).then((res) => {
        if (res.data.Code == 200) {
          // console.log(res.data);
          let data = res.data.Data;
          this.total = data.Total;
          this.tableData = data.list;
          console.log(this.tableData);
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
    },
    handleCreate(index, row) {
      // console.log(row);
      let text = {
        Sht: row.Sht,
        WO: row.WO,
        Ud_usr: getToken(),
        Ud_dt: getDateTo(),
      };
      // console.log(text);
      batching(text).then(res=>{
        if (res.data.Code == 200) {
          // console.log(res.data);
          this.$message({
            type: "success",
            message: "计算锁定成功!",
          });
          this.getData()
          this.handle(row)
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
      })
      // this.$router.push({ path: "/assemble/assemblePicke" });
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
          text = "待计算配料";
          break;
        case 1:
          text = "锁料完成";
          break;
        case 2:
          text = "正在拣货";
          break;
        case 3:
          text = "取出，待复核";
          break;
        case 4:
          text = "拣货完成";
          break;
        case 99:
          text = "工单完结";
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
          text = "";
          break;
        case 2:
          text = "warning";
          break;
        case 3:
          text = "danger";
          break;
        case 4:
          text = "";
          break;
        case 99:
          text = "success";
          break;
        default:
          break;
      }
      return text;
    },
    statusColor(status) {
      let text = "";
      switch (status) {
        case 4:
          text = "#FE5E08";
          break;

        default:
          break;
      }
      return text;
    },

    handle(row, column, event) {
      // console.log(row);
      // let text = {
      //   Wo: row.Wo, //预留工单号
      // };
      getChkOutShtItemDetail(row).then((res) => {
        if (res.data.Code == 200) {
          let data = res.data.Data;
          //   this.total = data.Total;
          this.tableData1 = data;
          // console.log(this.tableData1);
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
      getChkOutShtListDetail(row).then((res) => {
        if (res.data.Code == 200) {
          let data = res.data.Data;
          //   this.total = data.Total;
          this.tableData2 = data;
          console.log(this.tableData2);
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

  //   .tableAuto.el-table .cell {
  //   white-space: nowrap;
  // }
}
</style>
