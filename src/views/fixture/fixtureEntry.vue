<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <el-button type="primary" @click="addOpen" size="medium">添加</el-button>
        <div>
          <el-input v-model="searchName" style="width: 350px" clearable placeholder="请输入"
            @keyup.enter.native="searchData()" @clear="clearData">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="searchData()"></el-button>
            </template>
          </el-input>
        </div>
      </div>
      <el-table :data="tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        " border :height="tableHeight" style="width: 100%" size="mini">
        <el-table-column type="index" label="序号" width="55" align="center" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</span>
          </template>
        </el-table-column>
        <af-table-column prop="Tool" label="工治具编码"> </af-table-column>
        <af-table-column prop="Model" label="工治具类别"> </af-table-column>
        <el-table-column prop="Cell" label="储位" width="100">
        </el-table-column>
        <el-table-column prop="Dsc" label="描述"> </el-table-column>
        <el-table-column prop="Stts" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="tagType(scope.row.Stts)">
              {{ tagText(scope.row.Stts) }}
            </el-tag>
            <!-- <span>{{ scope.row.Stts == 4 ? "已发料" : "已上架" }}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="ExpireDate" label="到期日期" width="155">
          <template slot-scope="scope">
            <span :class="{ 'text-red': compressDate(scope.row.ExpireDate) }">{{
              scope.row.ExpireDate
              }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Ud_user" label="操作人" width="125">
        </el-table-column>
        <el-table-column prop="Ud_dt" label="操作时间" width="155">
        </el-table-column>
        <!-- <el-table-column prop="Dsc" label="描述"> </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" :disabled="scope.row.Stts == -1" size="mini"
                @click="handleEdit(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="报废" placement="top">
              <el-button type="warning" icon="el-icon-s-release" :disabled="scope.row.Stts == -1" size="mini"
                @click="handleScrap(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top"><el-button type="danger" icon="el-icon-delete"
                :disabled="scope.row.Stts == -1" size="mini" @click="handleDelete(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="详情" placement="top">
              <el-button type="success" icon="el-icon-document" :disabled="scope.row.Stts == -1" size="mini"
                @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next" :total="tableData1.length">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'添加'" :visible.sync="addVisible" @close="addCancel()" width="500px">
      <el-form :model="addForm" ref="addFormRef" label-width="auto">
        <el-form-item label="工治具编码" prop="compid">
          <el-input v-model="addForm.compid" style="width: 350px" placeholder="请输入工治具编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="工治具类别" prop="compname">
          <el-select v-model="addForm.compname" filterable style="width: 350px" placeholder="请选择工治具类别" clearable @change="getCompname">
            <el-option v-for="item in typeList" :key="item.ToolsMold" :label="item.ToolsMold"
              :value="item.ToolsMold"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="remark">
          <el-input v-model="fixtureType" style="width: 350px" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="addForm.remark" style="width: 350px" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="描述" prop="remark">
          <el-input v-model="addForm.remark" style="width: 350px" type="textarea" placeholder="请输入描述信息"
            clearable></el-input>
        </el-form-item> -->
        <el-form-item label="到期日期" prop="expirationDate">
          <el-date-picker v-model="addForm.expirationDate" style="width: 350px" type="date" placeholder="选择日期"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCancel()">取消</el-button>
        <el-button type="primary" @click="addSumbit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'编辑'" :visible.sync="editVisible" @close="editCancel()" width="500px">
      <el-form :model="editForm" ref="editFormRef" label-width="auto">
        <el-form-item label="工治具编码" prop="compid">
          <el-input v-model="editForm.compid" disabled style="width: 350px" placeholder="请输入工治具编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="工治具类别" prop="compname">
          <el-select v-model="editForm.compname" filterable style="width: 350px" placeholder="请选择工治具类别" clearable @change="getCompname">
            <el-option v-for="item in typeList" :key="item.ToolsMold" :label="item.ToolsMold"
              :value="item.ToolsMold"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="类别" prop="remark">
          <el-input v-model="fixtureType" style="width: 350px" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="editForm.remark" style="width: 350px" type="textarea" placeholder="请输入描述信息"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="到期日期" prop="expirationDate">
          <el-date-picker v-model="editForm.expirationDate" style="width: 350px" type="date" placeholder="选择日期"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editCancel()">取消</el-button>
        <el-button type="primary" @click="editSumbit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'详情'" :visible.sync="detailVisible" @close="addCancel()" width="800px">
      <el-form :model="addForm" :inline="true" ref="formRef" label-width="auto">
        <el-form-item label="工治具编码" prop="compid">
          <el-input v-model="detailForm.CompID" disabled style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="工治具类别" prop="compname">
          <el-input v-model="detailForm.CompName" disabled style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="使用次数" prop="totalUses">
          <el-input v-model.number="detailForm.Uses" style="width: 240px" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item label="规定使用总数" prop="totalUses">
          <el-input v-model.number="detailForm.TotalUses" style="width: 240px" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item label="初始时间" prop="compname">
          <el-input v-model="detailForm.InitialDate" disabled style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="保养时间" prop="compname">
          <el-input v-model="detailForm.InitialDate" disabled style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="compname">
          <div>{{ returnStatus(detailForm.CleanStatus) }}</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { moldControl, iDControll } from "@/api/all";
import { getToken } from "@/utils/auth";
import dayjs from "dayjs";
import FixtureType from "./fixtureType.vue";
export default {
  data() {
    return {
      searchName: "", // 搜索名称

      getIDText: {
        operationType: "Q",
        compid: "*",
        compname: "",
        remark: "",
        user: "",
        expirationDate: "",
      },
      getText: {
        toolsMold: "*",
        remark: "",
        operationType: "Q",
      },
      tableData: [],
      tableData1: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      addVisible: false,
      typeList: [], // 工治具类别列表
      addForm: {
        operationType: "I",
        compid: "",
        compname: "",
        remark: "",
        user: getToken(),
        expirationDate: "",
      },
      editVisible: false,
      detailVisible: false,
      editForm: {
        operationType: "U",
        compid: "",
        compname: "",
        remark: "",
        user: getToken(),
        expirationDate: "",
      },
      detailForm: {
        CompID: "",
        CompName: "",
        InitialDate: "",
        Uses: 0,
        TotalUses: 0,
        MaintDate: null,
        CleanStatus: 0,
      },
      compnameText: "", // 描述,
      fixtureType:"" //类别
    };
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getIDdata();
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getCompname(value) {
      let selected = this.typeList.find(item => item.ToolsMold === value);
      // this.compnameText = selected ? selected.MaterialName : '';
      this.addForm.remark = selected ? selected.MaterialName : '';
      this.fixtureType = this.returnType(selected ? selected.Category : '');
      
    },
    returnType(num) {
      let arr = [
        { Value: "1", Text: "印刷工治具" },
        { Value: "2", Text: "ICT工治具" },
        { Value: "3", Text: "样件" },
      ];
      let text = ''
      arr.forEach((i) => {
        if (i.Value == num) {
          text = i.Text;
        }
      })
      return text;
    },
    getData() {
      moldControl(this.getText).then((res) => {
        this.typeList = res.data.DataList;
      });
    },
    getIDdata() {
      iDControll(this.getIDText)
        .then(({ data }) => {
          if (data.Status == "OK") {
            this.tableData = data.DataList;
            this.tableData1 = this.tableData.map((item) => {
              return {
                ...item,

                ExpireDate: item.ExpireDate
                  ? dayjs(item.ExpireDate).format("YYYY-MM-DD")
                  : "",
                Ud_dt: dayjs(item.Ud_dt).format("YYYY-MM-DD HH:mm:ss"),
              };
            });
          } else {
            this.tableData = [];
            this.tableData1 = [];
          }
          if (
            this.tableData1.length % this.pageSize == 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
          }
        })
        .catch(() => {
          this.$message.error("请求数据失败，请刷新");
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
    clearData() {
      this.searchName = "";
      this.tableData1 = this.tableData;
      this.currentPage = 1; // 清除搜索时重置页码
    },
    addOpen() {
      this.getData();
      this.addVisible = true;
    },
    handleDetail(raw) {
      this.startLoading();
      iDControll({
        operationType: "QD",
        compid: raw.Tool,
      }).then((res) => {
        if (res.data.Status == "OK") {
          this.detailForm = res.data.DataList[0];
        } else {
          this.$notify({
            title: "提示信息",
            message: res.data.Message,
            type: "error",
          });
        }
      });
      this.endLoading();
      this.detailVisible = true;
    },
    addSumbit() {
      iDControll(this.addForm)
        .then((res) => {
          if (res.data.Status == "OK") {
            this.$notify({
              title: "提示信息",
              message: "添加成功",
              type: "success",
            });
            this.$refs.addFormRef.resetFields();
            this.addVisible = false;
            // 重置表单
            this.getIDdata(); // 重新获取数据
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
    },

    // 取消添加
    addCancel() {
      this.$refs.addFormRef.resetFields();
      this.addForm.remark=""
      this.fixtureType = ""
      this.addVisible = false;
      // 重置表单
    },
    handleEdit(row) {
      this.getData();
      this.editForm = {
        compid: row.Tool,
        compname: row.Model,
        remark: row.Dsc,
        user: getToken(),
        expirationDate: row.ExpireDate,
        operationType: "U",
      }; 
      this.getCompname(row.Model);
      this.editVisible = true;
    },
    editCancel() {
      this.$refs.editFormRef.resetFields();
      this.addForm.remark=""
      this.fixtureType = ""
      this.editVisible = false;
    },
    editSumbit() {
      if (this.editForm.expirationDate == null) {
        this.editForm.expirationDate = "";
      }
      iDControll(this.editForm)
        .then((res) => {
          if (res.data.Status == "OK") {
            this.$notify({
              title: "提示信息",
              message: "修改成功",
              type: "success",
            });
            this.editVisible = false;
            this.getIDdata(); // 重新获取数据
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
    },
    handleDelete(row) {
      this.$confirm("确定删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            operationType: "D",
            compid: row.Tool,
            compname: row.Model,
            remark: "",
            user: getToken(),
            expirationDate: row.ExpireDate == null ? "" : row.ExpireDate,
          };
          iDControll(data)
            .then((res) => {
              if (res.data.Status == "OK") {
                this.$notify({
                  title: "提示信息",
                  message: "删除成功",
                  type: "success",
                });
                this.getIDdata(); // 重新获取数据
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
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleScrap(row) {
      this.$confirm("确定报废", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            operationType: "S",
            compid: row.Tool,
            compname: row.Model,
            remark: "",
            user: getToken(),
            expirationDate: row.ExpireDate == null ? "" : row.ExpireDate,
          };
          iDControll(data)
            .then((res) => {
              if (res.data.Status == "OK") {
                this.$notify({
                  title: "提示信息",
                  message: "报废成功",
                  type: "success",
                });
                this.getIDdata(); // 重新获取数据
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
          this.$message({
            type: "info",
            message: "已取消报废",
          });
        });
    },

    tagType(data) {
      let text = "";
      switch (data) {
        case -1:
          text = "danger";

          break;
        case 0:
          text = "info";
          break;
        case 1:
          text = "success";
          break;
        case 2:
          text = "";

          break;
        case 3:
          text = "info";

          break;
        case 4:
          text = "warning";

          break;
        default:
          break;
      }
      return text;
    },
    tagText(data) {
      let text = "";
      switch (data) {
        case -1:
          text = "报废";
          break;
        case 0:
          text = "已录入";
          break;
        case 1:
          text = "";
          break;
        case 2:
          text = "已上架";
          break;
        case 3:
          text = "已绑定";
          break;
        case 4:
          text = "已发料";
          break;
        default:
          break;
      }
      return text;
    },
    returnStatus(data) {
      let text = "";
      switch (data) {
        case 0:
          text = "清洗";
          break;
        case 1:
          text = "使用中";
          break;
        case 2:
          text = "待清洗";
          break;
      }
      return text;
    },
    compressDate(val) {
      if (val !== null && val !== "") {
        // 获取当前时间（含具体时间）
        let now = new Date();

        // 修复2：正确设置目标日期（原代码加了23:59:59会导致比较结果延迟一天）
        // 正确做法：将目标日期设为当天的00:00:00
        let targetDate = new Date(val + "T00:00:00");

        // 修复3：直接比较日期对象
        return now >= targetDate;
      } else {
        return false;
      }
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
        this.tableHeight = window.innerHeight - 210;
        // this.tableHeight1 =
      });
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
.text-red {
  color: #ff0000;
  font-weight: bold;
}
</style>
