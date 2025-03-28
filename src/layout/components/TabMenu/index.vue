<template>
    <div class="w-20  bg-cyan fixed left-0 bottom-0" v-clickoutside="clickOut()">
        <el-scrollbar style="height: 100%">
            <div class="tab-css w-20 ">
                <div class="w-20" v-for="item in tabRouters">
                    <div class="text-center text-xs cursor-pointer pt-3 pb-3 hover:bg-cyan1" style="font-size: 13px;"
                        :class="{ isActive: isActive(item.path) }">
                        <!-- <el-icon :size="24" color="#ffffff">
            <component :is="isOnlyChildren(item).meta?.icon" />
          </el-icon> -->
                        <p class="text-white mt-1 px-1">
                            {{ item.meta?.title || "" }}
                            <!-- {{ isOnlyChildren(item).meta?.title || "" }} -->
                        </p>
                    </div>
                </div>
            </div>
        </el-scrollbar>

    </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import {tabPathMap, initTabMap, filterMenusPath} from "./helper"
export default {
    directives: { Clickoutside },
    data() {
        return {
            showMenu: false
        }
    },
    watch: {
        routers: {
            handler(newRouters) {
                initTabMap(newRouters);
                filterMenusPath(newRouters, newRouters);
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        tabRouters() {
            return this.$router.options.routes.filter(v => v.hidden != true)
        },
        routers() {
            return this.$router.options.routes;
        },
    },
    methods: {
        isActive(currentPath) {
            // console.log(currentPath, this.$route.path);

            // const { path } = unref(currentRoute);
            console.log(tabPathMap[currentPath]);
            
            if (tabPathMap[currentPath].includes(this.$route.path)) {
                return true;
            }
            return false;
        },
        clickOut() {
            // console.log(1111);

            this.showMenu = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-css {
    height: calc(100vh - 55px);

}

.isActive {
    // color: #006487;
    background: #004493;
}
</style>