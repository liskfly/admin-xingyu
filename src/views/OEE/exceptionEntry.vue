<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2 flex gap-2 items-center">
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
          :clearable="false"
        >
        </el-date-picker>
        <el-select
          v-model="searchForm.SearchModel.oeetype"
          placeholder="请选择OEE类型"
          style="width: 240px"
        >
          <el-option label="设备故障" value="设备故障"></el-option>
          <el-option label="材料短缺" value="材料短缺"></el-option>
          <el-option label="其他" value="其他"></el-option>
          <el-option label="计划停机" value="计划停机"></el-option> </el-select
        ><el-select
          v-model="searchForm.SearchModel.oeeline"
          placeholder="工作线"
          style="width: 240px"
        >
          <el-option
            v-for="item in lineList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="getData">查询</el-button>
        <el-button type="primary" size="small" @click="addOpen">新建</el-button>
      </div>
      <el-table
        :data="tableData"
        ref="imageTable"
        border
        :height="tableHeight"
        style="width: 100%"
        highlight-current-row
        size="small"
      >
        <el-table-column type="index" label="序号" width="55" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shutdown_type" label="设备类型"> </el-table-column>
        <el-table-column prop="shutdown_line" label="线体"> </el-table-column>
        <el-table-column
          prop="shutdown_long"
          label="时长"
          align="center"
          width="100"
        >
        </el-table-column>

        <el-table-column
          prop="shutdown_date"
          label="日期"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="shutdown_remark"
          label="说明"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="shutdown_iuser"
          label="操作人"
          align="center"
        >
        </el-table-column>
        <el-table-column label="详情" width="120" align="center">
          <template slot-scope="scope">
            <el-button 
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteData(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.PageIndex"
          :page-size="searchForm.PageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :visible.sync="addVisible" title="新增" width="40%">
      <el-form ref="form" label-width="140px">
        <el-form-item label="OEE类别">
          <el-select
            v-model="addForm.shutdown_type"
            placeholder="请选择OEE类型"
            style="width: 240px"
          >
            <el-option label="设备故障" value="设备故障"></el-option>
            <el-option label="材料短缺" value="材料短缺"></el-option>
            <el-option label="其他" value="其他"></el-option>
            <el-option label="计划停机" value="计划停机"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护线体">
          <el-select
            v-model="addForm.shutdown_line"
            placeholder="工作线"
            style="width: 240px"
          >
            <el-option
              v-for="item in lineList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划停机时长(分钟)">
          <el-input
            style="width: 240px"
            placeholder="请输入内容"
            type="number"
            @input="handlePositiveInput"
            v-model="addForm.shutdown_long"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            style="width: 240px"
            v-model="addForm.shutdown_date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明">
          <el-input placeholder="请输入内容" v-model="addForm.shutdown_remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData"> 确 定 </el-button>
      </div>
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
import dayjs from "dayjs";
import {
  GetXYL_OEE_ShutDownList,
  InsertXYL_OEE_ShutDown,
  DeleteXYL_OEE_ShutDown,
} from "@/api/assemble";
import { getToken } from "@/utils/auth";
import { deleteData } from "@/api/employee";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: shortcuts1,
        disabledDate: disabledDate,
      },
      tableData: [],
      tableData2: [],
      currentPage: 1, // 当前页码
      pageSize: 50, // 每页的数据条数
      tableHeight: 0,
      dateValue: [],
      tableHeight2: 0,
      getForm: {
        PageIndex: 1,
        PageSize: 20,
        SearchText: "",
        StartTime: "",
        EndTime: "",
      },
      total: 0,
      previewUrl: "",
      previewContent: "",
      progress: 0,
      previewError: "",
      currentRowIndex: null,
      scrollContainer: null,
      addVisible: false,
      tableData2: [],
      container: "",
      detailScrollContainer: null,
      lineList: [
        { value: "Line1", name: "Line1" },
        { value: "Line2", name: "Line2" },
        { value: "Line3", name: "Line3" },
        { value: "Line4", name: "Line4" },
        { value: "Line5", name: "Line5" },
        { value: "Line6", name: "Line6" },
        { value: "Line7", name: "Line7" },
      ],
      searchForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        SearchModel: {
          oeetype: "设备故障",
          oeeline: "Line1",
        },
        StartTime: "",
        EndTime: "",
      },
      addForm: {
        shutdown_type: "",
        shutdown_line: "",
        shutdown_date: "",
        shutdown_long: "",
        shutdown_remark: "",
        shutdown_user: getToken(),
      },
    };
  },
  watch: {
    dateValue(value) {
      if (value == null) {
        this.searchForm.StartTime = "";
        this.searchForm.EndTime = "";
      } else {
        this.searchForm.StartTime = value[0];
        this.searchForm.EndTime = value[1];
      }
      this.searchForm.PageIndex = 1;
      this.getData();
    },
  },
  beforeMount() {
    let end = setTodayDate();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
    // let start= setLastDate();
    this.dateValue = [
      dayjs(todayStart).format("YYYY-MM-DD HH:mm:ss"),
      dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    // console.log(this.dateValue);

    this.getScreenHeight();
    // this.getData();
  },
  mounted() {
    // this.$nextTick(() => {
    //   // 获取表格的滚动容器
    //   this.scrollContainer = this.$refs.imageTable?.$el?.querySelector(
    //     ".el-table__body-wrapper"
    //   );
    // });
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    handlePositiveInput(value) {
      // 只允许数字和小数点
      let filteredValue = value.replace(/[^\d.]/g, "");

      // 防止以小数点开头
      if (filteredValue.startsWith(".")) {
        filteredValue = "0" + filteredValue;
      }

      // 防止多个小数点
      const dotCount = (filteredValue.match(/\./g) || []).length;
      if (dotCount > 1) {
        filteredValue = filteredValue
          .replace(/\.+$/, "")
          .replace(/\.(?=.*\.)/g, "");
      }

      this.addForm.time = filteredValue;
    },
    handleTableScroll() {
      // 强制更新懒加载检查
      if (this.scrollContainer) {
        this.$nextTick(() => {
          const event = new CustomEvent("scroll");
          this.scrollContainer.dispatchEvent(event);
        });
      }
    },
    clear() {
      this.searchForm.SearchText = "";
      this.getData();
    },
    getData() {
      GetXYL_OEE_ShutDownList(this.searchForm).then((res) => {
        if (res.Success) {
          this.tableData = res.Data.list;
          this.total = res.Data.Total;
          this.addVisible = false;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    addOpen() {
      this.addVisible = true;
    },
    deleteData(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteXYL_OEE_ShutDown({ shutdown_guid: row.shutdown_guid }).then(
            () => {
              if (res.Success) {
                this.$message({
                  message: res.Msg,
                  type: "success",
                });
                this.getData();
              } else {
                this.$message.error(res.Msg);
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addData() {
      InsertXYL_OEE_ShutDown(this.addForm).then((res) => {
        if (res.Success) {
          this.$message({
            message: res.Msg,
            type: "success",
          });
        } else {
          this.$message.error(res.Msg);
        }
      });
    },
    handleSizeChange(value) {
      this.searchForm.PageSize = value;
      this.getData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);

      this.searchForm.PageIndex = val;
      this.getData();
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-container {
  max-height: 60vh;
  overflow: auto;
  background: #f8f8f8;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.preview-container pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
  margin: 0;
}

.image-placeholder,
.image-error {
  width: 60px;
  height: 33.3px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  color: #909399;
}

.image-error {
  background: #fef0f0;
  color: #f56c6c;
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
