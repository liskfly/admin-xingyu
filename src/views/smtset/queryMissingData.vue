<template>
  <div :style="{ height: `${dashboardHeight}px` }">
    <div class="smtinstpro">
      <el-form ref="form" class="form" :inline="true" :model="getDataText">
        <el-form-item>
          <el-input
            placeholder="工单名称"
            v-model="getDataText.orderName"
            class="input-with-select"
            style="width: 300px; margin-right: 20px"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="getDataText.operationName" placeholder="操作名称">
            <el-option
              v-for="item in orderList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAdd">批量录入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data">
      <el-row :gutter="20">
        <el-col
          :span="8"
          class="item"
          v-for="(item, index) in missingList"
          :key="index"
        >
          <div>
            {{ item.SerialNumber
            }}{{ item.StatusCode ? `(${item.StatusCode})` : "" }}
          </div>
          <el-button
            type="primary"
            size="mini"
            @click="toQuatrace(item.SerialNumber)"
            >跳转</el-button
          >
        </el-col>
      </el-row>
    </div>
    <el-dialog title="批量录入" :visible.sync="addVisible">
      <el-form ref="form" label-width="80px">
        <el-form-item label="设备ID">
          <el-input
            placeholder="设备ID"
            v-model="addForm.mcId"
            class="input-with-select"
            style="width: 300px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="addForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 300px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="不良代码">
          <el-select
            v-model="addForm.status"
            placeholder="不良代码"
            style="width: 300px"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录入类型">
          <el-select
            v-model="addForm.operationType"
            placeholder="录入类型"
            style="width: 300px"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="(dialogFormVisible = false), addData()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { XY_Prod_MissSNs } from "@/api/timeApi";
import { XY_Prod_AddMissSNNew } from "@/api/all";
import { getDate } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
import { orderName } from "@/utils/oeeFun";
import { mapGetters, mapState } from "vuex";
import { missTime } from "@/utils/oeeFun";
export default {
  data() {
    return {
      getDataText: {
        orderName: "",
        operationName: "",
        operationType: "Q",
      },
      orderList: orderName(),
      missingList: [],
      addForm: {
        orderName: "",
        pcbId: [],
        mcId: 0,
        startTime: "",
        status: "",
        operationType: "",
      },
      typeList: [
        {
          value: "GI",
          label: "写入工艺流程记录",
        },
        {
          value: "RI",
          label: "注册SN到工单",
        },
      ],
      statusList: [
        {
          value: "PASS",
        },
        {
          value: "FAIL",
        },
      ],
      addVisible: false,
    };
  },
  computed: {
    ...mapState(["dashboardHeight"]),
  },
  beforeMount() {
    // this.dataInitialization();
  },
  mounted() {},
  methods: {
    getData() {
      if (
        this.getDataText.orderName === "" ||
        this.getDataText.operationType === ""
      ) {
        this.$alert("查询失败,请完整填写信息", "错误信息", {
          confirmButtonText: "确定",
        });
        return;
      }
      this.startLoading();
      XY_Prod_MissSNs(this.getDataText)
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.missingList = data.DataList;
          }else {
            this.missingList = [];
          }
          this.endLoading();
          console.log(data);
        })
        .catch(() => {
          this.endLoading();
        });
    },
    toQuatrace(SerialNumber) {
      this.$router.push({ path: "/report/quatrace", query: { SerialNumber } });
    },
    openAdd() {
      if (
        this.getDataText.operationName != "" ||
        this.missingList.length != 0
      ) {
        this.addVisible = true;
        this.addForm.orderName = this.getDataText.orderName;
        this.addForm.pcbId = [];
        const seen = new Set();
        this.missingList.forEach((item) => {
          if (!seen.has(item.SerialNumber)) {
            seen.add(item.SerialNumber);
            this.addForm.pcbId.push(item.SerialNumber);
          }
        });
        console.log(this.addForm.pcbId);
        // this.addForm.pcbId = this.missingList;
      } else {
        this.$notify({
          title: "提示",
          message: "请确认已输入工单并已进行搜索",
          type: "warning",
        });
      }
    },
    addData() {
      XY_Prod_AddMissSNNew({
        ...this.addForm,
        startTime: missTime(this.addForm.startTime),
      }).then((res) => {
        if (res.data.Status == "OK") {
          this.$message({
            message: res.data.Status,
            type: "success",
          });
          this.addVisible = false;
        } else {
          this.$alert(res.data.Message, "错误", {
            confirmButtonText: "确定",
            callback: (action) => {},
          });
        }
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
    // border: 1px solid;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
