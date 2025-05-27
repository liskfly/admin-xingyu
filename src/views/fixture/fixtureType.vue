<template>
  <div class="type">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="table_header">
        <el-button type="primary" @click="addOpen" size="medium">添加</el-button>
        <div class="input_box">
          <el-input placeholder="请输入内容" clearable v-model="searchText" class="input-with-select" @change="getSearchData"
            size="medium">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table :data="tableData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
          " border :height="tableHeight" style="width: 100%" size="medium">
          <el-table-column prop="ToolsMold" label="类型"> </el-table-column>
          <el-table-column prop="Remark" label="描述"> </el-table-column>
          <el-table-column prop="Category" label="类别">
            <template slot-scope="scope">
              <el-tag type="primary" effect="dark" v-if="scope.row.Category == '1'">SMT工治具</el-tag>
              <el-tag type="success" effect="dark" v-else-if="scope.row.Category == '2'">ICT工治具</el-tag>
              <el-tag type="warning" effect="dark" v-else-if="scope.row.Category == '3'">样件</el-tag>
              <!-- <span v-if="scope.row.Category == '1'">SMT工治具</span> -->
              <!-- <span v-else-if="scope.row.Category == '2'">ICT工治具</span>
              <span v-else-if="scope.row.Category == '3'">样件</span> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="UpdateTime" label="创建时间">
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="handleEdit(scope.$index, scope.row)"></el-button>

              <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'添加'" :visible.sync="dialogVisible" @close="addCancel()">
      <el-form :model="addForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="类别" prop="category">
          <el-select v-model="addForm.category" style="width: 100%;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="类型" prop="toolsMold">
          <el-input v-model="addForm.toolsMold"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'修改'" :visible.sync="dialogEditVisible" @close="editCancel">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="80px">
        <el-form-item label="类别" prop="category">
          <el-select v-model="editForm.category" style="width: 100%;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="类型" prop="toolsMold">
          <el-input v-model="editForm.toolsMold"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { moldControl } from "@/api/all";

export default {
  data() {
    return {
      searchText: "",
      addForm: {
        toolsMold: "",
        category: "",
        remark: "",
        operationType: "I",
      },
      editForm: {
        toolsMold: "",
        category: "",
        remark: "",
        operationType: "U",
      },
      dialogEditVisible: false,
      tableHeight: 0,
      getText: {
        toolsMold: "*",
        remark: "",
        operationType: "Q",
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
        category: [{ required: true, message: "请选择类别", trigger: "change" }],
        remark: [{ required: true, message: "请输入描述", trigger: "change" }]
      },
      options: [
        { value: "1", label: "SMT工治具" },
        { value: "2", label: "ICT工治具" },
        { value: "3", label: "样件" },

      ],
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
    window.addEventListener("resize", this.getScreenHeight);
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {

      moldControl(this.getText)
        .then((res) => {
          this.tableData = res.data.DataList;
          this.endLoading();
          // this.currentPage = 1;
          // console.log(res.data.DataList);
          // if (
          //   this.tableData.length % this.pageSize == 0 &&
          //   this.currentPage > 1
          // ) {
          //   this.currentPage--;
          // }
        })
        .catch(() => {

          this.$message.error("请求数据失败，请刷新");
        });
    },
    addOpen() {
      this.addForm.operationType = "I";
      this.titleType = "添加";
      this.dialogVisible = true;
    },
    addCancel() {

      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
    },
    addSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          moldControl(this.addForm).then(({ data }) => {
            if (data.Status == "OK") {
              this.getData();

              this.$notify({
                title: "提示信息",
                message: `添加成功!`,
                type: "success",
              });

              this.addForm.toolsMold = "";
              this.addForm.remark = "";
              this.addForm.category = "";
              this.$refs.formRef.resetFields();
              this.dialogVisible = false;
            } else {
              this.$notify({
                title: "提示信息",
                message: data.Message,
                type: "error",
              });

            }
          });
        }
      });

    },
    handleEdit(index, row) {

      this.editForm.toolsMold = row.ToolsMold;
      this.editForm.remark = row.Remark;
      this.editForm.category = row.Category;
      this.editForm.operationType = "U";

      this.dialogEditVisible = true;
    },
    editCancel() {
      this.editForm.toolsMold = "";
      this.editForm.remark = "";
      this.editForm.category = "";
      this.$refs.editFormRef.resetFields();
      this.dialogEditVisible = false;
    },
    editSubmit() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) {
          return false;
        }
        else {
          moldControl(this.editForm).then(({ data }) => {
            if (data.Status == "OK") {
              this.getData();
              this.$notify({
                title: "提示信息",
                message: `修改成功!`,
                type: "success",
              });
              this.$refs.editFormRef.resetFields();
              this.dialogEditVisible = false;
            } else {
              this.$notify({
                title: "提示信息",
                message: data.Message,
                type: "error",
              });
            }
          });
        }
      });

    },
    handleDelete(index, row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          moldControl({
            toolsMold: row.ToolsMold,
            remark: row.Remark,
            operationType: "D",
          }).then(({ data }) => {
            if (data.Status == "OK") {
              //  this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
              this.getData();
              this.dialogVisible = false;

             
              this.$notify({
                title: "提示信息",
                message: `删除成功!`,
                type: "success",
              });
            } else {
             this.$notify({
                title: "提示信息",
                message: data.Message,
                type: "error",
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
      if (this.searchText == "") {
        this.getText.toolsMold = "*";
      } else {
        this.getText.toolsMold = this.searchText;
      }
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
      if (this.loading) {
        this.loading.close();
      }
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 230;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.type {
  padding: 8px;

  .initBox {
    width: 500px;
  }

  .table_header {
    padding-bottom: 8px;
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
