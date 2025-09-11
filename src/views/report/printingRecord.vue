<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div>
               <el-form ref="formRef" :model="getForm" :inline="true" @submit.native.prevent>
      
          <el-form-item label="产品SN" class="mb-2"><el-input v-model="getForm.ContainerMfg" clearable
              placeholder="请输入" style="width: 300px" @clear="clearInput"
              @keyup.enter.native="getData" /></el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()" icon="el-icon-search">查询</el-button></el-form-item>
        </el-form>


            </div>
            <el-table :data="tableData.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
            )
                " border :height="tableHeight" style="width: 100%" size="mini" ref="operaRecordRef">
                 <el-table-column  label="序号" width="60" align="center"> 
                    <template #default="scope">
                        {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                    </template>
                 </el-table-column>
                <el-table-column prop="pcbid" label="条码"> </el-table-column>
                <el-table-column prop="McID" label="设备"> </el-table-column>
                <el-table-column prop="ProductName" label="产品编码"> </el-table-column>
                <el-table-column prop="OrderNo" label="工单"> </el-table-column>
                  <el-table-column prop="Label" label="采集项目"> </el-table-column>
                    <el-table-column prop="Value" label="采集内容"> </el-table-column>
                     <el-table-column prop="Units" label="单位"> </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper"
                    :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>

    </div>
</template>

<script>
import { GetPrintingTranslator } from "@/api/reportApi/index";
export default {
    data() {
        return {
            getForm: {
                ContainerMfg: '',
            },
            tableHeight: 0,
            tableData: [],
            currentPage: 1, // 当前页码
            pageSize: 20, // 每页的数据条数
        }
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
        getData(){
            if(this.getForm.ContainerMfg==''){
                this.$notify.error({
                    title: '提示信息',
                    message: '请输入产品SN',
                    
                });
                return;
            }
            GetPrintingTranslator(this.getForm).then(res => {
                if(res.Success){
                    this.tableData = res.Data;
                }else{
                    this.tableData = [];
                    this.$notify.error({
                        title: '提示信息',
                        message: res.Message,
                        
                    });
                }
               
            });
        },
        clearInput() {
            this.getForm.ContainerMfg = '';
            this.$refs.formRef.resetFields();
            this.tableData = [];
        },
        handleSizeChange(value) {
            this.pageSize = value;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        getScreenHeight() {
            this.$nextTick(() => {
                this.tableHeight = window.innerHeight - 210;

            });
        },
    }
}
</script>
