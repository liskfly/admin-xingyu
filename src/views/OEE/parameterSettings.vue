<template>
  <div class="parameterSetting">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
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
      </div>
      <el-button type="primary" @click="dialogFormVisible = true"
        >增加</el-button
      >
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
      >
        <el-table-column prop="LevelType" label="OEE类型">
          <template slot-scope="{ row, $index }">
            <el-input
              v-if="isShow[$index]"
              v-model="row.LevelType"
              placeholder="请输入内容"
            ></el-input>
            <span v-if="!isShow[$index]">{{ row.LevelType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="LevelCode" label="OEE参数"> </el-table-column>
        <el-table-column prop="Description" label="OEE描述">
          <template slot-scope="{ row, $index }">
            <el-input
              v-if="isShow[$index]"
              v-model="row.Description"
              placeholder="请输入内容"
            ></el-input>
            <span v-if="!isShow[$index]">{{ row.Description }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ModifyDate" label="时间">
          <template slot-scope="{ row }">
            <!-- <el-input
              v-if="isShow[$index]"
              v-model="row.ModifyDate"
              placeholder="请输入内容"
            ></el-input> -->
            <span>{{ getDate(row.ModifyDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Operator" label="操作员">
          <template slot-scope="{ row, $index }">
            <el-input
              v-if="isShow[$index]"
              v-model="row.Operator"
              placeholder="请输入内容"
            ></el-input>
            <span v-if="!isShow[$index]">{{ row.Operator }}</span>
          </template>
        </el-table-column>
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
        style="margin-top: 20px"
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
      <el-form ref="form" label-width="80px">
        <el-form-item label="OEE类型">
          <el-select v-model="levelTypeInput" placeholder="请选择OEE类型">
            <el-option label="计划" value="计划"></el-option>
            <el-option label="工作" value="工作"></el-option>
            <el-option label="停机" value="停机"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="OEE参数">
          <el-input v-model="levelCodeInput"></el-input>
        </el-form-item>
        <el-form-item label="OEE描述">
          <el-input
            class="popul-item"
            placeholder="请输入内容"
            v-model="descriptionInput"
          >
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
    };
  },
  beforeMount() {
    this.dataInitialization();
  },
  mounted() {},
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
        if(item.LevelCode === this.levelCodeInput) {
          haveCode = true
          this.$message({
            type: "error",
            message: `此参数已有,请输入新参数`,
          });
          return;
        }
      })
      if(haveCode) {
        return;
      };
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
