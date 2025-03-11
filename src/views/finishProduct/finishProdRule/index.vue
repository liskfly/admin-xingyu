<template>
  <div class="type">
    <el-card :body-style="{ padding: '8px' }">
      <div class="table_header">
        <el-button type="primary" @click="openAdd">添加</el-button>
      </div>
      <div class="table_container">
        <el-table
          :data="tableData"
          border
          :height="tableHeight"
          style="width: 100%"
        >
          <!-- <el-table-column type="index" label="序号" width="55" /> -->
          <el-table-column label="序号" width="55">
            <template slot-scope="scope">
              <span>{{
                scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称">
          </el-table-column>
          <el-table-column prop="product_code" label="成品编码">
          </el-table-column>
          <el-table-column prop="code_identifier" label="成品码规则">
          </el-table-column>
          <el-table-column prop="updater" label="操作人" width="150"> </el-table-column>
          <el-table-column prop="create_time" label="时间" width="170"> </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex"
          :page-size="getForm.PageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="'新增'"
      :visible.sync="dialogVisible"
      width="500px"
      @close="addCancel()"
    >
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="form.product_name" placeholder="" />
        </el-form-item>
        <el-form-item label="成品编码" prop="product_code">
          <el-input v-model="form.product_code" placeholder="" />
        </el-form-item>
        <el-form-item label="成品码规则" prop="code_identifier">
          <el-input v-model="form.code_identifier" placeholder="" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'编辑'"
      :visible.sync="editVisible"
      width="500px"
      @close="editCancel()"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="auto">
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="editForm.product_name" placeholder="" />
        </el-form-item>
        <el-form-item label="成品编码" prop="product_code">
          <el-input v-model="editForm.product_code" placeholder="" />
        </el-form-item>
        <el-form-item label="成品码规则" prop="code_identifier">
          <el-input v-model="editForm.code_identifier" placeholder="" />
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
import {
  addProductCodeRules,
  findProductCodeRules,
  DeleteProductCodeRules,
  updateProductCodeRules,
} from "@/api/sdzApi";
import { getToken } from "@/utils/auth";
import dayjs from "dayjs";
export default {
  data() {
    return {
      dialogVisible: false,
      editVisible: false,
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      form: {
        product_name: "",
        product_code: "",
        code_identifier: "",
        creator: "",
        create_time: "",
      },
      editForm: {
        id: 0,
        product_name: "",
        product_code: "",
        code_identifier: "",
        status: 0,
        creator: "",
        create_time: "",
        updater: "",
        update_time: "",
        remark: "",
      },
      getForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        SearchModel: {
          product_name: "",
          product_code: "",
          code_identifier: "",
          creator: "",
          create_time: "",
        },
        StartTime: "",
        EndTime: "",
      },
      total: 0,
      itemPass1: "",
    };
  },
  created() {
    // this.getData();
  },
  beforeMount() {
    this.getScreenHeight();
    this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      findProductCodeRules(this.getForm).then((res) => {
        //   console.log(res);
        this.tableData = [];
        this.total = res.Data.Total;
        this.tableData = res.Data.list.map((item) => {
          return {
            ...item,
            create_time: dayjs(item.create_time).format("YYYY-MM-DD HH:mm:ss"),
            update_time: dayjs(item.update_time).format("YYYY-MM-DD HH:mm:ss"),
          };
        });
      });
    },
    openAdd() {
      this.dialogVisible = true;
    },

    addCancel() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
      // this.$refs.form.resetFields();
    },
    handleEdit(row) {
    //   console.log(row);
    this.editForm.product_name=""
    this.editForm.product_code=""
    this.editForm.code_identifier=""
      this.editForm = { ...row };
      this.editVisible = true;
    },
    handleDelete(row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteProductCodeRules([row.id]).then((res) => {
            if (res.Success) {
              this.$notify({
                title: "提示信息",
                type: "success",
                message: "删除成功",
              });
              this.getData();
            } else {
              this.$notify({
                title: "提示信息",
                type: "error",
                message: res.Msg,
              });
            }
          });
        })
        .catch(() => {
          this.$notify({
            title: "提示信息",
            type: "info",
            message: "已取消删除",
          });
        });
    },
    onSubmit() {
      this.$refs.formRef.validate((valid) => (this.itemPass1 = valid));
      if (this.itemPass1) {
        this.form.creator = getToken();
        this.form.create_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
        addProductCodeRules(this.form).then((res) => {
          // console.log(res);

          if (res.Success) {
            this.$notify({
              title: "提示信息",
              type: "success",
              message: "添加成功",
            });
            this.getData();
            this.$refs.formRef.resetFields();
            this.dialogVisible = false;
          } else {
            this.$notify({
              title: "提示信息",
              type: "error",
              message: res.Msg,
            });
          }
        });
      } else {
        this.$alert("添加失败,请完成必填项", "错误信息", {
          confirmButtonText: "确定",
        });
      }
    },
    editCancel() {
        this.editForm.product_name=""
    this.editForm.product_code=""
    this.editForm.code_identifier=""
      this.$refs.editFormRef.resetFields()
      this.editVisible = false;
    },
    editSubmit() {
      this.$refs.editFormRef.validate((valid) => (this.itemPass1 = valid));
      if (this.itemPass1) {
        this.editForm.updater = getToken();
        this.editForm.update_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
        updateProductCodeRules(this.editForm).then((res) => {
          if (res.Success) {
            this.$notify({
              title: "提示信息",
              type: "success",
              message: "修改成功",
            });
            this.getData();
            this.$refs.editFormRef.resetFields();
            this.editVisible = false;
          } else {
            this.$notify({
              title: "提示信息",
              type: "error",
              message: res.Msg,
            });
          }
        });
      } else {
        this.$alert("修改失败,请完成必填项", "错误信息", {
          confirmButtonText: "确定",
        });
      }
    },
    handleSizeChange(value) {
      //
      this.getForm.PageSize = value;
      this.getData();
    },
    handleCurrentChange(val) {
      this.getForm.PageIndex = val;
      this.getData();
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 220;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.titleSelect {
  margin-right: 12px;
}

.type {
  padding: 8px;

  .initBox {
    width: 500px;
  }

  .table_header {
    padding-bottom: 8px;
    display: flex;
    // gap: 30px;
    // justify-content: flex-end;
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
