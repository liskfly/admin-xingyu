<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-button type="primary" @click="openAdd">添加</el-button>
      </div>
      <el-table :data="tableData" border :height="tableHeight" style="width: 100%">
        <!-- <el-table-column type="index" label="序号" width="55" /> -->
        <el-table-column label="序号" width="55">
          <template slot-scope="scope">
            <span>{{
              scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
            }}</span>
          </template>
        </el-table-column>
        <af-table-column prop="PN" label="SN码"> </af-table-column>
        <af-table-column prop="name" label="物料编码"> </af-table-column>
        <af-table-column prop="pn_spec" label="样件名称"> </af-table-column>
        <el-table-column prop="faceNumber" label="规格型号" width="80" align="center">
        </el-table-column>
        <af-table-column prop="version" label="状态"> </af-table-column>
        <af-table-column prop="softwareVersion" label="站位"> </af-table-column>
        <af-table-column prop="softwareVersion" label="储位"> </af-table-column>
        <af-table-column prop="softwareVersion" label="有效期"> </af-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
            <el-button type="success" size="mini" icon="el-icon-document" @click="handleDetail(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'添加'" :visible.sync="dialogVisible" width="400px" @close="addCancel()">
      <el-form ref="formRef" :model="form" label-position="left" label-width="auto">
        <el-form-item label="物料编码" prop="path">
          <el-input v-model="form.path" placeholder="请输入物料编码"></el-input>
        </el-form-item>
        <el-form-item label="样板SN" prop="MenuName">
          <el-input v-model="form.MenuName" placeholder="请输入样板SN"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="redirect">
          <el-input v-model="form.redirect" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="component">
          <el-input :disabled="fmeun" v-model="form.component" placeholder="请输入规格型号"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="sortId">
          <el-input :disabled="fmeun" v-model="form.component" placeholder="请输入有效期"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'修改'" :visible.sync="detailVisible" width="400px" @close="addDetailCancel()">
      <el-form ref="formRef" :model="form" label-position="left" label-width="auto">
        <el-form-item label="物料编码" prop="path">
          <el-input v-model="form.path" placeholder="请输入物料编码"></el-input>
        </el-form-item>
        <el-form-item label="样板SN" prop="MenuName">
          <el-input v-model="form.MenuName" placeholder="请输入样板SN"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="redirect">
          <el-input v-model="form.redirect" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="component">
          <el-input :disabled="fmeun" v-model="form.component" placeholder="请输入规格型号"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="sortId">
          <el-input :disabled="fmeun" v-model="form.component" placeholder="请输入有效期"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'样件使用记录'" :visible.sync="detailVisible" width="800px" @close="addDetailCancel()">

      <el-table :data="tableDetail" style="width: 100%" border :height="300" size="mini">
            <el-table-column label="序号" width="55"></el-table-column>
        <el-table-column prop="PD_model" label="工单号"> </el-table-column>
        <el-table-column prop="PD_model" label="时间"> </el-table-column>
        <el-table-column prop="PD_model" label="使用人员"> </el-table-column>
          </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  findPanelizationList,
  addPanelizationList,
  DeletePanelizationList,
  findPnDetail,
  addPanelizationdetail,
  DeletePanelizationDetail,
  UpdatePanelizationDetail
} from "@/api/puzzleApi.js";
import dayjs from "dayjs";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      tableData: [],
      tableDetail: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableHeight: 0,
      getForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        StartTime: "",
        EndTime: "",
      },
      dialogVisible: false,
      detailVisible:false,
      activeName: "smallBoard",
      form: {
        list: {
          pn: "",
          model: "",
          side: "",
          name: "",
          version: "",
          softwareVersion:""
        },
        Detail: [
          {
            version: "",
            softwareVersion:"",
            small_board_qty: 0,
            finished_code: "",
            name: "",
            model: "",
            pcb_code: "",
            module_start: 0,
            module_end: 0,
          },
        ],
      },
      detailVisible: false,
      editForm: {
        pn: "",
        model: "",
        sdie: "",
        name: "",
        version: "",
        softwareVersion:""
      },
      upDateForm: {
        pnl_code: "",
        list: [
        ],
      },
      smallBoardTable: [],
      songBoardVisible: false,
      detailForm: {},
    };
  },
  beforeMount() {
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
    getData() {
      findPanelizationList(this.getForm).then((res) => {
        console.log(res);
        
        if (res.Success) {
          this.tableData = res.Data.list;
          this.total = res.Data.Total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    openAdd() {
      this.dialogVisible = true;
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
      this.$confirm("是否删除该拼板物料", "提示", {
        type: "warning",
      })
        .then(() => {
          // DeletePanelizationList(row.PN).then((res) => {
          //   if (res.Success) {
          //     this.$notify({
          //       type: "success",
          //       title: "提示信息",
          //       message: res.Msg,
          //     });
          //     this.getData();
          //   } else {
          //     this.$notify({
          //       type: "error",
          //       title: "提示信息",
          //       message: res.Msg,
          //     });
          //   }
          // });
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
   this.form.Detail = this.form.Detail.filter((item) => item.finished_code !== "");
      if (this.form.Detail.length === 0) {
        this.$notify({
          type: "error",
          title: "提示信息",
          message: "小板明细不能为空",
        });
        return;
      }
      this.form.list.cr_user = getToken();
      this.form.list.cr_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      this.form.Detail.forEach((item) => {
        item.cr_user = getToken();
        item.cr_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      });
      addPanelizationdetail(this.form).then((res) => {
        if (res.Success) {
          this.$notify({
            type: "success",
            title: "提示信息",
            message: res.Msg,
          });
          // this.$refs.formRef.resetFields();
          // console.log(this.form);

          this.restForm();
          this.dialogVisible = false;
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
      this.$refs.formRef.resetFields();
    },
    handleEdit(row) {
      // console.log(row);
      this.upDateForm.pnl_code = row.PN;
      this.editForm = {
        pn: row.PN,
        model: row.pn_spec,
        side: row.faceNumber,
        name: row.name,
        version: row.version,
      };
      findPnDetail(row.PN).then((res) => {

        if(  res.Data==null||res.Data.length===0){
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
        }else{
          this.smallBoardTable = JSON.parse(res.Data);
      
        }
        this.dialogVisible = true;
        // console.log(this.smallBoardTable);

      });
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
    handleDetailDelete(row) {
      // console.log(row);
      this.smallBoardTable.splice(row, 1);
      if (this.smallBoardTable.length === 0) {
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
      }
    },
    onDetailSubmit() {
      // console.log(this.smallBoardTable);
      // if (this.smallBoardTable.length === 1&& this.smallBoardTable[0].finished_code === "") {
      //   this.$notify({
      //     type: "error",
      //     title: "提示信息",
      //     message: "小板明细不能为空",
      //   });
      //   return;
      // }
      this.smallBoardTable= this.smallBoardTable.filter((item) => item.finished_code !== "");
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
      this.detailVisible = false
    },
    handleSizeChange(value) {
      //
      this.getForm.PageSize = value;
      this.getData();
    },
    handleCurrentChange(val) {
      this.getForm.PageIndex = val;
      this.getData();
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
