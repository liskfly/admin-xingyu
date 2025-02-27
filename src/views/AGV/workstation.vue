<template>
    <div class="type">
      <el-card :body-style="{ padding: '8px' }">
        <!-- <div class="table_header">
            <el-input style="width: 240px;" v-model="line"></el-input>
          <el-button type="" style="margin-left: 10px;" @click="getData()" icon="el-icon-search">查询</el-button>
        </div> -->
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
          <el-table-column type="index" label="序号" width="55"> </el-table-column>
            <el-table-column prop="workstationID" label="工位ID"> </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="area" label="区域"></el-table-column>
            <el-table-column prop="cr_user" label="更新人"> </el-table-column>
            <el-table-column prop="cr_date" label="更新时间"></el-table-column>
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
  import { findWorkStation } from "@/api/agvApi";
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
      this.getData();
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
        findWorkStation().then(res=>{
          this.tableData=[]
          // console.log(res);
          let data = JSON.parse(res.Data);
          this.tableData = data;
           console.log(data);
        })
      },
      handleSizeChange(value) {
        this.pageSize = value;
        console.log(this.pageSize);
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage = val;
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
        this.loading.close();
      },
      getScreenHeight() {
        this.$nextTick(() => {
          this.tableHeight = window.innerHeight - 185;
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
    padding: 8px;
    .initBox {
      width: 500px;
    }
    .table_header {
      padding-bottom: 8px;
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
  