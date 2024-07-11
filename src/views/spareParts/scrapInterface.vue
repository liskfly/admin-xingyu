<template>
  <div class="type">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div class="table_header">
        <div>
          <el-button type="primary" @click="addOpen">添加</el-button>
          <el-button type="primary" @click="getAll">全部</el-button>
          <el-button
            type="primary"
            v-show="!searchType"
            @click="searchType = !searchType"
            >日期搜索</el-button
          >
          <el-button
            type="primary"
            v-show="searchType"
            @click="searchType = !searchType"
            >名称搜索</el-button
          >
        </div>
        <div class="input_box">
          <el-date-picker
            v-show="searchType"
            v-model="choiceTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="getTimeData()"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-input
            v-show="!searchType"
            placeholder="请输入内容"
            clearable
            v-model="searchText"
            class="input-with-select"
          >
            <!-- @change="getSearchData" -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getSearchData()"
            ></el-button>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          border
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column prop="Spare_Name" label="名称"> </el-table-column>
          <el-table-column prop="Spare_Model" label="型号"></el-table-column>
          <el-table-column prop="Spare_Quantity" label="数量">
          </el-table-column>
          <el-table-column prop="Spare_DateTime" label="报废时间">
          </el-table-column>
          <el-table-column prop="Spare_Devcie" label="报废设备">
          </el-table-column>
          <el-table-column prop="Spare_User" label="保废人"> </el-table-column>
          <el-table-column prop="create_uid" label="创建人"></el-table-column>
          <el-table-column prop="create_time" label="创建时间">
          </el-table-column>
          <!-- <el-table-column label="再用/弃用">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">在用</span>
              <span v-else>废弃</span>
            </template>
          </el-table-column> -->
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>

              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    </el-card>
    <el-dialog :title="titleType" :visible.sync="dialogVisible">
      <el-form :model="addForm" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="名称" prop="Spare_Name">
          <el-input v-model="addForm.Spare_Name"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="Spare_Model">
          <el-input v-model="addForm.Spare_Model"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="Spare_Quantity">
          <el-input
            type="number"
            v-model.number="addForm.Spare_Quantity"
          ></el-input>
        </el-form-item>
        <el-form-item label="报废时间" prop="Spare_DateTime">
          <el-date-picker
            v-model="addForm.Spare_DateTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
          <!-- <el-input v-model="addForm.Spare_DateTime"></el-input> -->
        </el-form-item>
        <el-form-item label="报废设备" prop="Spare_Devcie">
          <el-input v-model="addForm.Spare_Devcie"></el-input>
        </el-form-item>
        <el-form-item label="保废人" prop="Spare_User">
          <el-input v-model="addForm.Spare_User"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
          <el-radio v-model="addForm.status" :label="0">在用</el-radio>
          <el-radio v-model="addForm.status" :label="1">废弃</el-radio>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="titleType" :visible.sync="changeShow">
      <el-form :model="changeForm" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="名称" prop="Spare_Name">
          <el-input v-model="changeForm.Spare_Name"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="Spare_Model">
          <el-input v-model="changeForm.Spare_Model"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="Spare_Quantity">
          <el-input
            type="number"
            v-model.number="changeForm.Spare_Quantity"
          ></el-input>
        </el-form-item>
        <el-form-item label="报废时间" prop="Spare_DateTime">
          <el-date-picker
            v-model="changeForm.Spare_DateTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
          <!-- <el-input v-model="addForm.Spare_DateTime"></el-input> -->
        </el-form-item>
        <el-form-item label="报废设备" prop="Spare_Devcie">
          <el-input v-model="changeForm.Spare_Devcie"></el-input>
        </el-form-item>
        <el-form-item label="保废人" prop="Spare_User">
          <el-input v-model="changeForm.Spare_User"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
          <el-radio v-model="changeForm.status" :label="0">在用</el-radio>
          <el-radio v-model="changeForm.status" :label="1">废弃</el-radio>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeCancel()">取 消</el-button>
        <el-button type="primary" @click="changeSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetScrapPage, DeleteScrap, UPdateScrap, SavaScrap } from "@/api/spApi";
