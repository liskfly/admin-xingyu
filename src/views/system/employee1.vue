<template>
  <div class="employee">
    <el-card class="box-card">
      <div class="table_header">
        <!-- <el-button type="primary" @click="dialogVisible = true">添加</el-button> -->
        <el-button type="primary" @click="dialogVisible = true"
          >添加员工信息</el-button
        >
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
          <el-table-column prop="var1" label="姓名" min-width="120">
          </el-table-column>
          <el-table-column prop="var2" label="年龄"> </el-table-column>
          <!-- <el-table-column prop="var3" label="角色"> </el-table-column> -->
          <el-table-column prop="var4" label="手机号码"> </el-table-column>
          <el-table-column
            prop="var5"
            label="身份证号"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
              >
              <el-button
                type="text"
                icon="el-icon-s-custom"
                size="mini"
                @click="handleAssigned(scope.$index, scope.row)"
                >角色分配</el-button
              >
              <el-button
                type="text"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
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
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <!-- <el-input v-model="form.field3" class="input-with-select"> -->
          <!-- <el-select v-model="form.department" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select> -->
          <!-- </el-input> -->
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input
            v-model="form.idcard"
            placeholder="请输入身份证号码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="信息修改"
      @close="editCancel()"
      :visible.sync="visible"
      width="50%"
    >
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="editForm.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门">
          <el-select
            v-model="editForm.department"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="手机号码">
          <el-input
            v-model="editForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input
            v-model="editForm.idcard"
            placeholder="请输入身份证号码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editVerify()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="角色分配"
      @close="roleCancel()"
      :visible.sync="setRole"
      width="500px"
    >
      <el-form ref="form" :model="roleForm" label-width="80px">
        <el-form-item label="员工编号">
          <el-input v-model="roleForm.Child_Var1" disabled></el-input>
        </el-form-item>
        <el-form-item label="员工名称">
          <el-input v-model="roleForm.Child_Var2" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-tag
            :key="tag.ID"
            v-for="tag in current_role"
            closable
            :disable-transitions="false"
            @close="handleClose(tag.ID)"
          >
            {{ tag.var2 }}
          </el-tag>
        </el-form-item>
        <el-form-item  v-show="current_role.length==0"  label="角色分配">
          <el-select v-model="roleForm.P_Var1" clearable placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.var1"
              :label="item.var2"
              :value="item.var1"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleCancel()">取 消</el-button>
        <el-button type="primary" @click="roleVerify()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  setField,
  getEmployeeData,
  deleteData,
  editData,
  getRoleData,
  setRole,
  setPermission,
  getRolePressions,
} from "@/api/employee";
import { xmlTagToJson, jsonToxml } from "@/utils/xmlTojson";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      visible: false,
      setRole: false,
      currentPage: 1,
      pageSize: 5,
      total: 10,
      form: {
        ID: "",
        name: "",
        age: "",
        sex: "",
        department: "",
        phone: "",
        idcard: "",
      },
      editForm: {
        ID: "",
        name: "",
        age: "",
        sex: "",
        department: "",
        phone: "",
        idcard: "",
      },
      roleForm: {
        P_Var1: "",
        P_Var2: "",
        Child_Var1: "",
        Child_Var2: "",
        P_ModeName: "",
        Child_ModeName: "",
        Current_ModeName: "",
      },
      current_role: "",
      roleOptions: [],
    };
  },
  created() {
    this.resetData();
  },
  methods: {
    addCancel() {
      this.dialogVisible = false;
    },
    onSubmit() {
      setField(this.form).then((res) => {
        this.resetData();
        this.dialogVisible = false;
      });
    },
    resetData() {
      getEmployeeData().then(({ data }) => {
        this.tableData = xmlTagToJson(data, "Table");
        // console.log(xmlTagToJson(data,'Table'));
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
    handleDelete(a, b) {
      deleteData(b.ID).then(({ data }) => {
        this.resetData();
        // console.log(xmlTagToJson(data, "Table"));
      });
    },
    handleEdit(index, row) {
      // console.log(row);
      this.visible = true;
      this.editForm = {
        ID: row.ID,
        name: row.var1,
        age: row.var2,
        // sex: row.val3,
        department: row.var3,
        phone: row.var4,
        idcard: row.var5,
      };
    },
    editCancel() {
      this.editForm = {
        ID: "",
        name: "",
        age: "",
        sex: "",
        department: "",
        phone: "",
        idcard: "",
      };
      this.visible = false;
    },
    editVerify() {
      editData(this.editForm).then(({ data }) => {
        // console.log(xmlTagToJson(data, "Table"));
        this.editCancel();
        this.resetData();
      });
    },
    handleAssigned(index, row) {
      this.setRole = true;
    
      this.roleForm = {
        P_Var1: "",
        P_Var2: "",
        Child_Var1: row.var1,
        Child_Var2: row.var2,
        P_ModeName: "角色信息",
        Child_ModeName: "员工信息",
        Current_ModeName: "员工角色管理",
      };
      this.resetRole()
    },
    handleClose(tag) {
      deleteData(tag).then(({ data }) => {
        this.resetRole()
        // console.log(xmlTagToJson(data, "Table"));
        // console.log(this.roleOptions);
      });
    },
    resetRole(){
      getRoleData().then(({ data }) => {
        this.roleOptions = xmlTagToJson(data, "Table");
      });
      getRolePressions(this.roleForm.Current_ModeName).then(({ data }) => {
        let result = xmlTagToJson(data, "Table");
        // console.log(result);
        this.current_role = result.filter(({ var11 }) => var11 == this.roleForm.Child_Var1);
        this.roleOptions = this.roleOptions.filter(
          (item) =>
            !this.current_role.some((item2) => item.var1 == item2.var1)
        );
        // console.log(this.current_role);
      });
    },
    roleCancel() {
      this.roleForm = {
        P_Var1: "",
        P_Var2: "",
        Child_Var1: "",
        Child_Var2: "",
        P_ModeName: "",
        Child_ModeName: "",
        Current_ModeName: "",
      };
      this.setRole = false;
    },
    roleVerify() {
      this.roleOptions.forEach((item) => {
        if (item.var1 == this.roleForm.P_Var1) {
          this.roleForm.P_Var2 = item.var2;
        }
      });
      setPermission(jsonToxml(this.roleForm)).then(({ data }) => {
        this.resetData();
        this.setRole = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.employee {
  padding: 20px;
}
.table_header {
  padding-bottom: 20px;
}
.el-tag  {
    margin-left: 10px;
  }
</style>