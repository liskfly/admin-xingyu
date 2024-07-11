<template>
  <div class="role">
    <el-card class="box-card">
      <div class="table_header">
        <el-button type="primary" @click="dialogVisible = true"
          >添加角色</el-button
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
          <el-table-column prop="var1" label="角色编号" min-width="120">
          </el-table-column>
          <el-table-column prop="var2" label="角色名称"> </el-table-column>
          <el-table-column
            prop="EventDatetime"
            :formatter="dateFormat"
            label="创建时间"
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
                >角色权限</el-button
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
      title="添加角色"
      @close="addCancel()"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色编号">
          <el-input v-model="form.number" placeholder="请输入编号"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改角色"
      @close="editCancel()"
      :visible.sync="editVisible"
      width="500px"
    >
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="角色编号">
          <el-input v-model="editForm.number" placeholder="请输入编号"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="editForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="角色权限"
      @close="setCancel()"
      :visible.sync="visible"
      width="600px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              default-expand-all
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span v-if="data.ID">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    @click="() => remove(node, data)"
                  >
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form ref="form" :model="permissions" label-width="80px">
              <el-form-item>
                <el-select
                  v-model="permissions.Child_Var2"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in noPermission"
                    :key="item.var1"
                    :label="item.var2"
                    :value="item.var2"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button @click="setCancel()">取 消</el-button>
                <el-button type="primary" @click="setPermiss()"
                  >确 定</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleData,
  setRole,
  setPermission,
  deleteData,
  getRolePressions,
  getMeunData,
  editRoleData,
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
        number: "",
        name: "",
      },
      permissions: {
        P_Var1: "",
        P_Var2: "",
        Child_Var1: "",
        Child_Var2: "",
        P_ModeName: "",
        Child_ModeName: "",
        Current_ModeName: "",
      },
      treeData: [],
      defaultProps: {
        label: "var2",
        children: "pression",
      },
      noPermission: [],
      editVisible:false,
      editForm: {
        ID:'',
        number: "",
        name: "",
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    getData() {
      getRoleData().then(({ data }) => {
        this.tableData = xmlTagToJson(data, "Table");
      });
    },
    onSubmit() {
      this.dialogVisible = false;
      setRole(this.form).then(({ data }) => {
        this.getData();
      });
    },
    addCancel() {
      this.dialogVisible = false;
      this.form = {
        number: "",
        name: "",
      };
    },
    handleAssigned(index, row) {
      this.visible = true;
      this.permissions = {
        P_Var1: row.var1,
        P_Var2: row.var2,
        Child_Var1: "",
        Child_Var2: "",
        P_ModeName: "角色信息",
        Child_ModeName: "权限信息",
        Current_ModeName: "角色权限管理",
      };
      this.restPressions();
    },
    setPermiss() {
      // this.visible = false;
      this.noPermission.forEach((item) => {
        if (item.var2 == this.permissions.Child_Var2) {
          this.permissions.Child_Var1 = item.var1;
        }
      });
      // console.log(this.permissions);
      setPermission(jsonToxml(this.permissions)).then(({ data }) => {
        // console.log(xmlTagToJson(data, "Table"));
        this.restPressions();
        this.permissions.Child_Var1 = "";
        this.permissions.Child_Var2 = "";
      });
    },
    restPressions() {
      getRolePressions(this.permissions.Current_ModeName).then(({ data }) => {
        this.dataProcesse(xmlTagToJson(data, "Table"), this.permissions.P_Var1);
      });
    },
    setCancel() {
      this.visible = false;
      this.permissions = {
        P_Var1: "",
        P_Var2: "",
        Child_Var1: "",
        Child_Var2: "",
        P_ModeName: "",
        Child_ModeName: "",
        Current_ModeName: "",
      };
      this.optionCardShow = false;
    },
    handleEdit(index, row) {
      this.editVisible=true
      console.log(row);
      this.editForm={
        ID:row.ID,
        number:row.var1,
        name:row.var2
      }
    },
    editCancel(){
      this.editVisible=false
    },
    editSubmit(){
      editRoleData(this.editForm).then(({data})=>{
        this.editVisible=false
        // console.log(xmlTagToJson(data, "Table"));
        this.getData()
      })
    },
    handleDelete(index, row) {
      deleteData(row.ID).then(({ data }) => {
        this.getData();
        // console.log(xmlTagToJson(data, "Table"));
      });
    },
    dateFormat(row) {
      // console.log(row,column);
      let date = row.EventDatetime;
      return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    dataProcesse(data, row) {
      let unData = [];
      const uniqueObj = {};
      data.forEach((item) => {
        let obj = {
          var1: item.var1,
          var2: item.var2,
          pression: [
            {
              ID: item.ID,
              var1: item.var11,
              var2: item.var21,
            },
          ],
        };
        unData.push(obj);
      });
      // console.log(unData);
      for (let obj of unData) {
        const key = obj.var1;
        if (uniqueObj[key]) {
          const existingPressionVar11 = new Set(
            uniqueObj[key].pression.map((item) => item.var1)
          );
          obj.pression.forEach((item) => {
            if (!existingPressionVar11.has(item.var1)) {
              uniqueObj[key].pression.push(item);
              existingPressionVar11.add(item.var11);
            }
          });
        } else {
          uniqueObj[key] = obj;
        }
      }
      let result = Object.values(uniqueObj);
      console.log(result);
      result = result.filter(({ var1 }) => var1 == row);
      if (result.length == 0) {
        this.treeData = [];
      } else {
        this.treeData = result;
      }
      // console.log(this.treeData);
      getMeunData().then(({ data }) => {
        let permissionsData = xmlTagToJson(data, "Table");
        if (this.treeData.length == 0) {
          this.noPermission = permissionsData;
        } else {
          this.noPermission = permissionsData.filter(
            (item) =>
              !this.treeData[0].pression.some(
                (item2) => item.var1 == item2.var1
              )
          );
        }

      });
    },
    remove(a, b) {
      deleteData(b.ID).then(({ data }) => {
        this.restPressions();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.role {
  box-sizing: border-box;
  padding: 20px;
  .table_header {
  padding-bottom: 20px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
}

</style>