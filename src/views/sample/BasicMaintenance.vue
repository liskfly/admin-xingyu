<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2 flex items-center justify-between">
        <el-button type="primary" @click="openAdd">新增</el-button>
        <el-input
          v-model="searchName"
          style="width: 350px"
          clearable
          placeholder="请输入"
          @keyup.enter.native="searchData()"
          @clear="clearData"
        >
          <template slot="append">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchData()"
            ></el-button>
          </template>
        </el-input>
      </div>
      <el-table
        :data="tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        border
        :height="tableHeight"
        style="width: 100%"
      >
        <!-- <el-table-column type="index" label="序号" width="55" /> -->
        <el-table-column label="序号" width="55">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</span>
          </template>
        </el-table-column>
        <af-table-column prop="Tool" label="样件编码"> </af-table-column>
        <!-- <af-table-column prop="Model" label="成品编码"> </af-table-column> -->
        <!-- <el-table-column
          prop="MaterialName"
          label="样件名称"
          width="80"
          align="center"
        >
        </el-table-column> -->
        <!-- <af-table-column prop="version" label="版本"> </af-table-column> -->
        <af-table-column prop="Model" label="样件类型">
        </af-table-column>
        <af-table-column prop="SS_Content" label="封样内容">
        </af-table-column>
        <af-table-column prop="SS_Date" label="封样日期"> </af-table-column>
        <!-- <af-table-column prop="softwareVersion" label="刷新日期">
        </af-table-column>
        <af-table-column prop="softwareVersion" label="有效期">
        </af-table-column> -->
        <af-table-column prop="SS_User" label="封样人"> </af-table-column>
        <af-table-column prop="Dsc" label="备注"> </af-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            ></el-button>
            <!-- <el-button
              type="success"
              size="mini"
              icon="el-icon-document"
              @click="handleDetail(scope.row)"
            ></el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next"
          :total="tableData1.length"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="'新增'"
      :visible.sync="dialogVisible"
      width="1000px"
      @close="addCancel()"
    >
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="样件编码" prop="compid">
          <el-input v-model="form.compid" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="成品编码" prop="Model">
          <el-select
            v-model="form.Model"
            @change="change"
            filterable
            placeholder=""
          >
            <el-option
              v-for="item in typeList"
              :key="item.ToolsMold"
              :label="item.ToolsMold"
              :value="item.ToolsMold"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="MaterialName">
          <el-input v-model="form.MaterialName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="版本" prop="component">
          <el-input v-model="form.component" placeholder=""></el-input>
        </el-form-item> -->
        <el-form-item label="样件类型" prop="compname">
          <el-select v-model="form.compname" filterable placeholder="">
            <el-option
              v-for="item in typeList"
              :key="item.ToolsMold"
              :label="item.ToolsMold"
              :value="item.ToolsMold"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封样内容" prop="sS_Content">
          <el-input v-model="form.sS_Content" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="封样日期" prop="sS_Date">
          <el-date-picker
            v-model="form.sS_Date"
            type="date"
            placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="刷新日期" prop="sS_UpdateDate">
          <el-date-picker
            v-model="form.sS_UpdateDate"
            type="date"
            placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="有效期(年)" prop="sortId">
          <el-input v-model="form.component" placeholder=""></el-input>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'编辑'" :visible.sync="editVisible" width="1000px">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="样件编码" prop="compid">
          <el-input
            v-model="editForm.compid"
            placeholder=""
            disabled
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="成品编码" prop="Model">
          <el-select
            v-model="editForm.Model"
            @change="change"
            filterable
            placeholder=""
          >
            <el-option
              v-for="item in typeList"
              :key="item.ToolsMold"
              :label="item.ToolsMold"
              :value="item.ToolsMold"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="MaterialName">
          <el-input v-model="editForm.MaterialName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="版本" prop="component">
          <el-input v-model="editForm.component" placeholder=""></el-input>
        </el-form-item> -->
        <el-form-item label="样件类型" prop="compname">
          <el-select
            v-model="editForm.compname"
            @change="change"
            filterable
            placeholder=""
          >
            <el-option
              v-for="item in typeList"
              :key="item.ToolsMold"
              :label="item.ToolsMold"
              :value="item.ToolsMold"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封样内容" prop="sS_Content">
          <el-input v-model="editForm.sS_Content" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="封样日期" prop="sS_Date">
          <el-date-picker
            v-model="editForm.sS_Date"
            type="date"
            placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="刷新日期" prop="sS_UpdateDate">
          <el-date-picker
            v-model="editForm.sS_UpdateDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="有效期(年)" prop="sortId">
          <el-input v-model="form.component" placeholder="" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEditSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { iDControll, moldControl } from "@/api/all.js";
