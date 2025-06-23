<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between">
                <el-button type="primary" @click="openAdd">添加</el-button>
                <div>
                    <el-input v-model="getForm.productCode" placeholder="" style="width: 350px" @change="getData"
                        clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                    </el-input>
                </div>
            </div>
            <el-table :data="tableData" border :height="tableHeight" style="width: 100%">
                <!-- <el-table-column type="index" label="序号" width="55" /> -->
                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <span>{{
                            scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
                            }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="productCode" label="产品编号"> </el-table-column>
                <el-table-column prop="partNumber" label="料号"> </el-table-column>
                <el-table-column prop="enterBatch" label="录入批次"> </el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template v-slot="{ row }">
                        <el-tag :type="row.status === '1' ? 'primary' : 'info'" effect="dark" class="m-0">
                            {{ row.status === "1" ? "启用" : "禁用" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <af-table-column prop="Ud_usr" label="操作人" width="140">
                </af-table-column>
                <af-table-column prop="Ud_dt" label="操作时间" width="155">
                </af-table-column>
                <el-table-column fixed="right" label="操作" width="140" align="center">
                    <template v-slot="{ row }">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(row)" />
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)" />
                    </template>
                </el-table-column>
            </el-table>

            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[10, 20, 50, 100, 150]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="'添加'" :visible.sync="addVisible" @close="addCancel()">
            <el-form ref="addForm" :model="addForm" label-width="100px">
                <el-form-item label="产品编号">
                    <el-input v-model="addForm.productCode" placeholder="请输入产品编号"></el-input>
                </el-form-item>
                <el-form-item label="料号">
                    <el-input v-model="addForm.partNumber" placeholder="请输入料号"></el-input>
                </el-form-item>
                <el-form-item label="录入批次">
                    <el-input v-model="addForm.enterBatch" placeholder="请输入录入批次"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="addForm.status" :active-value="'1'" :inactive-value="'2'" active-text="启用"
                        inactive-text="禁用">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="'编辑'" :visible.sync="editVisible" @close="editCancel()">
            <el-form ref="editForm" :model="editForm" label-width="100px">
                <el-form-item label="产品编号">
                    <el-input v-model="editForm.productCode" placeholder="请输入产品编号"></el-input>
                </el-form-item>
                <el-form-item label="料号">
                    <el-input v-model="editForm.partNumber" placeholder="请输入料号"></el-input>
                </el-form-item>
                <el-form-item label="录入批次">
                    <el-input v-model="editForm.enterBatch" placeholder="请输入录入批次"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="editForm.status" :active-value="'1'" :inactive-value="'2'" active-text="启用"
                        inactive-text="禁用">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
    data() {
        return {
            tableData: [
                {
                    productCode: "4051011799500",
                    partNumber: "1050570075100",
                    enterBatch: "Batch-001",
                    status: "1",
                    Ud_usr: "CamstarAdmin",
                    Ud_dt: "2025-06-23 10:00:00",
                },
            ],
            total: 0,
            getForm: {
                productCode: "",
                PageIndex: 1,
                PageSize: 10,
            },
            tableHeight: 0,
            addVisible: false,
            addForm: {
                productCode: "",
                partNumber: "",
                enterBatch: "",
                status: "1",
                Ud_usr: getToken(),
            },
            editVisible: false,
            editForm: {
                productCode: "",
                partNumber: "",
                enterBatch: "",
                status: "1",
                Ud_usr: getToken(),
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
        getData() { },
        openAdd() {
            this.addVisible = true;
        },
        addCancel() {
            this.$refs.addForm.resetFields();
            this.addVisible = false;
        },
        addSubmit() {
            this.$refs.addForm.resetFields();
            this.addVisible = false;
        },
        handleEdit(row) {
            this.editForm = { ...row };
            this.editVisible = true;
        },
        editCancel() {
            this.$refs.editForm.resetFields();
            this.editVisible = false;
        },
        editSubmit() {
            // 提交编辑表单
            this.$refs.editForm.resetFields();
            this.editVisible = false;
        },
        handleDelete(row) {
            this.$confirm("是否确认删除该记录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    // 执行删除操作
                    this.$notify({
                        title: "提示信息",
                        message: "删除成功",
                        type: "success",
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
            this.getForm.PageSize = value;
            this.getData();
        },
        handleCurrentChange(val) {
            this.getForm.PageIndex = val;
            this.getData();
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

<style lang="scss" scoped></style>
