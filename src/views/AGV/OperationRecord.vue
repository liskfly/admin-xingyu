<template>
    <div class="p-2">
      <el-card :body-style="{ padding: '8px' }">
        <div class="mb-2">
            <el-input style="width: 240px;" v-model="line" placeholder="线体" @change="getData"></el-input>
          <el-button type="" style="margin-left: 10px;" @click="getData()" icon="el-icon-search">查询</el-button>
        </div>
        <div class="table_container">
          <el-table
            :data="
              tableData.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            border
            :height="tableHeight"
            style="width: 100%"
          >
            <el-table-column prop="lineNumber" label="备料ID"> </el-table-column>
            <el-table-column prop="workstationID" label="线体"> </el-table-column>
            <el-table-column prop="mtype" label="工位"></el-table-column>
            <el-table-column prop="mtype" label="任务类型"></el-table-column>
            <el-table-column prop="mtype" label="起点"></el-table-column>
            <el-table-column prop="mtype" label="状态"></el-table-column>
            <el-table-column prop="startPoint" label="操作"> </el-table-column>
            <el-table-column prop="status" label="更新时间"></el-table-column>
          </el-table>
        </div>
        <div class="block" style="margin-top: 8px">
          <el-pagination
            align="center"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import { findLineMaterial } from "@/api/agvApi";
  export default {
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页的数据条数
        tableHeight: 0,
        form: {
          productName: "",
          useage: "",
          toolsMold: "",
          remark: "",
          operationType: "I",
        },
        getText: {
          toolsMold: "*",
          remark: "",
          operationType: "Q",
        },
        getAllText: {
          toolsMold: "",
          remark: "",
          productName: "*",
          useage: 0,
          operationType: "Q",
        },
        typeList: [],
        itemPass1: "",
        titleType: "",
        line:'',
        lineList:['Line1','Line2','Line3','Line4','Line5','Line6','Line7']
      };
    },
    created() {
      // this.getData();
      // this.getIDdata();
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
      getData() {
        // console.log(this.line);
        if(this.line === '') {
          this.$message.error('请输入线体');
          return;
        }
        findLineMaterial(this.line).then((res) => {
          if (res.Success) {
            this.tableData = JSON.parse(res.Data);
           
          }else {
            this.tableData = [];
            
          }
        });
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
          this.tableHeight = window.innerHeight - 220;
          // this.tableHeight1 =
        });
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .titleSelect {
      margin-right: 12px;
  }
  
  .type {
    padding: 20px;
    .initBox {
      width: 500px;
    }
    .table_header {
      padding-bottom: 20px;
      display: flex;
      // gap: 30px;
      // justify-content: flex-end;
      align-items: center;
      .input_box {
        width: 400px;
      }
    }
    .btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  </style>
  