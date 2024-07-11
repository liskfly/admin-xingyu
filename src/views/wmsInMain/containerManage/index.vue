<template>
  <div class="smdPro">
    <el-card class="box-card">
      <div class="table_header">
        <el-button type="primary" @click="openAdd()">添加</el-button>
        <div class="input_box">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="getlistText.searchText"
            class="input-with-select"
            @input="getSearchData"
            @change="getSearchData"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table
          :data="tableData"
          :height="tableHeight"
          border
          stripe
          style="width: 100%; height: 400"
        >
          <el-table-column prop="Containerid" label="容器ID"> </el-table-column>
          <el-table-column prop="ContainerName" label="名称"> </el-table-column>
          <el-table-column prop="Spec" label="规格"> </el-table-column>
          <el-table-column prop="Capacity" label="最大容量"> </el-table-column>
          <el-table-column prop="ProduceType" label="生产类型">
          </el-table-column>
          <el-table-column prop="MaxuseNum" label="最大使用次数">
          </el-table-column>
          <el-table-column prop="ExFactoryDate" label="出厂日期" width="180">
          </el-table-column>
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
                type="warning"
                icon="el-icon-time"
                size="mini"
                @click="handleHistory(scope.$index, scope.row)"
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
        <div class="block" style="margin-top: 15px">
          <el-pagination
            background
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
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
      title="添加/修改"
      @close="addCancel()"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="容器ID" prop="containerid">
          <el-input
            :disabled="show"
            v-model="form.containerid"
            placeholder="容器ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="containerName">
          <el-input v-model="form.containerName" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input
            type="textarea"
            v-model="form.spec"
            placeholder="规格"
          ></el-input>
        </el-form-item>
        <el-form-item label="最大容量" prop="cpacity">
          <el-input v-model="form.capacity" placeholder="最大容量"></el-input>
        </el-form-item>
        <el-form-item label="生产类型" prop="produceType">
          <el-select v-model="form.produceType" placeholder="生产类型">
            <el-option
              v-for="item in lineList"
              :key="item.lineType"
              :label="item.lineType"
              :value="item.lineType"
            ></el-option>
          </el-select>
          <!-- </el-input> -->
        </el-form-item>
        <el-form-item label="最大使用次数" prop="maxuseNum">
          <el-input
            v-model="form.maxuseNum"
            placeholder="最大使用次数"
          ></el-input>
        </el-form-item>
        <el-form-item label="出厂日期" prop="exfactorydate">
          <!-- <el-input v-model="form.madata" placeholder="出厂日期"></el-input> -->
          <el-form-item prop="exFactoryDate">
            <el-date-picker
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.exFactoryDate"
            ></el-date-picker>
          </el-form-item>
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
      width="500px"
    >
      <el-form
        ref="editForm"
        :model="edForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="容器ID" prop="Containerid">
          <el-input
            v-model="edForm.Containerid"
            placeholder="容器ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="ContainerName">
          <el-input
            v-model="edForm.ContainerName"
            placeholder="名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="Spec">
          <el-input
            type="textarea"
            v-model="edForm.Spec"
            placeholder="规格"
          ></el-input>
        </el-form-item>
        <el-form-item label="最大容量" prop="Capacity">
          <el-input v-model="edForm.Capacity" placeholder="最大容量"></el-input>
        </el-form-item>
        <el-form-item label="生产类型" prop="ProduceType">
          <el-select v-model="edForm.ProduceType" placeholder="生产类型">
            <el-option
              v-for="item in lineList"
              :key="item.lineType"
              :label="item.lineType"
              :value="item.lineType"
            ></el-option>
          </el-select>
          <!-- </el-input> -->
        </el-form-item>
        <el-form-item label="最大使用次数" prop="MaxuseNum">
          <el-input
            v-model="edForm.MaxuseNum"
            placeholder="最大使用次数"
          ></el-input>
        </el-form-item>
        <el-form-item label="出厂日期" prop="madata">
          <!-- <el-input v-model="form.madata" placeholder="出厂日期"></el-input> -->
          <el-form-item prop="exfactorydate">
            <el-date-picker
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="edForm.ExFactoryDate"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="历史记录" width="65%" :visible.sync="dialogTableVisible">
      <el-table
        :data="
          hosity.slice(
            (hositycurrentPage - 1) * hositypageSize,
            hositycurrentPage * hositypageSize
          )
        "
        border
        style="width: 100%"
      >
        <el-table-column prop="MaterialId" label="容器ID" width="80">
        </el-table-column>
        <el-table-column prop="Pn" label="料号" width="130"> </el-table-column>
        <el-table-column prop="PnName" label="名称"> </el-table-column>
        <el-table-column prop="PnSpec" label="规格"> </el-table-column>
        <el-table-column prop="Qty" label="数量" width="80"> </el-table-column>
        <el-table-column prop="Descript" label="操作事件"> </el-table-column>
        <el-table-column prop="UpdateUserId" label="操作人" width="80">
        </el-table-column>
        <el-table-column prop="RecordDt" label="操作时间"> </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          align="center"
          @current-change="hosityhandleCurrentChange"
          :current-page="hositycurrentPage"
          :page-size="hositypageSize"
          layout="total, prev, pager, next"
          :total="hosity.length"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryPageContainer,
  saveContainer,
  deleteContainer,
  getHistoy,
} from "@/api/wmsApi";
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
        containerid: "",
        containerName: "",
        spec: "",
        pn: "", //料号
        qty: 0, //数量
        cellNo: "", //储位
        capacity: "",
        stts: 0,
        produceType: "",
        maxuseNum: "",
        usedNum: 0,
        updateTime: "",
        updateUser: "",
        createTime: "",
        createUser: "",
        exFactoryDate: "",
      },
      edForm: {
        Containerid: "",
        ContainerName: "",
        Spec: "",
        Pn: "", //料号
        Qty: 0, //数量
        CellNo: "", //储位
        Capacity: "",
        Stts: 0,
        ProduceType: "",
        MaxuseNum: "",
        UsedNum: 0,
        UpdateTime: "",
        UpdateUser: "",
        CreateTime: "",
        CreateUser: "",
        ExFactoryDate: "",
      },
      tableData: [],
      total: 0,
      currentPage: 1, // 当前页码
      tableHeight: 0,
      // pageSize: 10, // 每页的数据条数
      getlistText: {
        pageIndex: 0,
        pageSize: 10,
        searchText: "",
      },
      rules: {
        containerid: [
          { required: true, message: "请输入容器ID", trigger: "blur" },
        ],
        containerName: [
          { required: true, message: "请输入容器名称", trigger: "change" },
        ],
        capacity: [
          { required: true, message: "请输入最大容量", trigger: "change" },
        ],
        produceType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
      },
      hosity: [],
    };
  },
  created() {
    this.getData();
  },
  watch: {
    "form.containerid"(value) {
      // console.log(1);
      this.inputValue(value);
    },
  },
   beforeMount() {
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
      queryPageContainer(this.getlistText)
        .then(({ data }) => {
          //  console.log(data);
          let a = JSON.parse(data.Data);
          this.total = a.Total;
          this.tableData = a.list;
          this.endLoading();
          console.log(this.tableData);
        })
        .catch(() => {
          this.endLoading();
        });
    },
    openAdd() {
      this.form.containerid = "";
      this.form.containerName = "";
      this.form.spec = "";
      this.form.pn = "";
      this.form.qty = "";
      this.form.cellNo = "";
      this.form.capacity = "";
      this.form.stts = "";
      this.form.produceType = "";
      this.form.maxuseNum = "";
      this.form.usedNum = "";
      this.form.updateTime = "";
      this.form.updateUser = "";
      this.form.createTime = "";
      this.form.createUser = "";
      this.form.exFactoryDate = "";
      this.show = false;
      this.dialogVisible = true;
      //  this.form=this.edForm
    },
    onSubmit() {
      // console.log(this.form);
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.createTime) {
            this.form.createTime = this.getNowFormatDate();
            this.form.createUser = getToken();
          }
          this.form.updateUser = getToken();
          this.form.updateTime = this.getNowFormatDate();
          // console.log(this.form);
          this.startLoading();
          // console.log(this.form);
          saveContainer(this.form)
            .then(({ data }) => {
              if (data.Code == 200) {
                this.dialogVisible = false;
                this.show = false;
                this.getData();
                // console.log(res);

                this.$message({
                  type: "success",
                  message: "添加/修改成功!",
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
      // console.log(this.form);
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.onSubmit();
        } else {
          this.$alert("添加失败,请完成必填项", "错误信息", {
            confirmButtonText: "确定",
          });
        }
      });
    },
    editCancel() {
      this.dialogEdVisible = false;
    },
    handleEdit(index, row) {
      // this.edForm = row;
      this.show = true;
      this.formDataPro(row);
      this.dialogVisible = true;
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
          deleteContainer({ Containerid: row.Containerid }).then((res) => {
            if (this.tableData.length == 1 && this.getlistText.pageIndex >= 0) {
              this.getlistText.pageIndex--;
            }
            // console.log(this.tableData.length, this.getlistText.pageIndex);
            this.getData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
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
      this.form.containerid = row.Containerid;
      this.form.containerName = row.ContainerName;
      this.form.spec = row.Spec;
      this.form.pn = row.Pn;
      this.form.qty = row.Qty;
      this.form.cellNo = row.CellNo;
      this.form.capacity = row.Capacity;
      this.form.stts = row.Stts;
      this.form.produceType = row.ProduceType;
      this.form.maxuseNum = row.MaxuseNum;
      this.form.usedNum = row.UsedNum;
      this.form.updateTime = row.UpdateTime;
      this.form.updateUser = row.UpdateUser;
      this.form.createTime = row.CreateTime;
      this.form.createUser = row.CreateUser;
      this.form.exFactoryDate = row.ExFactoryDate;
      // console.log(this.form);
    },
    getSearchData() {
      this.getlistText.pageIndex = 0;
      this.getData();
    },
    handleSizeChange(value) {
      this.getlistText.pageSize = value;
      this.getData();
      // console.log(this.pageSize);
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getlistText.pageIndex = value - 1;
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
    getNowFormatDate() {
      var date = new Date(); //获取当前时间
      var month = date.getMonth() + 1; //月份处理
      var day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      month = month < 10 ? "0" + month : month; //月份为1-9月,在其前面加0
      day = day < 10 ? "0" + day : day; //日期为1-9号,在其前面加了0
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      var s1 = "-"; //定义年月日分隔符-
      var s2 = ":"; //定义时分秒分隔符:
      //拼接年月日,时分秒
      var currDate =
        date.getFullYear() +
        s1 +
        month +
        s1 +
        day +
        " " +
        hours +
        s2 +
        minutes +
        s2 +
        seconds;
      return currDate;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 300;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.smdPro {
  padding: 20px;
  .table_header {
    padding-bottom: 20px;
    display: flex;
    gap: 30px;
    justify-content: space-between;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
}
</style>
