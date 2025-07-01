<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between">
                <el-button type="primary" @click="addOpen" size="medium">创建任务</el-button>
                <div>
                    <!-- <el-input v-model="searchName" clearable placeholder="请输入" @keyup.enter.native="searchData()" @clear="clearData">
                        <template slot="append">
                            <el-button type="primary" icon="el-icon-search" @click="searchData()"></el-button>
                        </template>
                    </el-input> -->
                </div>
            </div>
            <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                " border :height="tableHeight" style="width: 100%" >
                 <el-table-column type="index" label="序号" width="55" align="center" fixed>
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="InspectOrder" label="任务编号" ></el-table-column>
                <el-table-column prop="taskType" label="点检类型" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskType === 'FI'">首检</span>
                        <span v-else-if="scope.row.taskType === 'RI'">巡检</span>
                        <span v-else-if="scope.row.taskType === 'EI'">设备点检</span>
                        <span v-else-if="scope.row.taskType === 'WI'">工艺点检</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Status" label="状态" >
                    <template slot-scope="scope">
                        <el-tag type="info" v-if="scope.row.Status === '1'"  effect="dark">未完成</el-tag>
                        <el-tag type="success" v-else-if="scope.row.Status === '9'"  effect="dark">已完成</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" ></el-table-column>
                <el-table-column prop="CreateUser" label="创建人" ></el-table-column>
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template slot-scope="scope">
                      
                        <el-button type="danger" icon="el-icon-delete" :disabled="scope.row.Stts == -1" size="mini"
                            @click="handleDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                    :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="'添加'" :visible.sync="addVisible" @close="addCancel()" width="400px">
          <el-form ref="addFormRef" :model="addForm" label-width="auto">
                <el-form-item label="任务编号"  style="width:100% ;">
                    <el-input v-model="addForm.InspectOrder" placeholder="请输入任务编号"></el-input>
                </el-form-item>
                <el-form-item label="点检类型">
                    <el-select v-model="addForm.taskType" placeholder="请选择点检类型" style="width:100% ;">
                        <el-option label="首检" value="FI"></el-option>
                        <el-option label="巡检" value="RI"></el-option>
                        <el-option label="设备点检" value="EI"></el-option>
                        <el-option label="工艺点检" value="WI"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生成日期"  style="width:100% ;">
                   
                    <el-date-picker v-model="addForm.createTime"type="date"
                        placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        style="width:100% ;"></el-date-picker>
                </el-form-item>
          </el-form>
          <span slot="footer">
                <el-button @click="addCancel()">取消</el-button>
                <el-button type="primary" @click="addSumbit">确定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import { getToken } from '@/utils/auth';
export default {
    data() {
        return {
            tableData: [
                {
                    InspectOrder: 'XYFI20250624D01',
                    taskType: 'FI',
                    Status: '1',
                    CreateTime: '2023-10-01 10:00:00',
                    CreateUser: getToken(),
                },
                {
                    InspectOrder: 'XYRI20250624D02',
                    taskType: 'RI',
                    Status: '1',
                    CreateTime: '2023-10-01 11:00:00',
                    CreateUser: getToken(),
                },
                {
                    InspectOrder: 'XYEI20250624D03',
                    taskType: 'EI',
                    Status: '9',
                    CreateTime: '2023-10-01 12:00:00',
                    CreateUser: getToken(),
                },
                {
                    InspectOrder: 'XYWI20250624D04',
                    taskType: 'WI',
                    Status: '1',
                    CreateTime: '2023-10-01 13:00:00',
                    CreateUser: getToken(),
                },
                
            ],
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页的数据条数
            tableHeight: 0,
            addVisible: false,
            addForm: {
                InspectOrder: '',
                taskType: '',
                createTime: '',
                createUser: getToken(),
            },
        };
    },
    beforeMount() {
        this.getScreenHeight();
    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
        this.getData();
        // this.getData();
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        getData(){

        },
        addOpen() {
            this.addVisible = true;
        },
        addCancel() {
            this.addVisible = false;
            this.$refs.addFormRef.resetFields();
        },
        addSumbit(){

        },
        handleDelete(row) {
            this.$confirm('删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    // 删除逻辑
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                    });
                })
                .catch(() => {
                   this.$notify({
                        title: '取消',
                        message: '已取消删除',
                        type: 'info',
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
                this.tableHeight = window.innerHeight - 210;
                // this.tableHeight1 =
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
