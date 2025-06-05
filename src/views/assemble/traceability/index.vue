<template>
  <div class="inboundRecord">
    <el-card class="box-card" :body-style="{ padding: '8px' }">
      <div class="header">
        <div>
          <el-form ref="form" class="form" :inline="true">
            <el-form-item label="过程码">
              <el-input
                placeholder="请输入"
                clearable
                style="width: 400px"
                v-model="getText.SearchModel.SN"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="组件码">
              <el-input
                placeholder="请输入"
                clearable
                style="width: 400px"
                v-model="getText.SearchModel.PreSN"
                class="input-with-select"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="时间">
              <el-date-picker
                v-model="date"
                style="width: 280px"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-input
            v-model="searchName"
            clearable
            placeholder="请输入"
            @keyup.enter.native="searchData()"
          >
            <template slot="append">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchData()"
              ></el-button>
            </template>
          </el-input> -->
        </div>
      </div>
      <div class="table_container">
        <el-table
          :data="
            tableData
          "
          :height="tableHeight"
          border
          :size="innerHeight < 750 ? 'mini' : 'medium'"
          stripe
          highlight-current-row
          @row-click="handle"
          class="tableAuto"
          style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="55"> </el-table-column> -->

          <af-table-column prop="StationCode" label="工序编码"> </af-table-column>
          <af-table-column prop="StationName" label="工序名称">
          </af-table-column>
          <af-table-column prop="SN" label="过程码或组件码">
          </af-table-column>
          <af-table-column prop="WorkOrder" label="工单号"> </af-table-column>
          <af-table-column prop="OperateUser" label="操作人"> </af-table-column>
          <af-table-column prop="OperateTime" label="时间"> </af-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
          <el-pagination
            background
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20, 50, 100]"
            :current-page="getText.PageIndex"
            :page-size="getText.PageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <div class="box">
        <el-tabs v-model="activeName" style="width: 100%">
          <el-tab-pane label="组件绑定清单" name="first">
            <el-table
              :data="tableFirst"
              :height="tableHeight1"
              border
              stripe
              :size="innerHeight < 750 ? 'mini' : 'medium'"
              class="tableAuto"
            >
              <el-table-column prop="Code" label="组件编码" width="690"> </el-table-column>
              <!-- <el-table-column prop="MaterialCode" label="物料编号"> </el-table-column>
              <el-table-column prop="MaterialName" label="物料名称"> </el-table-column> -->
            </el-table></el-tab-pane
          >
          <el-tab-pane label="数据采集清单" name="second">
            <el-table
              :data="tableSecond"
              :height="tableHeight1"
              border
              stripe
              :size="innerHeight < 750 ? 'mini' : 'medium'"
              class="tableAuto"
              style="width: 100%"
            >
              <!-- <el-table-column prop="Code" label="清单编码">
              </el-table-column> -->
              <el-table-column prop="Name" label="名称" width="230"> </el-table-column>
              <el-table-column prop="Value" label="值" width="230">
              </el-table-column>
              <el-table-column prop="Unit" label="单位" width="230"> </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="不良代码清单" name="third">
            <el-table
              :data="tableThird"
              :height="tableHeight1"
              border
              stripe
              :size="innerHeight < 750 ? 'mini' : 'medium'"
              class="tableAuto"
              style="width: 100%"
            >
              <el-table-column prop="Code" label="不良代码" width="230">
              </el-table-column>
              <el-table-column prop="Name" label="不良名称" width="230"> </el-table-column>
              <el-table-column prop="Remark" label="备注" width="460"> </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { getDateTo } from "@/utils/getDate";
