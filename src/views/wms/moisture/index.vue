<template>
  <div class="moisture">
    <!-- <el-row :gutter="20">
      <el-col :span="18" :offset="0"> -->
    <el-table
      :data="tableData"
      :height="tableHeight"
      :header-cell-style="heardStyle"
      border
      style="width: 100%"
    >
      <af-table-column prop="CompName" label="料号"> </af-table-column>
      <af-table-column prop="ReelID" label="ID"> </af-table-column>
      <el-table-column prop="TimeLeft" label="剩余时间" align="center">
        <template slot-scope="scope">
          <span>{{minChangeH(scope.row.TimeLeft)}}</span>
        </template>
      </el-table-column>
      <af-table-column prop="CountLeft" label="剩余数量" align="center">
      </af-table-column>

      <af-table-column prop="MsdLevel" label="等级" align="center">
      </af-table-column>
      <af-table-column prop="NumDryLeft" label="烘烤次数" align="center">
      </af-table-column>
      <!-- <el-table-column prop="PlanQty" label="库位"> </el-table-column> -->
    </el-table>
     <div class="block" style="margin-top: 15px">
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
    <!-- </el-col> -->
    <!-- <el-col :span="6" :offset="0">
        <el-card>
          <div class="leftBox">
            <el-form label-position="left" ref="form" label-width="80px">
              <el-form-item label="元器件ID" prop="reelID">
                <el-input v-model="reelID"></el-input>
              </el-form-item>
              <el-form-item label="储位" prop="cell">
                <el-input v-model.number="cell"></el-input>
              </el-form-item>
              <el-form-item label="操作" prop="type">
                <el-radio-group v-model="type">
                  <el-radio label="movein">入库</el-radio>
                  <el-radio label="moveout">出库</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col> -->
    <!-- </el-row> -->
  </div>
</template>

<script>
import { dryComponentControl } from "@/api/all";
import { movein, moveout, downLigthing } from "@/api/ms";
export default {
  data() {
    return {
      heardStyle: {
        background: "rgb(102, 146, 217)",
        color: "#ffffff",
      },
      tableData: [],
      tableHeight: 0,
         currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      reelID: "",
      cell: "",
      type: "movein",
      itemPass1: "",
      getTimer: null,
      rules: {
        reelID: [{ required: true, message: "请输入", trigger: "change" }],
        // mcId: [{ required: true, message: "请输入", trigger: "change" }],
        type: [{ required: true, message: "请输入", trigger: "change" }],
      },
    };
  },
   beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
     window.addEventListener("resize", this.getScreenHeight);
    this.getData();
    this.getTimer = setInterval(() => {
      this.getData();
    }, 5000);
  },
  destroyed() {
        window.removeEventListener("resize", this.getScreenHeight);
    // console.log(1);
    clearTimeout(this.getTimer);
    this.getTimer = null;
  },
  methods: {
    getData() {
      dryComponentControl({ reelID: "", mcId: 4, type: "inquiry" }).then(
        (res) => {
          this.tableData = res.data.Details;
          // console.log();
        }
      );
    },
    onSubmit() {
      // this.$refs.form.validate((valid) => (this.itemPass1 = valid));
      // if (this.itemPass1) {
      dryComponentControl({
        reelID: this.reelID,
        mcId: 4,
        type: this.type,
      }).then(({ data }) => {
        if (data.Status == "OK") {
          if (this.type == "movein") {
            movein({
              cell: this.cell,
              reelID: this.reelID,
              createUser: "111",
            }).then((res) => {
              if (res.data.code == 100200) {
                //  this.offLight();
                this.$refs.form.resetFields();
                this.$message({
                  type: "success",
                  message: `成功!`,
                });
                this.getData();
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg,
                });
              }
            });
          } else {
            moveout({
              cell: this.cell,
              reelID: this.reelID,
              createUser: "111",
            }).then((res) => {
              if (res.data.code == 100200) {
                this.offLight();
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg,
                });
              }
            });
          }
        } else {
          this.$message({
            type: "error",
            message: `失败!`,
          });
          this.$alert(data.Message, "错误信息", {
            confirmButtonText: "确定",
          });
        }
      });
      // } else {
      //   this.$alert("添加失败,请完成必填项", "错误信息", {
      //     confirmButtonText: "确定",
      //   });
      // }
    },
    minChangeH(data){
        return (Math.floor(data/60) + "小时" + (data%60) + "分" );
    },
    offLight() {
      this.$confirm("确定灭灯", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          downLigthing(this.cell).then((res) => {
            if (res.data.code == 100200) {
              this.$refs.form.resetFields();
              this.$message({
                type: "success",
                message: `成功!`,
              });
              this.getData();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
     handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
     getScreenHeight() {
      this.$nextTick(() => {
        // console.log( window.innerHeight);
        this.tableHeight = window.innerHeight - 200;
        //后面的50：根据需求空出的高度，自行调整
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
