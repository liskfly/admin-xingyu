<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-input
          placeholder="OEE参数"
          v-model="searchiInput"
          class="input-with-select"
          style="width: 300px; margin-right: 20px"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchData()"
          ></el-button>
        </el-input>
        <el-button @click="dataInitialization">查看全部</el-button>
        <el-button type="primary" @click="dialogFormVisible = true"
          >增加</el-button
        >
      </div>

      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        :height="tableHeight"
        size="small"
      >
        <el-table-column label="序号" type="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="LevelType" label="OEE类型"></el-table-column>
        <el-table-column prop="LevelCode" label="维护线体"> </el-table-column>
        <el-table-column
          prop="Description"
          label="计划停机时间"
        ></el-table-column>
        <el-table-column prop="ModifyDate" label="年月日"></el-table-column>
        <el-table-column prop="Operator" label="操作员"></el-table-column>
        <el-table-column prop="" label="说明"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="ChangeShow(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        align="center"
        background
        style="margin-top: 8px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="OE参数信息" :visible.sync="dialogFormVisible">
      <el-form ref="form" label-width="120px">
        <el-form-item label="OEE类别">
          <el-select v-model="addForm.type" placeholder="请选择OEE类型"
          style="width: 240px;">
            <el-option label="设备故障" value="设备故障"></el-option>
            <el-option label="材料短缺" value="材料短缺"></el-option>
            <el-option label="其他" value="其他"></el-option>
            <el-option label="计划停机" value="计划停机"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护线体">
          <el-select v-model="addForm.line" placeholder="工作线"
          style="width: 240px;">
            <el-option
              v-for="item in lineList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="计划停机时间">
          <el-date-picker
            v-model="dateAddArr"
            type="datetimerange"
    format="yyyy-MM-dd HH:mm"
    value-format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="计划停机时间">
          <el-input
          style="width: 240px;"
            placeholder="请输入内容"
            type="number"
            @input="handlePositiveInput"
            v-model="addForm.time"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
          style="width: 240px;"
            v-model="addForm.date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明">
          <el-input placeholder="请输入内容" v-model="addForm.Instructions">
          </el-input>
        </el-form-item>
      </el-form>
      <!-- <div>
        <el-input
          class="popul-item"
          placeholder="请输入内容"
          v-model="levelCodeInput"
        >
          <template slot="prepend">OEE参数</template>
        </el-input>
        <el-input
          class="popul-item"
          placeholder="请输入内容"
          v-model="levelTypeInput"
        >
          <template slot="prepend">OEE类型</template>
        </el-input>
        <el-input
          class="popul-item"
          placeholder="请输入内容"
          v-model="descriptionInput"
        >
          <template slot="prepend">OEE描述</template>
        </el-input>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="(dialogFormVisible = false), insertData()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="更改OE参数信息" :visible.sync="OEChange">
      <div>
        <el-input
          class="popul-item"
          placeholder="请输入内容"
          v-model="levelCodeChange"
          :disabled="true"
        >
          <template slot="prepend">OE参数</template>
        </el-input>
        <el-input
          class="popul-item"
          placeholder="请输入内容"
          v-model="levelTypeChange"
        >
          <template slot="prepend">OE类型</template>
        </el-input>
        <el-input
          class="popul-item"
          placeholder="请输入内容"
          v-model="descriptionChange"
        >
          <template slot="prepend">OE描述</template>
        </el-input>
        <!-- <el-input placeholder="请输入内容" v-model="operatorChange">
          <template slot="prepend">操作员</template>
        </el-input> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="OEChange = false">取 消</el-button>
        <el-button
          type="primary"
          @click="(dialogFormVisible = false), handleUpdate()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { XY_OEE_LevelCode } from "@/api/all";
