<template>
    <div class="header-title1">
        <!-- <div class="text">Siemens Opcenter 中心 -- 智能电子</div> -->
        <div class="flex">
            <div class="flex ml-2 ">
                <!-- <img src="../../../assets/logo-white.svg" alt="SIEMENS" width="150" /> -->
                <span class="ml-2 font-bold" style="font-size: 24px;"> Siemens Opcenter 中心 -- 电子二工厂</span>
            </div>
            <!-- <bread></bread> -->
        </div>

        <div class="logo" v-if="device !== 'mobile'"><img src="../../../assets/logo_xyl2-modified.png" alt="星宇"
                width="160" /></div>
    </div>
</template>

<script>
import bread from "@/components/Bread"
export default {
    components: {
        bread
    },
    data() {
        return {

        }
    },
    computed: {
        device() {
            return this.$store.state.app.device;
        },
    }
}
</script>

<style lang="scss" scoped>
// @import "~@/styles/mixin.scss";
// @import "~@/styles/variables.scss";
.header-title1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // position: relative;
    height: 51px;
    color: #fff;
    background-color: #004ea1;
}
</style>