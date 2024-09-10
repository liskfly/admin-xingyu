<template>
  <div class="inboundRecord">
    <!-- <el-card class="box-card"> -->
    <div class="table_header">
      <div class="input_box">
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
      </div>
    </div>
    <div class="table_container">
      <el-table
        :data="tableData"
        :height="tableHeight"
        border
        stripe
        :size="innerHeight < 750 ? 'mini' : 'medium'"
        @row-click="handle"
        class="tableAuto"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <af-table-column prop="wo" label="工单号"> </af-table-column>

        <af-table-column prop="productid" label="产品编号"> </af-table-column>

        <af-table-column prop="wonum" label="工单数量"> </af-table-column>
        <af-table-column prop="goodnum" label="良品数量"> </af-table-column>
        <!-- <af-table-column prop="yibgok" label="已报良品" width="100">
        </af-table-column> -->
        <af-table-column prop="brokennum" label="不良品数量"> </af-table-column>
        <!-- <af-table-column prop="yibgno" label="已报不良品" width="100">
        </af-table-column> -->
        <af-table-column prop="updateuser" label="更新人"> </af-table-column>
        <!-- <af-table-column prop="bgstatus" label="报工状态" width="100">
          <template
            slot-scope="scope"
            v-if="scope.row.bgstatus !== '' && scope.row.bgstatus !== null"
          >
            <el-tag :type="scope.row.bgstatus == 1 ? 'info' : 'success'">{{
              scope.row.bgstatus == 1 ? "待报工" : "已完成"
            }}</el-tag>
          </template>
        </af-table-column> -->

        <!-- <span>{{ scope.row.Result == "PASS"? "良品" : "不良品" }}</span> -->
        <af-table-column prop="erpmsg" label="ERP回传信息"> </af-table-column>
        <!-- <el-table-column label="操作" fixed="right" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="mini"
              @click.stop="handleUpload(scope.$index, scope.row)"
              >上传工时</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click.stop="handleCreate(scope.$index, scope.row)"
              >ERP入库</el-button
            >
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="mini"
              @click.stop="handleUpload(scope.$index, scope.row)"
              >上传工时</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click.stop="handleCreate(scope.$index, scope.row)"
              >ERP入库</el-button
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
        :data="tableData2"
        :height="tableHeight1"
        border
        stripe
        :size="innerHeight < 750 ? 'mini' : 'medium'"
        @row-click="handle1"
        class="tableAuto"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <af-table-column prop="Wo" label="工单号"> </af-table-column>
        <af-table-column prop="Pn" label="产品编号"> </af-table-column>
        <af-table-column prop="Name" label="产品名称"> </af-table-column>
        <af-table-column prop="Rid" label="容器ID"> </af-table-column>
        <af-table-column prop="Qty" label="定容数量" width="100">
        </af-table-column>
        <af-table-column prop="PackQty" label="实际数量" width="100">
        </af-table-column>

        <af-table-column prop="BoxType" label="包装类型" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.BoxType == 1 ? 'info' : ''">{{
              scope.row.BoxType == 1 ? "零数箱" : "整数箱"
            }}</el-tag>
            <!-- <span>{{ scope.row.Result == "PASS"? "良品" : "不良品" }}</span> -->
          </template>
          <!-- <span>{{ scope.row.BoxType == 1 ? "零数箱" : "整数箱" }}</span> -->
        </af-table-column>
        <af-table-column prop="Result" label="结果" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Result == 'PASS' ? 'success' : 'danger'">{{
              scope.row.Result == "PASS" ? "良品" : "不良品"
            }}</el-tag>
            <!-- <span>{{ scope.row.Result == "PASS"? "良品" : "不良品" }}</span> -->
          </template>
        </af-table-column>

        <af-table-column prop="PackUser" label="操作员" width="100">
        </af-table-column>
        <af-table-column prop="PackTime" label="包装时间"> </af-table-column>
        <!-- <af-table-column prop="ErpReturnMsg" label="ERP回传信息">
        </af-table-column> -->
        <af-table-column prop="ErpgsTime" label="ERP工时上传时间">
        </af-table-column>
        <af-table-column prop="Erpgs" label="ERP工时回传消息">
          <template slot-scope="scope">
            <div>{{ scope.row.Erpgs == "200" ? "成功" : scope.row.Erpgs }}</div>
          </template>
        </af-table-column>
        <af-table-column prop="Erprk" label="ERP入库回传消息">
          <template slot-scope="scope">
            <div>{{ scope.row.Erprk == "200" ? "成功" : scope.row.Erprk }}</div>
          </template>
        </af-table-column>
        <af-table-column prop="ErprkTime" label="ERP入库上传时间">
        </af-table-column>
        <af-table-column prop="Erpuid" label="ERP上传Uid"> </af-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          background
          align="center"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :page-sizes="[5, 10, 20, 50, 100]"
          :current-page="currentPage2"
          :page-size="getRecordText.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total2"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="组装工单详细信息"
      :visible.sync="dialogTableVisible"
      width="60%"
    >
      <el-table
        :data="tableData1"
        max-height="300"
        border
        stripe
        class="tableAuto"
        style="width: 100%"
      >
        <af-table-column prop="Rid" label="容器ID"> </af-table-column>
        <af-table-column prop="PcbSn" label="PCBA板码"> </af-table-column>
        <af-table-column prop="CreUser" label="操作员"> </af-table-column>
        <af-table-column prop="CreTime" sortable label="时间">
        </af-table-column>
      </el-table>
    </el-dialog>

    <!-- </el-card> -->
  </div>
