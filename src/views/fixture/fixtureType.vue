<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between">
                <el-button type="primary" @click="addOpen" size="medium">添加</el-button>
                <div class="input_box">
                    <!-- <el-input placeholder="请输入内容" clearable v-model="searchText" class="input-with-select"
                        @change="getSearchData" size="medium">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input> -->
                    <el-input v-model="searchName" style="width: 350px;" clearable placeholder="请输入"
                        @keyup.enter.native="searchData()" @clear="clearData">
                        <template slot="append">
                            <el-button type="primary" icon="el-icon-search" @click="searchData()"></el-button>
                        </template>
                    </el-input>
                </div>
            </div>
            <el-table :data="tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                " border :height="tableHeight" style="width: 100%" size="mini">
                <el-table-column type="index" label="序号" width="55" align="center" fixed>
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Category" label="类别" fixed width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.Category == 1">印刷工治具</span>
                        <span v-else-if="scope.row.Category == 2">ICT工治具</span>
                        <span v-else-if="scope.row.Category == 3">样件</span>
                    </template>
                </el-table-column>
                <af-table-column prop="ToolsMold" label="编码" fixed>
                </af-table-column>
                <af-table-column prop="MaterialName" label="描述" fixed> </af-table-column>
                <af-table-column prop="TotalUses" label="使用寿命(次数)">
                </af-table-column>

                <af-table-column prop="UsesUntilRevalidation" label="停机扫描(生产片数)">
                </af-table-column>
                <af-table-column prop="PauseUntilRevalidate" label="停机扫描(暂停时间)">
                </af-table-column>
                <af-table-column prop="TimeUntilRevalidation" label="停机扫描(生产时间)">
                </af-table-column>
                <af-table-column prop="CleaningTime" label="清洗时间">
                </af-table-column>
                <af-table-column prop="TensionLimit" label="张力测试上限值">
                </af-table-column>
                <af-table-column prop="LowerTensionLimit" label="张力测试下限值">
                </af-table-column>
                <af-table-column prop="TensionPoints" label="测试点位数量">
                </af-table-column>

                <!-- <el-table-column prop="UpdateTime" label="创建时间">
          </el-table-column> -->
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="handleEdit(scope.row)"></el-button>

                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="handleDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper"
                    :total="tableData1.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="'添加'" :visible.sync="addVisible" @close="addCancel()" width="800px">
            <el-form :model="addForm" :rules="rules" ref="formRef" label-width="auto">
                <el-form-item label="类别" prop="category">
                    <el-select v-model="addForm.category" placeholder="请选择" style="width: 240px" filterable>
                        <el-option v-for="item in MaterialNameList" :key="item.Value" :label="item.Text"
                            :value="item.Value" />
                    </el-select>
                </el-form-item>



                <el-form-item label="编码" prop="toolsMold">
                    <el-input v-model.trim="addForm.toolsMold" style="width: 240px" />
                </el-form-item>


                <el-form-item label="描述" prop="materialName">
                    <el-input v-model="addForm.materialName" style="width: 100%"></el-input>
                </el-form-item>

                <el-form-item label="使用寿命(次数)" prop="totalUses">
                    <el-input v-model.number="addForm.totalUses" style="width: 240px" placeholder="请输入"
                        type="number"></el-input>
                </el-form-item>
                <el-form-item label="停机扫描(生产片数)">
                    <el-input :disabled="!formControl.cleanAfterUses" v-model.number="addForm.usesUntilRevalidation"
                        style="width: 240px" placeholder="请输入" type="number"></el-input>
                    <el-checkbox class="ml-3" v-model="formControl.cleanAfterUses" @change="handleCleanAfterUsesChange">
                        启用
                    </el-checkbox>
                </el-form-item>

                <el-form-item label="停机扫描(暂停时间)">
                    <el-input :disabled="!formControl.cleanAfterPause" v-model.number="addForm.pauseUntilRevalidate"
                        style="width: 240px" placeholder="请输入" type="number"></el-input>
                    <el-checkbox class="ml-3" v-model="formControl.cleanAfterPause"
                        @change="handleCleanAfterPauseChange">
                        启用
                    </el-checkbox>
                </el-form-item>

                <el-form-item label="停机扫描(生产时间)">
                    <el-input :disabled="!formControl.cleanAfterTime" v-model.number="addForm.timeUntilRevalidation"
                        style="width: 240px" placeholder="请输入" type="number"></el-input>
                    <el-checkbox class="ml-3" v-model="formControl.cleanAfterTime" @change="handleCleanAfterTimeChange">
                        启用
                    </el-checkbox>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="0"> <el-form-item label="清洗时间">
                            <el-input v-model.number="addForm.cleaningTime" style="width: 240px" placeholder="请输入"
                                type="number"></el-input>
                        </el-form-item></el-col>
                    <el-col :span="12" :offset="0"> <el-form-item label="张力测试上限值">
                            <el-input v-model.number="addForm.tensionLimit" placeholder="请输入" type="number"></el-input>
                        </el-form-item> </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="测试点位数量">
                            <el-input v-model.number="addForm.tensionPoints" style="width: 240px" placeholder="请输入"
                                type="number"></el-input>
                        </el-form-item></el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="张力测试下限值">
                            <el-input v-model.number="addForm.lowerTensionLimit" placeholder="请输入"
                                type="number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="addSubmit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="'编辑'" :visible.sync="editVisible" @close="editCancel()">
            <el-form :model="editForm" ref="editFormRef" :rules="rules" label-width="auto">
                <el-form-item label="类别">
                    <el-select v-model="editForm.category" placeholder="请选择" style="width: 240px" filterable>
                        <el-option v-for="item in MaterialNameList" :key="item.Value" :label="item.Text"
                            :value="item.Value" />
                    </el-select>
                </el-form-item>


                <el-form-item label="编码" prop="toolsMold">
                    <el-input disabled v-model="editForm.toolsMold" style="width: 240px" />
                </el-form-item>
                <el-form-item label="描述" prop="materialName">
                    <el-input v-model="editForm.materialName" style="width: 100%"></el-input>
                </el-form-item>


                <el-form-item label="使用寿命(次数)" prop="totalUses">
                    <el-input disabled v-model.number="editForm.totalUses" style="width: 240px"
                        placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="停机扫描(生产片数)">
                    <el-input :disabled="!editFormControl.cleanAfterUses"
                        v-model.number="editForm.usesUntilRevalidation" style="width: 240px"
                        placeholder="请输入"></el-input>
                    <el-checkbox class="ml-3" v-model="editFormControl.cleanAfterUses" @change="
                        editForm.usesUntilRevalidation = !editFormControl.cleanAfterUses
                            ? 0
                            : editForm.usesUntilRevalidation
                        " label="启用" />
                </el-form-item>
                <el-form-item label="停机扫描(暂停时间)">
                    <el-input :disabled="!editFormControl.cleanAfterPause"
                        v-model.number="editForm.pauseUntilRevalidate" style="width: 240px"
                        placeholder="请输入"></el-input>
                    <el-checkbox class="ml-3" v-model="editFormControl.cleanAfterPause" @change="
                        editForm.pauseUntilRevalidate = !editFormControl.cleanAfterPause
                            ? 0
                            : editForm.pauseUntilRevalidate
                        " label="启用" />
                </el-form-item>
                <el-form-item label="停机扫描(生产时间)">
                    <el-input :disabled="!editFormControl.cleanAfterTime"
                        v-model.number="editForm.timeUntilRevalidation" style="width: 240px"
                        placeholder="请输入"></el-input>
                    <el-checkbox class="ml-3" v-model="editFormControl.cleanAfterTime" @change="
                        editForm.timeUntilRevalidation = !editFormControl.cleanAfterTime
                            ? 0
                            : editForm.timeUntilRevalidation
                        " label="启用" />
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="0"> <el-form-item label="清洗时间">
                            <el-input v-model.number="editForm.cleaningTime" style="width: 240px" placeholder="请输入"
                                type="number"></el-input>
                        </el-form-item></el-col>
                    <el-col :span="12" :offset="0"> <el-form-item label="张力测试上限值">
                            <el-input v-model.number="editForm.tensionLimit" placeholder="请输入" type="number"></el-input>
                        </el-form-item></el-col>
                </el-row>


                <el-row :gutter="20">
                    <el-col :span="12" :offset="0"><el-form-item label="测试点位数量">
                            <el-input v-model.number="editForm.tensionPoints" style="width: 240px" placeholder="请输入"
                                type="number"></el-input>
                        </el-form-item> </el-col>
                    <el-col :span="12" :offset="0"> <el-form-item label="张力测试下限值">
                            <el-input v-model.number="editForm.lowerTensionLimit" placeholder="请输入"
                                type="number"></el-input>
                        </el-form-item></el-col>
                </el-row>



            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel()">取 消</el-button>
                <el-button type="primary" @click="editSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { moldControl } from "@/api/all";
