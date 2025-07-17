<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
        <div class="mb-2">
            <el-button type="primary" @click="openAdd">添加</el-button>
        </div>
        <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
            " border :height="tableHeight" style="width: 100%" size="small ">
            <el-table-column label="序号" width="55" fixed="left" align="center">
                <template slot-scope="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="examine_productname" label="料号"></el-table-column>
            <el-table-column prop="examine_status" label="启用">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.examine_status" :active-value="1" :inactive-value="0"
                        @change="editSubmit($event, scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
            <el-pagination align="center" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                :page-sizes="[10, 20, 50, 100, 200]" layout="total,sizes, prev, pager, next" :total="tableData.length">
            </el-pagination>
        </div>
        <el-dialog :title="'添加'" :visible.sync="addVisible" width="450px" @close="addCancel()">
            <el-form :model="addForm" ref="addFormRef" label-width="auto">
                <el-form-item label="料号" prop="examine_productname">
                    <el-input v-model="addForm.examine_productname" placeholder="请输入料号" ></el-input></el-form-item>
                <el-form-item label="启用" prop="examine_status">
                    <el-switch v-model="addForm.examine_status" :active-value="1"
                        :inactive-value="0"></el-switch></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="addSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
    </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
    QueryXYL_BadExamine,
    InsertXYL_BadExamine,
    UpdateXYL_BadExamine,
} from "@/api/repairApi";

export default {
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            tableHeight: 0,
            getForm: {
                examine_productname: "",
            },
            addVisible: false,
            addForm: {
                examine_productname: "",
                examine_status: 1,
                UserNo: getToken()
            },
        };
    },
    beforeMount() {
        this.getScreenHeight();
        this.getData();
    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        getData() {
            QueryXYL_BadExamine(this.getForm).then((res) => {
                console.log(res);

                this.tableData = res.Data;
            });
        },
        openAdd() {

            this.addVisible = true;

        },
        addCancel() {
            // this.$refs.addFormRef.resetFields();
            this.addVisible = false;
            this.addForm.examine_productname = "";
            this.addForm.examine_status = 1;
        },
        addSubmit() {
            // this.$refs.addFormRef.validate((valid) => {
            //     if (valid) {
            InsertXYL_BadExamine(this.addForm).then((res) => {
                if (res.Success) {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "success",
                    });
                    this.getData();
                    // this.$refs.addFormRef.resetFields();
                    this.addVisible = false;
                } else {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "error",
                    });
                }
            });
            //     } else {
            //         return false;
            //     }
            // });
        },
        editSubmit(val, row) {
            console.log(val, row);
            UpdateXYL_BadExamine({
                examine_productname: row.examine_productname,
                examine_status: val,
                UserNo: getToken(),
            }).then((res) => {
                if (res.Success) {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "success",
                    });
                    this.getData();
                } else {
                    this.$notify({
                        title: "错误信息",
                        message: res.Msg,
                        type: "error",
                    });
                }
            });
        },
        handleSizeChange(value) {
            this.pageSize = value;
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
        },
        getScreenHeight() {
            this.$nextTick(() => {
                this.tableHeight = window.innerHeight - 210;
                // this.tableHeight1 =
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
