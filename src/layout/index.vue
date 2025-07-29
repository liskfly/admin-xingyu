<template>
  <div >
    <HeaderTop></HeaderTop>
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- <sidebar class="sidebar-container" /> -->
 
      <TabMenu />
     
  
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }" >
        <navbar />
      </div>
      <div style="display: flex">
        <div class="left-box"><app-main /></div>
      
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain,TabMenu ,HeaderTop} from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";


export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TabMenu,
    HeaderTop
  },
  mixins: [ResizeMixin],
  data() {
    return {
      timer: "",
    };
  },
  computed: {
    ...mapState(['showNotice']),
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  watch: {
    showNotice(n) {
      if (n) {
        setTimeout(() => {
          this.start()
        }, 500)

      } else {
        clearTimeout(this.timer);
        this.timer = null
      }
    }
  },
  mounted() {
    // this.ListScroll()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    start() {
      clearTimeout(this.timer);
      // 定时器触发周期
      this.timer = setInterval(this.ListScroll, 50);
    },
    ListScroll() {
      let scrollDom = this.$refs.scrollContainer;
      let div1 = this.$refs.div1
      let a = (div1[0].clientHeight + 32) * this.notice.length
      // console.log(a);
      // 如果列表数量过少不进行滚动
      if (scrollDom.clientHeight > a + 20) {
        clearTimeout(this.timer);
        return;
      }
      // 组件进行滚动
      scrollDom.scrollTop += 1;
      // console.log(scrollDom.scrollTop);
      // 判断是否滚动到底部
      if (
        Math.round(scrollDom.scrollTop) ==
        Math.round(scrollDom.scrollHeight - scrollDom.clientHeight)
      ) {
        // 获取组件第一个节点
        let first = scrollDom.children[0];
        // 删除节点
        scrollDom.removeChild(first);
        // 将该节点拼接到组件最后
        scrollDom.append(first);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";


.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;

  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 110px);
}

.mobile .fixed-header {
  width: 100%;
}

.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // position: relative;
  height: 55px;
  color: #fff;
  background-color: $menuBg;
}

.text {
  margin-left: 75px;
  letter-spacing: 2px;
  font-size: 23px;
  transform: skew(-10deg);
}

.logo {
  margin-left: auto;
  // position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  // float: right;
  // width:auto;
  // background-color: #fff;
}

.noti {
  flex: 0 0 200px;
  height: calc(100vh - 91px);
  width: 100%;
}

.left-box {
  flex: 1;
  height: calc(100vh - 91px);
  overflow: auto;
}

.left-box::-webkit-scrollbar {
  display: none;
}

.list {
  height: calc(100vh - 207px);
  overflow: auto;
}

.list::-webkit-scrollbar {
  display: none;
}
</style>
