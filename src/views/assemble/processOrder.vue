<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div>
                <el-form ref="form" class="form" :inline="true">
                    <el-form-item label="工单号" class="mb-2">
                        <el-input placeholder="请输入" clearable style="width: 350px" v-model="getForm.SearchModel.wo"
                            class="input-with-select">
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
                        <el-button type="warning" @click="addVisible=true">生成</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData
                " border :height="tableHeight" style="width: 100%" size="mini">
                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <span>{{
                            scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
                        }}</span>
                    </template>
                </el-table-column>

                <af-table-column prop="WorkOrder" label="工单号"> </af-table-column>
                <af-table-column prop="WorkOrder" label="数量"> </af-table-column>
                <af-table-column prop="WorkOrder" label="生产时间"> </af-table-column>
                <af-table-column prop="OperateUser" label="操作人"> </af-table-column>
                <af-table-column prop="OperateTime" label="时间"> </af-table-column>
                <el-table-column fixed="right" label="操作" width="140" align="center">
                    <template v-slot="{ row }">
                        <el-button type="primary" size="mini" icon="el-icon-document" @click="handleEdit(row)" />
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)" />
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
                    <el-table :data="tableFirst" :height="tableHeight1" border stripe size="mini">
                        <el-table-column label="序号" width="60" type="index"> </el-table-column>
                        <el-table-column prop="Code" label="过程码"> </el-table-column>
                    </el-table></el-tab-pane>
                </el-tabs>
        </el-card>
        <el-dialog :title="'生成'" :visible.sync="addVisible" width="400px" @close="addCancel()">

            <el-form ref="addFormRef" :model="addForm" label-width="auto">
                <el-form-item label="工单号">
                    <el-input v-model="addForm.wo" placeholder="请输入工单号" width="100%" />
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="addForm.num" placeholder="请输入数量" width="100%"/>
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
import { getToken } from "@/utils/auth";
import {
    shortcuts,
    disabledDate,
    setTodayDate,
    setLastDate,
} from "@/utils/dataMenu";
export default {
    data() {
        return {
            getForm: {

                PageIndex: 1,
                PageSize: 50,
                SearchModel: {
                    wo: "",
                    OperateStartTime: "",
                    OperateEndTime: "",
                },
            },
            dateInterval: [],
            pickerOptions: {
                shortcuts: shortcuts,
            },
            tableHeight: 0,
            tableHeight1: 0,
            tableData: [],
            total: 0,
            tableFirst: [],
            activeName: "first",
            addForm: {
                wo: "",
                user: getToken(),
                num: "",
            },
            addVisible: false,
        };
    },
    watch: {
        dateInterval(newdata) {
            if (newdata != null) {
                this.getForm.SearchModel.OperateStartTime = newdata[0];
                this.getForm.SearchModel.OperateEndTime = newdata[1];
            } else {
                this.getForm.SearchModel.OperateStartTime = "";
                this.getForm.SearchModel.OperateEndTime = "";
            }
        },

    },
    beforeMount() {
        this.getScreenHeight();

    },

    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
        this.dateInterval = [setLastDate(), setTodayDate()];
        this.getForm.SearchModel.OperateStartTime = this.dateInterval[0];
        this.getForm.SearchModel.OperateEndTime = this.dateInterval[1];
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {

        addCancel() {
            this.addVisible = false;
            this.addForm.wo = "";
            this.addForm.num = "";
        },
        handleSubmit(){

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
                this.tableHeight1 = (window.innerHeight - 148 - 68 + 80 - 50 - 70) * 0.4;
            })
        }
    }
};
</script>

<style lang="scss" scoped></style>
