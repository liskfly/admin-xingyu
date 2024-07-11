<template>
  <div class="role">
    <!-- 卡片视图-->
    <el-card>
      <!-- 添加按钮-->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="search"
            style="display: inline-block; width: 200px"
            placeholder="请输入搜索内容"
          >
          </el-input>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table
        :data="tables"
        border
        stripe
        style="width: 100%; margin-top: 20px"
        :default-sort="{ prop: 'createat', order: 'ascending' }"
        @selection-change="handleSelectionChange"
      >
        <!--展开列-->
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          type="index"
          label="#"
          align="center"
          width="90"
          sortable
        >
        </el-table-column>
        <el-table-column label="角色编号" prop="roleid" align="center" sortable>
        </el-table-column>
        <el-table-column label="角色名称" prop="name" align="center">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createat"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="" trigger="click">
              <div class="operate">
                <span @click="showEditDialog(scope.row.roleid)">编辑</span>
                <span @click="removeRoleById(scope.row.roleid)">删除</span>
                <span>详情</span>
                <span @click="showRightDialog(scope.row.roleid)">权限</span>
              </div>
              <el-button type="primary" slot="reference">选择操作</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page.sync="currentPage"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="pageSize"
          layout="total
          , prev, pager, next, sizes"
          :total="totalNum"
          background
          :pager-count="7"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加角色对话框-->
    <!-- <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addRoleClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 编辑角色对话框-->
    <!-- <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editRoleClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 分配权限对话框-->
    <el-drawer
      title="分配角色权限"
      :visible.sync="drawer"
      :before-close="closeDrawer"
    >
      <el-button type="primary" size="small" @click="savePermission"
        >保存</el-button
      >
      <el-button size="small" @click="closeDrawer">关闭</el-button>
      <el-divider></el-divider>
      <el-tree
        ref="treeRef"
        :data="rightList"
        :props="treeProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultkeys"
      >
        <!-- <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>

          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button> 
        </div> -->
      </el-tree>
    </el-drawer>
  </div>
</template>
  
<script>
import {
  getRolesList,
  getRoles,
  getMuenList,
  getRoleMuen,
  setRoleKeys,
} from "@/api/role";
import { getDate } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      checkboxGroup4:[],
      currentPage: 0,
      totalNum: "",
      rolesList: [],
      search: "",
      // 控制角色对话框显示和隐藏
      addDialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      //控制编辑对话框
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 分配权限
      rightDialogVisible: false,
      rightList: [],
      // 树形组件属性绑定对象
      treeProps: {
        // 显示的标签
        label: "details",
        // 子一级
        children: "children",
      },
      // 默认选中节点的id值数组
      defaultkeys: [],
      // 当前分配权限的角色ID
      roleId: "",
      drawer: false,
      checkTree: [],
      // treeProps1: {
      //   label: "name",
      //   children: "children",
      // },
    };
  },
  created() {
    this.getRolesListData();
  },
  computed: {
    tables() {
      const search = this.search;
      if (search) {
        return this.rolesList.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).toLowerCase().indexOf(search) > -1;
          });
        });
      }
      return this.rolesList;
    },
  },
  methods: {
    // 获取角色列表
    async getRolesListData() {
      await getRolesList().then((res) => {
        this.totalNum = res.data.length;
        this.rolesList = res.data.map((item) => {
          return { ...item, createat: getDate(item.createat) };
        });
        // console.log(this.rolesList);
      });
      getMuenList().then((res) => {
        console.log(res.data);
        this.rightList = res.data;
      });
    },
    // 获取角色信息
    getRolesMeg() {
      getRoles().then((res) => {
        console.log(res.data);
      });
    },
    append(data) {
      console.log(data);
      const newChild = {
        ...data.actions[0],
        id: data.actions[0].id,
        label: data.actions[0].name,
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },

    //添加角色

    // 对话框的表单重置

    // 修改角色

    // 监听编辑角色对话框的关闭时间

    // 删除角色

    // 根据id删除角色下的权限

    // 显示分配权限对话框
    showRightDialog(id) {
      this.drawer = true;
      let params = { roleid: id };
      this.roleId = id;
      getRoleMuen(params).then((res) => {
        this.getLearKey(res.data);
        console.log(this.checkTree);
        this.$refs.treeRef.setCheckedKeys(this.checkTree);
      });
    },
    //遍历角色拥有的权限
    getLearKey(data) {
      (data || []).forEach(({ children, id, actions }) => {
        if (!children) {
          if (actions.length > 0) {
            console.log(id, actions.length);
            return this.checkTree.push(id);
          }
        }
        this.getLearKey(children);
      });
    },
    //显示已有权限

    // 监听分配权限对话框的关闭事件

    // 分配权限
    savePermission() {
      this.drawer = false;
      let keys = this.$refs.treeRef.getCheckedNodes(true);

      let params = { token: getToken(), roleid: this.roleId };
      setRoleKeys(params, keys).then((res) => {
        console.log(res.data);
      });

      // console.log(keys);
    },
    closeDrawer() {
      this.drawer = false;
      this.checkTree = [];
    },
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    currentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style lang="scss">
.role {
  padding: 20px;
}
.el-tag {
  margin: 6px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.operate {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
// .el-tree .el-tree-node__expand-icon {
//   font-size: 14px;
// }
// .el-tree .el-tree-node__expand-icon.expanded {
//   -webkit-transform: rotate(0deg);
//   transform: rotate(0deg);
// }
// .el-tree .el-icon-caret-right:before {
//   content: "\e723";
// }
// .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
//   content: "\e722";
// }
.custom-tree-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
</style>
