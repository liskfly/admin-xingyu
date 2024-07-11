<template>
  <div class="smdPro">
    <el-card class="box-card">
      <div class="table_header">
        <el-button type="primary" @click="dialogVisible = true"
          >添加/修改机种</el-button
        >
        <div class="input_box">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="getlistText.searchText"
            class="input-with-select"
            @input="getSearchData"
            @change="getSearchData"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table :data="tableData"  :height="tableHeight" border style="width: 100%">
          <el-table-column prop="ProductName" label="批量名称" min-width="120">
          </el-table-column>
          <el-table-column prop="MjsId" label="数据名称" min-width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 15px">
          <el-pagination
            background
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20, 50, 100]"
            :current-page="currentPage"
            :page-size="getlistText.pageSize"
             layout="total,sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="添加/修改机种"
      @close="addCancel()"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="批量名称">
          <el-input
            v-model="form.productName"
            placeholder="批量名称 = 产品名称+面(TOP,BOT)"
          ></el-input>
        </el-form-item>
        <el-form-item label="生产数据名称">
          <el-input v-model="form.mjsId" placeholder="生产数据名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveMjsID, getMjsList, deleteMjsID } from "@/api/smd";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        productName: "",
        mjsId: "",
      },
      tableHeight:0,
      tableData: [],
      total: 0,
      currentPage: 1,
      getlistText: {
        pageIndex: 0,
        pageSize: 10,
        searchText: "",
      },
    };
  },
  created() {
    this.getData();
  },
     beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      this.startLoading();
      getMjsList(this.getlistText)
        .then(({ data }) => {
          this.endLoading();
          let a = JSON.parse(data.data);
          this.total = a.Total;
          this.tableData = a.MjsList;
        })
        .catch(() => {
          this.endLoading();
        });
    },
    onSubmit() {
      // console.log(this.form);
      if (this.form.productName && this.form.mjsId) {
        saveMjsID(this.form).then(({ data }) => {
          if (data.code == 1) {
            console.log(this.getlistText);
            this.getData();
            this.$message.success("添加成功");
            this.dialogVisible = false;
            this.form.productName = "";
            this.form.mjsId = "";
          } else {
            this.$alert("添加失败", "错误信息", {
              confirmButtonText: "确定",
              callback: () => {
                this.dialogVisible = false;
                this.form.productName = "";
                this.form.mjsId = "";
              },
            });
          }
        });
      } else {
        this.$alert("添加失败,请完成信息填写", "错误信息", {
          confirmButtonText: "确定",
        });
      }
    },
    addCancel() {
      this.dialogVisible = false;
      this.form.productName = "";
      this.form.mjsId = "";
    },
    handleEdit(index, row) {
      this.form.productName = row.ProductName;
      this.form.mjsId = row.MjsId;
      this.dialogVisible = true;
      // console.log(index, row);
    },
    handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteMjsID({ MjsID: row.MjsId }).then((res) => {
            if (this.tableData.length == 1 && this.getlistText.pageIndex >= 0) {
              this.getlistText.pageIndex--;
            }
            console.log(this.tableData.length, this.getlistText.pageIndex);
            this.getData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getSearchData() {
      this.getlistText.pageIndex = 0;
      this.getData();
    },
     handleSizeChange(value) {
      this.getlistText.pageSize = value;
      this.getData();
      // console.log(this.pageSize);
    },
    handleCurrentChange(value) {
      this.getlistText.pageIndex = value - 1;
      this.getData();
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
        this.tableHeight = window.innerHeight - 300;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.smdPro {
  padding: 20px;
  .table_header {
    padding-bottom: 20px;
    display: flex;
    gap: 30px;
    justify-content: space-between;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
}
</style>
