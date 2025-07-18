<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2">
                <el-input v-model="pcbNum" placeholder="输入工单号" style="width: 500px"
                    @keyup.enter.native="getChange"></el-input>
                <el-button class="ml-2" type="primary" @click="getChange">查询</el-button>
            </div>
            <el-table :data="tableData" :height="tableHeight" border stripe :style="{ width: '100%' }"
                @row-dblclick="dialogVisible = true" size="small">
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column prop="ContainerName" label="PCB编码" />
                <el-table-column prop="line" label="线体" />
                <el-table-column prop="deviceID" label="设备ID" />
                <el-table-column prop="process" label="工序" />
                <el-table-column prop="tickets" label="工单" />
                <el-table-column prop="author" label="提交人" />
                <el-table-column prop="state" label="状态" />
                <el-table-column prop="analyzePeople" label="分析人" />
                <el-table-column prop="analyzeTime" label="分析时间" />
            </el-table>
        </el-card>
        <el-dialog :visible.sync="dialogVisible" width="80%" :title="'不良信息'">
            <div class="flex flex-col border-solid border-2 border-[#bdbdbd]">
                <div>
                    <div class="flex justify-between items-center text-lg h-8 pl-2 pr-2 font-bold">
                        <div>PCB编码：{{ "PCB001" }}</div>
                        <div>线体：{{ "SMT1线" }}</div>
                        <div>时间：{{ "2025-02-12 12:12:01" }}</div>
                    </div>
                    <!-- <div class="w-full h-8 pl-3 flex items-center text-base text-white bg-cyan">
                        基本信息
                    </div>
                    <el-form ref="baseFormRef" :model="baseForm" label-width="auto" class="pt-1">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="PCB条码" class="mb-2" prop="ContainerName">
                                    <el-input v-model="baseForm.ContainerName" style="width: 200px" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="工单号" class="mb-2" prop="MfgOrderName">
                                    <el-input v-model="baseForm.MfgOrderName" style="width: 200px" disabled />
                                </el-form-item>
                            </el-col>
                        </el-row>
                         <el-row>
                            <el-col :span="8">
                                <el-form-item class="mb-2" label="产品编码" prop="ProductName">
                                    <el-input v-model="baseForm.ProductName" style="width: 200px" disabled />
                                </el-form-item></el-col>
                            <el-col :span="11">
                                <el-form-item class="mb-2" label="产品描述">
                                    <el-input v-model="baseForm.ProductDesc" style="width: 300px" disabled />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item class="mb-2" label="工序编码" prop="SpecName">
                                    <el-input v-model="baseForm.SpecName" style="width: 200px" disabled />
                                </el-form-item></el-col>
                            <el-col :span="11">
                                <el-form-item class="mb-2" label="工序描述" prop="SpecDesc">
                                    <el-input v-model="baseForm.SpecDesc" style="width: 200px" disabled />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form> -->
                </div>

                <div>
                    <div class="w-full h-8 pl-3 flex items-center text-base text-white bg-cyan">
                        不良列表
                    </div>
                    <div class="flex ">
                        <el-table :data="badData" :style="{ width: '100%' }" :height="200" stripe border fit>
                            <el-table-column label="序号" type="index" width="50" align="center" />
                            <el-table-column prop="DefectCode" label="不良位号" />
                            <el-table-column prop="DefectDesc" label="不良现象" />
                            <el-table-column prop="ref_name" label="不良料号" />

                            <!-- <el-table-column label="序号" width="50" align="center">
                            <template template #default="scope">
                                {{ scope.row.DefectCode1 == null || scope.row.DefectCode1 == ""
                                    ? ""
                                    : badData.length+scope.$index+1 }}
                            </template>