import dayjs from "dayjs";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      tableData: [],
      tableData1: [],
      typeList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableHeight: 0,
      getForm: {
        operationType: "",
        compid: "*",
        compname: "",
        remark: "",
        user: "",
        expirationDate: "",
        selectType: ["3"],
      },
      getText: {
        toolsMold: "*",
        remark: "",
        operationType: "Q",
      },
      dialogVisible: false,
      editVisible: false,
      activeName: "smallBoard",
      form: {
        compid: "",
        sS_Date: "",
        sS_Content: "",
        compname:"",
        sS_User: getToken(),
        sS_UpdateDate:'',
        remark: "",
        selectType: ["3"],
      },
      detailVisible: false,
      editForm: {
        compid: "",
        sS_Date: "",
        compname:"",
        sS_Content: "",
        sS_User: getToken(),
        sS_UpdateDate:'',
        remark: "",
        selectType: ["3"],
      },
      upDateForm: {
        pnl_code: "",
        list: [],
      },
      smallBoardTable: [],
      songBoardVisible: false,
      detailForm: {},
      searchName:''
    };
  },
  beforeMount() {
    this.getScreenHeight();
    this.getData();
    this.getIdData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      iDControll({ ...this.getForm, operationType: "Q" }).then((res) => {
        if (res.data.Status) {
          this.tableData = res.data.DataList;
          this.tableData1 = res.data.DataList;
        } else {
          this.tableData = [];
          this.tableData1 = [];
        }
      });
    },
    getIdData() {
      moldControl(this.getText).then((res) => {
        this.typeList = res.data.DataList.filter((item) => {
          return item.Category == "3";
        });
      });
    },
    searchData() {
      if (this.searchName == "") {
        this.tableData1 = this.tableData;
      } else {
        this.tableData1 = this.table1(this.searchName);
      }
    },
    // 打开添加对话框
    table1(newdata) {
      let searchName = newdata.toLowerCase();
      this.currentPage = 1;
      console.log();
      
      return this.tableData.filter((v) => {
        if (
          String(v.Tool).toLowerCase().indexOf(searchName) > -1 ||
          String(v.Model).toLowerCase().indexOf(searchName) > -1
        ) {
          return true;
        } else {
          return false;
        }
      });
    },
    openAdd() {
      this.dialogVisible = true;
    },
    openEdit() {
      this.editVisible = true;
    },
    removeBoardItem(index) {
      this.form.Detail.splice(index, 1);
      if (this.form.Detail.length === 0) {
        this.form.Detail.push({
          version: "",
          small_board_qty: 0,
          finished_code: "",
          name: "",
          model: "",
          pcb_code: "",
          module_start: 0,
          module_end: 0,
        });
      }
    },
    addSmallBoard() {
      this.form.Detail.push({
        version: "",
        small_board_qty: 0,
        finished_code: "",
        name: "",
        model: "",
        pcb_code: "",
        module_start: 0,
        module_end: 0,
      });
    },
    deleteBoard() {
      this.form.smallBoardTable.pop();
    },
    handleDelete(row) {
      this.$confirm("是否删除", "提示", {
        type: "warning",
      })
        .then(() => {
          let data = {
            operationType: "D",
            compid: row.Tool,
            compname: row.Model,
            remark: "",
            user: getToken()
          };
          iDControll(data)
            .then((res) => {
              if (res.data.Status == "OK") {
                this.$notify({
                  title: "提示信息",
                  message: "删除成功",
                  type: "success",
                });
                this.getData(); // 重新获取数据
              } else {
                this.$notify({
                  title: "提示信息",
                  message: res.data.Message,
                  type: "error",
                });
              }
            })
            .catch(() => {
              this.$message.error("请求失败，请稍后再试");
            });
        })
        .catch(() => {
          this.$notify({
            type: "info",
            title: "提示信息",
            message: "已取消删除",
          });
        });
    },
    handleDetail() {
      this.detailVisible = true;
    },
    onSubmit() {
      iDControll({...this.form,operationType:"I"}).then((res) => {
        if (res.data.Status == "OK") {
          this.$notify({
            title: "提示信息",
            message: "添加成功",
            type: "success",
          });
          this.dialogVisible = false;
          this.getData();
          // 重置表单
        } else {
          this.$notify({
            title: "提示信息",
            message: res.data.Message,
            type: "error",
          });
        }
      });
    },
    restForm() {
      this.form = {
        list: {
          pn: "",
          model: "",
          side: "",
          name: "",
          version: "",
        },
        Detail: [
          {
            version: "",
            small_board_qty: 0,
            finished_code: "",
            name: "",
            model: "",
            pcb_code: "",
            module_start: 0,
            module_end: 0,
          },
        ],
      };
    },
    addCancel() {
      this.dialogVisible = false;
      this.form = {};
    },
    handleEdit(row) {
      this.editForm = {
        compid: row.Tool,
        sS_Date: row.SS_Date,
        compname:row.Model,
        sS_Content: row.SS_Content,
        sS_User: getToken(),
        sS_UpdateDate:row.SS_UpdateDate,
        remark: row.Dsc,
        selectType: ["3"],
      };
      this.editVisible = true;
    },
    addDetailCancel() {
      this.detailVisible = false;
      this.smallBoardTable = [];
      this.$refs.editFormRef.resetFields();
    },
    handleDetailEdit() {
      this.smallBoardTable.push({
        version: "",
        small_board_qty: 0,
        finished_code: "",
        name: "",
        model: "",
        pcb_code: "",
        module_start: 0,
        module_end: 0,
      });
    },
    onEditSubmit() {
      iDControll({...this.editForm,operationType:"U"}).then((res) => {
        if (res.data.Status == "OK") {
          this.$notify({
            title: "提示信息",
            message: "修改成功",
            type: "success",
          });
          this.editVisible = false;
          this.getData();
          // 重置表单
        } else {
          this.$notify({
            title: "提示信息",
            message: res.data.Message,
            type: "error",
          });
        }
      });
    },
    onDetailSubmit() {
      this.smallBoardTable = this.smallBoardTable.filter(
        (item) => item.finished_code !== ""
      );
      this.smallBoardTable.forEach((item) => {
        item.cr_user = getToken();
        item.cr_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      });
      this.upDateForm.list = this.smallBoardTable;
      UpdatePanelizationDetail(this.upDateForm).then((res) => {
        if (res.Success) {
          this.$notify({
            type: "success",
            title: "提示信息",
            message: res.Msg,
          });
          this.detailVisible = false;
          this.getData();
        } else {
          this.$notify({
            type: "error",
            title: "提示信息",
            message: res.Msg,
          });
        }
      });
    },
    addCancel() {
      this.detailVisible = false;
    },
    handleSizeChange(value) {
      this.pageSize = value;
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 220;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.puzzles {
  padding: 8px;

  .table_header {
    margin-bottom: 8px;
  }
}

.form-section {
  // margin-bottom: 20px;
  .section-title {
    color: #409eff;
    font-size: 16px;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }

  .sub-title {
    font-size: 12px;
    color: #409eff;
    margin-bottom: 6px;
    padding-left: 4px;
  }

  .vertical-divider {
    position: absolute;
    left: 50%;
    top: 40px;
    bottom: 20px;
    width: 1px;
    background: #eee;
  }
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
