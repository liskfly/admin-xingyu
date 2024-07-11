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
        @row-click="handle"
        class="tableAuto"
        style="width: 100%"
      >
       <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="Wo" label="工单号"> </el-table-column>
       
        <el-table-column prop="Pn" label="产品编号"> </el-table-column>
       
        <el-table-column prop="Qty" label="工单数量" width="100">
        </el-table-column>
        <el-table-column prop="Qty" label="已报数量" width="100">
        </el-table-column>
         <el-table-column prop="Qty" label="良品数量" width="100">
        </el-table-column>
       <el-table-column prop="Qty" label="已报良品" width="100">
        </el-table-column>
        <el-table-column prop="Qty" label="不良品数量" width="100">
        </el-table-column>
         <el-table-column prop="Qty" label="已报不良品" width="100">
        </el-table-column>
        <el-table-column prop="PackUser" label="更新人" width="100">
        </el-table-column>
          <el-table-column prop="PackUser" label="报工状态" width="100">
        </el-table-column>
        <el-table-column prop="PackUser" label="ERP回传信息" width="100">
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
   
    <!-- </el-card> -->
  </div>
</template>

<script>
import { getPackPage, getPackBind } from "@/api/wmsApi";
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
     
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      // console.log( window.innerHeight);
      // let fold = Math.ceil(window.innerHeight / 750);
      //   console.log(fold);
      this.tableHeight = window.innerHeight - 260;
      //后面的50：根据需求空出的高度，自行调整
    });
    this.$nextTick(() => {
      // console.log( window.innerHeight);
      this.tableHeight1 = window.innerHeight - this.tableHeight - 300;

      //后面的50：根据需求空出的高度，自行调整
    });
  },
  methods: {
    getData() {
      getPackPage(this.getText).then((res) => {
        if (res.data.Code == 200) {
          let data = JSON.parse(res.data.Data);
          this.total = data.Total;
          this.tableData = data.list;
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
    handle(row, column, event) {
      console.log(row);
      let text = {
        Wo: row.Wo, //预留工单号
        Rid: row.Rid, //必填 外包装Rid
        Pn: row.Pn, //预留料号
        Reuslt: row.Reuslt, //预留结果
      };
      getPackBind(text).then((res) => {
        if (res.data.Code == 200) {
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
