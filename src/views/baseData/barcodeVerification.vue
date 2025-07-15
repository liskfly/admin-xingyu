<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <div>
          <el-button type="primary" @click="openAdd">添加</el-button>
          <el-button type="primary" @click="openHistory"
            >校验查询</el-button
          >
        </div>
        <div>
          <el-input
            v-model="getForm.SearchModel.checkpro_no"
            placeholder=""
            style="width: 350px"
            @keyup.enter.native="getData()"
            clearable
            @clear="clearData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getData()"
            ></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        :height="tableHeight"
        size="small"
        style="width: 100%"
      >
        <!-- <el-table-column type="index" label="序号" width="55" /> -->
        <el-table-column label="序号" width="55" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
            }}</span>
          </template>
        </el-table-column>
        <af-table-column prop="checkpro_no" label="物料编码" width="220">
        </af-table-column>
        <el-table-column prop="checkpro_sepc" label="规则"> </el-table-column>
        <el-table-column prop="checkpro_date" label="时间"> </el-table-column>
        <af-table-column prop="checkpro_user" label="操作人" width="145">
        </af-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
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
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex"
          :page-size="getForm.PageSize"
          :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="'添加'"
      :visible.sync="dialogVisible"
      width="30%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="物料编码">
          <el-input v-model="addForm.checkpro_no" placeholder="" />
        </el-form-item>
        <el-form-item label="规则">
          <el-input v-model="addForm.checkpro_sepc" placeholder="" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="addData()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改'"
      :visible.sync="editVisible"
      width="30%"
      @close="editCancel()"
    >
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="物料编码">
          <el-input v-model="editForm.checkpro_no" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="规则">
          <el-input v-model="editForm.checkpro_sepc" placeholder="" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editData()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'校验查询'" :visible.sync="historyVisible" width="1200px" @close="historyClose">
      <div>
        <el-input
          v-model.trim="historyForm.SearchModel.checkpro_no"
          placeholder=""
          style="width: 350px"
          @keyup.enter.native="getHistoy"
          clearable
          @clear="getHistoy"
        >
          <el-button slot="append" icon="el-icon-search" @click="getHistoy"></el-button>
        </el-input>
      </div>
      <el-table :height="'500px'" :data="historyData" border size="small">
        <af-table-column prop="factorybar" label="原厂标签"> </af-table-column>
        <el-table-column prop="xybar" label="星宇标签" width="300px"> </el-table-column>
        <el-table-column prop="checkstatus" label="校验状态"> </el-table-column>
        <af-table-column prop="checkresult" label="校验说明"> </af-table-column>
        <af-table-column prop="checkdate" label="校验时间"> </af-table-column>
        <af-table-column prop="checkuser" label="校验人"> </af-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="historyForm.PageIndex"
          :page-size="historyForm.PageSize"
          :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next"
          :total="totalHistory"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  QueryChecProductFoundation,
  InsertChecProductFoundation,
  UpdateChecProductFoundation,
  DeleteChecProductFoundation,
  QueryChecProductFoundationById,
  QueryChecProductLog,
} from "@/api/puzzleApi.js";
import dayjs from "dayjs";
import { getToken } from "@/utils/auth";
import { getHistoy } from "@/api/wmsApi";