import { getDateTo } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      searchText: "",
      addForm: {
        Spare_Name: "",
        Spare_Model: "",
        Spare_Quantity: 0,
        Spare_DateTime: "",
        Spare_Devcie: "",
        Spare_User: "",
        status: 0,
      },
      changeForm: {
        Spare_Name: "",
        Spare_Model: "",
        Spare_Quantity: 0,
        Spare_DateTime: "",
        Spare_Devcie: "",
        Spare_User: "",
        status: 0,
      },
      tableHeight: 0,
      getText: {
        PageIndex: 1,
        PageSize: 20,
        SearchText: "",
      },
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      dialogVisible: false,
      changeShow: false,
      titleType: "",
      rules: {
        toolsMold: [
          { required: true, message: "请输入治具类型", trigger: "change" },
        ],
      },
      searchType: false,
      choiceTime: [],
      //  loading: false
    };
  },
  created() {
    // this.getData();
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    this.getAll();
    window.addEventListener("resize", this.getScreenHeight);
    // this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      this.startLoading();
      GetScrapPage(this.getText).then(({ data }) => {
        this.tableData = data.Data.list;
        this.endLoading();
        // console.log(res.data.DataList);
        // if (
        //   this.tableData.length % this.pageSize == 0 &&
        //   this.currentPage > 1
        // ) {
        //   this.currentPage--;
        // }
      });
    },
    getTimeData() {
      this.startLoading();
      GetScrapPage({
        PageIndex: 1,
        PageSize: 100000,
        SearchText: "",
        SearchModel: {},
        StartTime: this.choiceTime[0] + " 00:00:00",
        EndTime: this.choiceTime[1] + " 23:59:59",
      })
        .then(({ data }) => {
          if (data.Success) {
            if (data.Data.list.length === 0) {
              this.$message("搜索范围内暂无数据");
              this.tableData = data.Data.list;
            } else {
              this.tableData = data.Data.list;
            }
          } else {
            this.$message.error(data.Msg);
          }
          this.endLoading();
        })
        .catch(() => {
          this.$message.error("网络请求失败");
        });
    },
    addOpen() {
      //   this.addForm.operationType = "I";
      this.titleType = "添加";
      this.dialogVisible = true;
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    getAll() {
      this.startLoading();
      GetScrapPage({
        PageIndex: 1,
        PageSize: 100000,
        SearchText: "",
        SearchModel: {},
      })
        .then(({ data }) => {
          if (data.Success) {
            if (data.Data.list.length === 0) {
              this.$message("搜索范围内暂无数据");
              this.tableData = data.Data.list;
            } else {
              this.tableData = data.Data.list;
            }
          } else {
            this.$message.error(data.Msg);
          }
          this.endLoading();
          // console.log(res.data.DataList);
          // if (
          //   this.tableData.length % this.pageSize == 0 &&
          //   this.currentPage > 1
          // ) {
          //   this.currentPage--;
          // }
        })
        .catch(() => {
          this.$message.error("网络请求失败");
        });
    },
    changeCancel() {
      this.changeShow = false;
      this.$refs.form.resetFields();
    },
    addSubmit() {
      SavaScrap([
        { ...this.addForm, create_time: getDateTo(), create_uid: getToken() },
      ]).then(({ data }) => {
        if (data.Msg === "数据保存成功") {
          this.getData();
          this.$message({
            type: "success",
            message: `${this.titleType}成功!`,
          });
          this.dialogVisible = false;
          this.clearAdd();
        }
      });
      // moldControl(this.addForm).then(({ data }) => {
      //   // console.log(data.Status);
      //   this.dialogVisible = false;
      //   if (data.Status == "OK") {
      //     this.getData();
      //     this.$message({
      //       type: "success",
      //       message: `${this.titleType}成功!`,
      //     });
      //     this.$refs.form.resetFields();
      //   } else {
      //     this.$message({
      //       type: "error",
      //       message: `${this.titleType}失败!`,
      //     });
      //     this.$alert(data.Message, "错误信息", {
      //       confirmButtonText: "确定",
      //     });
      //   }
      // });
    },
    clearAdd() {
      this.addForm.Spare_Name = "";
      this.addForm.Spare_Model = "";
      this.addForm.Spare_Quantity = 0;
      this.addForm.Spare_DateTime = "";
      this.addForm.Spare_Devcie = "";
      this.addForm.Spare_User = "";
      this.addForm.status = 0;
    },
    handleEdit(index, row) {
      //   this.addForm.operationType = "U";
      this.titleType = "修改";
      this.changeForm.Spare_Name = row.Spare_Name;
      this.changeForm.Spare_Model = row.Spare_Model;
      this.changeForm.Spare_Quantity = row.Spare_Quantity;
      this.changeForm.Spare_DateTime = row.Spare_DateTime;
      this.changeForm.Spare_Devcie = row.Spare_Devcie;
      this.changeForm.Spare_User = row.Spare_User;
      this.changeForm.status = row.status;
      this.changeForm.create_time = row.create_time;
      this.changeForm.create_uid = row.create_uid;
      this.changeForm.uid = row.uid;
      this.changeShow = true;
    },
    handleDelete(index, row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteScrap([
            {
              uid: row.uid,
            },
          ]).then(({ data }) => {
            if (data.Msg == "数据删除成功") {
              //  this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
              this.getData();
              this.$message({
                type: "success",
                message: `删除成功!`,
              });
            } else {
              this.$alert(data.Message, "错误信息", {
                confirmButtonText: "确定",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getSearchData() {
      // if (this.searchText == "") {
      //   this.getText.toolsMold = "*";
      // } else {
      this.getText.SearchText = this.searchText;
      // }
      this.getData();
    },
    changeSubmit() {
      UPdateScrap([this.changeForm]).then(({ data }) => {
        this.changeShow = false;
        this.getData();
        this.$message({
          type: "success",
          message: `${this.titleType}成功!`,
        });
      });
    },
    handleSizeChange(value) {
      this.pageSize = value;
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
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
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 300;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.type {
  padding: 20px;
  .initBox {
    width: 500px;
  }
  .table_header {
    padding-bottom: 20px;
    display: flex;
    gap: 30px;
    justify-content: space-between;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
