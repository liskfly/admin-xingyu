<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-button type="primary" @click="openAdd" size="small">添加</el-button>
      </div>
      <div class="w-full">
        <el-table size="small" :data="tableData" stripe border fit :height="tableHeight" row-key="ID"
          :tree-props="{ children: 'childMenu' }">
          <el-table-column prop="title" label="菜单名称"></el-table-column>
          <el-table-column prop="icon" label="图标" align="center" width="60">
            <template slot-scope="scope">
              <span></span>
              <a-icon :type="scope.row.icon" :style="{ fontSize: '20px' }"  v-if="scope.row.icon!=null&&scope.row.icon!=''"/>
              <!-- <i :class="'el-icon-' + scope.row.icon" style="font-size: 20px" v-if="scope.row.icon"></i> -->
            </template>
          </el-table-column>
          <el-table-column prop="path" label="PATH路径"></el-table-column>
          <el-table-column prop="MenuName" label="组件名称"></el-table-column>
          <el-table-column prop="component" label="文件路径"></el-table-column>

          <el-table-column prop="sortId" label="排序" width="60" align="center"></el-table-column>

          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-tooltip content="复制" placement="top" v-if="
                scope.row.MenuName !== 'Portal' &&
                scope.row.MenuName !== 'PDA' &&
                scope.row.MenuName !== 'OPUI'
              ">
                <el-button type="warning" icon="el-icon-document-copy" size="mini"
                  @click.prevent="handleCopy(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top" v-if="
                scope.row.MenuName !== 'Portal' &&
                scope.row.MenuName !== 'PDA' &&
                scope.row.MenuName !== 'OPUI'
              ">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click.prevent="handleEdit(scope.row)"></el-button>
              </el-tooltip>

              <el-tooltip content="删除" placement="top" v-if="
                scope.row.MenuName !== 'Portal' &&
                scope.row.MenuName !== 'PDA' &&
                scope.row.MenuName !== 'OPUI'
              ">
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click.prevent="handleDelete(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 新增对话框 -->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="addVisible" title="新增" width="40%"
      @close="addCancel">
      <el-form ref="formRef" :model="form" label-position="left" label-width="auto">
        <!-- <el-form-item label="类型" prop="type">
          <el-radio-group v-model="tabPosition">
            <el-radio-button label="目录">目录</el-radio-button>
            <el-radio-button label="菜单">菜单</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="父级菜单" prop="chooseName">
          <el-select ref="selectUpResId" v-model="chooseName" placeholder="请选择" style="width: 240px" clearable>
            <el-option :value="chooseName" disabled style="height: 100%">
              <el-tree style="min-height: 150px;" :props="defaultProps" :data="tableData" node-key="ID"
                :expand-on-click-node="false" :check-on-click-node="true" @node-click="handleNodeClick"></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="show">
          <el-switch class="ml-2" v-model="form.show">
          </el-switch>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon" placeholder="请输入图标"></el-input>
          </el-form-item> -->
        <!-- 图标选择器 -->
        <el-form-item label="选择图标">
          <el-popover v-model="iconPickerVisible1" placement="bottom" width="600" trigger="click">
            <!-- 触发按钮 -->
            <template slot="reference">
              <el-button class="icon-trigger">
                <span v-if="form.icon" class="flex items-center">
                  <a-icon :type="form.icon" />
                  <span style="margin-left: 8px">{{ form.icon }}</span>
                </span>
                <span v-else>选择图标</span>
              </el-button>
            </template>
            <div class="icon-picker">
              <el-input v-model="searchText" placeholder="搜索图标..." clearable style="margin-bottom: 10px">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <div class="icon-grid">
                <div v-for="(icon, index) in filteredIcons" :key="index" class="icon-item"
                  :class="{ selected: form.icon === icon }" @click="selectIcon(icon,'1')">
                  <a-icon :type="icon" style="font-size: 20px" />
                  <div class="icon-name">{{ icon }}</div>
                </div>
              </div>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="PATH路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入PATH路径"></el-input>
        </el-form-item>
        <el-form-item label="路由名称" prop="MenuName">
          <el-input v-model="form.MenuName" placeholder="请输入路由名称"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="form.redirect" placeholder="请输入重定向"></el-input>
        </el-form-item>
        <el-form-item label="文件路径" prop="component">
          <el-input :disabled="fmeun" v-model="form.component" placeholder="请输入组件"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortId">
          <el-input-number :min="0" controls-position="right" v-model="form.sortId" placeholder="请输入"></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="修改" :append-to-body="true" :close-on-click-modal="false" @close="editCancel()"
      :visible.sync="editVisible" width="50%">
      <el-form :model="editForm" label-width="auto">
        <el-form-item label="父级菜单">
          <el-select ref="selectUpResId" v-model="editPName" placeholder="请选择" clearable>
            <el-option :value="editPName" disabled style="height: 100%">
              <el-tree style="min-height: 150px;" :props="defaultProps" :data="tableData"
                node-key="ID" :expand-on-click-node="false" :check-on-click-node="true"
                @node-click="handleENodeClick"></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="类型" prop="MenuType">
          <el-select v-model="editForm.MenuType" placeholder="选择类型" style="width: 240px">
            <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="editForm.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="show">
          <el-switch class="ml-2" v-model="editForm.show">
          </el-switch>
        </el-form-item>
        <!-- <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon" placeholder="图标"></el-input>
        </el-form-item> -->
        <el-form-item label="选择图标">
          <el-popover v-model="iconPickerVisible2" placement="bottom" width="600" trigger="click">
            <!-- 触发按钮 -->
            <template slot="reference">
              <el-button class="icon-trigger">
                <span v-if="editForm.icon" class="flex items-center">
                  <a-icon :type="editForm.icon" />
                  <span style="margin-left: 8px">{{ editForm.icon }}</span>
                </span>
                <span v-else>选择图标</span>
              </el-button>
            </template>
            <div class="icon-picker">
              <el-input v-model="searchText" placeholder="搜索图标..." clearable style="margin-bottom: 10px">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <div class="icon-grid">
                <div v-for="(icon, index) in filteredIcons" :key="index" class="icon-item"
                  :class="{ selected: editForm.icon === icon }" @click="selectIcon(icon,'2')">
                  <a-icon :type="icon" style="font-size: 20px" />
                  <div class="icon-name">{{ icon }}</div>
                </div>
              </div>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="PATH路径" prop="path">
          <el-input v-model="editForm.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="MenuName">
          <el-input v-model="editForm.MenuName" placeholder="组件名称"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="editForm.redirect" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="文件路径" prop="component">
          <el-input :disabled="fmeun" v-model="editForm.component" placeholder="组件"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortId">
          <el-input-number :min="0" controls-position="right" v-model="editForm.sortId"
            placeholder="请输入"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 复制对话框 -->
    <el-dialog title="复制" :append-to-body="true" :close-on-click-modal="false" @close="copyCancel()"
      :visible.sync="copyVisible" width="50%">
      <el-form :model="copyform" label-width="auto" ref="copyRef">
        <el-form-item label="父级菜单">
          <el-select ref="selectUpResId" v-model="editPName" placeholder="请选择" clearable>
            <el-option :value="editPName" disabled style="height: 100%">
              <el-tree style="min-height: 150px;" :props="defaultProps" :data="tableData"
                node-key="ID" :expand-on-click-node="false" :check-on-click-node="true"
                @node-click="handleCNodeClick"></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="类型" prop="MenuType">
          <el-select v-model="copyform.MenuType" placeholder="选择类型" style="width: 240px">
            <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否显示" prop="show">
          <el-switch class="ml-2" v-model="copyform.show">
          </el-switch>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="copyform.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="图标" prop="icon">
          <el-input v-model="copyform.icon" placeholder="图标"></el-input>
        </el-form-item> -->
        <el-form-item label="选择图标">
          <el-popover v-model="iconPickerVisible3" placement="bottom" width="600" trigger="click">
            <!-- 触发按钮 -->
            <template slot="reference">
              <el-button class="icon-trigger">
                <span v-if="copyform.icon" class="flex items-center">
                  <a-icon :type="copyform.icon" />
                  <span style="margin-left: 8px">{{ copyform.icon }}</span>
                </span>
                <span v-else>选择图标</span>
              </el-button>
            </template>
            <div class="icon-picker">
              <el-input v-model="searchText" placeholder="搜索图标..." clearable style="margin-bottom: 10px">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <div class="icon-grid">
                <div v-for="(icon, index) in filteredIcons" :key="index" class="icon-item"
                  :class="{ selected: copyform.icon === icon }" @click="selectIcon(icon,'3')">
                  <a-icon :type="icon" style="font-size: 20px" />
                  <div class="icon-name">{{ icon }}</div>
                </div>
              </div>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="PATH路径" prop="path">
          <el-input v-model="copyform.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="MenuName">
          <el-input v-model="copyform.MenuName" placeholder="组件名称"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="copyform.redirect" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="文件路径" prop="component">
          <el-input :disabled="fmeun" v-model="copyform.component" placeholder="文件路径"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortId">
          <el-input-number :min="0" controls-position="right" v-model="copyform.sortId"
            placeholder="请输入"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyCancel()">取消</el-button>
        <el-button type="primary" @click="copySubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFirstMeun, addMeun, deleteMeun, updateMeun } from "@/api/control/index";
