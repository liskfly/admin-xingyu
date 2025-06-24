<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between">
                <el-button type="primary" @click="addOpen" size="medium">添加</el-button>
                <div>
                    <el-input v-model="searchName" clearable placeholder="请输入" @keyup.enter.native="searchData()">
                        <template slot="append">
                            <el-button type="primary" icon="el-icon-search" @click="searchData()"></el-button>
                        </template>
                    </el-input>
                </div>
            </div>
          
        </el-card>

    </div>
</template>

<script>
import { moldControl, iDControll } from "@/api/all";
export default {
    data() {
        return {
            searchName: '', // 搜索名称
            addVisible: false, 

        }
    },
    beforeMount() {
        this.getScreenHeight();
    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
        this.getIDdata();
        this.getData();
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        // 打开添加对话框
        addOpen() {
            this.addVisible = true;
        },
        // 搜索数据
        searchData() {
            console.log("搜索内容:", this.searchName);
            // 在这里添加搜索逻辑
        },
        // 取消添加
        addCancel() {
            this.addVisible = false;
            this.$refs.addForm.resetFields(); // 重置表单
        },
        handleSizeChange(value) {
            this.pageSize = value;
            console.log(this.pageSize);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
        },
        getScreenHeight() {
            this.$nextTick(() => {
                this.tableHeight = window.innerHeight - 230;
                // this.tableHeight1 =
            });
        },
    }
}
</script>

<style lang="scss" scoped></style>