import {
  GetAssSpecMoveHistory,
  GetAssSpecDataList,
  GetAssSpecMaterialBind,
  GetAssSpecNGList
} from "@/api/wmsApi";
export default {
  data() {
    return {
      getText: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        SearchModel: {
          SN: "",
          PreSN: "",
          WorkOrder: "",
          StationCode: "",
          DeviceCode: "",
          OperateStartTime: "",
          OperateEndTime: "",
          OperateUser: "",
        },
        StartTime: "",
        EndTime: "",
      },
      date: [],
      tableData: [],
      tableSearch: [],
      activeName: "first",
      searchName: "",
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
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
      tableFirst:[],
      tableSecond:[],
      tableThird:[],
      MoveHistoryID:'',
    };
  },
  watch: {
    date(newdata) {
      if (newdata != null) {
        this.getText.SearchModel.OperateStartTime = newdata[0]
        this.getText.SearchModel.OperateEndTime = newdata[1]
      } else {
        this.getText.SearchModel.OperateStartTime = ''
        this.getText.SearchModel.OperateEndTime = ''
      }
    },
    activeName(value) {
      if (this.MoveHistoryID !== '') {
        this.getHistory(value)
      }
    }
  },
  created() {
    // this.getData();
  },
  mounted() {
    const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const format = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    this.date = [format(firstDay), format(lastDay)];
  this.getText.SearchModel.OperateStartTime = format(firstDay);
  this.getText.SearchModel.OperateEndTime = format(lastDay);
    this.$nextTick(() => {
      this.tableHeight = (window.innerHeight - 148 - 68 - 68 + 80 - 85) * 0.6;
      this.tableHeight1 = (window.innerHeight - 148 - 68 + 80 - 50 - 85) * 0.4;
    });
  },
  methods: {
    tableS(newdata) {
      let searchName = newdata.toLowerCase();
      this.currentPage = 1;
      return this.tableData.filter((v) => {
        if (
          String(v.PD_model).toLowerCase().indexOf(searchName) > -1 ||
          String(v.PN_Model).toLowerCase().indexOf(searchName) > -1
        ) {
          return true;
        } else {
          return false;
        }
      });
    },
    getData() {
      GetAssSpecMoveHistory(this.getText).then((res) => {
        if (res.data.Code == 200) {
          let data = res.data.Data;
          this.total = data.Total;
          this.tableData = data.list;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        console.log(this.tableData);
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
      this.getText.PageIndex = 0;
      this.getData();
    },
    handleSizeChange(value) {
      this.getText.PageSize = value;
      this.getData();
      // console.log(this.pageSize);
    },
    handleCurrentChange(value) {
      this.getText.PageIndex = value;
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
    getHistory(value) {
      this.startLoading();
      if (value == 'first') {
        GetAssSpecMaterialBind({MoveHistoryID:this.MoveHistoryID}).then((res) => {
        if (res.data.Code == 200) {
          this.tableFirst = res.data.Data;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        this.endLoading();
        })
      } else if(value == 'second') {
        GetAssSpecDataList({MoveHistoryID:this.MoveHistoryID}).then((res) => {
        if (res.data.Code == 200) {
          this.tableSecond = res.data.Data;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        this.endLoading();
        })
      } else if(value == 'third') {
        GetAssSpecNGList({MoveHistoryID:this.MoveHistoryID}).then((res) => {
        if (res.data.Code == 200) {
          this.tableThird = res.data.Data;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        this.endLoading();
        })
      }
    },
    handle(row, column, event) {
      console.log(row);
      this.MoveHistoryID = row.MoveHistoryID;
      this.getHistory(this.activeName)
    },
    handleSearch() {
      this.getText.PageIndex = 1;
      this.tableFirst = [];
      this.tableSecond = [];
      this.tableThird = [];
      this.getData();
    }
  },
};
</script>

<style lang="scss" scoped>
.inboundRecord {
  padding: 8px;
  .header {
    padding-bottom: 10px;
    display: flex;
    // gap: 30px;
    // justify-content: flex-end;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
  .box {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
  }
  //   .tableAuto.el-table .cell {
  //   white-space: nowrap;
  // }
}

.el-form-item {
  margin-bottom: 0;
}
</style>
