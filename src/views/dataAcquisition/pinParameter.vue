<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <el-button type="primary" @click="openAdd">添加</el-button>
        <div> <el-input v-model="getForm.DataCollectionDefName" placeholder="请输入程序名" style="width: 300px;"
            @keyup.enter.native="getData" /> <el-button type="primary" @click="getData">查询</el-button></div>
      </div>
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        " :style="{ width: '100%' }" border :height="tableHeight" stripe size="small">
        <el-table-column width="50" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + pageSize * (currentPage - 1) + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ColumnPosition" label="插针头" />
        <el-table-column prop="DataCollectionDefName" label="程式名" />
        <el-table-column prop="PositionType" label="针类型" >
          <template slot-scope="scope">
           
            <el-tag  v-if="scope.row.PositionType==1" type="info" effect="dark">小针</el-tag>
            <el-tag  v-if="scope.row.PositionType==2" type="warning" effect="dark">大针</el-tag>
          
          </template>
        </el-table-column>
        <el-table-column prop="StandardValue" label="标准值" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleEdit(scope.row)"></el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'添加'" :visible.sync="dialogVisible" width="350px" @close="addCancel()">
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="插针头" prop="ColumnPosition">
          <el-input  v-model.number="form.ColumnPosition"    type="number"  placeholder="请输入插针头" style="width: 240px" />
        </el-form-item>
        <el-form-item label="程序名" prop="DataCollectionDefName">
          <el-select v-model="form.DataCollectionDefName" placeholder="请选择" style="width: 240px" filterable>
            <el-option v-for="item in nameList" :key="item.DataCollectionDefName" :label="item.DataCollectionDefName"
              :value="item.DataCollectionDefName">
            </el-option>
          </el-select>
          <!-- <el-input v-model="form.DataCollectionDefName" placeholder="请输入程序名" /> -->
        </el-form-item>
        <el-form-item label="针类型" prop="PositionType">
          <el-select v-model="form.PositionType" placeholder="" style="width: 240px">
            <el-option label="小针" :value="1" />
            <el-option label="大针" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="标准值" prop="StandardValue">
          <el-input v-model="form.StandardValue" placeholder="请输入标准值" style="width: 240px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'修改'" :visible.sync="editVisible" width="350px" @close="editCancel()">
      <el-form :model="editForm" ref="editFormRef" label-width="auto">
        <el-form-item label="插针头" prop="ColumnPosition">
          <el-input    type="number" v-model.number="editForm.ColumnPosition" placeholder="请输入插针头" style="width: 240px" />
        </el-form-item>
        <el-form-item label="程序名" prop="DataCollectionDefName">
          <el-select v-model="editForm.DataCollectionDefName" placeholder="请选择" style="width: 240px" filterable>
            <el-option v-for="item in nameList" :key="item.DataCollectionDefName" :label="item.DataCollectionDefName"
              :value="item.DataCollectionDefName">
            </el-option>
          </el-select>
          <!-- <el-input v-model="form.DataCollectionDefName" placeholder="请输入程序名" /> -->
        </el-form-item>
        <el-form-item label="针类型" prop="PositionType">
          <el-select v-model="editForm.PositionType" placeholder="" style="width: 240px">
            <el-option label="小针" :value="1" />
            <el-option label="大针" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="标准值" prop="StandardValue">
          <el-input v-model="editForm.StandardValue" placeholder="请输入标准值" style="width: 240px" />
        </el-form-item>
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
  addPressFitBOM,
  updatePressFitBOM,
  deletePressFitBOM,
  findAllPressFitBOM,
  findAllNamePressFitBOM,
} from "@/api/sdzApi";

export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      tableHeight: 0,
      dialogVisible: false,
      getForm: {
        PressFitBOMid: "",
        DataCollectionDefName: "",
        ColumnPosition: -1,
        PositionType: -1,
        StandardValue: "",
      },
      form: {
        PressFitBOMid: "",

        ColumnPosition: "",
        DataCollectionDefName: "",
        PositionType: "",
        StandardValue: "",
      },
      nameList: [],
      editForm: {
        PressFitBOMid: "",
        DataCollectionDefName: "",
        ColumnPosition: 0,
        PositionType: 0,
        StandardValue: "",
      },
      editVisible: false
    };
  },

  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getData();
    this.getNameData()
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getNameData() {
      findAllNamePressFitBOM({
        PressFitBOMid: "",
        DataCollectionDefName: "",
        ColumnPosition: -1,
        PositionType: -1,
        StandardValue: "",
      }).then((res) => {
        this.nameList = res.Data;
      });
    },
    getData() {
      findAllPressFitBOM(this.getForm).then((res) => {
        this.tableData = res.Data;
      });
    },
    openAdd() {
      this.dialogVisible = true;

    },
    addCancel() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
    },
    onSubmit() {
      addPressFitBOM(this.form).then((res) => {
        if (res.Success) {
          this.$notify({
            title: "提示信息",
            type: "success",
            message: "添加成功",
          });
          this.getData();
          this.$refs.formRef.resetFields();
          this.dialogVisible = false;
        } else {
          this.$notify({
            title: "提示信息",
            type: "error",
            message: res.Msg,
          });
        }
      });
    },
    handleEdit(row) {
      this.editForm = { ...row }

      this.editVisible = true
    },
    handleDelete(row) {
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePressFitBOM(row).then((res) => {
            if (res.Success) {
              this.$notify({
                title: "提示信息",
                type: "success",
                message: "删除成功",
              });
              this.getData();
            } else {
              this.$notify({
                title: "提示信息",
                type: "error",
                message: res.Msg,
              });
            }
          });
        })
        .catch(() => {
          this.$notify({
            title: "提示信息",
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editCancel() {
      this.$refs.editFormRef.resetFields();
      this.editVisible = false;
    },
    editSubmit() {
      updatePressFitBOM(this.editForm).then((res) => {
        if (res.Success) {
          this.$notify({
            title: "提示信息",
            type: "success",
            message: res.Msg,
          });
          this.getData();
          this.$refs.editFormRef.resetFields();
          this.editVisible = false;
        } else {
          this.$notify({
            title: "提示信息",
            type: "error",
            message: res.Msg,
          });
        }
      });
    },
    handleSizeChange(value) {
      this.pageSize = value;
    },
    handleCurrentChange(value) {
      this.currentPage = value;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 230;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
  // .form{
  //    display: flex;
  //     justify-content: flex-end;
  // }
}

.data {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: grid;

  .item {
    height: 40px;
    display: flex;
    border: 1px solid;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
