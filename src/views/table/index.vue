<template>
  <div class="app-container">
    <el-card class="box-card">
    <div class="table_header">
      <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    </div>
    <div class="table_container">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        max-height="500"
        border
        style="width: 100%"
      >
        <el-table-column prop="order_number" label="订单号" min-width="120">
        </el-table-column>
        <el-table-column prop="order_name" label="订单名称"> </el-table-column>
        <el-table-column prop="customer_info" label="客户信息">
        </el-table-column>
        <el-table-column
          prop="description"
          label="订单描述"
          min-width="200"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </div>
  </el-card>
    <el-dialog
      title="添加订单"
      @close="editCancel()"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="订单号">
          <el-input
            v-model="form.order_number"
            placeholder="请输入订单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单名称">
          <el-input
            v-model="form.order_name"
            placeholder="请输入订单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户信息">
          <el-input
            v-model="form.customer_info"
            placeholder="请输入客户信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单描述">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入订单描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改订单"
      :visible.sync="dialogEide"
      width="50%"
      @close="editCancel()"
    >
      <el-form ref="form" :model="formEdit" label-width="80px">
        <el-form-item label="订单号">
          <el-input
            v-model="formEdit.order_number"
            placeholder="请输入订单号"
          
          ></el-input>
        </el-form-item>
        <el-form-item label="订单名称">
          <el-input
            v-model="formEdit.order_name"
            placeholder="请输入订单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户信息">
          <el-input
            v-model="formEdit.customer_info"
            placeholder="请输入客户信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单描述">
          <el-input
            type="textarea"
            v-model="formEdit.description"
            placeholder="请输入订单描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editCancel()">取消</el-button>
        <el-button type="primary" @click="editOrder()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from "@/api/table";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      tableData: [
        {
          order_number: 2023063021,
          order_name: "创新技术",
          customer_info: "创新谷",
          description: "计划中e",
        },
        {
          order_number: 2023063022,
          order_name: "创新技术",
          customer_info: "创新谷",
          description: "计划中e",
        },
        {
          order_number: 2023063023,
          order_name: "创新技术",
          customer_info: "创新谷",
          description: "计划中e",
        },
        {
          order_number: 2023063024,
          order_name: "创新技术",
          customer_info: "创新谷",
          description: "计划中e",
        },
        {
          order_number: 2023063025,
          order_name: "创新技术",
          customer_info: "创新谷",
          description: "计划中e",
        },
        {
          order_number: 2023063026,
          order_name: "创新技术",
          customer_info: "创新谷",
          description: "计划中e",
        },
        {
          order_number: 2023063027,
          order_name: "创新技术",
          customer_info: "创新谷",
          description: "计划中e",
        },
      ],
      currentPage: 1,
      pageSize: 5,
      total: 10,
      dialogVisible: false,
      form: {
        order_number: "",
        order_name: "",
        customer_info: "",
        description: "",
      },
      dialogEide: false,
      formEdit: {
        order_number: "",
        order_name: "",
        customer_info: "",
        description: "",
      },
    };
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
    onSubmit() {
      // console.log(this.form);
      this.tableData.push(this.form);
      this.form = {
        order_number: "",
        order_name: "",
        customer_info: "",
        description: "",
      };
      this.dialogVisible = false;
    },
    handleDelete(a, b) {
      // console.log(a, b);
      this.tableData = this.tableData.filter((t) => {
        return t.order_number != b.order_number;
      });
    },
    handleEdit(index, row) {
      this.dialogEide = true;
      this.formEdit = row;
    },
    editOrder() {
      this.tableData = this.tableData.map((t) => {
        if (t.order_number == this.formEdit.order_number) {
          return this.formEdit;
        } else {
          return t;
        }
      });
      this.dialogEide = false;
    },
    addCancel() {
      this.dialogVisible = false;
      this.form = {
        order_number: "",
        order_name: "",
        customer_info: "",
        description: "",
      };
    },
    editCancel() {
      this.dialogEide = false;
      this.formEdit = {
        order_number: "",
        order_name: "",
        customer_info: "",
        description: "",
      };
    },
  },
};
</script>
<style lang="scss">
// .el-table--border:after,
// .el-table--group:after,
// .el-table:before {
//   background-color: #c0c4cc;
// }
// .el-table--border,
// .el-table--group {
//   border-color: #c0c4cc;
// }
// .el-table td,
// .el-table th.is-leaf {
//   border-bottom: 1px solid #c0c4cc;
// }

// .el-table--border th,
// .el-table--border th.gutter:last-of-type {
//   border-bottom: 1px solid #c0c4cc;
// }

// .el-table--border td,
// .el-table--border th {
//   border-right: 1px solid #c0c4cc;
// }
.table_header {
  padding-bottom: 20px;
}
</style>