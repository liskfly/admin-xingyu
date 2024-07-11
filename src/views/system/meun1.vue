<template>
  <div class="meun">
    <tableTemplate :tableLabel="tableLabel" :pageTitle="title"></tableTemplate>
  </div>
</template>
  
<script>
import tableTemplate from "@/components/tableTemplate";
export default {
  components: {
    tableTemplate,
  },
  data() {
    return {
      title: "权限信息",
      tableLabel: ["权限编号", "权限名称"],
    };
  },
};
</script>
  
<style lang="scss" scoped>
</style>