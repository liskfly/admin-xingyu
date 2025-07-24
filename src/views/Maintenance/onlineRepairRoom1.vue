<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="form" :inline="true" :model="getForm" label-width="auto">
                    <!-- <el-form-item label="时间" class="mb-2">
                        <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" size="small" :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                            :clearable="false">
                        </el-date-picker>
                    </el-form-item> -->

                    <el-form-item label="SN码" class="mb-2">
                        <el-input placeholder="" clearable style="width: 300px"
                            v-model="getForm.SearchModel.baddata_pcbid" size="small" @clear="clearInput"
                            @keyup.enter.native="clearInput">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData">查询</el-button>
                    </el-form-item>

                </el-form>

                <!-- <el-button type="primary" @click="">维修</el-button> -->
                <div class="mb-2"><el-button type="success" @click="deducedClick">导出</el-button></div>

            </div>
            <el-table :data="tableData" ref="repairRoomRef" border :height="tableHeight" style="width: 100%" stripe
                size="small" @cell-click="handleCellClick" highlight-current-row>
                <!-- 序号列 -->
                <el-table-column type="index" label="序号" width="55" fixed="left" align="center">
                    <template v-slot="{ $index }">
                        {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
                    </template>
                </el-table-column>
                <af-table-column prop="baddata_no" label="报修单号" fixed="left">
                    <template v-slot="{ row }">
                        <span class="underline text-cyan cursor-pointer">{{ row.baddata_no }}</span>
                    </template>
                </af-table-column>
                <af-table-column prop="containername" label="产品SN" fixed="left"></af-table-column>
                <af-table-column prop="mfgordername" label="工单号" fixed="left"></af-table-column>
                <af-table-column prop="productname" label="产品编码" fixed="left"></af-table-column>
                <!-- <af-table-column prop="productvalue" label="产品名称"></af-table-column> -->

                <!-- <af-table-column prop="badphenomena_name" label="不良代码"></af-table-column>
                <af-table-column prop="badphenomena_value" label="不良描述"></af-table-column>
                <af-table-column prop="baddatadetail_item" label="不良点位"></af-table-column> -->
                <el-table-column prop="baddata_type" label="说明"></el-table-column>
                <el-table-column prop="baddata_stts" label="状态" align="center" width="100">
                    <template v-slot="{ row }">
                        <el-tag effect="plain" v-if="
                            row.baddata_stts == '完成维修' || row.baddata_stts == '完成报废'
                        " type="success">{{ row.baddata_stts }}</el-tag>
                        <el-tag effect="plain" v-else-if="row.baddata_stts == '维修中'" type="warning">{{ row.baddata_stts
                            }}</el-tag>
                        <el-tag effect="plain" v-else-if="row.baddata_stts == '未维修'" type="info">{{ row.baddata_stts
                            }}</el-tag>
                        <!-- <el-tag effect="dark" v-else type="danger">{{ row.baddata_stts }}</el-tag> -->
                    </template>
                </el-table-column>
                <af-table-column prop="baddata_user" label="报修人"></af-table-column>
                <el-table-column prop="baddata_datetime" label="报修时间" width="150"></el-table-column>

                <af-table-column prop="baddata_uuser" label="维修人"></af-table-column>
                <el-table-column prop="baddata_udatetime" label="维修时间" width="150"></el-table-column>
                <!--<af-table-column label="操作" fixed="right" width="200" align="center">
                    <template v-slot="{ row }">
                        <el-button type="primary" size="mini" @click="handleEdit(row)"
                            :disabled="row.baddata_stts == '报废审核' || row.baddata_stts == '完成报废' || row.baddata_stts == '完成维修'">维修</el-button>
                        <el-button type="info" size="mini" @click="handleScrap(row)"
                            :disabled="row.baddata_stts == '报废审核' || row.baddata_stts == '完成报废' || row.baddata_stts == '完成维修'">报废</el-button>
                        <el-button type="danger" size="mini"
                            :disabled="row.baddata_stts != '未维修' || row.baddata_stts == '完成维修'"
                            icon="el-icon-delete" @click="handleDelete(row)"></el-button>
                           
                    </template>
                </af-table-column> -->

            </el-table>
            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[10, 20, 50, 100, 200]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="'维修：' + repairForm.baddatadetail_pcbid" :visible.sync="repairVisible" width="75%"
            @close="repairCancel()">
            <el-form :model="repairForm" ref="repairFormRef" label-width="auto" :inline="true">
                <el-form-item label="产品SN" prop="containerName">
                    <el-input v-model="repairForm.containerName" disabled placeholder="请输入产品SN"
                        style="width: 270px"></el-input>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item label="工单号" prop="mfgordername">
                            <el-input v-model="repairForm.mfgordername" disabled readonly
                                style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="产品编码" prop="productname">
                            <el-input v-model="repairForm.productname" disabled readonly
                                style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="产品名称" prop="productvalue">
                            <el-input v-model="repairForm.productvalue" disabled readonly
                                style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item label="不良代码" prop="badphenomena_name">
                            <el-input v-model="repairForm.badphenomena_name" disabled readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="不良描述" prop="badphenomena_value">
                            <el-input v-model="repairForm.badphenomena_value" disabled readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="不良点位" prop="baddatadetail_item">
                            <el-input v-model="repairForm.baddatadetail_item" disabled readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-table :data="repairForm.tableData" border stripe height="300">
                    <af-table-column prop="baddatadetail_item" label="不良点位"></af-table-column>
                    <af-table-column prop="baddatadetail_code" label="不良代码"></af-table-column>
                    <af-table-column prop="badphenomena_value" label="不良名称"></af-table-column>
                </el-table>

                <el-form-item label="维修说明" prop="remark" class="mt-2">
                    <el-input v-model="repairForm.remark" type="textarea" style="width: 440px"></el-input>
                </el-form-item>
                <el-form-item class="mt-2">
                    <el-button type="primary" @click="handleProductname()">更换物料</el-button>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="repairCancel()">取消</el-button>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="'报废：' + scrapForm.baddatadetail_pcbid" :visible.sync="scrapVisible" width="75%"
            @close="scrapCancel()">
            <el-form :model="scrapForm" ref="scrapFormRef" label-width="auto" :inline="true">
                <el-form-item label="产品SN" prop="containerName">
                    <el-input v-model="scrapForm.containerName" disabled placeholder="请输入产品SN"
                        style="width: 270px"></el-input>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item label="工单号" prop="mfgordername">
                            <el-input v-model="scrapForm.mfgordername" disabled readonly
                                style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="产品编码" prop="productname">
                            <el-input v-model="scrapForm.productname" disabled readonly style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="产品名称" prop="productvalue">
                            <el-input v-model="scrapForm.productvalue" disabled readonly
                                style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table :data="scrapForm.tableData" border stripe height="300">
                    <af-table-column prop="baddatadetail_item" label="不良点位"></af-table-column>
                    <af-table-column prop="baddatadetail_code" label="不良代码"></af-table-column>
                    <af-table-column prop="badphenomena_value" label="不良名称"></af-table-column>
                </el-table>

                <el-form-item label="报废说明" prop="remark" class="mt-2">
                    <el-input v-model="scrapForm.remark" type="textarea" style="width: 440px"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="scrapCancel()">取消</el-button>
                <el-button type="primary" @click="scrapSubmit">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="'更换物料'" :visible.sync="addVisible" width="70%" @close="addCancel()">
            <el-table :data="productid" border style="width: 100%" height="350">
                <el-table-column type="index" width="50" label="序号">
                </el-table-column>

                <el-table-column prop="productname" label="更换料号">
                    <template v-slot="{ row, $index }">
                        <el-input v-model="row.productname" :id="`trayIdRef${$index}`" />
                    </template>
                </el-table-column>

                <!-- <el-table-column prop="productnum" label="数量">
                    <template v-slot="{ row }">
                        <el-input v-model="row.productnum" />
                    </template>
                </el-table-column> -->
                <el-table-column label="操作">
                    <template v-slot="{ $index }">
                        <el-button v-if="$index === productid.length - 1" type="text" icon="el-icon-plus"
                            @click="addSmallBoard" />
                        <el-button v-else type="text" icon="el-icon-delete" class="text-red-500"
                            @click="productid.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">关闭</el-button>
                <el-button type="primary" @click="addSubmit()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="'更换物料：' + replaceForm.baddatadetail_pcbid" :visible.sync="replaceVisible" width="75%"
            @close="replaceCancel()">
            <el-form :model="replaceForm" ref="repairFormRef" label-width="auto" :inline="true">
                <el-form-item label="产品SN" prop="containerName">
                    <el-input v-model="replaceForm.containerName" disabled placeholder="请输入产品SN"
                        style="width: 270px"></el-input>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item label="工单号" prop="mfgordername">
                            <el-input v-model="replaceForm.mfgordername" disabled readonly
                                style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="产品编码" prop="productname">
                            <el-input v-model="replaceForm.productname" disabled readonly
                                style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="产品名称" prop="productvalue">
                            <el-input v-model="replaceForm.productvalue" disabled readonly
                                style="width: 270px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table :data="replaceForm.tableData" border stripe height="300">
                    <af-table-column prop="baddatadetail_item" label="不良点位"></af-table-column>
                    <af-table-column prop="baddatadetail_code" label="不良代码"></af-table-column>
                    <af-table-column prop="badphenomena_value" label="不良名称"></af-table-column>
                </el-table>

            </el-form>

            <span slot="footer">
                <el-button @click="replaceCancel()">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    QueryXYL_BadProductInformation,
    UpdateXYL_BadProductInformation,
    QueryXYL_BadProductInformationFromByNo,
} from "@/api/repairApi";
import { getToken } from "@/utils/auth";
import { exportTableToExcel } from "@/utils/exportExcel";
import dayjs from "dayjs";
import {
    shortcuts1,
    disabledDate,
    setTodayDate,
    setLastDate,
} from "@/utils/dataMenu";
export default {
    data() {
        return {
            pickerOptions: {
                shortcuts: shortcuts1,
                disabledDate: disabledDate,
            },
            dateValue: [],
            tableData: [],
            tableHeight: 0,
            total: 0,
            getForm: {
                PageIndex: 1,
                PageSize: 50,
                SearchText: "",
                SearchModel: {
                    baddata_pcbid: "",
                    stts: "Y",
                },
                StartTime: "",
                EndTime: "",
            },
            repairForm: {
                baddatadetail_pcbid: "",
                containerName: "",
                mfgordername: "",
                productname: "",
                productvalue: "",
                badphenomena_name: "",
                badphenomena_value: "",
                baddatadetail_item: "",
                remark: "",
                productid: [],
                tableData: [],
            },
            productid: [
                {
                    productname: "",
                    productnum: "",
                },
            ],
            addVisible: false,
            scrapVisible: false,
            scrapForm: {
                baddatadetail_pcbid: "",
                containerName: "",
                mfgordername: "",
                productname: "",
                productvalue: "",
                badphenomena_name: "",
                badphenomena_value: "",
                baddatadetail_item: "",
                remark: "",
            },
            repairVisible: false,
            replaceForm: {
                baddatadetail_pcbid: "",
                containerName: "",
                mfgordername: "",
                productname: "",
                productvalue: "",
                tableData: [],
            },
            replaceVisible:false   
        };
    },
    watch: {
        dateValue(val) {
            if (val == null) {
                this.getForm.StartTime = "";
                this.getForm.EndTime = "";
            } else {
                this.getForm.StartTime = val[0];
                this.getForm.EndTime = val[1];
            }
            // this.getForm.PageIndex = 1;
            // console.log(111);

            // this.getData();
        },
    },
    beforeMount() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
        // let start= setLastDate();
        this.dateValue = [setLastDate(), setTodayDate()];

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
            QueryXYL_BadProductInformation(this.getForm).then((res) => {
                if (res.Success) {
                    this.tableData = res.Data.list;
                    this.total = res.Data.Total;
                } else {
                    this.tableData = [];
                    // this.$notify.error({
                    //     title: "提示信息",
                    //     message: res.Msg,
                    // });
                }
            });
        },
        clearInput() {
            this.getForm.PageIndex = 1;
            this.getData();
        },
        handleCellClick(row, column) {
      // console.log(row,column);
      if (column.label == "报修单号") {
        // console.log(row);
        this.replaceForm.baddatadetail_pcbid = row.baddata_no;
            this.replaceForm.containerName = row.baddata_pcbid;
            this.replaceForm.mfgordername = row.mfgordername;
            this.replaceForm.productname = row.productname;
            this.replaceForm.productvalue = row.productvalue;
            QueryXYL_BadProductInformationFromByNo({
                baddatadetail_no: row.baddata_no,
            }).then(res => {
          this.replaceForm.tableData=res.Data
          this.replaceVisible=true
        })

      }

    },
    replaceCancel(){
      this.replaceForm.tableData=[]
      this.replaceVisible=false
    },
        deducedClick() {
            exportTableToExcel({
                tableRef: this.$refs.repairRoomRef,
                fetchAllData: this.fetchAllUsers,
                fileName: `不良品维修_${dayjs().format("YYYYMMDDHHmmss")}`,
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
        },
        async fetchAllUsers() {
            let data = await QueryXYL_BadProductInformation(this.getForm).then(
                (res) => {
                    return res.Data.list;
                }
            );
            return data;
        },
        repairCancel() {
            this.repairVisible = false;
            this.repairForm = {
                baddatadetail_pcbid: "",
                containerName: "",
                mfgordername: "",
                productname: "",
                productvalue: "",
                badphenomena_name: "",
                badphenomena_value: "",
                baddatadetail_item: "",
                remark: "",
                productid: [],
            };
        },
        handleEdit(row) {
            this.repairForm.baddatadetail_pcbid = row.baddata_no;
            this.repairForm.containerName = row.containername;
            this.repairForm.mfgordername = row.mfgordername;
            this.repairForm.productname = row.productname;
            this.repairForm.productvalue = row.productvalue;
            // this.repairForm.badphenomena_name = row.badphenomena_name;
            // this.repairForm.badphenomena_value = row.badphenomena_value;
            // this.repairForm.baddatadetail_item = row.baddatadetail_item;
            // this.repairForm.remark = row.remark;

            QueryXYL_BadProductInformationFromByNo({
                baddatadetail_no: row.baddata_no,
            }).then((res) => {
                this.repairForm.tableData = res.Data;
                this.repairVisible = true;
            });
        },
        handleProductname() {
            this.addVisible = true;
            if (this.repairForm.productid.length === 0) {
                this.productid = [
                    {
                        productname: "",
                        // productnum: "",
                    },
                ];
            } else {
                this.productid = this.repairForm.productid;
            }

            this.$nextTick(() => {
                let trayIdRef = document.getElementById(`trayIdRef0`);

                trayIdRef.focus();
            });
        },
        addCancel() {
            this.addVisible = false;
            this.productid = [
                {
                    productname: "",
                    // productnum: "",
                },
            ];
        },
        addSmallBoard() {
            this.productid.push({
                productname: "",
                // productnum: "",
            });
            this.$nextTick(() => {
                let trayIdRef = document.getElementById(
                    `trayIdRef${this.productid.length - 1}`
                );

                trayIdRef.focus();
            });
        },
        addSubmit() {
            // 这里可以添加提交逻辑
            this.repairForm.productid = this.productid.map((item) => {
                return {
                    productname: item.productname,
                    // productnum: item.productnum,
                };
            });
            this.addVisible = false;
            this.productid = [
                {
                    productname: "",
                    // productnum: "",
                },
            ];
        },
        onSubmit() {
            let data = {
                baddatadetail_no: this.repairForm.baddatadetail_pcbid,
                baddata_way: "常规维修",
                baddata_remark: this.repairForm.remark,
                repairList: [],
                UserNo: getToken(),
            };

            if (this.repairForm.productid.length === 0) {
                data.baddata_way = "常规维修";
            } else {
                data.baddata_way = "更换物料";
                data.repairList = this.repairForm.productid.map((item) => {
                    return {
                        productname: item.productname,
                        // productnum: item.productnum,
                    };
                });
            }
            UpdateXYL_BadProductInformation(data).then((res) => {
                if (res.Success) {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "success",
                    });
                    this.repairCancel();
                    this.getData();
                } else {
                    this.$notify.error({
                        title: "提示信息",
                        message: res.Msg,
                    });
                }
            });
        },
        handleScrap(row) {
            this.scrapForm.baddatadetail_pcbid = row.baddata_no;
            this.scrapForm.containerName = row.containername;
            this.scrapForm.mfgordername = row.mfgordername;
            this.scrapForm.productname = row.productname;
            this.scrapForm.productvalue = row.productvalue;
            QueryXYL_BadProductInformationFromByNo({
                baddatadetail_no: row.baddata_no,
            }).then((res) => {
                this.scrapForm.tableData = res.Data;
                this.scrapVisible = true;
            });
            // this.scrapVisible = true;
        },

        scrapCancel() {
            this.scrapVisible = false;
            this.scrapForm = {
                baddatadetail_pcbid: "",
                containerName: "",
                mfgordername: "",
                productname: "",
                productvalue: "",
                badphenomena_name: "",
                badphenomena_value: "",
                baddatadetail_item: "",
                remark: "",
            };
        },
        scrapSubmit() {
            let data = {
                baddatadetail_no: this.scrapForm.baddatadetail_pcbid,
                baddata_way: "报废",
                baddata_remark: this.scrapForm.remark,
                repairList: [],
                UserNo: getToken(),
            };
            UpdateXYL_BadProductInformation(data).then((res) => {
                if (res.Success) {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "success",
                    });
                    this.scrapCancel();
                    this.getData();
                } else {
                    this.$notify.error({
                        title: "提示信息",
                        message: res.Msg,
                    });
                }
            });
        },
        handleDelete(row) {
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    // UpdateXYL_BadProductInformation({
                    //     baddatadetail_id: row.baddatadetail_id,
                    //     UserNo: getToken(),
                    // }).then((res) => {
                    //     if (res.Success) {
                    //         this.$notify({
                    //             title: "提示信息",
                    //             message: res.Msg,
                    //             type: "success",
                    //         });
                    //         this.getData();
                    //     } else {
                    //         this.$notify.error({
                    //             title: "提示信息",
                    //             message: res.Msg,
                    //         });
                    //     }
                    // });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
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
                this.tableHeight = window.innerHeight - 210;
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
