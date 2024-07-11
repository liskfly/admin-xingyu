<template>
  <div :style="{ height: `${dashboardHeight}px` }">
    <div class="smtinstpro">
      <el-form ref="form" class="form" :model="addForm">
        <el-form-item label="插针头">
          <el-input
            placeholder="插针头"
            type="number"
            v-model.number="addForm.columnPosition"
            class="input-with-select"
            style="width: 300px; margin-right: 20px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="程式名">
          <el-select v-model="addForm.dataCollectionDefName" placeholder="程式名">
            <el-option
              v-for="item in nameList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="针类型">
          <el-select v-model="addForm.positionType" placeholder="针类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准值">
          <el-input
            placeholder="标准值"
            v-model="addForm.standardValue"
            class="input-with-select"
            style="width: 300px; margin-right: 20px"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="entryData">录入</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { pressFitAdd, findAllName } from "@/api/index";
import { getDate } from "@/utils/getDate";
import { getToken } from "@/utils/auth";
import { missTime } from "@/utils/oeeFun";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      addForm: {
        columnPosition: "",
        dataCollectionDefName: "",
        positionType: 1,
        standardValue: "",
      },
      //   orderList: orderName(),
      nameList: [],
      typeList: [
        {
          value: 1,
          label: "小针",
        },
        {
          value: 2,
          label: "大针",
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
  mounted() {
      this.getList();
  },
  methods: {
    entryData() {
      if (
        !this.addForm.columnPosition ||
        !this.addForm.standardValue || 
        !this.addForm.dataCollectionDefName
      ) {
        this.$message({
          message: "请输入完整值",
          type: "warning",
        });
        return;
      }
      this.startLoading();
      pressFitAdd(this.addForm)
        .then(({ data }) => {
          if (data.code === "100200") {
            this.$message({
              message: "数据录入成功",
              type: "success",
            });
          } else {
            this.$message(data.msg);
          }
          this.endLoading();
        })
        .catch((res) => {
          this.$message(res);
          this.endLoading();
        });
    },
    getList() {
      this.startLoading();
        findAllName().then(({data}) => {
          if (data.code === "100200") {
            this.nameList = data.content;
          }
          this.endLoading();
        }).catch(() => {
          this.endLoading();
        })
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