</template>

<script>
import {
  getIntactJobBooking,
  getPackPage,
  getPackBind,
  uploadWareHousing,
  uploadWorkingHours,
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
        SearchModel: {},
      },
      getRecordText: {
        PageIndex: 0,
        PageSize: 10,
        SearchText: "",
        SearchModel: "",
      },
      tableData: [],
      tableData2: [],
      currentPage: 1,
      currentPage2: 1,
      total: 0,
      total2: 0,
      tableHeight: 0,
      tableHeight1: 0,
      tableData1: [],
      innerHeight: window.innerHeight,
      dialogTableVisible: false,
    };
  },
  created() {
    this.getData();
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
      getIntactJobBooking(this.getText).then((res) => {
        if (res.data.Code == 200) {
          let data = res.data.Data;
          this.total = data.Total;
          this.tableData = data.list.sort((a, b) => {
            const dateA = new Date(a.updatetime);
            const dateB = new Date(b.updatetime);
            return dateA - dateB;
          });
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
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
      this.getText.pageIndex = value - 1;
      this.getData();
    },
    handleSizeChange1(value) {
      this.getRecordText.pageSize = value;
      getPackPage(this.getRecordText).then((res) => {
        if (res.data.Code == 200) {
          let data = JSON.parse(res.data.Data);
          this.total2 = data.Total;
          this.tableData2 = data.list;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
    },
    handleCurrentChange1(value) {
      this.getRecordText.pageIndex = value - 1;
      getPackPage(this.getRecordText).then((res) => {
        if (res.data.Code == 200) {
          let data = JSON.parse(res.data.Data);
          this.total2 = data.Total;
          this.tableData2 = data.list;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
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
    handleCreate(index, row) {
      this.startLoading();
      uploadWareHousing({
        Wo: row.wo,
        UpdateUser: getToken(),
        UpdateTime: getDateTo(),
      }).then((res) => {
        if (res.data.Code == 200) {
          this.getData();
          this.tableData2 = [];
          this.$message({
            type: "success",
            message: "上传成功!",
          });
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        this.endLoading();
        // console.log(this.tableData);
      });
    },
    handleUpload(index, row) {
      this.startLoading();
      // console.log(111);
      uploadWorkingHours({
        Wo: row.wo,
        UpdateUser: getToken(),
        UpdateTime: getDateTo(),
      }).then((res) => {
        if (res.data.Code == 200) {
          this.getData();
          this.tableData2 = [];
          this.$message({
            type: "success",
            message: "上传成功!",
          });
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        this.endLoading();
        // console.log(this.tableData);
      });
    },
    handle(row) {
      this.getRecordText.SearchText = row.wo;
      getPackPage(this.getRecordText).then((res) => {
        if (res.data.Code == 200) {
          let data = JSON.parse(res.data.Data);
          this.total2 = data.Total;
          this.tableData2 = data.list;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
    },
    handle1(row, column, event) {
      // console.log(row);
      let text = {
        Wo: row.Wo, //预留工单号
        Rid: row.Rid, //必填 外包装Rid
        Pn: row.Pn, //预留料号
        Reuslt: row.Reuslt, //预留结果
      };
      getPackBind(text).then((res) => {
        if (res.data.Code == 200) {
          this.dialogTableVisible = true;
          let data = JSON.parse(res.data.Data);
          //   this.total = data.Total;
          this.tableData1 = data;
        } else {
          this.$alert(res.data.Msg, "错误信息", {
            confirmButtonText: "确定",
          });
        }
        // console.log(this.tableData);
      });
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = (window.innerHeight - 190 - 68 - 68) * 0.6;
        this.tableHeight1 = (window.innerHeight - 190 - 68 - 68) * 0.4;
        //后面的50：根据需求空出的高度，自行调整
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
