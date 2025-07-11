<template>
    <div>
        <div>
            <div class="h-8 flex items-center justify-between text-lg text-white bg-cyan">
                <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-28 p-5">
                <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                    @submit.native.prevent>
                    <el-form-item label="PCB条码" style="margin-bottom: 8px">
                        <el-input v-model.trim="barCode" ref="inputRef" style="width: 500px" placeholder="请输入条码"
                            @keyup.enter.native="getChange" />
                    </el-form-item>
                </el-form>
                <div class="text-xl font-bold" style="color: #00b400" v-show="msgType === true || msgTitle === ''">
                    {{ msgTitle === "" ? "请扫描条码" : msgTitle }}
                </div>
                <div class="text-xl font-bold" style="color: red" v-show="msgType === false && msgTitle !== ''">
                    {{ msgTitle }}
                </div>
            </div>
        </div>

        <div>
            <div class="h-8 flex items-center text-lg text-white bg-cyan">
                <span class="ml-5">不良记录</span>
            </div>
            <div>
                <el-table :data="form.tableData" border style="width: 100%" height="400">
                    <el-table-column type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column prop="baddatadetail_item" label="不良位号">
                    </el-table-column>
                   
                    <el-table-column prop="badphenomena_value" label="不良现象">
                    </el-table-column>
                    <el-table-column prop="repairAction" label="维修操作">
                        <template v-slot="{ row, $index }">
                            <el-select v-model="row.repairAction" placeholder="请选择"
                                @change="handleChange($event, $index)">
                               
                                <el-option label="常规维修" value="常规维修" />
                                <el-option label="更换物料" value="更换物料" />
                                <el-option label="误判" value="误判" />
                                <el-option label="报废" value="报废" />
                            </el-select>
                            <!-- <el-input v-model="row.trayId" :disabled="form.repairAction != 3" /> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="更换料号">
                        <template v-slot="{ row, $index }">
                            <el-input v-model="row.trayId" :id="`trayIdRef${$index}`"
                                :disabled="row.repairAction != '更换物料'" />
                        </template>
                    </el-table-column>
                   
                    <!-- <el-table-column label="更换料盘数量">
                        <template v-slot="{ row }">
                            <el-input v-model="row.trayIdNum"  :disabled="row.repairAction != '更换物料'" />
                        </template>
                    </el-table-column> -->
                    <el-table-column label="备注">
                        <template v-slot="{ row, $index }">
                            <el-input v-model="row.baddata_remark"  />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="flex justify-end p-2">
            <el-button>重置</el-button><el-button type="primary" @click="onSubmit">提交</el-button>
        </div>

        <!-- <el-dialog :title="'添加'" :visible.sync="addVisible" width="450px" @close="addCancel()">
            <el-table :data="productid" border style="width: 100%" height="400">


                </el-table>
          
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">关闭</el-button>
                <el-button type="primary" @click="addSubmit()">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import {
    QueryXYL_BadProductInformationFromContainer,
    UpdateXYL_BadProductInformation,
} from "@/api/repairApi";
import { getToken } from "@/utils/auth";
export default {
    data() {
        return {
            barCode: "",
            tableData: [],
            form: {
                repairAction: "",

                tableData: [],
            },
            msgType: true,
            msgTitle: "",
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.inputRef.focus();
        });
    },
     methods: {
        getChange() {
            QueryXYL_BadProductInformationFromContainer({ pcbid: this.barCode }).then(
                (res) => {
                    if (res.Success) {
                        this.form.tableData = res.Data;
                    } else {
                        this.msgType = false;
                        this.msgTitle = res.Msg;
                        this.form.tableData = [];
                        // this.$notify({
                        //     title: "提示信息",
                        //     message: res.Msg,
                        //     type: "error",
                        // });
                    }
                }
            );
        },
        handleChange(val, index) {
            if (val == "更换物料") {
                this.$nextTick(() => {
                    let trayIdRef = document.getElementById(`trayIdRef${index}`);

                    trayIdRef.focus();
                });
            } else {
                this.form.tableData[index].trayId = "";
                this.form.tableData[index].trayIdNum="" 
            }
            // if (val == 3) {
            //     this.$refs.trayIdRef0.focus();

            // }
        },
        onSubmit() {
            let data = {
                repairList: [],
                UserNo: getToken(),
            };
            this.form.tableData.forEach((item) => {
                if (
                    item.trayId == null ||
                    item.trayId == undefined ||
                    item.trayId == ""
                ) {
                    data.repairList.push({
                        baddatadetail_id: item.baddatadetail_id,
                        baddata_way: item.repairAction,
                        baddata_remark: item.baddata_remark,
                        productid: [],
                    });
                } else {
                    data.repairList.push({
                        baddatadetail_id: item.baddatadetail_id,
                        baddata_way: item.repairAction,
                        baddata_remark: item.baddata_remark,
                        productid: [{productname:item.trayId}],
                    });
                }
            });
            let isScrap = this.form.tableData.some(
                (item) => item.repairAction === "报废"
            );
            if (isScrap) {
                this.$confirm("是否报废？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.submitData(data);
                    })
                    .catch(() => {
                        this.$notify({
                            title: "提示信息",
                            message: "已取消",
                            type: "warning",
                        });
                    });
            } else {
                this.submitData(data);
            }
        },
        submitData(data) {
            // console.log(data);
            
            UpdateXYL_BadProductInformation(data).then((res) => {
                if (res.Success) {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "success",
                    });
                    this.barCode = "";
                    this.form.tableData = [];
                    this.msgType = true;
                    this.msgTitle = "";
                } else {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "error",
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
