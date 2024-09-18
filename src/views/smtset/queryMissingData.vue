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
      </el-form>
    </div>
    <div class="data">
      <el-row :gutter="20">
        <el-col
          :span="6"
          class="item"
          v-for="(item, index) in missingList"
          :key="index"
        >
          <div>{{ item.SerialNumber }}</div>
          <el-button
            type="primary"
            size="mini"
            @click="toQuatrace(item.SerialNumber)"
            >跳转</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { XY_Prod_MissSNs } from "@/api/timeApi";
import { getDate } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
import { orderName } from "@/utils/oeeFun";
import { mapGetters, mapState } from "vuex";
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
      this.startLoading();
      XY_Prod_MissSNs(this.getDataText)
        .then(({ data }) => {
          if (data.Status === "OK") {
            this.missingList = data.DataList;
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
