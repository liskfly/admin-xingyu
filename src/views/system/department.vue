<template>
  <div class="department">
    <el-card class="box-card">
      <div class="table_header">
        <el-button type="primary" @click="dialogVisible = true">添加</el-button>
      </div>
      <div class="table_container">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          max-height="500"
          border
          style="width: 100%"
        >
          <el-table-column prop="var1" label="部门名称" min-width="90">
          </el-table-column>
          <el-table-column prop="var2" label="状态"> </el-table-column>
          <el-table-column
            prop="EventDatetime"
            :formatter="dateFormat"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column prop="var4" label="负责人"> </el-table-column>
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
      title="添加字段"
      @close="addCancel()"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="部门名称">
          <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.head" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartData, setField } from "@/api/department";
import { xmlTagToJson } from "@/utils/xmlTojson";
export default {
  data() {
    return {
      tableData: "",
      dialogVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 10,
      form: {
        name: "",
        head: "",
        phone: "",
        email: "",
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getDepartData().then(({ data }) => {
        this.tableData = xmlTagToJson(data, "Table");
      });
    },
    onSubmit() {
      this.dialogVisible = false;
      setField(this.form).then(({ data }) => {
        this.getData();
      });
    },
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
    dateFormat(row) {
      // console.log(row,column);
      let date = row.EventDatetime;
      return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
.department {
  padding: 20px;
}
.table_header {
  padding-bottom: 20px;
}
</style>