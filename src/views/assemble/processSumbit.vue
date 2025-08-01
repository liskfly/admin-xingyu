<template>
    <div class="p-2">
        <el-row :gutter="20">
            <el-col :span="15">
                <el-form class="inbound" label-position="left" :model="form" ref="form" label-width="120px"
                    @submit.native.prevent>
                    <el-form-item label="扫入过程码">
                        <el-input v-model="form.SN" ref="inputRef" placeholder="请扫描过程码或相机码" @keyup.enter.native="changeSubmit"></el-input>
                    </el-form-item>
                    <el-form-item label="当前过程码">
                        <el-input v-model="olderSN" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="工单">
                        <span style="font-size: 28px; font-weight: bolder">
                            {{ textForm.WorkOrder }}</span>
                    </el-form-item>
                    <el-form-item label="产品编码">
                        <span style="font-size: 28px; font-weight: bolder">
                            {{ textForm.ProductCode }}</span>
                    </el-form-item>
                    <el-form-item label="产品名称">
                        <span style="font-size: 28px; font-weight: bolder">
                            {{ textForm.ProductName }}
                        </span>
                    </el-form-item>
                    <el-form-item label="产品规格">
                        <span style="font-size: 28px; font-weight: bolder">
                            {{ textForm.ProductSpec }}
                        </span>
                    </el-form-item>
                    <el-form-item label="消息提示">
                        <el-input v-model="textMessage" disabled type="textarea" :rows="4"
                            :class="messageClass"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="9">
                <el-table :data="tableData" border :height="tableHeight" stripe size="small">
                    <el-table-column label="序号" type="index" align="center" width="55"/>
                   
                    <el-table-column prop="SN" label="SN码">
                    </el-table-column>
                    <el-table-column prop="ReworkUser" label="返修人" width="100"></el-table-column>
                    <el-table-column prop="ReworkTime" label="返修时间" width="150"> </el-table-column>
                </el-table>

            </el-col>
        </el-row>
    </div>
</template>

<script>
import { processSumbit, AssemblyReworkHistory } from "@/api/assemble";

import { getToken } from "@/utils/auth";
import dayjs from "dayjs";

export default {
    data() {
        return {
            form: {
                SN: "",
                OperateTime: "",
                OperateUser: getToken(),
            },
            textMessage: "",
            isSuccess: true,
            olderSN: "",
            textForm: {
                WorkOrder: "",
                ProductCode: "",
                ProductName: "",
                ProductSpec: "",
            },
            tableHeight: 0,
            tableData: []

        };
    },
    computed: {
        // 根据状态计算样式类
        messageClass() {
            return this.isSuccess ? "success-message" : "error-message";
        },
    },
    beforeMount() {
        this.getScreenHeight();
        this.getData()
    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);

        this.$nextTick(() => {
            this.$refs.inputRef.focus();
        });
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },

    methods: {
        getData() {
            AssemblyReworkHistory().then(res => {

                this.tableData = res.Data
            })
        },
        changeSubmit() {
            this.form.OperateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
            processSumbit(this.form).then((res) => {
                this.isSuccess = res.Success;
                this.textMessage = res.Msg;
                this.olderSN = this.form.SN; // 保存当前扫描的过程码

                this.getData()
                if (res.Data != null) {

                    let data = JSON.parse(res.Data);
                    this.textForm = {
                        WorkOrder: data.WorkOrder || "",
                        ProductCode: data.ProductCode || "",
                        ProductName: data.ProductName || "",
                        ProductSpec: data.ProductSpec || "",
                    }
                } else {
                    this.textForm = {
                        WorkOrder: "",
                        ProductCode: "",
                        ProductName: "",
                        ProductSpec: "",
                    }
                }


                this.form.SN = "";
                this.$refs.inputRef.focus();
            });
        },
        getScreenHeight() {
            this.$nextTick(() => {

                this.tableHeight = window.innerHeight - 108;

            });
        },
    },
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
    font-size: 20px;
}

.inbound .el-input__inner {
    font-size: 28px;
    font-weight: bolder;
}

.inbound .el-textarea__inner {
    font-size: 28px;
    font-weight: bolder;
}

.success-message .el-textarea__inner {
    color: #67c23a !important;
}

/* 失败样式 - 红色文字 */
.error-message .el-textarea__inner {
    color: #f56c6c !important;
}
</style>