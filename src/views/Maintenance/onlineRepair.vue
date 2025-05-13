<template>
    <div>
        <div>
            <div class="h-8 flex items-center justify-between text-lg text-white bg-cyan">
                <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-28 p-5">
                <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                    @submit.native.prevent>
                    <el-form-item label="PCB条码">
                        <el-input v-model.trim="barCode" ref="inputRef" style="width: 500px" placeholder="请输入条码"
                            @keyup.enter.native="getChange" />
                    </el-form-item>
                </el-form>
                <!-- <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
              {{ msgTitle === "" ? "请扫描条码" : msgTitle }}
            </div>
            <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
              {{ msgTitle }}
            </div> -->
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

                    <el-table-column prop="badTags" label="不良位号">
                        <template v-slot="{ row }">
                            <el-input v-model="row.badTags" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="badPartNumber" label="不良料号">
                        <template v-slot="{ row }">
                            <el-input v-model="row.badPartNumber" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="badphenomena_value" label="不良现象">
                        <template v-slot="{ row }">
                            <el-input v-model="row.badphenomena_value" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="repairAction" label="维修操作">
                        <template v-slot="{ row }">
                            <el-select v-model="row.repairAction" placeholder="请选择">
                                <el-option label="误判" value="1" />
                                <el-option label="常规维修" value="2" />
                                <el-option label="更换元器件" value="3" />
                                <el-option label="报废" value="4" />
                            </el-select>
                            <!-- <el-input v-model="row.trayId" :disabled="form.repairAction != 3" /> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="badPhenomenon" label="更换料盘ID">
                        <template v-slot="{ row }">
                            <el-input v-model="row.trayId" :disabled="row.repairAction != 3" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="flex justify-end p-2">
            <el-button>重置</el-button><el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
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

                tableData: [
                    {
                        badTags: "D001",
                        badPartNumber: "40014322",
                        badPhenomenon: "不良原因1",
                        trayId: "",
                    },
                ],
            },
        };
    },
    methods: {
        getChange() {
            QueryXYL_BadProductInformationFromContainer({ pcbid: this.barCode }).then(
                (res) => {
                    if (res.Success) {
                        this.form.tableData = res.Data;
                    } else {
                    }
                }
            );
        },
        onSubmit() {
            let data={
                repairList:[],
                UserNo:getToken(),
            }
            this.form.tableData.forEach((item) => {
                data.repairList.push({
                    baddata_id: item.baddata_id,
                    baddata_way: item.repairAction,
                    productid:[]
                });
            });
            UpdateXYL_BadProductInformation(data).then((res) => {
                if(res.Success) {
                   this.$notify({
                    title:"提示信息",

                    message: res.Msg,
                    type: "success",
                   })
                } else {
                   this.$notify({
                    title:"提示信息",
                    message: res.Msg,
                    type: "error",
                   })
                }
            });
         },
    },
};
</script>

<style lang="scss" scoped></style>
