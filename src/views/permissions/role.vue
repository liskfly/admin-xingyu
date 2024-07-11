<template>
  <div class="role">
    <el-card>
      <div class="table_header">
        <el-button type="primary" @click="openAdd()">新增</el-button>
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        :height="tableHeight"
        stripe
      >
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
              icon="el-icon-edit"
              size="mini"
              @click="handleAssigned(scope.$index, scope.row)"
              >编辑</el-button
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
      <div class="block" style="margin-top: 15px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="xyRoleName">
          <el-input v-model="form.xyRoleName"></el-input>
        </el-form-item>
        <el-form-item label="菜单分配" prop="menus" size="normal">
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
      <div class="sync-dialog__div">
        <el-form :model="form" ref="form" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="changMeun.xyRole.xyRoleName"></el-input>
          </el-form-item>
          <el-form-item label="菜单" size="normal">
            <el-tree
              :data="treeData"
              show-checkbox
              node-key="xyClientMenuId"
              :props="{ label: 'title', children: 'childs' }"
              ref="tree1"
            >
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="xqCancel()">关闭</el-button>
        <el-button type="primary" @click="addSubmit()">确定</el-button>
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
  updateRoleMeun,
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
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数,
      tableHeight: 0,
      changMeun: {
        adds: [],
        deletes: [],
        xyRole: {
          xyRoleId: "",
          xyRoleName: "",
        },
      },
      roleAllMeun: [],
      rules: {
        xyRoleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
    };
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    this.getData();
    this.getMeun();
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      this.startLoading();
      getRole().then(({ data }) => {
        // console.log(data);
        this.tableData = data;
        this.endLoading();
      });
    },
    openAdd() {
      this.dialogVisible = true;
      this.getMeun();
    },
    getMeun() {
      // this.dialogVisible = true;
      this.startLoading();
      getFirstMeun().then(({ data }) => {
        this.treeData = data.content;
        // console.log(data);
        this.endLoading();
      });
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    onSubmit() {
      this.form.menus = this.$refs.tree.getCheckedKeys();
      this.form.menus.push(...this.$refs.tree.getHalfCheckedKeys());
      this.form.menus = Array.from(new Set(this.form.menus));
      this.$refs.form.validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.startLoading();
          addRole(this.form).then(({ data }) => {
            // console.log(data);
            this.getData();
            this.endLoading();
            this.dialogVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleEdit() {},
    handleAssigned(index, row) {
      this.changMeun.xyRole.xyRoleId = row.xyRoleId;
      this.changMeun.xyRole.xyRoleName = row.xyRoleName;
      // console.log(this.changMeun);
      // this.startLoading()
      this.xqVisible = true;
      getMeunRole(row.xyRoleId).then(({ data }) => {
        data.forEach((item) => {
          item.childs.forEach((i) => {
            this.roleData.push(i.xyClientMenuId);
          });
        });
        // console.log(this.treeData);

        this.$refs.tree1.setCheckedKeys(this.roleData);
        this.roleAllMeun = [
          ...this.$refs.tree1.getCheckedKeys(),
          ...this.$refs.tree1.getHalfCheckedKeys(),
        ];

        //  this.endLoading()

        //  console.log(this.roleData);
      });
      // this.getMeun()
    },
    addSubmit() {
      let meun = [
        ...this.$refs.tree1.getCheckedKeys(),
        ...this.$refs.tree1.getHalfCheckedKeys(),
      ];

      this.comparefunction(this.roleAllMeun, meun);
      //  console.log(this.changMeun);
      this.startLoading();
      updateRoleMeun(this.changMeun).then(({ data }) => {
        // console.log(res);
        if ((data.code = 100200)) {
          this.getData();
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        } else {
          this.$message({
            type: "error",
            message: data.msg,
          });
        }
        this.xqVisible = false;
        this.endLoading();
      });
    },
    xqCancel() {
      this.xqVisible = false;
      this.roleData = [];
    },
    handleDelete(index, row) {
      // console.log(row);
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.startLoading();
          deleteRole(row.xyRoleId).then(({ data }) => {
            // console.log(res);
            if ((data.code = 100200)) {
              this.getData();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message({
                type: "error",
                message: data.msg,
              });
            }
            this.endLoading();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    comparefunction(arr1, arr2) {
      // let remove = [];
      // let add = [];
      // 旧数据循环
      this.changMeun.adds = [];
      this.changMeun.deletes = [];
      for (let i = 0; i < arr2.length; i++) {
        let item = arr2[i];
        if (arr1.indexOf(item) === -1) {
          // 在新数据中找不到原来的数据表示这个被移除了
          this.changMeun.adds.push(item);
        }
      }
      // 新数据循环
      for (let i = 0; i < arr1.length; i++) {
        let item = arr1[i];
        if (arr2.indexOf(item) === -1) {
          // 在旧数据中找不到新元素，表示这个元素被添加了
          this.changMeun.deletes.push(item);
        }
      }
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
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
      this.loading.close();
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 300;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.role {
  padding: 20px;
  .table_header {
    padding-bottom: 20px;
  }
}
.sync-dialog__div {
  height: 400px;
  overflow: auto;
}
</style>
