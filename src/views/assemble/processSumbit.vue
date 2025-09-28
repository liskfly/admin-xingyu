<template>
  <div class="p-2">
    <el-row :gutter="20">
      <el-col :span="15">
        <el-form
          class="inbound"
          label-position="left"
          :model="form"
          ref="form"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form :inline="true">
            <el-form-item label="处置方法"
          label-width="120px">
              <el-select
                v-model="form.ReworkType"
                placeholder=""
                style="width: 200px"
              >
                <el-option
                  v-for="item in repairList"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                style="width: 350px"
                v-model="form.ReworkRemark"
                ref="inputRef"
                placeholder=""
                v-show="form.ReworkType == 2"
              ></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="refresh">重置</el-button>
            </el-form-item>
          </el-form>
          <el-form-item label="扫入过程码">
            <el-input
              class="SN"
              v-model="form.SN"
              ref="inputRef"
              placeholder="请扫描过程码或相机码"
              @keyup.enter.native="changeSubmit"
            ></el-input>
          </el-form-item>
          <el-form-item label="当前过程码">
            <el-input v-model="olderSN" disabled></el-input>
          </el-form-item>
          <el-form-item label="工序">
            <span style="font-size: 28px; font-weight: bolder">
              {{ textForm.StationCode }}</span
            >
          </el-form-item>
          <el-form-item label="工单">
            <span style="font-size: 28px; font-weight: bolder">
              {{ textForm.WorkOrder }}</span
            >
          </el-form-item>
          <el-form-item label="产品编码">
            <span style="font-size: 28px; font-weight: bolder">
              {{ textForm.ProductCode }}</span
            >
          </el-form-item>
          <el-form-item label="产品名称">
            <span style="font-size: 28px; font-weight: bolder">
              {{ textForm.ProductName }}
            </span>
          </el-form-item>
          <el-form-item label="产品规格">
            <span style="font-size: 28px; font-weight: bolder">
              {{ textForm.ProductSpec }}
            </span>
          </el-form-item>
          <el-form-item label="消息提示">
            <el-input
              v-model="textMessage"
              disabled
              type="textarea"
              :rows="4"
              :class="messageClass"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="9">
        <el-table
          :data="tableData"
          border
          :height="tableHeight"
          stripe
          size="small"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="55"
          />

          <el-table-column prop="ScanSN" label="SN码" width="210"> </el-table-column>
          <el-table-column prop="ReworkMethod" label="处置方法">
          </el-table-column>
          <el-table-column
            prop="ReworkUser"
            label="处置人"
            width="100"
          ></el-table-column>
          <el-table-column prop="ReworkTime" label="处置时间" width="150">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { processSumbit, AssemblyReworkHistory } from "@/api/assemble";

import { getToken } from "@/utils/auth";
import dayjs from "dayjs";

export default {
  data() {
    return {
      form: {
        SN: "",
        ReworkType: null,
        ReworkMethod: "",
        ReworkRemark: "",
        ReworkUser: getToken(),
        ReworkTime: "",
      },
      textMessage: "",
      isSuccess: true,
      olderSN: "",
      textForm: {
        WorkOrder: "",
        ProductCode: "",
        ProductName: "",
        ProductSpec: "",
        StationCode: "",
      },
      tableHeight: 0,
      tableData: [],
      repairList: [
        {
          lable: "误判",
          value: 1,
        },
        {
          lable: "维修",
          value: 2,
        },
        {
          lable: "返工解绑",
          value: 3,
        },
      ],
    };
  },
  computed: {
    // 根据状态计算样式类
    messageClass() {
      return this.isSuccess ? "success-message" : "error-message";
    },
  },
  beforeMount() {
    this.getScreenHeight();
    this.getData({ ReworkTime: dayjs().format("YYYY-MM-DD") });
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);

    this.$nextTick(() => {
      this.$refs.inputRef.focus();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },

  methods: {
    getData(data) {
      AssemblyReworkHistory(data).then((res) => {
        this.tableData = res.Data;
      });
    },
    refresh() {
      this.form = {
        SN: "",
        OperateTime: "",
        ReworkRemark: "",
        ReworkType: null,
        OperateUser: getToken(),
      };
      this.textForm = {
        WorkOrder: "",
        ProductCode: "",
        ProductName: "",
        ProductSpec: "",
        StationCode: "",
      }
    },
    returnType(num) {
      let text = "";
      this.repairList.forEach((i) => {
        if (i.value == num) {
          text = i.lable;
        }
      });
      return text;
    },
    changeSubmit() {
      if (this.form.ReworkType == null || (this.form.ReworkType == 2 && this.form.ReworkRemark == "")) {
        this.$message({
          message: "请先选择处置方法并输入描述",
          type: "warning",
        });
        this.form.SN = "";
        return;
      }
      this.form.ReworkMethod = this.returnType(this.form.ReworkType);
      this.form.ReworkTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      processSumbit(this.form).then((res) => {
        this.isSuccess = res.Success;
        this.textMessage = res.Msg;
        this.olderSN = this.form.SN; // 保存当前扫描的过程码

        this.getData({ ReworkTime: dayjs().format("YYYY-MM-DD") });
        if (res.Data != null) {
          let data = JSON.parse(res.Data);
          this.textForm = {
            WorkOrder: data.WorkOrder || "",
            ProductCode: data.ProductCode || "",
            ProductName: data.ProductName || "",
            ProductSpec: data.ProductSpec || "",
            StationCode: data.StationCode || "",
          };
        } else {
          this.textForm = {
            WorkOrder: "",
            ProductCode: "",
            ProductName: "",
            ProductSpec: "",
            StationCode: "",
          };
        }

        this.form.SN = "";
        this.$refs.inputRef.focus();
      });
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 108;
      });
    },
  },
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 20px;
}

.inbound .el-input__inner {
  font-size: 28px;
  font-weight: bolder;
}

.inbound .el-textarea__inner {
  font-size: 28px;
  font-weight: bolder;
}

.success-message .el-textarea__inner {
  color: #67c23a !important;
}

/* 失败样式 - 红色文字 */
.error-message .el-textarea__inner {
  color: #f56c6c !important;
}
</style>
