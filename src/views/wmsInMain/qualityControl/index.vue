<template>
  <div class="qualityControl">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="function" label="功能" width="180"> </el-table-column>
      <el-table-column prop="isActivate" label="是否启用" width="180"> </el-table-column>
      <el-table-column prop="date" label="时间"> </el-table-column>
      <el-table-column prop="operator" label="更新人"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      tableData: [{
          function:'ICT过站报工卡控',
          isActivate:true,
          date:'2024-08-01T09:17:06.457',
          operator:getToken()
      }],
    };
  },
};
</script>
