<template>
    <div class="bood flex justify-between">
        <div class="flex-1">
            <!-- <el-scrollbar class="h-full" > -->
            <div class="flex h-full items-center">
                <div v-for="item in visitedViews" :key="item.fullPath" class="tag_item" :class="[
                    item.meta.affix ? `affix` : '',
                    {
                        'is-active': isActive(item),
                    },
                ]">
                    <router-link :to="{ ...item }" custom v-slot="{ navigate }">
                        <div @click="navigate" class="flex whitespace-nowrap justify-center items-center pl-[15px]">
                            {{ item?.meta?.title }}
                            <div class="qx" v-if="item.fullPath !== '/dashboard/index'">
                                <!-- <el-icon :size="12" :color="isActive(item) ? '#fff' : '#333'"
                                    @click.prevent.stop="closeSelectedTag(item)">
                                    <Close />
                                </el-icon> -->
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
            <!-- </el-scrollbar> -->
        </div>
        <div>111</div>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
// import { filterAffixTags } from './helper'
export default {
    data() {
        return {
            affixTagArr: []
        };
    },
    computed: {
        visitedViews() {
            // 假设 tagsView 是 Vuex 模块名称
            return this.$store.getters["tagsView/visitedViews"];
        }
    },
    methods: {
        isActive(route) {
            return route.path === this.$route.path;
        },
        closeSelectedTag(view) {
            this.$store.dispatch("tagsView/delView", view);
            if (this.isActive(view)) {
                toLastView();
            }
        },
        toLastView() {
            // 从Vuex获取已访问视图
            const visitedViews = this.$store.getters["tagsView/visitedViews"];
            const latestView = visitedViews.slice(-1)[0];

            if (latestView) {
                // 跳转到最后一个视图
                this.$router.push(latestView);
            } else {
                // 获取权限路由配置
                const addRouters = this.$store.getters["permission/addRouters"] || [];
                const defaultRoute = addRouters[0] || { path: "/" };

                // 检查当前路由是否已经是默认路由
                if (
                    this.$route.path === defaultRoute.path ||
                    this.$route.path === defaultRoute.redirect
                ) {
                    // this.addDefaultTags() // 添加默认标签
                    this.addTags();
                    return;
                }

                // 跳转到默认路由
                this.$router.push(defaultRoute.path);
            }
        },
        initTags() {
            this.affixTagArr = filterAffixTags(this.routers);
            this.affixTagArr.forEach((tag) => {
                if (tag.name) {
                    // 使用深拷贝添加路由对象
                    this.$store.commit("tagsView/ADD_VISITED_VIEW", cloneDeep(tag));
                }
            });
        },
        addTags() {
            const currentRoute = this.$route;
            if (currentRoute.name) {
                // this.setSelectTag(currentRoute)
                this.$store.dispatch("tagsView/setSelectedTag", currentRoute);
                // 分发Vuex action
                this.$store.dispatch("tagsView/addView", currentRoute);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.bood {
    box-sizing: border-box;
    border-bottom: 1px solid #cbd5e1;
    height: 35px;
}
</style>
