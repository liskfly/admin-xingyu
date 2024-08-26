<template>
  <div class="qualityControl">
    <el-table :data="tableData" style="width: 100%" :cell-style="cellStyle">
      <el-table-column
        prop="remark"
        label="功能"
        width="180"
        style="background: #409eff"
      >
      </el-table-column>
      <el-table-column prop="ISCheck" label="是否启用" width="180">
        <template slot-scope="scope">
          <!-- scope.row 包含了当前行的数据 -->
            <el-switch
              v-model="scope.row.ISCheck"
              :active-value="1"
              :inactive-value="0"
              @change="test(scope.row,scope)"
            >
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="ud_dt" label="时间"> </el-table-column>
      <el-table-column prop="ud_user" label="更新人"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetICTOverStation, UPdateICTOverStation } from "@/api/spApi";
import { getToken } from "@/utils/auth";
import { getDateTo } from "@/utils/getDate";
export default {
  data() {
    return {
      tableData: [
        // {
        //   function: "ICT过站报工卡控",
        //   isActivate: true,
        //   date: "2024-08-01T09:17:06.457",
        //   operator: getToken(),
        // },
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 第一列的索引是0
        return "background-color: #409EFF;color:#ffffff;"; // 修改为你想要的颜色
      }
    },
    getData() {
      GetICTOverStation({
        PageIndex: 1,
        PageSize: 20,
        SearchText: "string",
        SearchModel: "string",
        StartTime: "string",
        EndTime: "string",
      }).then(({ data }) => {
        this.tableData = JSON.parse(data.Data.replace(/\//g, "")).list;
      });
    },
    textToObjectArray(text) {
      // 假设每句话以句号结束，并且我们以此作为分隔符
      const sentences = text.split(".");
      sentences = sentences
        .map((sentence) => ({
          text: sentence.trim(), // 去除可能的空白字符
        }))
        .filter((obj) => obj.text); // 去除空对象
      return sentences.text;
    },
    test(state,scope) {
      // console.log({
      //   name: "ICTGZKK",
      //   ISCheck: state.ISCheck,
      //   ud_dt: getDateTo(),
      //   ud_user: getToken(),
      // });
      UPdateICTOverStation({
        name: "ICTGZKK",
        ISCheck: state.ISCheck,
        ud_dt: getDateTo(),
        ud_user: getToken(),
      })
        .then(() => {
          this.tableData[scope.$index].ISCheck = state.ISCheck
        })
        .catch(() => {
          this.tableData[scope.$index].ISCheck = state.ISCheck === 0 ? 1 : 0
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.test {
  display: flex;
  justify-content: space-around;
}
</style>
