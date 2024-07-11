<template>
  <div class="employee">
    <el-card>
      <!-- <div class="table_header">
        <el-button type="primary" size="medium" @click="openAdd()"
          >新增</el-button
        >
      </div> -->
      <el-table :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="用户名" prop="FullName"> </el-table-column>
        <el-table-column label="账号" prop="EmployeeName"> </el-table-column>
        <el-table-column label="角色" prop="xyRoleName"> </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <!-- <el-button
              type="primary"
              size="mini"
              @click="handleAssigned(scope.$index, scope.row)"
              >详情</el-button
            > -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="角色添加"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="用户">
          <el-input v-model="roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="form.roleId"
            placeholder="请选择角色"
            clearable=""
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
            <!-- <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option> -->
          </el-select>

          <!-- <el-input v-model="roleName"></el-input> -->
        </el-form-item>
        <!-- <el-form-item label="菜单分配" size="normal">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="xyClientMenuId"
            :props="defaultProps"
            ref="tree"
          >
          </el-tree>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button @click="addCancel()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEmployee,
  deleteEmployee,
  getRole,
  addEmployeeRole,
} from "@/api/index";
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      roleName: "",
      form: {
        employeeId: "",
        id: 0,
        roleId: "",
      },
      options: [],
    };
  },
  mounted() {
    this.getData();
    this.getRoleMeun();
  },
  methods: {
    getData() {
      getEmployee().then(({ data }) => {
        // console.log(data);
        this.tableData = data;
      });
    },
    getRoleMeun() {
      getRole().then(({ data }) => {
        console.log(data);
        this.options = data.map((item) => {
          return {
            value: item.xyRoleId,
            lable: item.xyRoleName,
          };
        });
        console.log(this.options);
      });
    },
    openAdd() {
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      // console.log(row);
      this.dialogVisible = true;
      this.roleName = row.EmployeeName;
      this.form.roleId = row.xyRoleId;
      this.form.employeeId = row.EmployeeId;
      // this.form.employeeId=row.EmployeeId
    },
    onSubmit() {
      // console.log(this.form);
      addEmployeeRole(this.form).then((res)=>{
        // console.log(data);
        this.dialogVisible=false
      })
    },
    handleDelete(index, row) {
      deleteEmployee(row.EmployeeId).then(({ data }) => {
        // console.log(data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.employee {
  padding: 20px;
}
</style>
