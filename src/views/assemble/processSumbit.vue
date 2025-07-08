<template>
    <div class="p-2">
        <el-row>
            <el-col :span="16">
                <el-form class="inbound" label-position="left" :model="form" ref="form" label-width="120px"
                    @submit.native.prevent>
                    <el-form-item label="扫入过程码">
                        <el-input v-model="form.SN" ref="inputRef" @keyup.enter.native="changeSubmit"></el-input>
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
            <el-col :span="8">
                <!-- <el-table :data="tableData" border :height="tableHeight" stripe>
          <el-table-column prop="OperationName" label="工序名称">
          </el-table-column>
          <el-table-column prop="EquipmentID" label="设备ID"></el-table-column>
          <el-table-column prop="StatusCODE" label="结果">
            <template slot-scope="scope">
              <el-tag
                :type="
                  scope.row.StatusCODE == 'PASS' || scope.row.StatusCODE == 'OK'
                    ? 'success'
                    : 'danger'
                "
                effect="dark"
              >
                {{ scope.row.StatusCODE }}
              </el-tag>
            </template>
</el-table-column>
<el-table-column prop="DateTime" label="时间"> </el-table-column>
</el-table> -->
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { processSumbit } from "@/api/assemble";

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
            textForm:{
                WorkOrder: "",
                ProductCode: "",
                ProductName: "",
                ProductSpec: "",
            }

        };
    },
    computed: {
        // 根据状态计算样式类
        messageClass() {
            return this.isSuccess ? "success-message" : "error-message";
        },
    },
    beforeMount() {
      
  },
    mounted() {
      
        this.$nextTick(() => {
            this.$refs.inputRef.focus();
        });
    },


    methods: {
        changeSubmit() {
            this.form.OperateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
            processSumbit(this.form).then((res) => {
                this.isSuccess = res.Success;
                this.textMessage = res.Msg;
                this.olderSN = this.form.SN; // 保存当前扫描的过程码
                console.log(res.Data);
                console.log(JSON.parse(res.Data));
                
               if(res.Data!=null){
                
                let data=JSON.parse(res.Data);
                this.textForm={
                    WorkOrder: data.WorkOrder || "",
                    ProductCode: data.ProductCode || "",
                    ProductName: data.ProductName || "",
                    ProductSpec: data.ProductSpec || "",
                }
               }else{
                this.textForm={
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
    },
};
</script>

<style lang="scss" >
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
