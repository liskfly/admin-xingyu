<template>
  <div class="employee">
    <el-card>
      <!-- <div class="table_header">
        <el-button type="primary" size="medium" @click="openAdd()"
          >新增</el-button
        >
      </div> -->
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        :height="tableHeight"
        stripe
      >
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <af-table-column label="账号" prop="EmployeeName" align="center"> </af-table-column>
        <af-table-column label="员工" prop="FullName" align="center"> </af-table-column>

        <af-table-column label="角色" prop="xyRoleName" >
          <template slot-scope="scope">
            <el-tag
              v-for="item in scope.row.xyRoleName"
              :key="item"
              :type="item"
              effect="plain"
              size="small"
            >
              {{ item }}
            </el-tag>
          </template>
        </af-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
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
      title="角色添加"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="员工" prop="roleName">
          <el-input v-model="roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" prop="role">
          <el-tag
            :key="tag.xyRoleId"
            v-for="tag in hasRole"
            closable
            size="medium"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag.xyRoleName }}
          </el-tag>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="form.roleId"
            placeholder="请选择角色"
            clearable=""
          >
            <el-option
              v-for="item in noRole"
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
  findEmployeeRoles,
  deletefirstRole,
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
      hasRole: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数,
      tableHeight: 0,
    };
  },
    beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    this.getData();
    this.getRoleMeun();
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  computed: {
    noRole() {
      let data = this.options.filter(
        (item) => !this.hasRole.some((ele) => ele.xyRoleId === item.value)
      );
      return data;
    },
  },
  methods: {
    getData() {
      this.startLoading();
      getEmployee().then(({ data }) => {
        // console.log(data);
        this.endLoading();
        // this.tableData = data;
        this.dataPrecc(data);
        // })
      });
    },
    getRoleMeun() {
      this.startLoading();
      getRole().then(({ data }) => {
        // console.log(data);
        this.endLoading();
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
      this.startLoading();
      findEmployeeRoles(row.EmployeeId).then(({ data }) => {
        if (data.code == 100200) {
          //  console.log(data);
          this.hasRole = data.content;
          this.dialogVisible = true;
          this.roleName = row.FullName;
          this.form.roleId = row.xyRoleId;
          this.form.employeeId = row.EmployeeId;
        } else {
          this.$message({
            type: "error",
            message: data.msg,
          });
        }
        this.endLoading();
      });

      // this.form.employeeId=row.EmployeeId
    },
    addCancel() {
      this.dialogVisible = false;
    },
    onSubmit() {
      // console.log(this.form);
      if (
        this.form.roleId == "" ||
        this.form.roleId == undefined ||
        this.form.roleId == null
      ) {
        this.dialogVisible = false;
        this.$refs.form.resetFields();
        // console.log(this.form.roleId);
      } else {
        this.startLoading();
        addEmployeeRole(this.form).then((res) => {
          this.endLoading();
          // console.log(data);
          this.getData();
          this.dialogVisible = false;
          this.$refs.form.resetFields();
        });
      }
    },
    handleClose(tag) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.startLoading();
          deletefirstRole({
            empId: this.form.employeeId,
            roleId: tag.xyRoleId,
          }).then(({ data }) => {
            // console.log(res);
            if ((data.code = 100200)) {
              this.getHasRole();
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
    handleDelete(index, row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.startLoading();
          deleteEmployee(row.EmployeeId).then(({ data }) => {
            if (data.code == 100200) {
              //  console.log(data);
              this.$message({
                type: "success",
                message: "删除成功",
              });

              this.getData();
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
    getHasRole() {
      this.startLoading();
      findEmployeeRoles(this.form.employeeId).then(({ data }) => {
        if (data.code == 100200) {
          //  console.log(data);
          this.hasRole = data.content;
        } else {
          this.$message({
            type: "error",
            message: data.msg,
          });
        }
        this.endLoading();
      });
    },
    dataPrecc(data) {
      var beforeData = data; //将dataArr赋值给beforeData  也可直接操作dataArr
      let tempArr = [];
      let afterData = []; //新数组
      for (let i = 0; i < beforeData.length; i++) {
        if (tempArr.indexOf(beforeData[i].EmployeeId) === -1) {
          // console.log(beforeData[i].xyRoleName);
          afterData.push({
            EmployeeId: beforeData[i].EmployeeId,
            EmployeeName: beforeData[i].EmployeeName,
            FullName: beforeData[i].FullName,
            xyRoleName:
              beforeData[i].xyRoleName == undefined
                ? []
                : [beforeData[i].xyRoleName],
          });
          tempArr.push(beforeData[i].EmployeeId);
        } else {
          for (let j = 0; j < afterData.length; j++) {
            if (afterData[j].EmployeeId == beforeData[i].EmployeeId) {
              afterData[j].xyRoleName.push(beforeData[i].xyRoleName);
              break;
            }
          }
        }
      }
      // console.log(afterData);
      //循环afterData并且合并name值用逗号隔开
      // afterData.forEach(
      //   (item) => (item.xyRoleName = item.xyRoleName.join(","))
      // );
      // console.log(afterData, "afterData");
      this.tableData = afterData;
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
     getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 240;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.employee {
  padding: 20px;
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
