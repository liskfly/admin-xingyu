<template>
    <div class="type">
        <el-card :body-style="{ padding: '8px' }">
            <div class="table_header">
                <el-button type="primary" @click="openAdd">添加</el-button>
            </div>
            <div class="table_container">
                <el-table :data="tableData.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                )
                    " border :height="tableHeight" style="width: 100%">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column prop="product_name" label="产品名称">
                    </el-table-column>
                    <el-table-column prop="product_code" label="成品编码">
                    </el-table-column>
                    <el-table-column prop="code_identifier" label="成品码规则">
                    </el-table-column>
                    <el-table-column prop="creator" label="操作人"> </el-table-column>
                    <el-table-column prop="create_time" label="时间"> </el-table-column>

                    <el-table-column fixed="right" label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>

                            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper"
                    :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="'新增'" :visible.sync="dialogVisible" width="500px" @close="addCancel()">
            <el-form :model="form" ref="formRef" label-width="auto">
                <el-form-item label="产品名称" prop="product_name">
                    <el-input v-model="form.product_name" placeholder="" />
                </el-form-item>
                <el-form-item label="成品编码" prop="product_code">
                    <el-input v-model="form.product_code" placeholder="" />
                </el-form-item>
                <el-form-item label="成品码规则" prop="code_identifier">
                    <el-input v-model="form.product_code" placeholder="" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="onSubmit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="'编辑'" :visible.sync="editVisible" width="500px" @close="editCancel()">
            <el-form :model="editForm" ref="editFormRef" label-width="auto">
                <el-form-item label="产品名称" prop="product_name">
                    <el-input v-model="editForm.product_name" placeholder="" />
                </el-form-item>
                <el-form-item label="成品编码" prop="product_code">
                    <el-input v-model="editForm.product_code" placeholder="" />
                </el-form-item>
                <el-form-item label="成品码规则" prop="code_identifier">
                    <el-input v-model="editForm.product_code" placeholder="" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel()">取 消</el-button>
                <el-button type="primary" @click="editSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    findLineMaterialk,
    recycleEmptyVehicles,
    cancelTask1,
} from "@/api/agvApi";
import { getToken } from "@/utils/auth";
import { Notification } from "element-ui";
export default {
    data() {
        return {
            dialogVisible: false,
            editVisible: false,
            tableData: [
                {
                    product_name: "F2A",
                    product_code: "4051012946200",
                    code_identifier: "4051012946200",
                    creator: "CamstarAdmin",
                    create_time: "2025-3-10 10:20:12",
                },
            ],
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页的数据条数
            tableHeight: 0,
            form: {
                product_name: "",
                product_code: "",
                code_identifier: "",
                creator: "",
                create_time: "",
            },
            editForm: {
                product_name: "",
                product_code: "",
                code_identifier: "",
            },
            getText: {
                toolsMold: "*",
                remark: "",
                operationType: "Q",
            },
        };
    },
    created() {
        // this.getData();
    },
    beforeMount() {
        this.getScreenHeight();
        //   this.getData();
    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        getData() {
            // findLineMaterialk(this.line).then((res) => {
            //     // console.log(res);
            //     this.tableData = [];
            //     if (res.Success) {
            //         let data = JSON.parse(res.Data);
            //         this.tableData = data.filter((item) => {
            //             if (item.mtype == 2) {
            //                 return true;
            //             }
            //             return false;
            //         });
            //         // console.log(this.tableData);
            //     }
            // });
        },
        openAdd() {
            this.dialogVisible = true;
        },

        addCancel() {
            this.$refs.formRef.resetFields();
            this.dialogVisible = false;
            // this.$refs.form.resetFields();
        },
        handleEdit(row) {
            console.log(row);
            this.editForm = { ...row };
            this.editVisible = true;
        },
        handleDelete(row) {
            this.$confirm("确定删除", "确认操作", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.startLoading();
                    specControl({
                        toolsMold: row.PN_Model,
                        remark: row.Dsc,
                        productName: row.PD_model,
                        useage: row.Qty,
                        operationType: "D",
                    }).then(({ data }) => {
                        this.endLoading();
                        if (data.Status == "OK") {
                            //  this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
                            this.getIDdata();
                            // this.dialogVisible = false;
                            // this.$message({
                            //     type: "success",
                            //     message: `删除成功!`,
                            // });
                            this.$notify({
                                title: "提示信息",
                                type: "success",
                                message: "删除成功",
                            });
                        } else {
                            this.$alert(data.Message, "错误信息", {
                                confirmButtonText: "确定",
                            });
                        }
                    });
                })
                .catch(() => {
                    // this.$message({
                    //     type: "info",
                    //     message: "已取消删除",
                    // });
                    this.$notify({
                        title: "提示信息",
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        onSubmit() {
            this.$refs.form.validate((valid) => (this.itemPass1 = valid));
            if (this.itemPass1) {
                // specControl(this.form).then(({ data }) => {
                //     if (data.Status == "OK") {
                //         this.$refs.formRef.resetFields();
                //         this.dialogVisible = false;
                //         this.$message({
                //             type: "success",
                //             message: `${this.titleType}成功!`,
                //         });
                //         this.getIDdata();
                //     } else {
                //         this.$message({
                //             type: "error",
                //             message: `${this.titleType}添加失败!`,
                //         });
                //         this.$alert(data.Message, "错误信息", {
                //             confirmButtonText: "确定",
                //         });
                //     }
                // });
            } else {
                this.$alert("添加失败,请完成必填项", "错误信息", {
                    confirmButtonText: "确定",
                });
            }
        },
        editCancel() {
            this.$refs.editFormRef.resetFields();
            this.editVisible = false;
        },
        editSubmit() { },
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
                this.tableHeight = window.innerHeight - 228;
                // this.tableHeight1 =
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.titleSelect {
    margin-right: 12px;
}

.type {
    padding: 8px;

    .initBox {
        width: 500px;
    }

    .table_header {
        padding-bottom: 8px;
        display: flex;
        // gap: 30px;
        // justify-content: flex-end;
        align-items: center;

        .input_box {
            width: 400px;
        }
    }

    .btn {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
