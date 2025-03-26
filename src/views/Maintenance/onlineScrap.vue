<template>
    <div class="p-2">

        <el-card shadow="" :body-style="{ padding: '8px' }">
            <div class="p-2">
                <el-input v-model="input" placeholder="请输入" style="width: 400px;" />
                <el-button>查询</el-button>
            </div>
            <el-table :data="tableData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )" :style="{ width: '100%' }" border :height="tableHeight" stripe>
                <el-table-column type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column prop="pcbBarcode" label="PCB条码" />
                <el-table-column prop="applicant" label="申请人" />
                <el-table-column prop="applicatTime" label="申请时间" />
                <el-table-column prop="remark" label="备注" />
                <el-table-column label="操作" width="100" align="center">
                    <template>

                        <el-button type="primary" icon="el-icon-document" size="mini" @click="handleEdit"></el-button>
                        
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 8px">
            <el-pagination align="center" background @size-change="handleSizeChange"
              @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
              :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="tableData.length">
            </el-pagination>
          </div>
        </el-card>
        <el-dialog
      :title="'PCB123456'"
      :visible.sync="dialogVisible"
      width="75%"
      @close="addCancel()"
    >
    <el-table :data="tableData1" border style="width: 100%" height="400">
                    <el-table-column type="index" width="50" label="序号">
                    </el-table-column>

                    <el-table-column prop="badTags" label="不良位号">
                      
                    </el-table-column>
                    <el-table-column prop="badPartNumber" label="不良料号">
                       
                    </el-table-column>
                    <el-table-column prop="badPhenomenon" label="不良现象">
                       
                    </el-table-column>
                  
                </el-table>
    
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">不通过</el-button>
        <el-button type="primary" @click="onSubmit()">通过</el-button>
      </span>
    </el-dialog>

    </div>
</template>

<script>
export default {
data(){
    return{
        tableData:[
            {
                pcbBarcode: "PCB123456",
                applicant: "张三",
                applicatTime: "2025-03-25",
                remark: "备注"
            }
        ],
        tableData1:[
            {
                badTags: "1",
                badPartNumber: "2",
                badPhenomenon: "3"
            }
        ],
        currentPage: 1,
        pageSize: 10,
        tableHeight: 0,
        input: "",
        dialogVisible: false
    }
},
beforeMount() {
    this.getScreenHeight();
  },
  mounted() {

    window.addEventListener("resize", this.getScreenHeight);
    // this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
methods:{
    handleEdit() {
      this.dialogVisible = true;
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
        this.tableHeight = window.innerHeight - 230;
        // this.tableHeight1 =
      });
    },
}
}
</script>

<style lang="scss" scoped></style>