<template>
  <div class="issue">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <div class="form_Bottom">
            <el-button type="primary" @click="onSubmit">查询全部工单</el-button>
            <div>
              <el-input v-model="searchName" clearable placeholder="请输入" @keyup.enter.native="searchData()">
                <template slot="append">
                  <el-button type="primary" icon="el-icon-search" @click="searchData()"></el-button>
                </template>
              </el-input>
            </div>
        </div>
      </div>

      <div class="table_container">
        <el-table
          :data="
            tableData1.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          border
          :height="tableHeight"
          style="width: 100%"
          size="medium"
        >
          <af-table-column prop="WO" label="治具发料单"> </af-table-column>
          <af-table-column prop="PD_model" label="料号"> </af-table-column>

          <af-table-column prop="Plan_qty" label="数量" align="center">
          </af-table-column>
          <el-table-column prop="erp_wo_type" label="类型" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.erp_wo_type == 'D' ? '' : 'warning'">
                {{ scope.row.erp_wo_type == "D" ? "SMT治具" : "组装治具" }}
              </el-tag>
              <!-- <span>{{ scope.row.Stts == 4 ? "已发料" : "已上架" }}</span> -->
            </template>
          </el-table-column>
          <af-table-column prop="Crt_dt" label="创建时间"> </af-table-column>
          <af-table-column prop="Plan_dt" label="计划时间"> </af-table-column>
        </el-table>
      </div>

      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData1.length"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { orderControl } from "@/api/all";
export default {
  data() {
    return {
      getDataText: {
        toolsOrder: "*",
        startTime: "",
        endTime: "",
        status: 0,
        operationType: "A",
      },
      tableHeight: 0,
      value1: [],
      typeList: [
        {
          value: "A",
          lable: "查询所有",
        },
        {
          value: "D",
          lable: "时间查询",
        },
        {
          value: "T",
          lable: "工单查询",
        },

        {
          value: "S",
          lable: "状态查询",
        },
      ],
      statusList: [
        {
          value: 0,
          lable: "录入",
        },
        {
          value: 1,
          lable: "已上架",
        },
        {
          value: 2,
          lable: "已绑定",
        },
        {
          value: 3,
          lable: "已发料",
        },
      ],
      tableData: [],
      tableData1: [],
      searchName: "",
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
    };
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    this.onSubmit();
    window.addEventListener("resize", this.getScreenHeight);
    // this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  watch: {
    value1(value) {
      this.getDataText.startTime = value[0];
      this.getDataText.endTime = value[1];
      // console.log(this.getDataText);
    },
    "getDataText.operationType"(value) {
      this.value = [];
      if (value != "T") {
        this.getDataText.toolsOrder = "*";
      } else {
        this.getDataText.toolsOrder = "";
      }
    },
    searchName(newdata) {
      if (newdata == "") {
        this.tableData1 = this.tableData;
      } else {
        this.tableData1 = this.table1(newdata);
      }
    },
  },
  methods: {
    onSubmit() {
      orderControl(this.getDataText).then((res) => {
        // console.log(res.data.DataList);
        this.tableData = res.data.DataList;
        this.tableData1 = this.tableData;
      });
    },
    handleSizeChange(value) {
      this.pageSize = value;
      // console.log(this.pageSize);
    },
    searchData() {
      if (this.searchName == "") {
        this.tableData1 = this.tableData;
      } else {
        this.tableData1 = this.table1(this.searchName);
      }
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 225;
        // this.tableHeight1 =
      });
    },
    table1(newdata) {
      let searchName = newdata.toLowerCase();
      this.currentPage = 1;
      return this.tableData.filter((v) => {
        if(String(v.Issue_id).toLowerCase().indexOf(searchName) > -1 || String(v.PD_model).toLowerCase().indexOf(searchName) > -1) {
          return true;
        }else {
          return false;
        }
      });
    },
    tagType(data) {
      let text = "";
      switch (data) {
        case 0:
          text = "info";
          break;
        case 1:
          text = "success";
          break;
        case 2:
          text = "";

          break;
        case 3:
          text = "info";

          break;
        case 4:
          text = "warning";

          break;
        default:
          break;
      }
      return text;
    },
    tagText(data) {
      let text = "";
      switch (data) {
        case 0:
          text = "已录入";
          break;
        case 1:
          text = "";
          break;
        case 2:
          text = "已上架";

          break;
        case 3:
          text = "已绑定";

          break;
        case 4:
          text = "已发料";

          break;
        default:
          break;
      }
      return text;
    },
  },
};
</script>

<style lang="scss" scoped>
.issue {
  width: 100%;
  padding: 8px;
  .table_header {
    // padding-bottom: 20px;
    .form {
      // display: flex;
      // justify-content: space-between;
    }
    // display: flex;
    // gap: 30px;
    // justify-content: flex-end;
    // align-items: center;
    .input_box {
      width: 400px;
    }
  }
  .form_Bottom {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
