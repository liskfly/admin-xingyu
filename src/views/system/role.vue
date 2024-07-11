<template>
  <div class="role">
    <el-card>
      <div class="table_header">
        <el-button type="primary" size="medium" @click="openAdd()"
          >新增</el-button
        >
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="角色名称" prop="xyRoleName"> </el-table-column>
        <el-table-column label="描述" prop="description"> </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template slot-scope="scope">
            <!-- <el-button
              type="primary"
                icon="el-icon-edit"
                size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            > -->
            <el-button
              type="primary"
              icon="el-icon-s-custom"
              size="mini"
              @click="handleAssigned(scope.$index, scope.row)"
              >详情</el-button
            >
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
      title="新增"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.xyRoleName"></el-input>
        </el-form-item>
        <el-form-item label="菜单分配" size="normal">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="xyClientMenuId"
            :props="defaultProps"
            ref="tree"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCancel()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="xqVisible"
      width="50%"
      @close="xqCancel()"
    >
      <el-form :model="form" ref="form" label-width="80px">
        <!-- <el-form-item label="角色名称">
          <el-input v-model="form.xyRoleName"></el-input>
        </el-form-item> -->
        <el-form-item label="菜单" size="normal">
          <el-tree
            :data="roleData"
            node-key="xyClientMenuId"
            :props="{  label: 'title',children: 'childs',}"
            ref="tree"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="xqCancel()">关闭</el-button>
        <!-- <el-button type="primary" @click="onSubmit()">确定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFirstMeun,
  addRole,
  getRole,
  deleteRole,
  getMeunRole,
} from "@/api/index";
export default {
  data() {
    return {
      dialogVisible: false,
      xqVisible: false,
      tableData: [],
      treeData: [],
      roleData: [],
      form: {
        menus: [],
        xyRoleName: "",
      },
      defaultProps: {
        label: "title",
        children: "childs",
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getRole().then(({ data }) => {
        // console.log(data);
        this.tableData = data;
      });
    },
    openAdd() {
      this.dialogVisible = true;
      this.getMeun();
    },
    getMeun() {
      // this.dialogVisible = true;
      getFirstMeun().then(({ data }) => {
        this.treeData = data.content;
        // console.log(data);
      });
    },
    addCancel() {
      this.dialogVisible = false;
    },
    onSubmit() {
      this.form.menus = this.$refs.tree.getCheckedKeys();
      // console.log( this.form);
      addRole(this.form).then(({ data }) => {
        console.log(data);
      });
    },
    handleEdit() {},
    handleAssigned(index, row) {
      this.xqVisible = true;
      getMeunRole(row.xyRoleId).then(({ data }) => {
        // console.log(data);
        this.roleData = data;
      });
      // this.getMeun()
    },
    xqCancel(){
      this.xqVisible=false
      this.roleData=[]
    },
    handleDelete(index, row) {
      // console.log(row);
      deleteRole(row.xyRoleId).then((res) => {
        console.log(res);
        this.getData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.role {
  padding: 20px;
}
</style>
