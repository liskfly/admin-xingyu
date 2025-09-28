<template>
  <div class="smdPro">
    <el-card class="box-card" :body-style="{ padding: '8px' }">
      <div class="table_header">
        <el-button type="primary" @click="openAdd()">添加</el-button>
        <div class="input_box">
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="true"
          >
          </el-date-picker>
          <el-input
            placeholder="请输入"
            clearable
            style="width: 240px"
            v-model="getlistText.searchText"
            class="input-with-select"
            @input="getSearchData"
            @change="getSearchData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getData"
            ></el-button>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table
          :data="tableData"
          :height="tableHeight"
          border
          size="small"
          stripe
          style="width: 100%; height: 400"
        >
          <el-table-column type="index" label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{
                (getlistText.PageIndex - 1) * getlistText.PageSize +
                scope.$index +
                1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="line_code" label="线体" width="75">
          </el-table-column>
          <el-table-column prop="device_model" label="设备型号" width="100">
          </el-table-column>
          <el-table-column
            prop="fault_phenomenon"
            label="故障现象"
          ></el-table-column>
          <el-table-column prop="analysis_steps" label="分析步骤">
            <template slot-scope="scope">
              <span style="white-space: pre-wrap">{{
                scope.row.analysis_steps
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="solution_method" label="处理方法">
            <template slot-scope="scope">
              <span style="white-space: pre-wrap">{{
                scope.row.solution_method
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="maintenance_result" label="输出内容">
            <template slot-scope="scope">
              <span style="white-space: pre-wrap">{{
                scope.row.maintenance_result
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="horizontal_extension" label="横展">
            <template slot-scope="scope">
              <span style="white-space: pre-wrap">{{
                scope.row.horizontal_extension
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="时间" width="120">
            <template slot-scope="scope">
              <span style="white-space: pre-wrap">{{
                deleteText(scope.row.create_time)
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="creator" label="录入人"> </el-table-column> -->
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
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
          <el-pagination
            background
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="getlistText.PageIndex"
            :page-size="getlistText.pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="添加"
      @close="addCancel()"
      :visible.sync="dialogVisible"
      width="1000px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        inline
      >
        <el-form-item label="线体" prop="line_code">
          <el-select
            v-model="form.line_code"
            filterable
            allow-create
            default-first-option
            placeholder=""
            style="width: 300px"
            :disabled="show"
            @focus="getLine()"
          >
            <el-option
              v-for="item in lineList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="device_model">
          <el-select
            v-model="form.device_model"
            filterable
            allow-create
            default-first-option
            placeholder=""
            style="width: 300px"
            @focus="getType()"
          >
            <el-option
              v-for="item in typeList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障现象" prop="fault_phenomenon">
          <el-input
            style="width: 710px"
            v-model="form.fault_phenomenon"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="分析步骤" prop="analysis_steps">
          <el-input
            style="width: 710px"
            type="textarea"
            v-model="form.analysis_steps"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="处理方法" prop="solution_method">
          <el-input
            style="width: 710px"
            type="textarea"
            v-model="form.solution_method"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="输出内容" prop="maintenance_result">
          <el-input
            style="width: 710px"
            type="textarea"
            v-model="form.maintenance_result"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="横展" prop="horizontal_extension">
          <el-input
            style="width: 710px"
            type="textarea"
            v-model="form.horizontal_extension"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="create_time">
          <el-date-picker
            style="width: 300px"
            v-model="form.create_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
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
      :visible.sync="dialogEdVisible"
      width="1000px"
    >
      <el-form
        ref="form"
        :model="edForm"
        label-width="100px"
        inline
      >
        <el-form-item label="线体" prop="line_code">
          <el-input
            style="width: 480px"
            v-model="edForm.line_code"
            placeholder=""
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="device_model">
          <el-input
            style="width: 480px"
            v-model="edForm.device_model"
            placeholder=""
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="故障现象" prop="fault_phenomenon">
          <el-input
            style="width: 710px"
            v-model="edForm.fault_phenomenon"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="分析步骤" prop="analysis_steps">
          <el-input
            style="width: 710px"
            type="textarea"
            v-model="edForm.analysis_steps"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="处理方法" prop="solution_method">
          <el-input
            style="width: 710px"
            type="textarea"
            v-model="edForm.solution_method"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="输出内容" prop="maintenance_result">
          <el-input
            style="width: 710px"
            type="textarea"
            v-model="edForm.maintenance_result"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="横展" prop="horizontal_extension">
          <el-input
            style="width: 710px"
            type="textarea"
            v-model="edForm.horizontal_extension"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="create_time">
          <el-date-picker
            style="width: 300px"
            v-model="edForm.create_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
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
  shortcuts1,
  disabledDate,
  setTodayDate,
  setLastDate,
} from "@/utils/dataMenu";
import {
  addEquipmentMaintenance,
  QueryWarehouseInspectionData,
  GetEquipmentMaintenance,
  UpdateEquipmentMaintenanceFormID,
  DeleteEquipmentMaintenanceFormID
} from "@/api/spApi";
import dayjs from "dayjs";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogEdVisible: false,
      show: false,
      dialogTableVisible: false,
      hositycurrentPage: 1,
      hositypageSize: 5,
      lineList: [
        {
          lineType: "SMT",
        },
        {
          lineType: "组装",
        },
      ],
      form: {
        line_code: "",
        device_model: "",
        fault_phenomenon: "",
        analysis_steps: "",
        solution_method: "",
        maintenance_result: "",
        horizontal_extension: "",
        creator: getToken(),
        create_time: "",
      },
      edForm: {
        id: 0,
        line_code: "",
        device_model: "",
        fault_phenomenon: "",
        analysis_steps: "",
        solution_method: "",
        maintenance_result: "",
        horizontal_extension: "",
        creator: "",
        create_time: "",
      },
      tableData: [],
      total: 0,
      currentPage: 1, // 当前页码
      tableHeight: 0,
      // pageSize: 10, // 每页的数据条数
      getlistText: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        SearchModel: "",
        StartTime: "",
        EndTime: "",
      },
      lineList: [],
      typeList: [],
      rules: {
        line_code: [{ required: true, message: "请输入", trigger: "blur" }],
        device_model: [{ required: true, message: "请输入", trigger: "blur" }],
        fault_phenomenon: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        analysis_steps: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        solution_method: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        maintenance_result: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        horizontal_extension: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        create_time: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      hosity: [],
      dateValue: [],
      pickerOptions: {
        shortcuts: shortcuts1,
        // disabledDate: disabledDate,
      },
    };
  },
  watch: {
    dateValue(value) {
      if (value == null) {
        this.getlistText.StartTime = "";
        this.getlistText.EndTime = "";
      } else {
        this.getlistText.StartTime = value[0];
        this.getlistText.EndTime = value[1];
      }
      this.getlistText.PageIndex = 1;
      this.getData();
    },
  },
  created() {
    this.getData();
  },
  beforeMount() {
    // const todayStart = new Date();
    // todayStart.setMonth(todayStart.getMonth() - 3);
    // // todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
    // this.dateValue = [
    //   dayjs(todayStart).format("YYYY-MM-DD HH:mm:ss"),
    //   dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    // ];
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      this.startLoading();
      QueryWarehouseInspectionData(this.getlistText)
        .then(({ data }) => {
          //  console.log(data);
          this.total = data.Data.Total;
          this.tableData = data.Data.list;
          this.endLoading();
          console.log(this.tableData);
        })
        .catch(() => {
          this.endLoading();
        });
    },
    getLine() {
      GetEquipmentMaintenance({
        request_type: "line",
      }).then((res) => {
        if (res.data.Success) {
          this.lineList = res.data.Data.sort(
            (a, b) => a.split("-")[1] - b.split("-")[1]
          );
        }
      });
    },
    getType() {
      GetEquipmentMaintenance({
        request_type: "equip",
      }).then((res) => {
        if (res.data.Success) {
          this.typeList = res.data.Data;
        }
      });
    },
    openAdd() {
      this.form.line_code = "";
      this.form.device_model = "";
      this.form.fault_phenomenon = "";
      this.form.analysis_steps = "";
      this.form.solution_method = "";
      this.form.maintenance_result = "";
      this.form.horizontal_extension = "";
      this.form.create_time = "";
      this.show = false;
      this.dialogVisible = true;
      this.getLine();
      this.getType();
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.create_time || this.form.create_time === "") {
          }
          //   console.log(this.form);
          this.startLoading();
          // console.log(this.form);
          addEquipmentMaintenance(this.form)
            .then(({ data }) => {
              if (data.Code == 200) {
                this.dialogVisible = false;
                this.show = false;
                this.getData();
                // console.log(res);

                this.$message({
                  type: "success",
                  message: data.Msg,
                });
                this.$refs.form.resetFields();
              } else {
                this.$message({
                  type: "error",
                  message: data.Msg,
                });
              }
              this.endLoading();
            })
            .catch((error) => {
              this.endLoading();
            });
        } else {
          this.$alert("添加失败,请完成必填项", "错误信息", {
            confirmButtonText: "确定",
          });
        }
      });
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    editSubmit() {
      UpdateEquipmentMaintenanceFormID(this.edForm).then(({ data }) => {
              if (data.Code == 200) {
                this.dialogEdVisible = false;
                this.getData();
                this.$message({
                  type: "success",
                  message: data.Msg,
                });
              } else {
                this.$message({
                  type: "error",
                  message: data.Msg,
                });
              }
              this.endLoading();
            })
            .catch((error) => {
              this.endLoading();
            });
    },
    editCancel() {
      this.dialogEdVisible = false;
    },
    deleteText(str) {
      let a = str.split(" ")[0];
      let year = a.split("/")[2];
      let month = a.split("/")[0];
      let day = a.split("/")[1];
      return `${year}/${month}/${day}`;
    },
    handleEdit(index, row) {
      // this.edForm = row;
      this.show = true;
      this.formDataPro(row);
      this.dialogEdVisible = true;
      // console.log(row);
    },
    handleHistory(index, row) {
      this.dialogTableVisible = true;
      // console.log(row);
      this.hosity = [];
      this.startLoading();
      getHistoy(row.Containerid).then(({ data }) => {
        this.endLoading();
        let a = JSON.parse(data.Data);
        // console.log();
        this.hosity = a.list.reverse();
        // this.hosity;
        // console.log(this.hosity);
      });
    },
    handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteEquipmentMaintenanceFormID({ id: row.id }).then((res) => {
            if (res.data.Code == 200) {
            this.getData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            }else {
              
          this.$message({
            type: "danger",
            message: res.data.Msg,
          });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    inputValue(value) {
      // console.log(value);
      let isExit = this.tableData.find((item) => item.Containerid == value);

      // console.log(value,this.tableData);
      if (value && isExit != undefined) {
        this.formDataPro(isExit);
      } else {
        // console.log(1);
        this.formDataPro(this.edForm);
        this.form.containerid = value;
      }
    },
    formDataPro(row) {
      // console.log(row);
      this.edForm.id = row.id;
      this.edForm.line_code = row.line_code;
      this.edForm.device_model = row.device_model;
      this.edForm.fault_phenomenon = row.fault_phenomenon;
      this.edForm.analysis_steps = row.analysis_steps;
      this.edForm.solution_method = row.solution_method;
      this.edForm.maintenance_result = row.maintenance_result;
      this.edForm.horizontal_extension = row.horizontal_extension;
      this.edForm.creator = getToken();
      this.edForm.create_time = dayjs(row.create_time).format("YYYY-MM-DD HH:mm:ss");
      // console.log(this.form);
    },
    getSearchData() {
      // this.getlistText.pageIndex = 0;
      // this.getData();
    },
    handleSizeChange(value) {
      this.getlistText.pageSize = value;
      this.getData();
      // console.log(this.pageSize);
    },
    handleCurrentChange(value) {
      this.getlistText.PageIndex = value;
      this.getData();
    },
    hosityhandleCurrentChange(currentPage) {
      //  console.log(currentPage,'currentPage');
      this.hositycurrentPage = currentPage;
      // console.log(this.currentPage);
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
        this.tableHeight = window.innerHeight - 230;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.smdPro {
  padding: 8px;
  .table_header {
    padding-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .input_box {
      display: flex;
      // width: 400px;
      gap: 30px;
    }
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
