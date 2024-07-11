<template>
  <div class="faultPhenomenon">
    <el-card>
      <div class="header1">
        <el-button type="primary" @click="dialogFormVisible = true"
          >增加</el-button
        >
        <div>
          <el-input
            placeholder="OE类型"
            v-model="searchiInput"
            class="input-with-select"
            style="width: 300px; margin-right: 20px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchData()"
            ></el-button>
          </el-input>
        </div>
      </div>

      <el-table
        border
        stripe
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :height="tableHeight"
      >
        <el-table-column prop="LevelType" label="OE类型"> </el-table-column>
        <el-table-column prop="Description" label="OE描述"> </el-table-column>
        <el-table-column prop="ModifyDate" label="时间">
          <template slot-scope="{ row }">
            <!-- <el-input
              v-if="isShow[$index]"
              v-model="row.ModifyDate"
              placeholder="请输入内容"
            ></el-input> -->
            <span>{{ getDate(row.ModifyDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Operator" label="操作员"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        align="center"
        background
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="添加故障信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="OE类型" prop="levelType">
          <el-input
            placeholder="请输入内容"
            v-model="form.levelType"
          ></el-input>
        </el-form-item>
        <el-form-item label="OE描述" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="insertData()"> 确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改故障信息" :visible.sync="dialogEditVisible">
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item label="OE类型" prop="levelType">
          <el-input
            placeholder="请输入内容"
            v-model="editForm.LevelType"
          ></el-input>
        </el-form-item>
        <el-form-item label="OE描述" prop="Description">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="editForm.Description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editSubmit()"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { XY_OEE_LevelType } from "@/api/all";
import { getDateTo } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      searchiInput: "",
      tableData: [],
      dialogFormVisible: false,
      dialogEditVisible: false,
      form: {
        levelType: "",
        description: "",
        dateTime: "",
        operator: getToken(),
        operationType: "I",
      },
      editForm: {
        levelType: "",
        description: "",
        dateTime: "",
        operator: getToken(),
        operationType: "U",
      },
      currentPage: 1,
      pageSize: 10,
      // total: 10,

      tableHeight: 0,
      rules: {
        levelType: [
          { required: true, message: "请输入OE类型", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入描述", trigger: "change" },
        ],
      },
    };
  },
  beforeMount() {},
  mounted() {
    this.dataInitialization();
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 310;
    });
  },
  methods: {
    searchData() {
      this.startLoading();
      XY_OEE_LevelType({
        levelType: this.searchiInput,
        operationType: "Q",
      }).then((res) => {
        if (res.data.Status === "OK") {
          this.tableData = res.data.DataList;
        } else if (res.data.Status === "NG") {
          this.tableData = [];
        }
        this.endLoading();
      });
    },
    addCancel() {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
    },
    insertData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.startLoading();
          this.form.dateTime = getDateTo();
          XY_OEE_LevelType(this.form).then((res) => {
            this.endLoading();
            if (res.data.Status === "OK") {
              this.dialogFormVisible = false;
              this.$message({
                type: "success",
                message: "添加成功!",
              });
              this.dataInitialization();
              this.$refs.form.resetFields();
            } else {
              this.$message({
                type: "error",
                message: "添加失败!",
              });
              this.$alert(res.data.Message, "错误信息", {
                confirmButtonText: "确定",
              });
            }
          });
        } else {
          // console.log(  this.dialogFormVisible);
          this.$message({
            type: "error",
            message: "添加失败!",
          });
        }
      });
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    dataInitialization() {
      this.startLoading();
      XY_OEE_LevelType({
        operationType: "QA",
      }).then((res) => {
        // console.log(res.data);
        if (res.data.Status === "OK") {
          this.tableData = res.data.DataList;

          this.tableData.sort((a, b) => {
            let aTime = new Date(a.ModifyDate);
            let bTime = new Date(b.ModifyDate);
            return bTime - aTime;
          });
        }
      });
      this.endLoading();
    },
    handleEdit(index, row) {
      this.editForm = {
        ...row,
        dateTime: getDateTo(),
        operationType: "U",
      };
      // console.log(this.editForm);
      this.dialogEditVisible = true;
    },
    editSubmit() {
      this.startLoading();
      XY_OEE_LevelType(this.editForm).then((res) => {
        if (res.data.Status === "OK") {
          this.dataInitialization();
          this.dialogEditVisible = false;
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        }
        this.endLoading();
      });
    },
    // handleUpdate(index, row) {
    //   this.startLoading();
    //   XY_OEE_LevelType({
    //     ...row,
    //     dateTime: this.getDate(row.ModifyDate),
    //     operationType: "U",
    //   }).then((res) => {
    //     if (res.data.Status === "OK") {
    //       this.$set(this.isShow, index, false);
    //     }
    //     this.endLoading();
    //   });
    // },
    handleDelete(index, row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.startLoading();
          XY_OEE_LevelType({
            ...row,
            operationType: "D",
          }).then((res) => {
            if (res.data.Status === "OK") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.dataInitialization();
              this.endLoading();
            } else {
              this.$alert(res.data.Message, "错误信息", {
                confirmButtonText: "确定",
              });
            }
            this.endLoading();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getDate(timestamp) {
      let getTime = new Date(timestamp);
      let year = getTime.getFullYear();
      let month = getTime.getMonth() + 1;
      let date = getTime.getDate();
      let hours = getTime.getHours();
      let min = getTime.getMinutes();
      let second = getTime.getSeconds();
      hours = hours < 10 ? "0" + hours : hours;
      min = min < 10 ? "0" + min : min;
      second = second < 10 ? "0" + second : second;
      let todayTime = year + "-" + month + "-" + date;
      let todayHours = hours + ":" + min + ":" + second;
      return todayTime + " " + todayHours;
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
  },
};
</script>

<style lang="scss" scoped>
.faultPhenomenon {
  padding: 20px;
  .header1 {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  // .input {
  //   width: 200px;
  //   margin-right: 10px;
  // }
}

// .popul-item {
//   margin-bottom: 20px;
// }
</style>
