<template>
  <div>
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        background-color="#003750"
        :unique-opened="true"
        text-color="#bfcbd9"
        active-text-color="#ffff"
        @select="menuSelect"
      >
        <smenu-item
          v-for="v in routers"
          :key="v.path"
          :item="v"
          :base-path="'/'"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import smenuItem from "./components/smenuItem.vue";
import { mapState, mapMutations } from "vuex";
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "SidebarMenu",
  components: {
    smenuItem,
  },
  props: {
    basePath: {
      type: String,
      default: "/",
    },
  },
  data() {
    return {
      permissionStore: this.$store.state.permission, // 假设使用 Vuex
    };
  },
  computed: {
    ...mapState("permission", ["menuTabRouters"]),
    routers() {
      return cloneDeep(this.menuTabRouters); // 隔离状态引用
    },
    activeMenu() {
      const { meta, path } = this.$route;
      return meta.activeMenu || path;
    },
  },
  methods: {
    menuSelect(index) {
      // 添加导航重复判断
      if (this.$route.path === index) return;
      this.$emit("refresh");
      this.$router.push(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu-item.is-active {
  color: #ffcd50 !important;
}
</style>
