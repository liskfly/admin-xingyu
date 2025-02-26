<template>
  <div class="three">
    <el-card :body-style="{ padding: '8px' }">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        :height="tableHeight"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column prop="lineNumber" label="线体"> </el-table-column>
        <el-table-column prop="deviceID" label="设备ID"> </el-table-column>
        <el-table-column prop="parameter" label="调整参数">
        </el-table-column>
        <el-table-column prop="value" label="值"> </el-table-column>
        <el-table-column prop="date" label="时间"> </el-table-column>
        <el-table-column prop="photographID" label="照合设备ID"> </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
            lineNumber:"Line1",
            deviceID:"102",
            parameter:"REV X",
            value:"-0.016mm",
            date:"2025-02-25 14:59:51.9306",
            photographID:"103"
        },
        {
            lineNumber:"Line1",
            deviceID:"102",
            parameter:"REV Y",
            value:"-0.026mm",
            date:"2025-02-25 14:59:51.9306",
            photographID:"103"
        },
        {
            lineNumber:"Line1",
            deviceID:"102",
            parameter:"REV T",
            value:"-45Arc Seconds",
            date:"2025-02-25 14:59:51.9306",
            photographID:"103"
        }
      ],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
    };
  },
  beforeMount() {
    this.getScreenHeight();
    this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {},
    handleSizeChange(value) {
      this.pageSize = value;
      console.log(this.pageSize);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 180;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.three {
  padding: 8px;
}
</style>
