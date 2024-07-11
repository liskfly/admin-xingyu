<template>
  <div class="parametEnable">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <el-form :model="form" ref="form" :inline="true" size="normal">
        <el-form-item label="产品">
          <el-select
            v-model="form.productName"
            filterable
            placeholder="点击选择"
          >
            <el-option
              v-for="item in itemList"
              :key="item.PartNumber"
              :label="item.PartNumber"
              :value="item.PartNumber"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="正反面">
          <el-select
            v-model="form.side"
            filterable
            placeholder="点击选择"
          >
            <el-option
              v-for="item in pon"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" label-width="50px">
          <el-input
            type="number"
            v-model="form.cycleTime"
            placeholder="输入时间"
          ></el-input>
        </el-form-item>
        <el-form-item class="item">
          <el-button type="primary" @click="addData">添加</el-button>
          <el-button type="primary" @click="getNowData">查询当前状态</el-button>
          <el-button type="primary" @click="getHistoryData"
            >查询历史状态</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :height="tableHeight"
        border
        stripe
      >
        <el-table-column prop="ProductName" label="产品"> </el-table-column>
        <el-table-column prop="CycleTime" label="周期时间"> </el-table-column>
        <el-table-column prop="Side" label="正反面" :filters="[{text:'Top',value:'Top'},{text:'Bot',value:'Bot'}]" :filter-method="filterMethod"> </el-table-column>
        <el-table-column prop="UserName" label="操作人"> </el-table-column>
        <el-table-column prop="UpdateTime" label="操作时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              v-show="delectShow"
              @click="handleChange(scope.$index, scope.row)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              v-show="delectShow"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          background
          align="center"
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
    </el-card>
    <el-dialog :title="'修改'" :visible.sync="dialogVisible">
      <el-form :model="changeForm" ref="form" label-width="80px">
        <el-form-item label="产品" prop="productName">
          <el-input v-model="changeForm.productName"></el-input>
        </el-form-item>
        <el-form-item label="正反面">
          <el-select
            v-model="changeForm.side"
            filterable
            placeholder="点击选择"
          >
            <el-option
              v-for="item in pon"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周期" prop="cycleTime">
          <el-input type="number" v-model="changeForm.cycleTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeCancel()">取 消</el-button>
        <el-button type="primary" @click="changeData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { XYL_OEE_ProductCycle } from "@/api/all";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, // 当前页码
      //   total: 0, // 总条数
      pageSize: 10, // 每
      tableHeight: 0,
      form: {
        userName: getToken(),
        productName: "",
        cycleTime: 0,
        side:''
      },
      itemList: [],
      dialogVisible: false,
      delectShow: false,
      changeForm: {
        userName: getToken(),
        productName: "",
        cycleTime: 0,
        side:''
      },
      loading: null,
      pon:[
        {value:'Top'},
        {value:'Bot'}
      ],
      test:''
    };
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getAll();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    getAll() {
      this.startLoading();
      XYL_OEE_ProductCycle({ operationType: "QA" })
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.$message({
              message: "初始数据查询成功",
              type: "success",
            });
            this.itemList = data.DataList;
          } else {
            this.$message(data.Message);
          }
          this.endLoading();
        })
        .catch((res) => {
          this.$message(res);
          this.endLoading();
        });
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 290;

        //后面的50：根据需求空出的高度，自行调整
      });
    },
    addData() {
      if (this.form.userName === '' ||
      this.form.cycleTime === 0 ||
      this.form.side === '') {
        return;
      }
      XYL_OEE_ProductCycle({ ...this.form, operationType: "I" })
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.$message("增加成功");
            this.getNowData();
          } else {
            this.$message(data.Message);
          }
        })
        .catch((res) => {
          this.$message(res);
        });
    },
    changeData(index, row) {
      XYL_OEE_ProductCycle({ ...this.changeForm, operationType: "U" })
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.$message("修改成功");
            this.dialogVisible = !this.dialogVisible;
            this.getNowData()
          } else {
            this.$message(data.Message);
          }
        })
        .catch((res) => {
          this.$message(res);
        });
    },
    getNowData() {
      XYL_OEE_ProductCycle({ ...this.form, operationType: "Q" })
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.delectShow = true;
            this.currentPage = 1;
            this.tableData = data.DataList;
          } else {
            this.$message(data.Message);
            this.tableData = [];
          }
        })
        .catch((res) => {
          this.$message(res);
        });
    },
    getHistoryData() {
      if (this.form.productName === '') {
        return;
      }
      this.delectShow = false;
      XYL_OEE_ProductCycle({ ...this.form, operationType: "QH" })
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.currentPage = 1;
            this.tableData = data.DataList;
          } else {
            this.$message(data.Message);
            this.tableData = [];
          }
        })
        .catch((res) => {
          this.$message(res);
        });
    },
    handleChange(index, row) {
      this.dialogVisible = true;
      this.changeForm = {
        userName: getToken(),
        productName: row.ProductName,
        cycleTime: row.CycleTime,
      };
    },
    handleDelete(index, row) {
      XYL_OEE_ProductCycle({ ...row, operationType: "D" })
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.$message("删除成功");
            if (this.delectShow) {
              this.getNowData();
            } else {
              this.getHistoryData();
            }
          } else {
            this.$message(data.Message);
          }
        })
        .catch((res) => {
          this.$message(res);
        });
    },
    changeCancel() {
      this.dialogVisible = false;
    },
    change2() {},
    startLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "加载中~",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.2)", //调节透明度
      });
    },
    endLoading() {
      if (this.loading) {
        this.loading.close();
      }
    },
    filterMethod(value,row) {
      return row.Side === value
    }
  },
};
</script>

<style lang="scss" scoped>
.parametEnable {
  padding: 10px;
}
</style>
