<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div
                class="mb-2 pl-2 pr-2 flex justify-between items-center text-xl font-bold border-solid border-2 border-[#bdbdbd]">
                <div>线体：{{ form.baddata_line }}</div>
                <div>设备：{{ form.baddata_equipment }}</div>
                <div class="text-2xl">
                    <i class="el-icon-setting" @click="openSet"></i>
                </div>
            </div>
            <div>
                <el-form ref="formRef" :model="form" label-width="auto" class="inbound" :inline="true"
                    @submit.native.prevent>
                    <el-form-item label="产品SN" prop="baddata_pcbid" class="mb-2">
                        <el-input v-model="form.baddata_pcbid" ref="pcbRef" placeholder="请输入产品SN" style="width: 640px"
                            @keyup.enter.native="changeInput"></el-input>
                    </el-form-item>
                    <el-form-item label="面别" prop="Side" class="mb-2">
                        <el-select v-model="form.Side">
                            <el-option label="TOP" value="TOP">
                            </el-option>
                            <el-option label="BOT" value="BOT">
                            </el-option>
                        </el-select>

                    </el-form-item>


                </el-form>
                <el-table :data="form.badrecodeList" border :style="{ width: '100%' }" :height="tableHeight">
                    <el-table-column label="序号" width="60" align="center">
                        <template v-slot="{ $index }">{{ $index + 1 }}</template>
                    </el-table-column>
                    <el-table-column prop="baddata_item" label="不良位号">
                        <template v-slot="{ row }">
                            <el-input v-model="row.baddata_item" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="baddata_component" label="不良">
                        <template v-slot="{ row }">
                            <el-select v-model="row.baddata_code" placeholder="请选择不良" filterable style="width: 100%;">
                                <el-option v-for="item in badList" :key="item.badphenomena_name"
                                    :label="item.badphenomena_value" :value="item.badphenomena_name" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="baddata_code" label="备注">
                        <template v-slot="{ row }">
                            <el-input v-model="row.baddata_remark" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                        <template v-slot="{ $index }">
                            <el-button v-if="$index === form.badrecodeList.length - 1" type="text" icon="el-icon-plus"
                                @click="addSmallBoard" />
                            <el-button v-else type="text" icon="el-icon-delete" class="text-red-500"
                                @click="removeBoardItem($index)" />
                        </template>
                    </el-table-column>
                </el-table>
                <div class="flex justify-end pt-2">
                    <el-button @click="restSubmit">重置</el-button><el-button type="primary"
                        @click="handleSubmit">提交</el-button>
                </div>
            </div>
        </el-card>
        <el-dialog title="设置" :visible.sync="dialogSetVisible" width="30%" @close="dialogSetVisible = false">
            <el-form ref="formRef" :model="changeForm" label-width="auto">
                <el-form-item label="线体" prop="line">
                    <el-select v-model="changeForm.line" placeholder="请选择线体" style="width: 100%"
                        @change="changeEquipment">
                        <el-option v-for="item in lineData" :key="item.MfgLineName" :label="item.MfgLineName"
                            :value="item.MfgLineName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="设备" prop="equipment">
                    <el-select v-model="changeForm.equipment" placeholder="请选择设备" style="width: 100%">
                        <el-option v-for="item in equipmentData" :key="item.RESOURCENAME" :label="item.Description"
                            :value="item.RESOURCENAME" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogSetVisible = false">关闭</el-button>
                <el-button type="primary" @click="onSubmitSet">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    QueryMfgLine,
    QueryEquipment,
    InsertXYL_BadProductInformation,
    QueryBadCodebasicInformation,
    QueryBadCodeFromType
} from "@/api/repairApi";
import { getToken } from "@/utils/auth";
export default {
    data() {
        return {
            form: {
                baddata_line: "",
                baddata_equipment: "",
                baddata_pcbid: "",
                Side:"TOP",
                badrecodeList: [
                    {
                        baddata_item: "",
                        baddata_code: "",
                        baddata_remark: "",
                    },
                ],
                UserNo: getToken(),
            },
            tableHeight: 0,
            lineData: [],
            equipmentData: [],
            dialogSetVisible: false,
            changeForm: {
                line: "",
                equipment: "",
            },
            badList: [],
            getBadCodeForm: {
                badphenomena_name: "",
                badphenomena_fathertype: "",
            }
        };
    },
    computed: {
        currentEquipment() {
            const equipment = this.changeForm.equipment;
            if (equipment) {
                const equipmentName = this.equipmentData.find(
                    (item) => item.RESOURCENAME === equipment
                );
                if (equipmentName) {
                    return equipmentName.Description;
                } else {
                    return "请选择设备";
                }
            } else {
                return "请选择设备";
            }
        },
    },
    beforeMount() {
        this.getScreenHeight();
        this.initFormData()
    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
        this.getBadCode();
        this.getLineData();
        this.getEquipmentData();
        this.$refs.pcbRef.focus();
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        initFormData() {
            const line = localStorage.getItem("LINE") || "请选择线体";
            const equipment = localStorage.getItem("EQUIPMENT") || "请选择设备";

            // 使用对象展开运算符统一设置表单值
            this.form = {
                ...this.form,
                baddata_line: line,
                baddata_equipment: equipment
            };

            this.changeForm = {
                line,
                equipment
            };

            this.getBadCodeForm.badphenomena_fathertype = this.getEquipmentPrefix(equipment);
        },
        getEquipmentPrefix(equipment) {
            return equipment.split('-')[0] || "";
        },
        getBadCode() {
            QueryBadCodeFromType(this.getBadCodeForm).then((res) => {
                this.badList = res.Data;
            });
        },
        getLineData() {
            QueryMfgLine({
                LineName: "",
            }).then((res) => {
                this.lineData = res.Data;
            });
        },
        changeEquipment() {
            this.changeForm.equipment = "";
            this.getEquipmentData()
        },
        getEquipmentData() {

            this.equipmentData = []
            QueryEquipment({
                EquipmenName: "",
                LineName: this.changeForm.line,
            }).then((res) => {
                // console.log(res);

                this.equipmentData = res.Data;
            });
        },
        onSubmitSet() {
            localStorage.setItem("LINE", this.changeForm.line);
            localStorage.setItem("EQUIPMENT", this.changeForm.equipment);
            this.$notify({
                title: "提示信息",
                message: "设置成功",
                type: "success",
            });
            this.form.baddata_line = this.changeForm.line;
            this.form.baddata_equipment = this.changeForm.equipment;
            this.getBadCodeForm.badphenomena_fathertype = this.changeForm.equipment.split('-')[0]
            this.getBadCode();
            this.dialogSetVisible = false;
            this.$refs.pcbRef.focus();
        },
        openSet() {
            this.dialogSetVisible = true;
        },
        restSubmit() {
            this.form.baddata_pcbid = "";
            this.form.badrecodeList = [{
                baddata_item: "",
                baddata_code: "",
                baddata_remark: "",
            }];
            this.$refs.pcbRef.focus();
        },
        removeBoardItem(index) {
            this.form.badrecodeList.splice(index, 1);
            if (this.form.badrecodeList.length === 0) {
                this.form.badrecodeList.push({
                    baddata_item: "",
                    baddata_code: "",
                    baddata_remark: "",
                });
            }
        },

        handleSubmit() {
            InsertXYL_BadProductInformation(this.form).then((res) => {
                if (res.Success) {
                    this.$notify({
                        title: "提示信息",
                        message: "不良登记成功",
                        type: "success",
                    });

                    this.restSubmit();
                } else {
                    this.$notify({
                        title: "提示信息",
                        message: res.Msg,
                        type: "error",
                    });
                }
            });
        },

        addSmallBoard() {
            this.form.badrecodeList.push({
                baddata_item: "",
                baddata_code: "",
                baddata_remark: "",
            });
        },
        getScreenHeight() {
            this.$nextTick(() => {
                this.tableHeight = window.innerHeight - 280;
                // this.tableHeight1 =
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
