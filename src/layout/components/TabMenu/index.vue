<template>
  <div class="w-20 bg-cyan fixed left-0 bottom-0 z-40" name="tabMenu">
    <el-scrollbar style="height: 100%" v-clickoutside="clickOut">
      <div class="tab-css w-20">
        <div class="w-20" v-for="item in tabRouters">
          <div
            class="text-center text-xs cursor-pointer pt-3 pb-3 hover:bg-cyan1 flex flex-col"
            style="font-size: 13px"
            :class="{ isActive: isActive(item.path) }"
            @click="tabClick(isOnlyChildren(item))"
          >
            <!-- <el-icon :size="24" color="#ffffff">
              <component :is="isOnlyChildren(item).meta?.icon" />
            </el-icon> -->
            <!-- <i :class="isOnlyChildren(item).meta?.icon" style="font-size: 25px;color:#fff" v-if="isOnlyChildren(item).meta?.icon!=null||isOnlyChildren(item).meta?.icon!=''"></i> -->
            <a-icon :type="isOnlyChildren(item).meta?.icon" :style="{ fontSize: '25px', color: '#fff'}" v-if="isOnlyChildren(item).meta?.icon!=null||isOnlyChildren(item).meta?.icon!=''"/>
            <!-- <SmartIcon :type="'setting'" :style="{ fontSize: '25px', color: '#fff'}"  v-if="isOnlyChildren(item).meta?.icon!=null||isOnlyChildren(item).meta?.icon!=''"></SmartIcon> -->
            <span class="text-white mt-1 px-1">
              <!-- {{ item.meta?.title || "" }} -->
              {{ isOnlyChildren(item).meta?.title || "" }}
            </span>
          </div>
        </div>
      </div>

    </el-scrollbar>
    <!-- <div class="h-20">1111</div> -->
    <menuItem
      class="absolute top-0 z-50 h-full left-20 bg-cyan2"
      :class="{ 'w-48': showMenu, 'w-0': !showMenu }"
      style="transition: width 0.5s, left 0.5s"
      :base-path="'/'"
      @refresh="clickOut"
    >
    </menuItem>
   
  </div>
</template>

<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
import { tabPathMap, initTabMap, filterMenusPath } from "./helper";
import { pathResolve } from "@/utils/routerHelper";
import cloneDeep from "lodash/cloneDeep";
import menuItem from "@/components/menu/index.vue";

import { mapState, mapMutations } from "vuex";
export default {
  directives: { Clickoutside },
  components: {
    menuItem,

  },
  data() {
    return {
      showMenu: false,
      tabActive: "",
      cachedTabRouters: [] // 缓存路由数据
    };
  },
  created() {
    this.cachedTabRouters = this.$router.options.routes.filter(v => !v.hidden);
  },
  watch: {
    routers: {
      handler(newRouters) {
        const clonedRouters = cloneDeep(newRouters); // 深拷贝避免污染原始数据
        initTabMap(clonedRouters);
        filterMenusPath(clonedRouters, clonedRouters);
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapState("permission", ["menuTabRouters"]),
    tabRouters() {
      return this.$router.options.routes.filter((v) => v.hidden != true);
    },
    routers() {
      return this.$router.options.routes;
    },
    getIconName(item) {
      return this.isOnlyChildren(item).meta?.icon || "";
    },
  },
  methods: {
    ...mapMutations("permission", ["SET_MENU_TAB_ROUTERS"]),
    tabClick(item) {
      // console.log(item);

      const newPath = item.children ? item.path : item.path.split("/")[0];
      const oldPath = this.tabActive;
      // if (this.tabActive === newPath && this.showMenu) return;
      if (this.tabActive === newPath && this.showMenu){
        this.showMenu=false
        return;
      } 
      //  console.log(this.showMenu);
      this.tabActive = newPath;

      if (item.children) {
        if (newPath === oldPath || !this.showMenu) {
          this.showMenu = !this.showMenu;
        }
        if (this.showMenu) {
         
          // console.log(this.tabActive);

          this.SET_MENU_TAB_ROUTERS(
            cloneDeep(item.children).map((v) => {
              v.path = pathResolve(this.tabActive, v.path);
              return v;
            })
          );
          // console.log(this.menuTabRouters);
        }
      } else {
        this.$router.push(item.path);

        this.SET_MENU_TAB_ROUTERS([]);
        this.showMenu = false;
      }
      // console.log(this.showMenu);

      // console.log(this.menuTabRouters);
    },
    isOnlyChildren(item) {
      //   console.log(item);

      if (item.path !== "/dashboard") {
        // console.log(item.children)
        return item;
      } else {
        return {
          ...(item.children && item.children[0]),
          path: pathResolve(
            item.path,
            (item.children && item.children[0])?.path
          ),
        };
      }
    },
    isActive(currentPath) {
      // console.log(currentPath, this.$route.path);

      // const { path } = unref(currentRoute);

      //   console.log(this.$route.path);
      if (currentPath == "/") {
        // console.log(currentPath, tabPathMap);
      } else {
        if (tabPathMap[currentPath].includes(this.$route.path)) {
          return true;
        }
        return false;
      }
    },

    clickOut() {
      this.showMenu = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-css {
  height: calc(100vh - 50.5px);
  // height: calc(100vh - 130.5px);
}

.isActive {
  // color: #004493;
  background: #013d83;
}
</style>
