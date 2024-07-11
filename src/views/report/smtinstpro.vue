<template>
  <div class="smtinstpro">
    <div >
      <el-form ref="form" class="form" :inline="true" :model="getDataText">
        <el-form-item>
          <el-select v-model="getDataText.operationType" placeholder="查询类型">
            <el-option
              v-for="item in selectType"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="
            getDataText.operationType == 'W' ||
            getDataText.operationType == 'WD' ||
            getDataText.operationType == 'WLD'
          "
        >
          <el-input
            placeholder="请输入单号"
            clearable
            style="width: 400px"
            v-model="getDataText.workOrder"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item v-show="getDataText.operationType != 'W'">
          <el-input
            placeholder="请输入seiralNumber"
            clearable
            style="width: 400px"
            v-model="getDataText.seiralNumber"
            class="input-with-select"
            @change="getData()"
          >
          </el-input>
        </el-form-item> -->
        <el-form-item
          v-show="
            getDataText.operationType == 'D' ||
            getDataText.operationType == 'WD' ||
            getDataText.operationType == 'WLD' ||
            getDataText.operationType == 'LD'
          "
        >
          <el-date-picker
            v-model="value1"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          v-show="
            getDataText.operationType == 'LD' ||
            getDataText.operationType == 'WLD'
          "
        >
          <el-select v-model="getDataText.lineNumber" placeholder="查询线体">
            <el-option
              v-for="item in lineType"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :height="tableHeight"
        :header-cell-style="heardStyle"
        border
        stripe
      >
        <af-table-column
          align="center"
          prop="OrderName"
          label="工单"
        ></af-table-column>
        <el-table-column align="center" prop="Laser-Bot" label="Laser-Bot">
        </el-table-column>
        <el-table-column align="center" prop="SPI-Top" label="SPI-Top">
        </el-table-column>
        <el-table-column align="center" prop="SPI-Bot" label="SPI-Bot">
        </el-table-column>
          <el-table-column align="center" prop="NPM-Top" label="NPM-Bot">
        </el-table-column>
        <el-table-column align="center" prop="NPM-Bot" label="NPM-Bot">
        </el-table-column>
        <el-table-column align="center" prop="DEK-Bot" label="DEK-Bot">
        </el-table-column>
        <el-table-column align="center" prop="AOI-1-Bot" label="AOI-1-Bot">
        </el-table-column>
        <el-table-column align="center" prop="AOI-1-Top" label="AOI-1-Top">
        </el-table-column>
        <el-table-column align="center" prop="Reflow-Bot" label="Reflow-Bot">
        </el-table-column>
        <el-table-column align="center" prop="Reflow-Top" label="Reflow-Top">
        </el-table-column>
        <el-table-column align="center" prop="AOI-2-Bot" label="AOI-2-Bot">
        </el-table-column>
        <el-table-column align="center" prop="AOI-2-Top" label="AOI-2-Top">
        </el-table-column>
          <el-table-column align="center" prop="ICT-Bot" label="ICT-Top">
        </el-table-column>
        <el-table-column align="center" prop="ICT-Top" label="ICT-Top">
        </el-table-column>
        <!-- <el-table-column prop="Name" label="T-炉后AOI"> </el-table-column>
        <el-table-column prop="order" label="DIP"> </el-table-column> -->
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { XY_PCBAHisQTYControl } from "@/api/all";
export default {
  data() {
    return {
      heardStyle: {
        background: "rgb(102, 146, 217)",
        color: "#ffffff",
      },
      getDataText: {
        workOrder: "",
        startDateTime: "",
        endDateTime: "",
        lineNumber: 0,
        fixedint: 0,
        operationType: "W",
      },
      selectType: [
        {
          lable: "工单号",
          value: "W",
        },
        {
          lable: "时间",
          value: "D",
        },
        {
          lable: "实时查询",
          value: "F",
        },
        {
          lable: "时间线体",
          value: "LD",
        },
        {
          lable: "工单时间",
          value: "WD",
        },
        {
          lable: "工单线体时间",
          value: "WLD",
        },
      ],
      lineType: [
        {
          lable: "Line1",
          value: 1,
        },
        {
          lable: "Line2",
          value: 2,
        },
        {
          lable: "Line3",
          value: 3,
        },
      ],
      tableHeight: 0,
      value1: [],
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
    };
  },
  watch: {
    value1(value) {
      this.getDataText.startDateTime = value[0];
      this.getDataText.endDateTime = value[1];
    },
    "getDataText.operationType"(newValue, oldValue) {
      if (newValue !== oldValue) {
        // console.log(newValue, oldValue);
        this.getDataText.workOrder = "";
        this, (this.value1 = []);
        this.getDataText.lineNumber = 0;
        this.getDataText.fixedint = 0;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 260;
    });
  },
  methods: {
    getData() {
      this.startLoading();
      XY_PCBAHisQTYControl(this.getDataText).then(({ data }) => {
        if (data.Status == "OK") {
          this.dataProse(data.DataList);
        } else {
          this.endLoading();
          this.$alert(data.Message, "错误信息", {
            confirmButtonText: "确定",
          });
        }
      });
    },
    dataProse(data) {
      let arr = [];
      data.forEach((item) => {
        const index = arr.findIndex((wo) => wo.OrderName == item.OrderName);
        if (index > -1) {
          arr[index][item.OperationName] = item.sns;
        } else {
          arr.push({
            OrderName: item.OrderName,
            [item.OperationName]: item.sns,
          });
        }
      });
      // console.log(arr);
      arr.sort((a, b) => {
        let aTime = a.OrderName.match(/\d+/g);
        let bTime = b.OrderName.match(/\d+/g);
        return aTime - bTime;
      });
      // console.log(arr);
      this.tableData = arr;
      this.endLoading();
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
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
}
</style>
