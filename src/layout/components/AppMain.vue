<template>
  <section class="app-main" ref="appMain">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: 'AppMain',
  data() {
    return {
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  mounted() {
    this.getHeight()
    window.addEventListener("resize", this.getHeight, false);
  },
  methods:{
    ...mapMutations(["Set_DashboardHeight"]),
    getHeight(){
      this.Set_DashboardHeight(this.$refs.appMain.clientHeight)
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 110px);
  width: 100%;
  position: relative;
  overflow: hidden;
  /* display: grid; */
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
