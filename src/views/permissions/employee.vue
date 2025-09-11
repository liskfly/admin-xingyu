<template>
  <div class="p-2" style="display: flex; gap: 10px">
    <el-card shadow="always" :body-style="{ padding: '8px' }" style="flex: 1">
      <div class="mb-2" style="display: flex; justify-content: space-between">
        <div>
          <el-button type="primary" @click="handleAdd()" size="small">添加</el-button>
        </div>
        <div>
          <el-input v-model="searchName" clearable placeholder="请输入">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </div>
      </div>

      <el-table size="small" :data="tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border
        :height="tableHeight" stripe>
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column label="工号" prop="employeeName" width="150"></el-table-column>
        <el-table-column label="员工姓名" prop="fullName" width="150"></el-table-column>
        <el-table-column label="职称" prop="title"></el-table-column>
        <af-table-column label="邮件" prop="email"></af-table-column>
        <el-table-column label="角色" prop="OrganizationName" :min-width="170">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.RoleName" :key="item" :type="item" effect="plain" size="small">
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" prop="LastLoginTime" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="密码重置" placement="top">
              <el-button type="warning" icon="el-icon-refresh-left" size="mini"
                @click="handleRest(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete-solid" size="mini"
                @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="历史登录记录" placement="top">
              <el-button icon="el-icon-time" size="mini" type="success" @click="handleHistory(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2  flex justify-around">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[30, 50, 100, 150, 200]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData1.length"></el-pagination>
      </div>
    </el-card>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="用户角色" :visible.sync="addVisible"
      width="400px" @close="addCancel()">
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="员工" prop="roleName">
          <el-input v-model="roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" prop="role">
          <el-tag class="mb-2" :key="tag.RoleID" v-for="tag in hasRole" closable :disable-transitions="false"
            @close="handleClose(tag)">
            {{ tag.RoleName }}
          </el-tag>
        </el-form-item>
        <el-form-item label="角色" prop="roleIdArr">
          <el-select v-model="form.roleIdArr" multiple>
            <el-option v-for="item in noRole" :key="item.value" :label="item.lable" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="编辑" :visible.sync="editVisible" width="400px"
      @close="editCancel()">
      <el-form :model="editForm" ref="editRef" label-width="auto">
        <el-form-item label="员工名" prop="FullName">
          <el-input v-model="editForm.FullName" placeholder="请输入员工名" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="EmployeeName">
          <el-input v-model="editForm.EmployeeName" placeholder="请输入账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="DocManagerUser">
          <el-input v-model="editForm.DocManagerUser" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取消</el-button>
        <el-button type="primary" @click="editSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="重置密码" :visible.sync="restVisible"
      width="400px" @close="upDateCancel()">
      <el-form :model="rePwForm" ref="reFormRef" :rules="rules" label-width="auto">
        <el-form-item label="工号" prop="employeeName">
          <el-input v-model="rePwForm.employeeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="FullName">
          <el-input v-model="rePwForm.FullName" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="rePwForm.pwd" placeholder="请输入新密码" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="rePwForm.confirmPwd" placeholder="再次输入新密码" show-password clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upDateCancel()">取消</el-button>
        <el-button type="primary" @click="upDateSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="添加员工" :visible.sync="addPwdVisible"
      width="400px" @close="addPwdCancel()">
      <el-form :model="addForm" ref="addFormRef" :rules="addRules" label-width="auto">
        <el-form-item label="工号" prop="employeeName">
          <el-input v-model="addForm.employeeName" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="FullName">
          <el-input v-model="addForm.FullName" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="新密码" prop="pwd">
          <el-input v-model="addForm.pwd" placeholder="请输入新密码" autocomplete="new-password" show-password
            clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="addForm.confirmPwd" placeholder="再次输入新密码" show-password clearable></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPwdCancel()">取消</el-button>
        <el-button type="primary" @click="addSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="历史登录记录" :visible.sync="historyVisible"
      width="800px">
      <el-table size="small" :data="historyData" border :height="400" stripe>
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column label="工号" prop="EmployeeName"></el-table-column>
        <el-table-column label="登录时间" prop="LoginTime"></el-table-column>
      </el-table>
      <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="addPwdCancel()">取消</el-button>
      <el-button type="primary" @click="addSubmit()">确定</el-button>
    </div> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRole,
  getEmployee,
  findEmployeeRoles,
  addEmployeeRole,
  deletefirstRole,
  deleteEmployee,
  getOrganization,
  ResetPwd,
  ResetEmpPwd,
  AddEmployee,
  findEmpLoginLog,
  OpcenterEmployeeSync,
} from "@/api/control/index";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      tableData: [],
      pageSize: 50,
      currentPage: 1,
      tableHeight: 0,
      addVisible: false,
      editVisible: false,
      formRef: null,
      form: {
        employeeName: "",
        id: 0,
        roleId: "",
        roleIdArr: [],
        IsDelete: "",
        CreateBy: this.$store.getters.userInfo,
        CreateDate: "",
        UpdateBy: "",
        UpdateDate: "",
      },
      hasRole: [],
      roleName: "",
      optionArr: [],
      editForm: {
        EmployeeId: "",
        EmployeeName: "",
        CanLogin: 1,
        FullName: "",
        DocManagerUser: "",
        IsDelete: "",
        CreateBy: "",
        CreateDate: "",
        UpdateBy: this.$store.getters.userInfo || "",
        UpdateDate: "",
      },
      addForm: {
        employeeName: "",
        pwd: "",
        FullName: "",
        confirmPwd: ""
      },
      editRef: null,
      searchName: "",
      tableData1: [],
      organTree: [],
      historyData: [],
      isLoding: "",
      restVisible: false,
      reFormRef: null,
      addPwdVisible: false,
      historyVisible: false,
      addFormRef: null,
      rePwForm: {
        employeeName: "",
        pwd: "",
        FullName: "",
        confirmPwd: ""
      },
      rules: {
        pwd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        confirmPwd: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { validator: this.equalToPassword, trigger: "blur" },
        ],
      },
      addRules: {
        pwd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        confirmPwd: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { validator: this.addPassword, trigger: "blur" },
        ],
      }
    };
  },
  computed: {
    noRole() {
      return this.optionArr.filter(
        (item) => !this.hasRole.some((ele) => ele.RoleID == item.value)
      );
    },
  },
  watch: {
    searchName(newdata) {
      if (newdata == "") {
        this.tableData1 = this.tableData;
      } else {
        this.tableData1 = this.table1(newdata);
      }
    },
  },
  created() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getData();
    this.getOrgan();
    this.getRoleMeun();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    equalToPassword(rule, value, callback) {
      if (this.rePwForm.pwd !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },
    addPassword(rule, value, callback) {
      if (this.addForm.pwd !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },
    table1(newdata) {
      let searchName = newdata.toLowerCase();
      this.currentPage = 1;
      return this.tableData.filter((v) => {
        return Object.keys(v).some((key) => {
          return String(v[key]).toLowerCase().indexOf(searchName) > -1;
        });
      });
    },
    getData() {
      getEmployee().then((data) => {
        this.dataPrecc(data.Data);
      });
    },
    getOrgan() {
      getOrganization().then((data) => {
        if (data.Code == 100200) {
          this.organTree = this.OrganData(data.Data);
        }
      });
    },
    OrganData(organizations) {
      const organizationMap = new Map();
      organizations.forEach((org) => {
        organizationMap.set(org.OrganizationId, { ...org, children: [] });
      });
      organizations.forEach((org) => {
        if (org.ParentOrganizationId !== null) {
          const parentOrg = organizationMap.get(org.ParentOrganizationId);
          if (parentOrg) {
            parentOrg.children.push(organizationMap.get(org.OrganizationId));
          }
        }
      });
      return Array.from(organizationMap.values()).filter(
        (org) => org.ParentOrganizationId === null
      );
    },
    handleNodeClick(data) {
      this.tableData1 = this.table1(data.OrganizationId);
    },
    refreshData() {
      this.isLoding = "is-loading";
      this.currentPage = 1;
      this.searchName = "";
      this.getData();
      setTimeout(() => {
        this.isLoding = "";
      }, 2000);
    },
    getRoleMeun() {
      getAllRole().then((data) => {
        this.optionArr = data.Data.map((item) => {
          return {
            value: item.ID,
            lable: item.RoleName,
          };
        });
      });
    },
    editCancel() {
      this.editVisible = false;
      this.editRef.resetFields();
    },
    editSubmit() {
      AddEmployee(this.editForm).then((data) => {
        if (data.Code == 100200) {
          this.getData();
          this.editVisible = false;
          this.$notify({
            title: "提示",
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    getHasRole() {
      findEmployeeRoles(this.form.employeeName).then((data) => {
        if (data.Code == 100200) {
          this.hasRole = data.Data || [];
        } else {
          this.$notify.error({
            title: "提示",
            message: data.msg,
          });
        }
        this.getData()
      });
    },
    openAdd() {
      this.editVisible = true;
    },
    dataPrecc(data) {
      // 使用Map存储员工ID和对应对象的映射，提高查找效率
      const employeeMap = new Map();
      const afterData = [];

      for (const item of data) {
        const { EmployeeId, RoleName } = item;

        if (employeeMap.has(EmployeeId)) {
          // 已存在相同ID：仅更新角色数组
          const existing = employeeMap.get(EmployeeId);
          RoleName && existing.RoleName.push(RoleName);
        } else {
          // 新员工ID：创建完整对象
          const newItem = {
            employeeId: EmployeeId,
            employeeName: item.EmployeeName,
            fullName: item.FullName,
            title: item.title,
            email: item.email,
            OrganizationName: item.OrganizationName,
            OrganizationID: item.OrganizationID,
            RoleName: RoleName ? [RoleName] : [],
            LastLoginTime: item.LastLoginTime
          };
          afterData.push(newItem);
          employeeMap.set(EmployeeId, newItem);
        }
      }

      // 优化排序：使用localeCompare进行字符串排序
      afterData.sort((a, b) =>
        a.employeeName.localeCompare(b.employeeName)
      );

      this.tableData = afterData;
      this.tableData1 = afterData; // 避免不必要的数据复制

    },
    handleEdit(row) {
      this.roleName = row.fullName;
      this.form.employeeName = row.employeeName;
      findEmployeeRoles(row.employeeName).then((data) => {
        this.hasRole = data.Data || [];
        this.addVisible = true;
      });
    },
    addCancel() {
      this.addVisible = false;
    },
    onSubmit() {
      this.form.roleId = this.form.roleIdArr.join(",");
      if (!this.form.roleId) {
        this.addVisible = false;
        this.formRef.resetFields();
      } else {
        addEmployeeRole(this.form).then((res) => {
          if (res.success) {
            this.$notify({
              title: "提示",
              message: res.msg,
              type: "success",
            });
          }
          this.getData();
          this.addVisible = false;
          this.formRef.resetFields();
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
          deletefirstRole({
            EmpId: this.form.employeeName,
            RoleId: tag.RoleID,
          }).then((data) => {
            if (data.Code == 100200) {
              this.getHasRole();
              this.$notify({
                title: "提示",
                message: "删除成功",
                type: "success",
              });
            } else {
              this.$notify.error({
                title: "提示",
                message: "删除失败",
              });
            }
          });
        })
        .catch(() => {
          this.$notify({
            title: "提示",
            message: "取消操作",
            type: "info",
          });
        });
    },
    handleRest(row) {
      this.rePwForm.employeeName = row.employeeName;
      this.rePwForm.FullName = row.fullName;
      this.restVisible = true;
    },
    handleAdd() {
      this.addPwdVisible = true;
    },
    upDateCancel() {
      this.restVisible = false;
      this.$refs.reFormRef.resetFields();
    },
    addPwdCancel() {
      this.addPwdVisible = false;
      this.$refs.addFormRef.resetFields();
    },
    upDateSubmit() {
      this.$refs.reFormRef.validate((valid) => {
        if (valid) {
          let data = {
            employeeName: this.rePwForm.employeeName,
            pwd: this.rePwForm.pwd,
            FullName: this.rePwForm.FullName
          };
          ResetEmpPwd(data).then((res) => {
            if (res.Success) {
              this.$notify({
                title: "提示信息",
                message: "重置成功",
                type: "success",
              });
            } else {
              this.$notify.error({

                title: "提示信息",
                message: res.Message||"重置失败",
    
              });
            }
            this.getData();
            this.restVisible = false;
          });
        }
      });
    },
    addSubmit() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          let data = {
            EmployeeName: this.addForm.employeeName,
            FullName: this.addForm.FullName,
            CreateBy: getToken(),
            IsOnline: "Y"
          };
          OpcenterEmployeeSync(data).then(res => {
            if (res.Success) {
              this.$notify({
                  title: "提示信息",
                message:"添加成功",
                type: "success",
              });
            } else {
              this.$notify.error({
                  title: "提示信息",
                message: res.Message
                // message: res.msg,
              });
            }
            this.getData();
            this.addPwdVisible = false;
          })
          // AddEmployee(data).then((res) => {
          //   if (res.Code == 100200) {
          //     this.$notify({
          //       title: "添加成功",
          //       type: "success",
          //     });
          //   } else {
          //     this.$notify.error({
          //       title: "添加失败",
          //       message: res.msg,
          //     });
          //   }
          //   this.getData();
          //   this.addPwdVisible = false;
          // });
        }
      });
    },
    handleDelete(row) {
      console.log(row);
      
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          OpcenterEmployeeSync({
            EmployeeName: row.employeeName,
            FullName: row.fullName,
            CreateBy: getToken(),
            IsOnline: "N"
          }).then(res => {
            if (res.Success) {
              this.getData();
              this.$notify({
                title: "提示信息",
                message:"删除成功",
                type: "success",
              });
            } else {
              this.$notify.error({
                title: "提示信息",
                  message: res.Message
              });
            }
          })
          // deleteEmployee(row.employeeName).then((data) => {
          //   if (data.Code == 100200) {
          //     this.getData();
          //     this.$notify({
          //       title: "删除成功",
          //       type: "success",
          //     });
          //   } else {
          //     this.$notify.error({
          //       title: "删除失败",
          //     });
          //   }
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作",
          });
        });
    },
    handleHistory(row) {
      this.historyVisible = true;
      findEmpLoginLog(row.employeeName).then((data) => {
        if (data.Code == 100200) {
          this.historyData = data.Data;
        } else {
          this.historyData = []
        }
      })
        .catch(() => {
          this.historyData = []
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
        this.tableHeight = window.innerHeight - 210;
      });
    },
    getMaxLength(arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          const calcLen = this.getTextWidth(item);
          if (acc < calcLen) {
            acc = calcLen;
          }
        }
        return acc;
      }, 0);
    },
    getTextWidth(str) {
      let width = 0;
      const html = document.createElement("span");
      html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${12}px; font-family: Arial, sans-serif;`;
      html.innerText = str;
      document.body?.appendChild(html);

      const spanElement = html;
      if (spanElement) {
        width = spanElement.offsetWidth;
        spanElement.remove();
      }
      return width;
    },
    flexColumnWidth(label, prop) {
      const arr = this.tableData?.map((x) => x[prop]);
      arr.push(label);
      return this.getMaxLength(arr) + 25 + "px";
    },
  },
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}

.el-tag+.el-tag {
  margin-left: 10px;
}

.el-card ::v-deep .el-card__header {
  padding: calc(20px - 5px) 20px;
}
</style>