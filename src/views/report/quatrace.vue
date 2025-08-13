<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">



            <div>
                <el-form ref="form" class="form" :inline="true" :model="getDataText">
                    <el-form-item class="mb-2">
                        <el-select v-model="getDataText.operationType" placeholder="检查类型">
                            <el-option v-for="item in inquireList" :key="item.value" :label="item.lable"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="getDataText.operationType == 'W'" class="mb-2">
                        <el-input placeholder="请输入单号" clearable style="width: 400px" v-model="getDataText.workOrder"
                            class="input-with-select">
                            <!-- @change="getAllData()" -->
                        </el-input>
                    </el-form-item>
                    <el-form-item v-show="getDataText.operationType != 'W'" class="mb-2">
                        <el-input placeholder="请输入seiralNumber" clearable style="width: 400px"
                            v-model="getDataText.seiralNumber" class="input-with-select">
                            <!-- @change="getAllData()" -->
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getAllData()">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="paginatedData" :height="tableHeight"   border stripe
                @sort-change="handleSortChange" size="small">
                <!-- 表格列定义保持不变 -->
                <el-table-column prop="OrderName" label="工单"></el-table-column>
                <el-table-column prop="OperationID" label="制程ID" width="80"></el-table-column>
                <el-table-column prop="OperationName" label="制程名称" width="100"></el-table-column>
                <el-table-column prop="AssemblyName" label="产品料号"></el-table-column>
                <el-table-column prop="LineName" label="线体" width="80"></el-table-column>
                <el-table-column prop="SerialNumber" label="PCB ID"></el-table-column>
                <el-table-column prop="EquipmentName" label="设备名称" width="120"></el-table-column>
                <el-table-column prop="DateTime" label="过站时间" sortable="custom" width="155"
                    :sort-orders="['ascending', 'descending']"></el-table-column>
                <el-table-column prop="StatusCODE" label="不良代码" width="100"></el-table-column>
            </el-table>

            <!-- 分页控件 -->
            <div class="block" style="margin-top: 8px">
            <el-pagination    align="center"
            background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="sortedData.length">
            </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import { XY_PCBAHisControl, XY_Prod_MissSNs } from "@/api/all";
import { getContainerMoves } from "@/api/material";
import dayjs from "dayjs";
export default {
    data() {
        return {
            heardStyle: {
                background: "rgb(102, 146, 217)",
                color: "#ffffff",
            },
            tableData: [],
            getDataText: {
                seiralNumber: "",
                workOrder: "",
                operationType: "S",
            },
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页的数据条数
            tableHeight: 0,
            dialogVisible: false,
            inquireList: [
                {
                    lable: "工单号",
                    value: "W",
                },
                {
                    lable: "PCBA码",
                    value: "S",
                },
            ],
            changeForm: {
                orderName: "",
                operationName: "",
            },
            sortProp: 'DateTime', // 当前排序字段
            sortOrder: 'ascending', // 当前排序顺序
            sortedData: [],
        };
    },
    watch: {
        "getDataText.operationType"(newValue) {
            if (newValue == "W") {
                this.getDataText.seiralNumber = "";
            } else {
                this.getDataText.workOrder = "";
            }
        },
        tableData: {
            immediate: true,
            handler(newVal) {
                this.sortedData = [...newVal];
                this.sortData();
            }
        }
    },
    computed: {
        // 当前页的分页数据
        paginatedData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.sortedData.slice(start, end);
        }
    },

    created() {
        console.log(this.$route.query);
        this.getDataText.seiralNumber = this.$route.query.SerialNumber; // 使用查询参数时使用
    },
    beforeMount() {
        this.getScreenHeight();

    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },

    methods: {
        handleSortChange({ prop, order }) {
            this.sortProp = prop;
            this.sortOrder = order || 'ascending'; // 点击三次后order为null，重置为ascending
            this.sortData();
            this.currentPage = 1; // 排序后重置到第一页
        },

        // 执行全局排序
        sortData() {
            this.sortedData = [...this.tableData].sort((a, b) => {
                // 处理空值
                if (a[this.sortProp] == null) return 1;
                if (b[this.sortProp] == null) return -1;

                let valA = a[this.sortProp];
                let valB = b[this.sortProp];

                // 特殊处理日期字段
                if (this.sortProp === 'DateTime') {
                    valA = new Date(valA).getTime();
                    valB = new Date(valB).getTime();
                }
                // 特殊处理数字字段（例如OperationID）
                else if (['OperationID'].includes(this.sortProp)) {
                    valA = Number(valA);
                    valB = Number(valB);
                }

                // 比较逻辑
                if (valA < valB) return this.sortOrder === 'ascending' ? -1 : 1;
                if (valA > valB) return this.sortOrder === 'ascending' ? 1 : -1;
                return 0;
            });
        },
            getData() {
                return new Promise((resolve, reject) => {
                    XY_PCBAHisControl(this.getDataText).then(({ data }) => {
                        if (data.Status !== "NG") {
                            resolve();
                            let arr = [];
                            // arr = data.DataList.sort((a, b) => {
                            //   return new Date(b.DateTime) - new Date(a.DateTime);
                            // });
                            arr = data.DataList.map((item) => {
                                return {
                                    ...item,
                                    DateTime: dayjs(item.DateTime).format("YYYY-MM-DD HH:mm:ss"),
                                };
                            }).sort((a, b) => {
                                return new Date(a.DateTime) - new Date(b.DateTime);
                            });
                            this.tableData = arr;
                            // this.tableData.push(...data.DataList);
                        } else {
                            resolve();
                            this.tableData = [];
                        }
                    });
                });
            },
          async getAllData() {
                this.startLoading();
                this.tableData = [];
                await this.getData();
                // await this.getDpiData();
                this.currentPage = 1;
                this.endLoading();
            },
            getDpiData() {
                return new Promise((resolve, reject) => {
                    if (this.getDataText.operationType === "S") {
                        getContainerMoves(`conName=${this.getDataText.seiralNumber}`).then(
                            ({ data }) => {
                                this.tableData.push(...data.content);
                                resolve();
                            }
                        );
                    } else {
                        getContainerMoves(`mfgOrder=${this.getDataText.workOrder}`).then(
                            ({ data }) => {
                                let arr = [];
                                arr = data.DataList.sort((a, b) => {
                                    return new Date(b.DateTime) - new Date(a.DateTime);
                                });
                                this.tableData = arr;
                                // this.tableData.push(...data.content);
                                resolve();
                            }
                        );
                    }
                });
                // this.startLoading();
                // if (this.getDataText.operationType === "S") {
                //   getContainerMoves(`conName=${this.getDataText.seiralNumber}`).then(
                //     ({ data }) => {
                //       this.endLoading();
                //       this.tableData.push(...data.content);
                //     }
                //   );
                // } else {
                //   getContainerMoves(`mfgOrder=${this.getDataText.workOrder}`).then(
                //     ({ data }) => {
                //       this.endLoading();
                //       this.tableData.push(...data.content);
                //     }
                //   );
                // }
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
            },
            //当前页改变时触发 跳转其他页
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
            startLoading() {
                this.loading = this.$loading({
                    lock: true,
                    text: "加载中~",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.2)", //调节透明度
                });
            },
            endLoading() {
                this.loading?.close();
            },
        },
    }
</script>

<style lang="scss" scoped>
.smtinstpro {
    padding: 20px;

    // .form{
    //    display: flex;
    //     justify-content: flex-end;
    // }
}
</style>
