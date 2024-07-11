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
        <el-table-column prop="subpiece_encod" label="子件编码" min-width="120">
        </el-table-column>
        <el-table-column prop="unit" label="单位"> </el-table-column>
        <el-table-column prop="quantity" label="数量"> </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          min-width="200"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="entry_time" label="录入时间"> </el-table-column>
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
      title="添加BOM产品"
      @close="editCancel()"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="子件编码">
          <el-input
            v-model="form.subpiece_encod"
            placeholder="请输子件编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" placeholder="请输入单位"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="form.quantity" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="录入时间">
          <el-date-picker
            v-model="form.entry_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改BOM产品"
      :visible.sync="dialogEide"
      width="50%"
      @close="editCancel()"
    >
      <el-form ref="form" :model="formEdit" label-width="80px">
        <el-form-item label="子件编码">
          <el-input
            v-model="formEdit.subpiece_encod"
            placeholder="请输子件编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="formEdit.unit" placeholder="请输入单位"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input
            v-model="formEdit.quantity"
            placeholder="请输入数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="formEdit.description"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="录入时间">
          <el-date-picker
            v-model="formEdit.entry_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
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
          subpiece_encod: "2023063021",
          unit: "个",
          quantity: "20",
          description: "计划中e",
          entry_time: "2023-07-03 10:11:59",
        },
        {
          subpiece_encod: "2023063021",
          unit: "个",
          quantity: "20",
          description: "计划中e",
          entry_time: "2023-07-03 10:11:59",
        },
        {
          subpiece_encod: "2023063021",
          unit: "个",
          quantity: "20",
          description: "计划中e",
          entry_time: "2023-07-03 10:11:59",
        },
        {
          subpiece_encod: "2023063021",
          unit: "个",
          quantity: "20",
          description: "计划中e",
          entry_time: "2023-07-03 10:11:59",
        },
        {
          subpiece_encod: "2023063021",
          unit: "个",
          quantity: "20",
          description: "计划中e",
          entry_time: "2023-07-03 10:11:59",
        },
        {
          subpiece_encod: "2023063021",
          unit: "个",
          quantity: "20",
          description: "计划中e",
          entry_time: "2023-07-03 10:11:59",
        },
        {
          subpiece_encod: "2023063021",
          unit: "个",
          quantity: "20",
          description: "计划中e",
          entry_time: "2023-07-03 10:11:59",
        },
      ],
      currentPage: 1,
      pageSize: 5,
      total: 10,
      dialogVisible: false,
      form: {
        subpiece_encod: "",
        unit: "",
        quantity: "",
        description: "",
        entry_time: "",
      },
      dialogEide: false,
      formEdit: {
        subpiece_encod: "",
        unit: "",
        quantity: "",
        description: "",
        entry_time: "",
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
        subpiece_encod: "",
        unit: "",
        quantity: "",
        description: "",
        entry_time: "",
      };
      this.dialogVisible = false;
    },
    handleDelete(a, b) {
      // console.log(a, b);
      this.tableData = this.tableData.filter((t) => {
        return t.subpiece_encod != b.subpiece_encod;
      });
    },
    handleEdit(index, row) {
      this.dialogEide = true;
      this.formEdit = row;
    },
    editOrder() {
      this.tableData = this.tableData.map((t) => {
        if (t.subpiece_encod == this.formEdit.subpiece_encod) {
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
        subpiece_encod: "",
        unit: "",
        quantity: "",
        description: "",
        entry_time: "",
      };
    },
    editCancel() {
      this.dialogEide = false;
      this.formEdit = {
        subpiece_encod: "",
        unit: "",
        quantity: "",
        description: "",
        entry_time: "",
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