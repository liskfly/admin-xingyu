<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <el-button type="primary" @click="openAdd" size="small">添加</el-button>
        <div>
          <el-input v-model="searchName" clearable placeholder="请输入">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </div>
      </div>
      <el-table
        size="small"
        :data="
          tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        :height="tableHeight"
        stripe
      >
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="角色名称" prop="RoleName"></el-table-column>
        <el-table-column label="描述" prop="RoleDesc"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button 
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click.prevent="handleAssigned(scope.row)"
              />
            </el-tooltip>
         
            <el-tooltip content="角色用户编辑" placement="top">
              <el-button
                type="warning"
                icon="el-icon-user"
                size="mini"
                @click.prevent="roleEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click.prevent="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[30, 50, 100, 200, 300]"
          layout="total,sizes, prev, pager, next"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      title="新增"
      :visible.sync="addVisible"
      width="400px"
      @close="addCancel()"
    >
      <el-form :model="form" ref="formRef" :rules="rules" label-width="auto">
        <el-form-item label="角色名称" prop="RoleName">
          <el-input v-model="form.RoleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="RoleDesc">
          <el-input v-model="form.RoleDesc"></el-input>
        </el-form-item>
        <el-form-item label="菜单分配" prop="MenuId">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="ID"
            :props="defaultProps"
            ref="tree"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <span class="dialog-footer">
          <el-button @click="addCancel()">取消</el-button>
          <el-button type="primary" @click="onSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      title="编辑"
      :visible.sync="editVisible"
      width="400px"
      @close="editCancel()"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editRef"
        label-width="auto"
      >
        <el-form-item label="角色名称" prop="RoleName">
          <el-input v-model="editForm.RoleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="RoleDesc">
          <el-input v-model="editForm.RoleDesc"></el-input>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="ID"
            :props="{ label: 'title', children: 'childMenu' }"
            ref="tree1"
          ></el-tree>
        </el-form-item>
      </el-form>

      <template slot="footer">
        <span class="dialog-footer">
          <el-button @click="editCancel()">取消</el-button>
          <el-button type="primary" @click="editSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      title="角色所属用户"
      :visible.sync="roleVisible"
      width="675px"
      @close="clear()"
    >
      <el-transfer
       :titles="['未绑定用户', '已绑定用户']"
        filterable
        :filter-method="filterMethod"
        filter-placeholder=""
        v-model="undistributed"
        :data="data"
        @change="test"
      >
      </el-transfer>

      <template slot="footer">
        <span class="dialog-footer">
          <el-button @click="clear()">取消</el-button>
          <el-button type="primary" @click="upData">确认更新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRole,
  addRole,
  getFirstMeun,
  getMeunRole,
  updateRoleMeun,
  deleteRole,
  getEmployeesByRole,
  getUnassignEmployeesByRole,
  updateEmployeesByRole,
} from "@/api/control/index";
import { Message, MessageBox, Notification } from "element-ui";