export default {
  data() {
    return {
      searchText: "",
      tableData1: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableHeight: 0,
      getForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchModel: {
          checkpro_no: "",
        },
      },
      dialogVisible: false,
      editVisible: false,
      activeName: "smallBoard",
      form: {
        list: {
          pn: "",
          model: "",
          side: "",
          name: "",
          version: "",
          softwareVersion: "",
        },
        Detail: [
          {
            version: "",
            softwareVersion: "",
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
        checkpro_no: "",
        checkpro_id: 0,
        checkpro_sepc: "",
        checkpro_date: "",
        UserNo: getToken(),
      },
      upDateForm: {
        pnl_code: "",
        list: [],
      },
      smallBoardTable: [],
      songBoardVisible: false,
      detailForm: {},
      options: [],
      options1: [],
      addForm: {
        checkpro_no: "",
        checkpro_sepc: "",
        UserNo: getToken(),
        checkpro_date: "",
      },
      historyVisible: false,
      totalHistory:0,
      historyData:[],
      historyForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchModel: {
          checkpro_no: "",
        },
      },
    };
  },
  watch: {},
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
      QueryChecProductFoundation(this.getForm).then((res) => {
        if (res.Success) {
          this.tableData = res.Data.list;
          this.total = res.Data.Total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    addData() {
      InsertChecProductFoundation({
        ...this.addForm,
        checkpro_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      }).then((res) => {
        if (res.Success) {
          this.dialogVisible = false;
          this.getData();
          this.$message({
            message: "成功",
            type: "success",
          });
        } else {
          this.$message.error(res.Msg);
        }
      });
    },
    editData() {
      UpdateChecProductFoundation({
        ...this.editForm,
        checkpro_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      }).then((res) => {
        if (res.Success) {
          this.editVisible = false;
          this.getData();
          this.$message({
            message: "成功",
            type: "success",
          });
        } else {
          this.$message.error(res.Msg);
        }
      });
    },
    getHistoy() {
      QueryChecProductLog(this.historyForm).then((res) => {
        if (res.Success) {
          this.historyData = res.Data.list;
          this.totalHistory = res.Data.Total;
        } else {
          this.historyData = [];
          this.total = 0;
        }
      });
    },
    historyClose() {
      this.historyForm.SearchModel.checkpro_no = '';
      this.historyData = [];
      this.totalHistory = 0;
    },
    clearData() {
      this.searchText = "";
      this.getForm.PageIndex = 1;
      this.getData();
    },
    openAdd() {
      this.dialogVisible = true;
    },
    openHistory() {
      this.historyVisible = true;
      // this.getHistoy();
    },
    change(val, index) {
      this.form.Detail[index].name = val.name;
      this.form.Detail[index].model = val.pn_spec;
    },
    remoteMethod(query, cb) {
      const reg = /^105057\d*$/;
      if (query !== "" && reg.test(query)) {
        findPartNumberData(query).then((res) => {
          if (res.Success) {
            if (res.Data === null || res.Data.length === 0) {
              this.$notify({
                type: "error",
                title: "提示信息",
                message: "未查询到相关数据",
              });
              cb([]);
              return;
            }
            const searchData = JSON.parse(res.Data);
            cb(
              searchData.map((item) => {
                return {
                  value: item.PN,
                  ...item,
                };
              })
            );
          }
        });
      }
    },
    change1(val, index) {
      this.smallBoardTable[index].name = val.name;
      this.smallBoardTable[index].model = val.pn_spec;
    },
    remoteMethod1(query) {
      const reg = /^10505\d*$/;
      if (query !== "" && reg.test(query)) {
        findPartNumberData(query).then((res) => {
          if (res.Success) {
            this.options1 = JSON.parse(res.Data);
          } else {
            this.$notify({
              type: "error",
              title: "提示信息",
              message: res.Msg,
            });
          }
        });
      }
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
          DeleteChecProductFoundation({
            checkpro_id: row.checkpro_id,
            UserNo: getToken(),
          }).then((res) => {
            if (res.Success) {
              this.editVisible = false;
              this.getData();
              this.$message({
                message: "成功",
                type: "success",
              });
            } else {
              this.$message.error(res.Msg);
            }
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
    onSubmit() {
      // console.log(this.form);

      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // console.log("submit!");
          if (
            this.form.Detail.length === 1 &&
            this.form.Detail[0].finished_code === ""
          ) {
            this.$notify({
              type: "error",
              title: "提示信息",
              message: "小板明细不能为空",
            });
            return;
          }
          this.form.Detail = this.form.Detail.filter(
            (item) => item.finished_code !== ""
          );
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
        } else {
          this.$notify({
            type: "error",
            title: "提示信息",
            message: "请检查表单数据",
          });
          return false;
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
    handleEdit(row) {
      // console.log(row);
      this.editForm.checkpro_id = row.checkpro_id;
      this.editForm.checkpro_no = row.checkpro_no;
      this.editForm.checkpro_sepc = row.checkpro_sepc;
      this.editVisible = true;
    },
    upDateSubmit() {
      this.editForm.cr_user = getToken();
      this.editForm.cr_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      UpdatePanelizationList(this.editForm).then((res) => {
        if (res.Success) {
          this.$notify({
            type: "success",
            title: "提示信息",
            message: res.Msg,
          });
          // this.detailVisible = false;
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
    editCancel() {
      this.editForm = {
        checkpro_no: "",
        checkpro_id: 0,
        checkpro_sepc: "",
        UserNo: getToken(),
      };
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
      // if (this.smallBoardTable.length === 1 && this.smallBoardTable[0].finished_code === "") {
      //   this.$notify({
      //     type: "error",
      //     title: "提示信息",
      //     message: "小板明细不能为空",
      //   });
      //   return;
      // } else {
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
      // }
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
