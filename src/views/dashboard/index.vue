<template>
  <div class="dashboard-container" ref="dc">
    <!-- <div class="dashboard-text">欢迎使用</div> -->
    <el-carousel :height="`${dashboardHeight}px`">
      <el-carousel-item v-for="item in pic" :key="item.img">
        <img
          :style="{ width: `${item.width}%`, height: `${item.height}%` }"
          :src="item.img"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      width: 0,
      height: 0,
      pic: [
        {
          img: require("@/assets/dashboard/1714269459418.png"),
          width: 100,
          height: 100,
        },
        {
          img: require("@/assets/dashboard/img_v3_00a6_a9d491a4-3940-43a0-9cc0-81b732bcef1g.jpg"),
          width: 100,
          height: 100,
        },
        // {
        //   img: require("@/assets/dashboard/img_v3_02a6_fc862b5a-7752-4624-b6ec-ff6f5e0072ag.jpg"),
        //   width: 80,
        //   height: 100,
        // },
      ],
    };
  },
  computed: {
    ...mapGetters(["name"]),
    ...mapState(["dashboardHeight"]),
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getWidth();
    // });
    // window.addEventListener("resize", this.getWidth, false);
  },
  methods: {
    getWidth() {
      // this.width = this.$refs.dc.clientWidth;
      // this.height = this.$refs.dc.clientHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  // &-container {
  //   margin: 30px;
  // }
  // &-text {
  //   font-size: 30px;
  //   line-height: 46px;
  // }
}
</style>