export default {
  data() {
    return {
      tableData: [],
      tableData1: [],
      pageSize: 50,
      currentPage: 1,
      tableHeight: 0,
      addVisible: false,
      editVisible: false,
      searchName: "",
      treeData: [],
      roleAllMeun: [],
      roleData: [],
      defaultProps: { label: "title", children: "childMenu" },
      form: {
        MenuId: [],
        RoleName: "",
        RoleDesc: "",
        CreateBy: this.$store.getters.userInfo || "",
        CreateDate: "",
        UpdateBy: "",
        UpdateDate: "",
      },
      editForm: {
        Add: [],
        Deletes: [],
        id: "",
        RoleName: "",
        RoleDesc: "",
        CreateBy: "",
        CreateDate: "",
        UpdateBy: this.$store.getters.userInfo || "",
        UpdateDate: "",
      },
      rules: {
        RoleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      data: [],
      undistributed: [],
      undistributedList: [],
      Assigned: [],
      AssignedList: [],
      roleVisible: false,
      roleId: "",
      
      filterMethod(query, item) {
        return item.key.toLowerCase().includes(query.toLowerCase());
      },
    };
  },
  watch: {
    searchName(newVal) {
      if (newVal == "") {
        this.tableData1 = this.tableData;
      } else {
        this.tableData1 = this.table1(newVal);
      }
    },
  },
  created() {
    this.getScreenHeight();
    this.getData();
    this.getMeun();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    test(value1, value2, value3) {
      console.log(value1, value2, value3);
    },
    table1(newdata) {
      let searchName = newdata.toLowerCase();
      return this.tableData.filter((v) => {
        return Object.keys(v).some((key) => {
          return String(v[key]).f().indexOf(searchName) > -1;
        });
      });
    },
    getData() {
      getAllRole().then((data) => {
        this.tableData = data.Data;
        this.tableData1 = this.tableData;
      });
    },
    getMeun() {
      getFirstMeun().then((data) => {
        this.treeData = data.Data;
      });
    },
    openAdd() {
      this.addVisible = true;
    },
    addCancel() {
      this.addVisible = false;
      this.$refs.formRef.resetFields();
    },
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const tree = this.$refs.tree;
          this.form.MenuId = tree.getCheckedKeys();
          const prarentTree = tree.getHalfCheckedKeys();
          this.form.MenuId.push(...prarentTree);
          this.form.MenuId = Array.from(new Set(this.form.MenuId));

          addRole(this.form).then((data) => {
            if (data.Code == 100200) {
              this.getData();
              this.roleData = [];
              Notification({
                title: "添加成功",
                type: "success",
              });
            } else {
              Notification({
                title: "添加失败",
                message: data.msg,
                type: "error",
              });
            }
            this.addVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editCancel() {
      this.editVisible = false;
      this.roleData = [];
    },
    handleAssigned(row) {
      this.editForm.id = row.ID;
      this.editForm.RoleName = row.RoleName;
      this.editForm.RoleDesc = row.RoleDesc;
      this.editVisible = true;

      getMeunRole(row.ID).then((data) => {
        if (data.Data == null || data.Data == undefined) {
          this.roleData = [];
        } else {
          const dataText = data.Data;
          dataText.forEach((item) => {
            if (item.childMenu !== null) {
              item.childMenu.forEach((i) => {
                if (i.childMenu == null) {
                  this.roleData.push(i.ID);
                } else {
                  i.childMenu.forEach((v) => {
                    if (v.childMenu !== null) {
                      v.childMenu.forEach((c) => {
                        this.roleData.push(c.ID);
                      });
                    } else {
                      this.roleData.push(v.ID);
                    }
                  });
                }
              });
            } else {
              this.roleData.push(item.id);
            }
          });
        }
        this.$refs.tree1.setCheckedKeys(this.roleData);
        this.roleAllMeun = [
          ...this.$refs.tree1.getCheckedKeys(),
          ...this.$refs.tree1.getHalfCheckedKeys(),
        ];
      });
    },
    editSubmit() {
      const tree1 = this.$refs.tree1;
      let meun = [...tree1.getCheckedKeys(), ...tree1.getHalfCheckedKeys()];
      this.comparefunction(this.roleAllMeun, meun);

      this.$refs.editRef.validate((valid) => {
        if (valid) {
          updateRoleMeun(this.editForm).then((data) => {
            if (data.Code == 100200) {
              this.getData();
              this.roleData = [];
              Notification({
                title: "修改成功",
                type: "success",
              });
            } else {
              Notification({
                title: "修改失败",
                message: data.msg,
                type: "error",
              });
            }
            this.editVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    comparefunction(arr1, arr2) {
      this.editForm.Add = [];
      this.editForm.Deletes = [];
      for (let i = 0; i < arr2.length; i++) {
        let item = arr2[i];
        if (arr1.indexOf(item) === -1) {
          this.editForm.Add.push(item);
        }
      }
      for (let i = 0; i < arr1.length; i++) {
        let item = arr1[i];
        if (arr2.indexOf(item) === -1) {
          this.editForm.Deletes.push(item);
        }
      }
    },
    handleDelete(row) {
      MessageBox.confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRole(row.ID).then((data) => {
            if (data.Code == 100200) {
              this.getData();
              Notification({
                title: "提示信息",
                message: "删除成功",
                type: "success",
              });
            } else {
              Notification({
                title: "提示信息",
                message: "删除失败",
                type: "error",
              });
            }
          });
        })
        .catch(() => {
          Notification({
            title: "提示信息",
            message: "取消操作",
            type: "info",
          });
        });
    },
    getList() {
      let arr = [];
      this.undistributedList.forEach((item) => {
        arr.push({ key: item.EmployeeName, label: item.EmployeeName + ' ' + item.FullName });
      });
      this.AssignedList.forEach((item) => {
        arr.push({ key: item.EmployeeName, label: item.EmployeeName + ' ' + item.FullName });
      });
      console.log();
      
      this.data = arr;
    },
    async roleEdit(row) {
      this.roleId = row.ID;
      await getEmployeesByRole(row.ID).then((data) => {
        if (data.Code == 100200 && data.Data != null) {
          let arr = [];
          data.Data.forEach((item) => {
            arr.push(item.EmployeeName);
          });
          this.undistributedList = data.Data;
          this.undistributed = arr;
        } else {
          this.undistributed = [];
          // Notification({
          //   title: "提示信息",
          //   message: data.Message,
          //   type: "error",
          // });
        }
      });
      await getUnassignEmployeesByRole(row.ID, '').then((data) => {
        if (data.Code == 100200 && data.Data != null) {
          let arr = [];
          data.Data.forEach((item) => {
            arr.push(item.EmployeeName);
          });
          this.AssignedList = data.Data;
          this.Assigned = arr;
        } else {
          this.Assigned = [];
          // Notification({
          //   title: "提示信息",
          //   message: data.Message,
          //   type: "error",
          // });
        }
      });
      this.getList();
      this.roleVisible = true;
    },
    clear() {
      this.data = [];
      this.undistributed = [];
      this.undistributedList = [];
      this.Assigned = [];
      this.AssignedList = [];
      this.roleVisible = false;
    },
    upData() {
      updateEmployeesByRole({
        EmployeeName: this.undistributed,
        ID: this.roleId,
      }).then((data) => {
        if (data.Code == 100200) {
          this.getData();
          Notification({
            title: "提示信息",
            message: "更新成功",
            type: "success",
          });
          this.roleVisible = false
        } else {
          Notification({
            title: "提示信息",
            message: "更新失败",
            type: "error",
          });
        }
      });
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 220;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