import { getDate } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
import { aD } from "@fullcalendar/core/internal-common";
export default {
  data() {
    return {
      searchiInput: "",
      tableData: [],
      dialogFormVisible: false,
      levelCodeInput: "",
      descriptionInput: "",
      levelTypeInput: "",
      modifyDateInput: "",
      operatorInput: "",
      currentPage: 1,
      pageSize: 10,
      total: 10,
      isShow: [],
      loading: null,
      levelCodeChange: "",
      descriptionChange: "",
      levelTypeChange: "",
      modifyDateChange: "",
      operatorChange: "",
      OEChange: false,
      index: 0,
      operator: getToken(),
      levelTypeData: [
        { name: "计划", value: "Plan" },
        { name: "工作", value: "Work" },
        { name: "停机", value: "Stop" },
        { name: "其他", value: "Other" },
      ],
      tableHeight: 0,
      lineList: [
        { value: "Line1", name: "Line1" },
        { value: "Line2", name: "Line2" },
        { value: "Line3", name: "Line3" },
        { value: "All", name: "All" },
      ],
      dateAddArr: [],
      addForm: {
        type: "",
        line: "",
        time: "",
        Instructions: "",
        date: "",
      },
    };
  },
  beforeMount() {
    this.dataInitialization();
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    //查询OE参数
    searchData() {
      this.startLoading();
      XY_OEE_LevelCode({
        levelCode: this.searchiInput,
        operationType: "Q",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.tableData = res.data.DataList;
          } else if (res.data.Status === "NG") {
            this.tableData = [];
          }
          this.endLoading();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: `网络不良`,
          });
          this.endLoading();
        });
    },
    //添加一条数据
    async insertData() {
      let haveCode = false;
      await this.tableData.forEach((item) => {
        if (item.LevelCode === this.levelCodeInput) {
          haveCode = true;
          this.$message({
            type: "error",
            message: `此参数已有,请输入新参数`,
          });
          return;
        }
      });
      if (haveCode) {
        return;
      }
      this.startLoading();
      let date = this.getDateTo();
      XY_OEE_LevelCode({
        LevelCode: this.levelCodeInput,
        levelType: this.levelTypeInput,
        description: this.descriptionInput,
        dateTime: date,
        operator: this.operator,
        operationType: "I",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.tableData.unshift({
              LevelCode: this.levelCodeInput,
              LevelType: this.levelTypeInput,
              Description: this.descriptionInput,
              ModifyDate: date,
              Operator: this.operator,
            });
            this.levelCodeInput = "";
            this.levelTypeInput = "";
            this.descriptionInput = "";
          }
          this.endLoading();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: `网络不良`,
          });
          this.endLoading();
        });
    },
    dateChange() {
      console.log(this.dateAddArr);
      if (this.dateAddArr) {
      }
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    //初始化获取数据
    dataInitialization() {
      this.startLoading();
      XY_OEE_LevelCode({
        operationType: "QA",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.tableData = res.data.DataList;
          } else {
            this.$message({
              type: "error",
              message: `初始化失败!`,
            });
          }
          this.endLoading();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: `网络不良`,
          });
          this.endLoading();
        });
    },
    handlePositiveInput(value) {
      // 只允许数字和小数点
      let filteredValue = value.replace(/[^\d.]/g, '')
      
      // 防止以小数点开头
      if (filteredValue.startsWith('.')) {
        filteredValue = '0' + filteredValue
      }
      
      // 防止多个小数点
      const dotCount = (filteredValue.match(/\./g) || []).length
      if (dotCount > 1) {
        filteredValue = filteredValue.replace(/\.+$/, '').replace(/\.(?=.*\.)/g, '')
      }
      
      this.addForm.time = filteredValue
    },
    //新增信息
    handleEdit(index, row) {
      this.$set(this.isShow, index, true);
    },
    handelCancel(index, row) {
      this.$set(this.isShow, index, false);
    },
    //数据修改
    ChangeShow(index, row) {
      this.levelCodeChange = row.LevelCode;
      this.levelTypeChange = row.LevelType;
      this.descriptionChange = row.Description;
      this.operatorChange = row.Operator;
      this.modifyDateChange = row.ModifyDate;
      this.OEChange = true;
      this.index = index;
    },
    ChangeHidden() {
      this.OEChange = false;
    },
    handleUpdate() {
      this.startLoading();
      XY_OEE_LevelCode({
        levelCode: this.levelCodeChange,
        levelType: this.levelTypeChange,
        description: this.descriptionChange,
        operator: this.operatorChange,
        dateTime: this.getDate(this.modifyDateChange),
        operationType: "U",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.tableData[this.index] = {
              LevelCode: this.levelCodeChange,
              LevelType: this.levelTypeChange,
              Description: this.descriptionChange,
              Operator: this.operatorChange,
              ModifyDate: this.getDate(this.modifyDateChange),
            };
          }
          this.OEChange = false;
          this.endLoading();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: `网络不良`,
          });
          this.OEChange = false;
          this.endLoading();
        });
    },
    //删除数据
    handleDelete(index, row) {
      this.startLoading();
      XY_OEE_LevelCode({
        ...row,
        operationType: "D",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.tableData = this.tableData.filter((message, i) => {
              return index !== i;
            });
          }
          this.endLoading();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: `网络不良`,
          });
          this.endLoading();
        });
    },
    getDate(timestamp) {
      let getTime = new Date(timestamp);
      let year = getTime.getFullYear();
      let month = getTime.getMonth() + 1;
      let date = getTime.getDate();
      let hours = getTime.getHours();
      let min = getTime.getMinutes();
      let second = getTime.getSeconds();
      hours = hours < 10 ? "0" + hours : hours;
      min = min < 10 ? "0" + min : min;
      second = second < 10 ? "0" + second : second;
      let todayTime = year + "-" + month + "-" + date;
      let todayHours = hours + ":" + min + ":" + second;
      return todayTime + " " + todayHours;
    },
    getDateTo() {
      let getTime = new Date();
      let year = getTime.getFullYear();
      let month = getTime.getMonth() + 1;
      let date = getTime.getDate();
      let hours = getTime.getHours();
      let min = getTime.getMinutes();
      let second = getTime.getSeconds();
      hours = hours < 10 ? "0" + hours : hours;
      min = min < 10 ? "0" + min : min;
      second = second < 10 ? "0" + second : second;
      let todayTime = year + "-" + month + "-" + date;
      let todayHours = hours + ":" + min + ":" + second;
      return todayTime + " " + todayHours;
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
        this.tableHeight = window.innerHeight - 210;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.parameterSetting {
  .input {
    width: 200px;
    margin-right: 10px;
  }
}

.popul-item {
  margin-bottom: 20px;
}
</style>
