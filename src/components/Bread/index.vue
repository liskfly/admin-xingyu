<template>
    <div class="mt-1">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="flex items-center h-full">
              <!-- <router-link to="/">
                <i class="el-icon-place" style="font-size: 22px;  margin:0  8px  4px 8px"></i>
          </router-link> -->
            <i class="el-icon-place" style="font-size: 22px;  margin:0  8px  4px 8px" @click="goBack"></i>
            <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="item in processedLevelList" :key="item.name" :to="{
                    path:
                        !item.redirect || item.redirect === 'noredirect' ? '' : item.path,
                }">
                    {{ item.meta.title }}
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>

<script>
import { filter, treeToList } from "@/utils/tree";
import { filterBreadcrumb } from "./helper";
import { mapState, mapMutations } from "vuex";
export default {
    data() {
        return {
            levelList: [],
        };
    },
    computed: {
        menuRouters() {
            return filterBreadcrumb(this.$store.getters["permission/getRouters"]);
        },
        processedLevelList() {
            return treeToList(this.levelList);
        },
    },
    watch: {
        $route(newRoute) {
            if (newRoute.path.startsWith("/redirect/")) {
                return;
            }
            this.getBreadcrumb();
        },
    },

    beforeMount() {
        this.getBreadcrumb();
    },
    methods: {
        ...mapMutations("permission", ["SET_MENU_TAB_ROUTERS","SET_SHOW_MENU"]),
        goBack() {
            // this.$router.back();
            this.SET_SHOW_MENU(true)
        },
        getBreadcrumb() {
            const currentPath = this.$route.matched.slice(-1)[0]?.path || "";
            this.levelList = filter(
                this.menuRouters,
                (node) => node.path === currentPath
            );
        },
    },
};
</script>

<!-- <style lang="scss" scoped>
.el-breadcrumb {
  ::v-deep .el-breadcrumb__inner {
    color: #fff;
    font-size: 15px;

    &:hover {
      color: #eeeeee;
    }
  }

  ::deep(.el-breadcrumb__item):not(:last-child) .el-breadcrumb__inner {
    color: #fff;
    // font-size: 13px;
    // &:hover {
    //   color: #ffcd50;
    // }
  }

  ::deep(.el-breadcrumb__item):last-child .el-breadcrumb__inner {
    color: #fff;
  }
}
</style> -->