export default {
    data() {
        return {
            searchText: "",
            tableData: [],
            tableData1: [],
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页的数据条数
            addVisible: false,
            tableHeight: 0,
            addForm: {
                category: "",
                toolsMold: "",
                materialName: "",
                totalUses: 0,
                usesUntilRevalidation: 0,
                pauseUntilRevalidate: 0,
                timeUntilRevalidation: 0,
                cleaningTime: 0,
                tensionLimit: 0,
                lowerTensionLimit: 0,
                tensionPoints: 0,
                operationType: "I",
            },
            MaterialNameList: [
                { Value: "1", Text: "印刷工治具" },
                { Value: "2", Text: "ICT工治具" },
                { Value: "3", Text: "样件" },
            ],
            formControl: {
                cleanAfterUses: false,
                cleanAfterPause: false,
                cleanAfterTime: false,
            },
            editForm: {
                category: "",
                toolsMold: "",
                materialName: "",
                totalUses: 0,
                usesUntilRevalidation: 0,
                pauseUntilRevalidate: 0,
                timeUntilRevalidation: 0,
                cleaningTime: 0,
                tensionLimit: 0,
                lowerTensionLimit: 0,
                tensionPoints: 0,
                operationType: "U",
            },
            editVisible: false,
            editFormControl: {
                cleanAfterUses: false,
                cleanAfterPause: false,
                cleanAfterTime: false,
            },

            getText: {
                toolsMold: "*",
                remark: "",
                operationType: "Q",
            },
            rules: {
                toolsMold: [
                    { required: true, message: "请输入治具类型", trigger: "change" },
                ],
                category: [
                    { required: true, message: "请选择类别", trigger: "change" },
                ],
                materialName: [
                    { required: true, message: "请输入描述", trigger: "change" },
                ],
            },
            options: [
                { value: "1", label: "印刷工治具" },
                { value: "2", label: "ICT工治具" },
                { value: "3", label: "样件" },
            ],
            searchName: ""
        };
    },
    // watch: {
    //     searchName(newVal) {
    //         if (newVal === "") {
    //             this.tableData1 = this.tableData;
    //         } else {
    //             this.tableData1 = this.table1(newVal);
    //         }
    //     },
    // },
    beforeMount() {
        this.getScreenHeight();
    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
        this.getData();
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        searchData() {
            if (this.searchName == "") {

                this.tableData1 = this.tableData;
            } else {
                this.tableData1 = this.table1(this.searchName);
            }
        },
        // 打开添加对话框
        table1(newdata) {
            console.log(newdata);

            let searchName = newdata.toLowerCase();
            this.currentPage = 1;
            return this.tableData.filter((v) => {
                if (
                    String(v.ToolsMold).toLowerCase().indexOf(searchName) > -1 ||
                    String(v.MaterialName).toLowerCase().indexOf(searchName) > -1
                ) {
                    return true;
                } else {
                    return false;
                }
            });
        },
        clearData() {
            this.searchName = "";
            this.currentPage = 1;
            // this.tableData1 = this.tableData;
            this.getData()
            // 清除搜索时重置页码
        },
        addOpen() {
            this.addVisible = true;
        },
        getData() {
            moldControl(this.getText)
                .then((res) => {
                    // this.tableData = res.data.DataList;
                    this.tableData = res.data.DataList;
                    this.tableData1 = this.tableData
                })
                .catch(() => {
                    this.$message.error("请求数据失败，请刷新");
                });
        },
        addCancel() {
            this.addVisible = false;
            this.formControl = {
                cleanAfterUses: false,
                cleanAfterPause: false,
                cleanAfterTime: false,
            };
            this.$refs.formRef.resetFields();
        },
        addSubmit() {
            let formData = {
                ...this.addForm,
                cleanAfterUses: this.formControl.cleanAfterUses ? "Y" : "N",
                cleanAfterPause: this.formControl.cleanAfterPause ? "Y" : "N",
                cleanAfterTime: this.formControl.cleanAfterTime ? "Y" : "N",
            };
            this.$refs.formRef.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    moldControl(formData).then(({ data }) => {
                        if (data.Status == "OK") {
                            this.getData();

                            this.$notify({
                                title: "提示信息",
                                message: `添加成功!`,
                                type: "success",
                            });
                            this.addForm = {
                                category: "",
                                toolsMold: "",
                                materialName: "",
                                totalUses: 0,
                                usesUntilRevalidation: 0,
                                pauseUntilRevalidate: 0,
                                timeUntilRevalidation: 0,
                                cleaningTime: 0,
                                tensionLimit: 0,
                                lowerTensionLimit: 0,
                                tensionPoints: 0,
                                operationType: "I",
                            };
                            this.formControl = {
                                cleanAfterUses: false,
                                cleanAfterPause: false,
                                cleanAfterTime: false,
                            };
                            // this.$refs.formRef.resetFields();
                            this.addVisible = false;
                        } else {
                            this.$notify({
                                title: "提示信息",
                                message: data.Message,
                                type: "error",
                            });
                        }
                    });
                }
            });
        },
        handleEdit(row) {
            this.editForm = {
                category: row.Category,
                toolsMold: row.ToolsMold,
                materialName: row.MaterialName,
                totalUses: row.TotalUses,
                usesUntilRevalidation: row.UsesUntilRevalidation,
                pauseUntilRevalidate: row.PauseUntilRevalidate,
                timeUntilRevalidation: row.TimeUntilRevalidation,
                cleaningTime: row.CleaningTime,
                tensionLimit: row.TensionLimit,
                lowerTensionLimit: row.LowerTensionLimit,
                tensionPoints: row.TensionPoints,
            };
            this.editFormControl = {
                cleanAfterUses: row.CleanAfterUses == "Y",
                cleanAfterPause: row.CleanAfterPause == "Y",
                cleanAfterTime: row.CleanAfterTime == "Y",
            };
            this.editVisible = true;
        },
        handleDelete(row) {
            this.$confirm("确定删除", "确认操作", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    moldControl({
                        toolsMold: row.ToolsMold,
                        // remark: row.Remark,
                        operationType: "D",
                    }).then(({ data }) => {
                        if (data.Status == "OK") {
                            //  this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
                            this.getData();
                            this.dialogVisible = false;

                            this.$notify({
                                title: "提示信息",
                                message: `删除成功!`,
                                type: "success",
                            });
                        } else {
                            this.$notify({
                                title: "提示信息",
                                message: data.Message,
                                type: "error",
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        editCancel() {
            this.editForm = {
                category: "",
                toolsMold: "",
                materialName: "",
                totalUses: 0,
                usesUntilRevalidation: 0,
                pauseUntilRevalidate: 0,
                timeUntilRevalidation: 0,
                cleaningTime: 0,
                tensionLimit: 0,
                lowerTensionLimit: 0,
                tensionPoints: 0,
            };
            this.editVisible = false;
            // this.$refs.editFormRef.resetFields();
        },
        editSubmit() {
            let formData = {
                ...this.editForm,
                cleanAfterUses: `${this.editFormControl.cleanAfterUses ? "Y" : "N"}`,
                cleanAfterPause: `${this.editFormControl.cleanAfterPause ? "Y" : "N"}`,
                cleanAfterTime: `${this.editFormControl.cleanAfterTime ? "Y" : "N"}`,
                operationType: "U",
            };
            moldControl(formData).then(({ data }) => {
                if (data.Status == "OK") {
                    this.getData();
                    this.$notify({
                        title: "提示信息",
                        message: `修改成功!`,
                        type: "success",
                    });
                    //   this.$refs.editFormRef.resetFields();
                    this.editForm = {
                        category: "",
                        toolsMold: "",
                        materialName: "",
                        totalUses: 0,
                        usesUntilRevalidation: 0,
                        pauseUntilRevalidate: 0,
                        timeUntilRevalidation: 0,
                        cleaningTime: 0,
                        tensionLimit: 0,
                        lowerTensionLimit: 0,
                        tensionPoints: 0,
                    };
                    this.editVisible = false;
                } else {
                    this.$notify({
                        title: "提示信息",
                        message: data.Message,
                        type: "error",
                    });
                }
            });
            // this.editVisible = false;
            // this.$refs.editFormRef.resetFields();
        },
        getSearchData() {
            if (this.searchText == "") {
                this.getText.toolsMold = "*";
            } else {
                this.currentPage = 1
                this.getText.toolsMold = this.searchText;

            }
            this.getData();
        },
        handleCleanAfterUsesChange() {
            if (!this.formControl.cleanAfterUses) {
                this.addForm.usesUntilRevalidation = 0;
            }
        },
        handleCleanAfterPauseChange() {
            if (!this.formControl.cleanAfterPause) {
                this.addForm.pauseUntilRevalidate = 0;
            }
        },
        handleCleanAfterTimeChange() {
            if (!this.formControl.cleanAfterTime) {
                this.addForm.timeUntilRevalidation = 0;
            }
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
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

<style lang="scss" scoped>
::v-deep .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
}
</style>
