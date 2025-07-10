<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div>
                <el-form ref="form" class="form" :inline="true">
                    <el-form-item label="工单号" class="mb-2">
                        <el-input placeholder="请输入" clearable style="width: 350px"
                            v-model="getForm.SearchModel.WorkOrder" class="input-with-select"
                            @keyup.enter.native="handleSearch" @clear="handleSearch">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="时间" class="mb-2">
                        <el-date-picker v-model="dateInterval" type="datetimerange" range-separator="至"
                            start-placeholder="开始日期" style="width: 350px" end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"
                            :default-time="['00:00:00', '23:59:59']" :clearable="false">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch()">查询</el-button>
                        <el-button type="warning" @click="addVisible = true">生成</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border :height="tableHeight" style="width: 100%" size="mini"
                @row-click="rowDblclick" highlight-current-row>
                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <span>{{
                            scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
                        }}</span>
                    </template>
                </el-table-column>
                <af-table-column prop="GenerateNumber" label="生成批号">
                </af-table-column>
                <af-table-column prop="GenerateQty" label="数量"> </af-table-column>
                <af-table-column prop="WorkOrder" label="工单号"> </af-table-column>

                <af-table-column prop="CreatedOn" label="生成时间"> </af-table-column>
                <af-table-column prop="UpdatedBy" label="操作人"> </af-table-column>

                <el-table-column fixed="right" label="操作" width="140" align="center">
                    <template v-slot="{ row }">
                        <el-button type="success" size="mini" @click.stop="handleEdit(row)">导出过程码</el-button>
                        <!-- <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)" /> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 8px">
                <el-pagination background align="center" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :page-sizes="[5, 10, 20, 50, 100]"
                    :current-page="getForm.PageIndex" :page-size="getForm.PageSize"
                    layout="total,sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <el-tabs v-model="activeName" style="width: 100%">
                <el-tab-pane label="过程码清单" name="first">
                    <el-table :data="tableFirst" ref="myTable" :height="tableHeight1" border stripe size="mini">
                        <el-table-column label="序号" width="60" type="index" align="center">
                        </el-table-column>
                        <el-table-column prop="SN" label="过程码">
                        </el-table-column> </el-table></el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog :title="'生成'" :visible.sync="addVisible" width="400px" @close="addCancel()">
            <el-form ref="addFormRef" :model="addForm" label-width="auto" :rules="rules">
                <el-form-item label="物料编码" prop="MaterialName">
                    <el-select v-model="addForm.MaterialName" filterable style="width: 100%">
                        <el-option v-for="item in MaterialList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单号" prop="WorkOrder">
                    <el-input v-model="addForm.WorkOrder" placeholder="请输入工单号" width="100%" />
                </el-form-item>
                <el-form-item label="数量" prop="GenerateQty">
                    <el-input v-model="addForm.GenerateQty" placeholder="请输入数量" width="100%" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel">取 消</el-button>
                <el-button type="primary" @click="handleSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    ExecuteAssGenerateSN,
    GetAssGenerateRecord,
    GetAssGenerateSN,
} from "@/api/assemble";
import { getToken } from "@/utils/auth";
import {
    shortcuts,
    disabledDate,
    setTodayDate,
    setLastDate,
} from "@/utils/dataMenu";
import { exportTableToExcel } from "@/utils/exportExcel";
import dayjs from "dayjs";
export default {
    data() {
        return {
            getForm: {
                PageIndex: 1,
                PageSize: 50,
                SearchModel: {
                    WorkOrder: "",
                },
                StartTime: "",
                EndTime: "",
            },
            dateInterval: [],
            pickerOptions: {
                shortcuts: shortcuts,
                disabledDate: disabledDate,
            },
            tableHeight: 0,
            tableHeight1: 0,
            tableData: [],
            total: 0,
            tableFirst: [],
            activeName: "first",
            addForm: {
                WorkOrder: "",
                CreatedBy: getToken(),
                GenerateQty: "",
                MaterialName: "1022059902400",
            },
            addVisible: false,
            MaterialList: [
                {
                    value: "1022059902400",
                    label: "1022059902400",
                },
            ],
            rules: {
                MaterialName: [
                    { required: true, message: "物料编码不能为空", change: "blur" },
                ],
                GenerateQty: [
                    { required: true, message: "数量不能为空", change: "blur" },
                ],
            },
            generateNumber: "",
        };
    },
    watch: {
        dateInterval(newdata) {
            if (newdata != null) {
                this.getForm.StartTime = newdata[0];
                this.getForm.EndTime = newdata[1];
            } else {
                this.getForm.StartTime = "";
                this.getForm.EndTime = "";
            }
        },
    },
    beforeMount() {
        this.getScreenHeight();
        this.getData();
    },

    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
        this.dateInterval = [setLastDate(), setTodayDate()];
        this.getForm.StartTime= this.dateInterval[0];
        this.getForm.EndTime = this.dateInterval[1];
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        getData() {
            GetAssGenerateRecord(this.getForm).then((res) => {
                if (res.Data.list.length === 0) {
                    this.tableData=[] 
                } else {
                    this.tableData = res.Data.list.map((item) => {
                        return {
                            ...item,
                            CreatedOn: dayjs(item.CreatedOn).format("YYYY-MM-DD HH:mm:ss"),
                        };
                    });
                    this.total = res.Data.Total;
                }

                this.tableFirst = [];
            });
        },
        handleSearch() {
            this.getForm.PageIndex = 1;
            this.getData();
        },
        addCancel() {
            this.addVisible = false;
            this.addForm.WorkOrder = "";
            this.addForm.GenerateQty = "";
        },
        handleSubmit() {
            this.$refs.addFormRef.validate((valid) => {
                if (valid) {
                    ExecuteAssGenerateSN(this.addForm).then((res) => {
                        if (res.Success) {
                            this.$notify({
                                title: "提示信息",
                                message: res.Msg,
                                type: "success",
                            });
                            this.addVisible = false;
                            this.addForm.WorkOrder = "";
                            this.addForm.GenerateQty = "";
                            this.getData();
                        } else {
                            this.$notify({
                                title: "提示信息",
                                message: res.Msg,
                                type: "error",
                            });
                        }
                    });
                }
            });
        },
        rowDblclick(row) {
            this.activeName = "first";
            GetAssGenerateSN({ GenerateNumber: row.GenerateNumber }).then((res) => {
                this.tableFirst = res.Data;
            });
        },
        handleEdit(row) {
            this.generateNumber = row.GenerateNumber;
            GetAssGenerateSN({ GenerateNumber: row.GenerateNumber }).then((res) => {
                if (res.Data.length === 0) {
                    this.$notify({
                        title: "提示信息",
                        message: "没有过程码数据",
                        type: "warning",
                    });
                    return;
                } else {

                    exportTableToExcel({
                        tableRef: this.$refs.myTable,
                        fetchAllData: this.fetchAllUsers,
                        fileName: `${this.generateNumber}_${dayjs().format("YYYYMMDDHHmmss")}`,
                        styles: {
                            headerBgColor: "", // 灰色表头
                            headerFont: {
                                color: { argb: "" }, // 红色文字
                                bold: true,
                                size: 14,
                            }, // 白色文字
                            cell: { numFmt: "@" }, // 强制文本格式
                        },
                    });
                }
            });
        },
        async fetchAllUsers() {

            let data = await GetAssGenerateSN({ GenerateNumber: this.generateNumber }).then((res) => {

                return res.Data

            });
            return data;

        },
        handleSizeChange(value) {
            this.getForm.PageSize = value;
            this.getData();
            // console.log(this.pageSize);
        },
        handleCurrentChange(value) {
            this.getForm.PageIndex = value;
            this.getData();
        },
        getScreenHeight() {
            this.$nextTick(() => {
                this.tableHeight = (window.innerHeight - 148 - 68 - 68 + 80 - 70) * 0.6;
                this.tableHeight1 =
                    (window.innerHeight - 148 - 68 + 80 - 50 - 70) * 0.4;
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