import { getToken } from "@/utils/auth";
import iconName from "@/utils/iconName";
// import { icons } from '@ant-design/icons-vue/lib/icons'

export default {
  data() {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      tableHeight: 0,
      addVisible: false,
      editVisible: false,
      copyVisible: false,
      tabPosition: "菜单",
      chooseName: "",
      fmeun: false,
      defaultProps: { label: "title", children: "childMenu" },
      form: {
        title: "",
        icon: "",
        path: "",
        MenuName: "",
        component: "",
        MenuLevel: 0,
        MenuType: '',
        MenuFID: "",
        redirect: "",
        sonNum: 0,
        sortId: 0,
        IsDelete: "",
        CreateBy: getToken(),
        CreateDate: "",
        UpdateBy: "",
        UpdateDate: "",
        show:true
      },
      copyform: {
        title: "",
        icon: "",
        path: "",
        MenuName: "",
        component: "",
        MenuLevel: 0,
        MenuType: '',
        MenuFID: "",
        redirect: "",
        sonNum: 0,
        sortId: 0,
        IsDelete: "",
        CreateBy: getToken(),
        CreateDate: "",
        UpdateBy: "",
        UpdateDate: "",
        show:true
      },
      editForm: {
        path: "",
        title: "",
        component: "",
        MenuName: "",
        icon: "",
        MenuFID: "",
        MenuLevel: "",
        MenuType: '',
        redirect: "",
        id: "",
        sortId: 0,
        IsDelete: "",
        CreateBy: "",
        CreateDate: "",
        UpdateBy: getToken(),
        UpdateDate: "",
        show:true
      },
      editPName: "",
      editid: "",
      arrID: [],
      list: [
        { value: 'Portal', label: 'Portal' },
        { value: 'PDA', label: 'PDA' },
        { value: 'OPUI', label: 'OPUI' }
      ],
      value1: true,
      iconPickerVisible1: false,
      iconPickerVisible2: false,
      iconPickerVisible3: false,
      searchText: '',
      // 提取所有ant图标名称（Vue2适配）
       allIcons: iconName
    };
  },
  computed: {
    filteredIcons() {
      return iconName.filter(icon =>
        icon.includes(this.searchText.toLowerCase())
      )
    }
  },
  watch: {
    tabPosition(newValue) {
      if (newValue == "目录") {
        this.fmeun = false;
        this.form.MenuLevel = 0;
      } else {
        this.fmeun = false;
        this.form.component = "";
      }
    }
  },
  created() {
    this.getScreenHeight();
    this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    selectIcon(icon,type) {
      if(type == 1) {
        this.form.icon = icon
        this.iconPickerVisible1 = false
      } else if(type == 2) {
        this.editForm.icon = icon
        this.iconPickerVisible2= false
      } else if(type == 3) {
        this.copyform.icon = icon
        this.iconPickerVisible3= false
      }
     
    },
    getData() {
      getFirstMeun().then((res) => {
        this.tableData = res.Data;
      });
    },
    openAdd() {
      this.addVisible = true;
    },
    addCancel() {
      this.addVisible = false;
      this.chooseName = '';
      this.$refs.formRef.resetFields();
    },
    handleNodeClick(data) {
      this.chooseName = data.title;
      this.form.MenuFID = data.ID;
      this.form.MenuLevel = data.MenuLevel;
      this.$refs.selectUpResId.blur();
    },
    onSubmit() {
      addMeun(this.form).then((res) => {
        this.getData();
        this.addVisible = false;
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        });
      }).catch(error => {
        this.$notify.error({
          title: '错误',
          message: '添加失败'
        });
      });
    },
    handleCopy(row) {
      this.copyform = { ...row,show:true };
      if (row.MenuFID != null) {
        this.findNameById(row.MenuFID, this.tableData);
      }
      this.copyVisible = true;
    },
    copyCancel() {
      this.copyVisible = false;
      this.$refs.copyRef.resetFields();
    },
    copySubmit() {
      addMeun(this.copyform).then((res) => {
        this.getData();
        this.copyVisible = false;
        this.$notify({
          title: '成功',
          message: '复制成功',
          type: 'success'
        });
      }).catch(error => {
        this.$notify.error({
          title: '错误',
          message: '复制失败'
        });
      });
    },
    handleCNodeClick(data) {
      this.editPName = data.title;
      this.copyform.MenuFID = data.ID;
      this.copyform.MenuLevel = data.MenuLevel + 1;
      this.$refs.selectUpResId.blur();
    },
    handleEdit(row) {
      this.editForm = {
        ...this.editForm,
        MenuFID: row.MenuFID,
        MenuLevel: row.MenuLevel,
        MenuName: row.MenuName,
        component: row.component,
        icon: row.icon,
        path: row.path,
        title: row.title,
        redirect: row.redirect,
        id: row.ID,
        sortId: row.sortId,
        MenuType: row.MenuType
      };
      this.editVisible = true;
      if (row.MenuFID != null) {
        this.findNameById(row.MenuFID, this.tableData);
      }
    },
    handleENodeClick(data) {
      this.editPName = data.title;
      this.editForm.MenuFID = data.ID;
      this.editForm.MenuLevel = data.MenuLevel + 1;
      this.$refs.selectUpResId.blur();
    },
    handleDelete(row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.arrID.unshift(row.ID);
          this.arrID.forEach((item) => {
            deleteMeun(item).then(({ data }) => {
              this.arrID = this.arrID.filter((id) => id != item);
              if (this.arrID.length == 0) {
                this.getData();
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                });
              }
            }).catch(error => {
              this.$notify.error({
                title: '错误',
                message: '删除失败'
              });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作",
          });
        });
    },
    editCancel() {
      this.editVisible = false;
    },
    editSubmit() {
      updateMeun(this.editForm).then((res) => {
        this.editVisible = false;
        this.getData();
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        });
      }).catch(error => {
        this.$notify.error({
          title: '错误',
          message: '修改失败'
        });
      });
    },
    changeSortd(row) {
      console.log(row);
    },
    findNameById(id, data) {
      data.forEach((x, i) => {
        if (data[i].ID == id) {
          this.editPName = data[i].title;
          return;
        } else if (data[i].childMenu) {
          const resultData = void this.findNameById(id, data[i].childMenu);
          if (resultData) {
            this.editPName = resultData;
            return;
          }
        }
      });
    },
    dataDispose(row) {
      if (row.sonNum != null) {
        row.childMenu.forEach((item) => {
          this.arrID.unshift(row.id);
          if (item.sonNum != 0) {
            return this.dataDispose(item);
          }
        });
      } else {
        return;
      }
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
        this.tableHeight = window.innerHeight - 180;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-picker {
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.icon-item:hover {
  background-color: #f5f5f5;
}

.icon-item.selected {
  background-color: #e6f7ff;
  border: 1px solid #1890ff;
}

.icon-name {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  word-break: break-all;
  text-align: center;
}

.icon-trigger {
  width: 200px;
  justify-content: start;
}

</style>
<style scoped>
.el-pagination {
  justify-content: center;
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>