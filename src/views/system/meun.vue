<template>
  <div class="meun">
    <el-card class="box-card">
      <div class="table_header">
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </div>
      <div class="table_container">
        <el-table
          :data="tableData"
          :height="tableHeight"
          row-key="xyClientMenuId"
          border
          style="width: 100%"
          :tree-props="{ children: 'childs' }"
        >
          >
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="title" label="菜单名称"> </el-table-column>
          <el-table-column prop="icon" label="图标"> </el-table-column>
          <el-table-column prop="component" label="组件"> </el-table-column>
          <el-table-column prop="path" label="路径"> </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
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
      </div>
    </el-card>
    <el-dialog
      title="添加"
      @close="addCancel()"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="菜单类型" prop="tabPosition">
          <el-radio-group v-model="tabPosition">
            <el-radio-button label="目录">目录</el-radio-button>
            <el-radio-button label="菜单">菜单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级菜单" prop="chooseName">
          <el-select
            :disabled="fmeun"
            ref="selectUpResId"
            v-model="chooseName"
            placeholder="请选择"
            clearable
          >
            <el-option
              :value="chooseName"
              disabled
              style="overflow: auto; height: 100%"
            >
              <el-tree
                style="min-height: 150px; max-height: 300px"
                :props="defaultProps"
                :data="tableData"
                node-key="xyClientMenuId"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-click="handleNodeClick"
              >
              </el-tree
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="form.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input
            :disabled="fmeun"
            v-model="form.component"
            placeholder="组件"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件名称">
          <el-input
            v-model="form.xyClientMenuName"
            placeholder="组件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="图标"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改"
      @close="editCancel()"
      :visible.sync="editVisible"
      width="50%"
    >
      <el-form :model="editform" ref="form" label-width="80px">
        <el-form-item label="父级菜单">
          <el-select
            ref="selectUpResId"
            v-model="editPName"
            placeholder="请选择"
            clearable
          >
            <el-option
              :value="editPName"
              disabled
              style="overflow: auto; height: 100%"
            >
              <el-tree
                style="min-height: 150px; max-height: 300px"
                :props="defaultProps"
                :data="tableData"
                node-key="xyClientMenuId"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-click="handleENodeClick"
              >
              </el-tree
            ></el-option>
          </el-select>
          <!-- <el-input v-model="editform.clientMenuFID">

        </el-input> -->
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="editform.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="editform.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input
            :disabled="fmeun"
            v-model="editform.component"
            placeholder="组件"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件名称">
          <el-input
            v-model="editform.xyClientMenuName"
            placeholder="组件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editform.icon" placeholder="图标"></el-input>
        </el-form-item>
        <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFirstMeun,
  getChildMeun,
  addMeun,
  deleteMeun,
  updateMeun,
} from "@/api/index";

export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      treeData: [],
      tableHeight: 0,
      form: {
        clientLevel: "",
        clientMenuFID: "",
        title: "",
        component: "",
        xyClientMenuName: "",
        icon: "",
      },
      tabPosition: "菜单",
      chooseName: "",
      defaultProps: {
        label: "title",
        children: "childs",
        // isLeaf: "hasChildren",
      },
      fmeun: false,
      // choosePath: "",
      arrID: [],
      editVisible: false,
      editform: {},
      editPName: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log( window.innerHeight);
      this.tableHeight = window.innerHeight - 250;
      //后面的50：根据需求空出的高度，自行调整
    });
    this.getData();
  },
  watch: {
    tabPosition(a) {
      if (a == "目录") {
        this.fmeun = true;
        this.form.clientLevel = "1";
        this.form.component = "Layout";
      } else {
        this.fmeun = false;
        this.form.component = "";
      }
    },
  },
  methods: {
    getData() {
      getFirstMeun().then(({ data }) => {
        // console.log(data.content);
        // this.tableData = data.content;
        this.tableData = data.content;
        // this.treeData = data.content.map((item) => {
        //   // console.log(item);
        //   if (item.sonNum > 0) {
        //     return {
        //       ...item,
        //       hasChildren: false,
        //     };
        //   } else {
        //     return {
        //       ...item,
        //       hasChildren: true,
        //     };
        //   }
        // });
      });
    },

    addCancel() {
      this.dialogVisible = false;
    },
    onSubmit() {
      addMeun(this.form).then((res) => {
        // console.log(res.data);
        this.getData();
        this.dialogVisible = false;
      });
    },
    editCancel() {
      this.editVisible = false;
    },
    editSubmit(){
      updateMeun(this.editform).then(res=>{
        // console.log(res);
         this.editVisible = false;
        this.getData()
      })
    },
    handleEdit(index, row) {
      this.editform = row;
      this.editVisible = true;
      if (row.clientMenuFID != null) {
        this.editPName = this.findNameById(row.clientMenuFID, this.tableData);
      }
    },
    findNameById(id, data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].xyClientMenuId === id) {
          // console.log(data[i].title);
          return data[i].title; //名称
        } else if (data[i].childs) {
          const result = this.findNameById(id, data[i].childs);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    handleENodeClick(data) {
      this.editPName = data.title;
      this.editform.clientMenuFID = data.xyClientMenuId;
      this.editform.clientLevel = data.clientLevel + 1;
      // console.log(this.editform);
      this.$refs.selectUpResId.blur();
    },
    handleDelete(index, row) {
      // console.log(row);
      this.arrID.unshift(row.xyClientMenuId);
      this.dataDispose(row);
      // console.log(this.arrID);
      this.arrID.forEach((item) => {
        deleteMeun(item).then(({ data }) => {
          console.log(data);
          this.arrID = this.arrID.filter((id) => id != item);
          // console.log(this.arrID);
          if (this.arrID.length == 0) {
            this.getData();
          }
        });
      });
    },
    dataDispose(row) {
      if (row.sonNum != 0) {
        row.childs.forEach((item) => {
          this.arrID.unshift(item.xyClientMenuId);
          if (item.sonNum != 0) {
            return this.dataDispose(item);
          }
        });
      } else {
        return;
      }
    },
    handleNodeClick(data) {
      this.chooseName = data.title;
      this.form.clientMenuFID = data.xyClientMenuId;
      this.form.clientLevel = data.clientLevel + 1;
      // this.choosePath = data.path;
      this.$refs.selectUpResId.blur();
    },
    // loadNode(node, resolve) {
    //   if (node.level === 0) {
    //     return resolve(this.treeData);

    //   } else {
    //     //    console.log(node);
    //     getChildMeun(node.data.xyClientMenuId).then(({ data }) => {
    //       let arr = data.content.map((item) => {
    //         if (item.sonNum > 0) {
    //           return {
    //             ...item,
    //             hasChildren: false,
    //           };
    //         } else {
    //           return {
    //             ...item,
    //             hasChildren: true,
    //           };
    //         }
    //       });
    //       resolve(arr);
    //     });
    //   }
    // },
    //   load(tree, treeNode, resolve) {
    //   // console.log(tree);
    //   getChildMeun(tree.xyClientMenuId).then(({ data }) => {
    //     let arr = data.content.map((item) => {
    //       if (item.sonNum > 0) {
    //         return {
    //           ...item,
    //           hasChildren: true,
    //         };
    //       } else {
    //         return {
    //           ...item,
    //           hasChildren: false,
    //         };
    //       }
    //     });
    //     resolve(arr);
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
.meun {
  padding: 20px;
  .table_header {
    padding-bottom: 20px;
    display: flex;
    // gap: 30px;
    // justify-content: flex-end;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
}
</style>
