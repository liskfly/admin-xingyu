<template>
  <div class="inboundRecord">
    <!-- <el-card class="box-card"> -->
    <div>
      <el-form ref="form" class="form" :inline="true" :model="getText">
        <el-form-item>
          <el-input
            placeholder="请输入产品编号"
            clearable
            v-model="getText.SearchModel.ProjectName"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="请输入单号"
            clearable
            v-model="getText.SearchModel.OrderNo"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="getText.SearchModel.CreateTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getData()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        :data="tableData"
        :height="tableHeight"
        border
        stripe
        class="tableAuto"
        style="width: 100%"
      >
        <el-table-column prop="ProjectName" label="产品编号"> </el-table-column>
        <el-table-column prop="OrderNo" label="工单号"> </el-table-column>
        <el-table-column prop="LineName" label="产线"> </el-table-column>
        <el-table-column prop="CreateUid" label="创建人"> </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              plain
              type="primary"
              size="mini"
              @click.stop="handle(scope.$index, scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column  label="操作">
             
             <template slot-scope="scope">
            <el-button
                plain
                type="primary"
                size="mini"
                icon="el-icon-lock"
                @click.stop="handle(scope.$index, scope.row)"
              ></el-button>
              </el-table-column> -->
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
    <el-dialog
      title="首件详细信息"
      :visible.sync="dialogTableVisible"
      width="80%"
    >
      <el-table
        :data="tableData1"
        max-height="400"
        border
        stripe
        class="tableAuto"
        style="width: 100%"
      >
        <af-table-column prop="ParentId" label="工单号"> </af-table-column>
        <af-table-column prop="MaterialCode" label="物料编码">
        </af-table-column>
        <af-table-column prop="MaterialName" label="物料名称">
        </af-table-column>
        <af-table-column prop="PositionNo" label="位号"> </af-table-column>
        <el-table-column prop="CreateUid" label="创建人"> </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间"> </el-table-column>
        <af-table-column prop="FailReason" label="结果"> </af-table-column>
        <af-table-column prop="MixImage" label="图片">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.MixImage"
              :preview-src-list="[scope.row.MixImage]"
            ></el-image>
          </template>
        </af-table-column>
        <!-- <af-table-column prop="CreUser" label="操作员"> </af-table-column>
        <af-table-column prop="CreTime" sortable label="时间">
        </af-table-column> -->
      </el-table>
    </el-dialog>
    <!-- </el-card> -->
  </div>
</template>

<script>
import { getFirstInspectionPage, getReportData } from "@/api/wmsApi";
export default {
  data() {
    return {
      dialogTableVisible: false,
      getText: {
        pageIndex: 0,
        pageSize: 10,
        searchText: "",
        SearchModel: {
          ProjectName: "",
          OrderNo: "",
          CreateTime: "",
        },
      },
      tableData: [],
      currentPage: 1,
      total: 0,
      tableHeight: 0,
      tableHeight1: 0,
      tableData1: [],
    };
  },
  //   created() {
  //     this.getData();
  //   },
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
      this.startLoading();
      getFirstInspectionPage(this.getText).then((res) => {
        if (res.data.Code == 200) {
          this.endLoading();
          let data = res.data.Data;
          this.total = data.Total;
          this.tableData = data.list;
          //   console.log(data);
        } else {
          this.$alert(res.data.Msg, "提示信息", {
            confirmButtonText: "确定",
          });
        }
        this.endLoading();
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
    handle(index, row) {
      //   console.log(row);
      let text = {
        OrderNo: row.OrderNo,
      };
      this.startLoading();
      getReportData(text)
        .then((res) => {
          if (res.data.Code == 200) {
            // console.log(res);
            let data = res.data.Data;
            //   this.total = data.Total;
            this.tableData1 = data.Details;
            this.endLoading();
            this.dialogTableVisible = true;
          } else {
            this.endLoading();
            this.$alert(res.data.Msg, "提示信息", {
              confirmButtonText: "确定",
            });
          }
          // console.log(this.tableData);
        })
        .catch((error) => {
          this.endLoading();
          this.$alert(error, "提示信息", {
            confirmButtonText: "确定",
          });
        });
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 260;
        this.tableHeight1 = window.innerHeight - this.tableHeight - 300;
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
    // padding-bottom: 20px;
    // display: flex;
    // // gap: 30px;
    // justify-content: flex-end;
    // align-items: center;
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
