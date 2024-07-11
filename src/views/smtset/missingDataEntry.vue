<template>
  <div :style="{ height: `${dashboardHeight}px` }">
    <div class="smtinstpro">
      <el-form ref="form" class="form" :model="addForm">
        <el-form-item label="工单名称">
          <el-input
            placeholder="工单名称"
            v-model="addForm.orderName"
            class="input-with-select"
            style="width: 300px; margin-right: 20px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="pcbID">
          <el-input
            placeholder="pcbID"
            v-model="addForm.pcbId"
            class="input-with-select"
            style="width: 300px; margin-right: 20px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input
            placeholder="设备ID"
            v-model="addForm.mcId"
            class="input-with-select"
            style="width: 300px; margin-right: 20px"
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
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="不良代码">
          <el-select v-model="addForm.status" placeholder="不良代码">
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
          <el-select v-model="addForm.operationType" placeholder="录入类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="entryData">录入</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { XY_Prod_AddMissSN } from "@/api/all";
import { getDate } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
import { missTime } from "@/utils/oeeFun";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      addForm: {
        orderName: "",
        pcbId: "",
        mcId: "",
        startTime: "",
        status: "PASS",
        operationType: "GI",
      },
      //   orderList: orderName(),
      statusList: [
        {
          value: "PASS",
        },
        {
          value: "FAIL",
        },
      ],
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
      missingList: [],
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
    entryData() {
      if (
        !this.addForm.pcbId ||
        !this.addForm.mcId ||
        !this.addForm.startTime
      ) {
        this.$message({
          message: "请输入完整值",
          type: "warning",
        });
        return;
      } else if (
        this.addForm.operationType === "RI" &&
        !this.addForm.orderName
      ) {
        this.$message({
          message: "请输入工单名称",
          type: "warning",
        });
        return;
      }
      this.startLoading();
      XY_Prod_AddMissSN({
        ...this.addForm,
        startTime: missTime(this.addForm.startTime),
      })
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.$message({
              message: "数据录入成功",
              type: "success",
            });
          } else {
            this.$message(data.Message);
          }
          this.endLoading();
        })
        .catch((res) => {
          this.$message(res);
          this.endLoading();
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
    border: 1px solid;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
