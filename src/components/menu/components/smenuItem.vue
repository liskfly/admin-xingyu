<!-- <template>
    <div>
       <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
        <el-menu-item
          :index="pathResolve(basePath, onlyOneChild.path)"
          @click.native="clickMenu(onlyOneChild)"
        >
          <el-icon v-if="onlyOneChild.meta.icon">
            <component :is="onlyOneChild.meta.icon"/>
          </el-icon> 
          <span>{{ onlyOneChild.meta.title }}</span>
        </el-menu-item>
      </template>
      
      <el-submenu v-else :index="pathResolve(basePath, item.path)">
        <template slot="title">
          
          <span>{{ item.meta.title }}</span>
        </template>
        <smenu-item
          v-for="v in item.children"
          :key="v.path"
          :item="v"
          :base-path="pathResolve(basePath, item.path)"
        />
      </el-submenu>
    </div>
  </template> -->
<!-- 修改模板逻辑 -->
<template>
  <div>
    <template v-if="shouldRenderSingleChild.isSingle">
      <el-menu-item :index="pathResolve(basePath, shouldRenderSingleChild.child.path)"    >
        <span>{{ shouldRenderSingleChild.child.meta.title }}</span>
      </el-menu-item>
    </template>
    <el-submenu v-else :index="pathResolve(basePath, item.path)">
      <template slot="title">
        <span>{{ item.meta.title }}</span>
      </template>
      <smenu-item v-for="v in item.children" :key="pathResolve(basePath, v.path)" :item="v"
        :base-path="pathResolve(basePath, item.path)" />
    </el-submenu>
  </div>
</template>

<script>
import { pathResolve } from "@/utils/routerHelper";

export default {
  name: "SmenuItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "/",
    },
  },
  data() {
    return {
      onlyOneChild: null,
    };
  },
  computed: {
    // 替换原有的 hasOneShowingChild 方法
    shouldRenderSingleChild() {
      const { item, basePath } = this;
      const children = item.children || [];
      const showingChildren = children.filter((route) => !route.meta?.hidden);
      if (showingChildren.length === 0) {
        return { isSingle: true, child: { ...item, noShowingChildren: true } };
      }
      if (showingChildren.length === 1) {
        return { isSingle: false, child: showingChildren[0] };
      }
      return { isSingle: false };
    },
  },
  methods: {
    pathResolve(base, path) {
      return pathResolve(base, path);
    },
    clickMenu(item, item2) { },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((route) => {
        if (route.meta?.hidden) {
          return false;
        } else {
          this.onlyOneChild = route;
          return true;
        }
      });

      if (!showingChildren.length) {
        this.onlyOneChild = { ...parent, noShowingChildren: true };
        return true;
      }
      return false;
    },
  },
};
</script>
<style lang="scss">
  .el-submenu__title {
  height: 45px ;
  line-height: 45px ;
  &:hover {
    outline: 0 !important;
    color: #ffcd50 !important;
    background-color: #000 !important;
  }
}
</style>
<style lang="scss" scoped>
.el-menu-item {
  height: 40px;
  line-height: 40px;
  font-size: small;
  color: #fff !important;

  &:hover {
    outline: 0 !important;
    color: #ffcd50 !important;
    background-color: #000 !important;
  }

  &.is-active {
    color: #ffcd50 !important;
    background-color: #000 !important;
  }
}

</style>