</el-table-column>
<el-table-column prop="DefectCode1" label="不良代码" />
<el-table-column prop="DefectDesc1" label="不良原因" />
<el-table-column prop="ref_name1" label="不良点位" /> -->
                        </el-table>
                        <el-table :data="tableData1" border :height="200" stripe>
                            <el-table-column prop="OperationName" label="工序名称">
                            </el-table-column>
                            <el-table-column prop="EquipmentID" label="设备ID" ></el-table-column>
                            <el-table-column prop="StatusCODE" label="结果" width="100">
                                <template slot-scope="scope">
                                    <el-tag :type="scope.row.StatusCODE == 'PASS' || scope.row.StatusCODE == 'OK'
                                            ? 'success'
                                            : 'danger'
                                        " effect="dark">
                                        {{ scope.row.StatusCODE }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="DateTime" label="时间" width="180"> </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div>
                    <div class="w-full h-8 pl-3 flex items-center text-base text-white bg-cyan">
                        图片分析
                    </div>


                    <div class="flex justify-between items-center h-64">
                        <div
                            class="flex-1 h-64 pt-1 flex flex-col items-center text-lg   font-bold gap-2 border-r-2 border-solid ">
                            <div>炉后AOI</div>
                            <div class="h-28 w-28 bg-gray-500"></div>
                        </div>
                        <div
                            class="flex-1 h-64 pt-1 flex flex-col items-center text-lg  font-bold gap-2 border-r-2 border-solid">
                            <div>炉前AOI</div>
                            <div class="h-28 w-28 bg-gray-500"></div>
                            <el-form ref="formRef" :model="form" label-width="auto" size="mini">
                                <el-form-item label="分析结果" prop="result" class="mb-1">
                                    <el-select v-model="form.result" placeholder="请选择">
                                        <el-option label="PASS" value="PASS" />
                                        <el-option label="NG" value="NG" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="不良现象" prop="badPhenomenon" class="mb-1">
                                    <el-select v-model="form.badPhenomenon" placeholder="请选择">
                                        <el-option label="缺件" value="缺件" />
                                        <el-option label="漏焊" value="漏焊" />
                                    </el-select>
                                </el-form-item>

                            </el-form>
                        </div>
                        <div class="flex-1 h-64 pt-1 flex flex-col items-center  font-bold text-lg gap-2">
                            <div>SPI</div>
                            <div class="h-28 w-28 bg-gray-500"></div>
                            <el-form ref="formRef" :model="form" label-width="auto" size="mini">
                                <el-form-item label="分析结果" prop="result" class="mb-1">
                                    <el-select v-model="form.result" placeholder="请选择">
                                        <el-option label="PASS" value="PASS" />
                                        <el-option label="NG" value="NG" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="不良现象" prop="badPhenomenon" class="mb-1">
                                    <el-select v-model="form.badPhenomenon" placeholder="请选择">
                                        <el-option label="缺件" value="缺件" />
                                        <el-option label="漏焊" value="漏焊" />
                                    </el-select>
                                </el-form-item>

                            </el-form>
                        </div>

                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="show = false">取消</el-button>
                    <el-button type="primary" @click="show = false"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pcbNum: '',
            tableHeight: 0,
            tableData: [
                {
                    ContainerName: 'PCB001',
                    line: 'SMT1线',
                    deviceID: 'SPI',
                    process: '工序1',
                    tickets: 'WO20250101',
                    author: 'Admin',
                    state: '未分析',
                    analyzePeople: 'CamstarAdmin',
                    analyzeTime: '2025-01-01 12:00:00'
                }
            ],
            tableData1: [
                {
                    OperationName: '工序1',
                    EquipmentID: 'SPI',
                    StatusCODE: 'PASS',
                    DateTime: '2025-01-01 12:00:00'
                },
                {
                    OperationName: '工序2',
                    EquipmentID: 'SPI',
                    StatusCODE: 'PASS',
                    DateTime: '2025-01-01 12:00:00'
                },
                {
                    OperationName: '工序3',
                    EquipmentID: 'SPI',
                    StatusCODE: 'PASS',
                    DateTime: '2025-01-01 12:00:00'
                }
            ],
            dialogVisible: false,
            baseForm: {
                ContainerName: 'PCB001',
                MfgOrderName: 'MO001',
                ProductName: '产品001',
                ProductDesc: '产品001描述',
                SpecName: 'SMT',
                SpecDesc: 'SMT描述'
            },
            badData: [
                {
                    DefectCode: 'D001',
                    DefectDesc: '不良原因1',
                    ref_name: '点位1',
                    DefectCode1: 'D002',
                    DefectDesc1: '不良原因2',
                    ref_name1: '点位2'
                },
                {
                    DefectCode: 'D003',
                    DefectDesc: '不良原因3',
                    ref_name: '点位3',
                    DefectCode1: 'D004',
                    DefectDesc1: '不良原因4',
                    ref_name1: '点位4'
                },

            ],
            form: {
                result: '',
                badPhenomenon: ''
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            // console.log( window.innerHeight);
            this.getScreenHeight();
            //后面的50：根据需求空出的高度，自行调整
        });
        window.addEventListener("resize", this.getScreenHeight);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        getChange() {
            console.log(this.pcbNum)
        },
        getScreenHeight() {
            this.$nextTick(() => {
                this.tableHeight = window.innerHeight - 180;
            });
        },
    }
}
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
    padding: 10px;
}
</style>