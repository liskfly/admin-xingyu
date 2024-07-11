<template>
  <div class="type">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div class="table_header">
        <div>
          <el-button type="primary" @click="addOpen">添加</el-button>
          <el-button type="primary" @click="getAll">全部</el-button>
        </div>
        <div class="input_box">
          <el-input
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
          <el-table-column prop="Supplier_Code" label="编码"> </el-table-column>
          <el-table-column prop="Supplier_Name" label="名称"></el-table-column>
          <el-table-column prop="Supplier_DeviceName" label="设备名称">
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间">
          </el-table-column>
          <el-table-column prop="create_uid" label="创建者"> </el-table-column>
          <el-table-column label="再用/弃用">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">再用</span>
              <span v-else>废弃</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="UpdateTime" label="创建时间">
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
        <el-form-item label="编码" prop="Supplier_Code">
          <el-input v-model="addForm.Supplier_Code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="Supplier_Name">
          <el-input v-model="addForm.Supplier_Name"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="Supplier_DeviceName">
          <el-input v-model="addForm.Supplier_DeviceName"></el-input>
        </el-form-item>
        <el-form-item label="再用/弃用" prop="status">
          <el-radio v-model="addForm.status" :label="0">在用</el-radio>
          <el-radio v-model="addForm.status" :label="1">废弃</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="titleType" :visible.sync="changeShow">
      <el-form :model="changeForm" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="编码" prop="Supplier_Code">
          <el-input v-model="changeForm.Supplier_Code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="Supplier_Name">
          <el-input v-model="changeForm.Supplier_Name"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="Supplier_DeviceName">
          <el-input v-model="changeForm.Supplier_DeviceName"></el-input>
        </el-form-item>
        <el-form-item label="再用/弃用" prop="status">
          <el-radio v-model="changeForm.status" :label="0">在用</el-radio>
          <el-radio v-model="changeForm.status" :label="1">废弃</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeCancel()">取 消</el-button>
        <el-button type="primary" @click="changeSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetinformationPage,
  SavaInformation,
  UPdateInformation,
  DeleteInformation,
} from "@/api/spApi";
import { getDateTo } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      searchText: "",
      addForm: {
        Supplier_Code: "",
        Supplier_Name: "",
        Supplier_DeviceName: "",
        status: 0,
      },
      changeForm: {
        Supplier_Code: "",
        Supplier_Name: "",
        Supplier_DeviceName: "",
        status: 0,
        create_time: "",
        create_uid: "",
        uid: "",
      },
      changeShow: false,
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
      titleType: "",
      rules: {
        toolsMold: [
          { required: true, message: "请输入治具类型", trigger: "change" },
        ],
      },
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
      GetinformationPage(this.getText).then(({ data }) => {
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
    addOpen() {
      // this.addForm.operationType = "I";
      this.titleType = "添加";
      this.dialogVisible = true;
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    changeCancel() {
      this.changeShow = false;
      this.$refs.form.resetFields();
    },
    addSubmit() {
      SavaInformation([
        { ...this.addForm, create_time: getDateTo(), create_uid: getToken() },
      ]).then(({ data }) => {
        this.getData();
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: `${this.titleType}成功!`,
        });
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
    changeSubmit() {
      UPdateInformation([this.changeForm]).then(({ data }) => {
        this.changeShow = false;
        this.getData();
        this.$message({
          type: "success",
          message: `${this.titleType}成功!`,
        });
      });
    },
    handleEdit(index, row) {
      // this.addForm.operationType = "U";
      this.titleType = "修改";
      this.changeForm.Supplier_Code = row.Supplier_Code;
      this.changeForm.Supplier_Name = row.Supplier_Name;
      this.changeForm.Supplier_DeviceName = row.Supplier_DeviceName;
      this.changeForm.status = row.status;
      this.changeForm.create_time = row.create_time;
      this.changeForm.create_uid = row.create_uid;
      this.changeForm.uid = row.uid;
      this.changeShow = true;
    },
    getAll() {
      this.startLoading();
      GetinformationPage({
        PageIndex: 1,
        PageSize: 100000,
        SearchText: "",
        SearchModel: {},
      }).then(({ data }) => {
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
    handleDelete(index, row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteInformation([
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
              this.$alert(data.Msg, "错误信息", {
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
