<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2">
                <el-button type="primary" @click="openAdd">添加</el-button>
            </div>
            <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                " border :height="tableHeight" style="width: 100%" stripe size="small">
                <!-- 序号列 -->
                <el-table-column type="index" label="序号" width="55" fixed="left" align="center">
                    <template v-slot="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>

                <!-- 数据列 -->
                <el-table-column prop="badphenomena_name" label="不良类别名称" />
                <!-- 操作列 -->
                <el-table-column fixed="right" label="操作" width="140" align="center">
                    <template v-slot="{ row }">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(row)" />
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)" />
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100, 200]" layout="total,sizes, prev, pager, next"
                    :total="tableData.length">
                </el-pagination>
            </div>

            <el-dialog title="添加不良类别" :visible.sync="dialogAddVisible" width="30%" @close="addCancel()">
                <el-form :model="form" ref="form" label-width="auto">
                    <el-form-item label="不良类别名称" prop="badphenomena_name">
                        <el-input v-model="form.badphenomena_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCancel">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="编辑不良类别" :visible.sync="dialogEditVisible" width="30%" @close="editCancel()">
                <el-form :model="editFrom" ref="editFromRef" label-width="auto">
                    <el-form-item label="不良类别名称" prop="badphenomena_name">
                        <el-input v-model="editFrom.badphenomena_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editCancel">取 消</el-button>
                    <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {
    QueryBadTypebasicInformation,
    InsertBadTypeInformation,
    UpdateBadTypeInformation,
    DeleteBadTypeInformation,
} from "@/api/repairApi";
import { getToken } from "@/utils/auth";
export default {
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            tableHeight: 0,
            getForm: {
                badphenomena_name: "",
            },
            dialogAddVisible: false,
            dialogEditVisible: false,
            form: {
                badphenomena_name: "",
                UserNo: getToken()
            },
            editFrom: {
                badphenomena_id:"",
                badphenomena_name: "",
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
            QueryBadTypebasicInformation(this.getForm).then((res) => {
                this.tableData = res.Data;
            });
        },
        openAdd() {
            this.dialogAddVisible = true;
        },
        addCancel() {
            this.dialogAddVisible = false;
            this.form.badphenomena_name = "";
        },
        handleSubmit() {
            if (this.form.badphenomena_name === "") {
                this.$notify.error("不良类别名称不能为空");
                return;
            }
            InsertBadTypeInformation(this.form).then((res) => {
                if (res.Success) {
                    this.$notify({
                        title: "提示信息",
                        message: "不良类别添加成功",
                        type: "success",
                    })
                    this.getData();
                    this.dialogAddVisible = false;
                } else {
                   
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "error",
                    });
                }
            });
        },
        handleEdit(row) {
            this.editFrom.badphenomena_id = row.badphenomena_id;
            this.editFrom.badphenomena_name = row.badphenomena_name;
            this.dialogEditVisible = true;
        },
        editCancel() {
            this.dialogEditVisible = false;
            this.editFrom.badphenomena_name = "";
        },
        handleEditSubmit() {
            if (this.editFrom.badphenomena_name === "") {
                this.$notify.error("不良类别名称不能为空");
                return;
            }
            UpdateBadTypeInformation(this.editFrom).then((res) => {
                if (res.Success) {
                    this.$notify({
                        title: "提示信息",
                        message: "不良类别修改成功",
                        type: "success",
                    })
                    this.getData();
                    this.dialogEditVisible = false;
                } else {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "error",
                    });
                }
            });
        },
        handleDelete(row) {
            this.$confirm("是否删除该不良类别?", "提示", {
                type: "warning",
            })
                .then(() => {
                    DeleteBadTypeInformation(row).then((res) => {
                        if (res.Success) {
                            this.$notify({
                                title: "提示信息",
                                message: "不良类别删除成功",
                                type: "success",
                            })
                            this.getData();
                        } else {
                            this.$notify({
                                title: "提示信息",
                                message: res.Msg,
                                type: "error",
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$notify({
                        title: "提示信息",
                        message: "已取消删除",
                        type: "info",
                    });
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
                this.tableHeight = window.innerHeight - 220;
                // this.tableHeight1 =
            });
        },
    },
};
</script>
