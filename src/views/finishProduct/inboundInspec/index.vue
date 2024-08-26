<template>
  <div class="inboundInspec">
    <el-row>
      <el-col :span="16">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <div class="left-box">
            <el-form
              class="inbound"
              label-position="left"
              :model="form"
              ref="form"
              :rules="rules"
              label-width="150px"
              size="normal"
              @submit.native.prevent
            >
              <el-form-item label="工单">
                <!-- <el-input v-model="form.order"></el-input> -->
                <el-select
                  v-model="form.Wo"
                  @change="change"
                  filterable
                  placeholder="点击选择"
                >
                  <el-option
                    style="font-size: 25px"
                    v-for="item in workOrderList"
                    :key="item.WO"
                    :label="item.WO"
                    :value="item.WO"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品编码">
                <span style="font-size: 30px; font-weight: bolder">
                  {{ form.Pn }}</span
                >
              </el-form-item>
              <el-form-item label="产品名称">
                <span style="font-size: 30px; font-weight: bolder">
                  {{ form.Name }}
                </span>
              </el-form-item>
              <el-form-item label="产品规格">
                <span style="font-size: 30px; font-weight: bolder">
                  {{ form.Spec }}
                </span>
              </el-form-item>
              <el-form-item label="资源">
                <el-select v-model="toForm.Equipment" placeholder="请选择">
                  <el-option
                    v-for="item in equipmentChoice"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="PCBA序列号" prop="PcbSn">
                <!-- <el-col :span="12"> -->
                <el-input
                  class="keydown"
                  ref="input"
                  v-model="form.PcbSn"
                  @keyup.enter.native="changeFocus"
                ></el-input>
                <!-- </el-col> -->
              </el-form-item>
              <el-form-item label="成品码">
                <!-- <el-col :span="12"> -->
                <el-input ref="finishedProduct" v-model="stringcode"></el-input>
                <!-- </el-col> -->
              </el-form-item>
              <el-form-item label="检验结果">
                <el-select
                  v-model="form.Result"
                  filterable
                  placeholder="点击选择"
                >
                  <el-option
                    style="font-size: 25px"
                    v-for="item in options"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <!-- <el-button>取消</el-button> -->
              </el-form-item>
            </el-form>
          </div>
          <button
            ref="myButton"
            type="primary"
            :style="{ display: 'none' }"
            @click="onSubmit"
          >
            保存
          </button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-table :data="tableData" border :height="tableHeight" stripe>
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
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      :class="form.Result == 'PASS' ? 'pass' : 'fail'"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>{{ form.Result }}</span>
    </el-dialog>

    <el-dialog
      v-for="key in dialogForm"
      title="提示"
      :visible.sync="key.dialogVisible"
      width="50%"
    >
      <span class="dio-msg">{{ key.Msg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="key.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="key.dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <AudioPlay ref="fail" :audio-src="fail"></AudioPlay>
  </div>
</template>

<script>
import { getFinshOrder, SaveIntactProduct } from "@/api/wmsApi";
import { XY_PCBAHisControl } from "@/api/all";
import { updateUri, getContainerMoves } from "@/api/index";
import { getToken } from "@/utils/auth";
import { getDate } from "@/utils/getDate";
import AudioPlay from "@/components/mp3/audioPlay.vue";
// import { getDate } from "@/utils/getDate";
export default {
  components: {
    AudioPlay,
  },
  data() {
    var PcbSnPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入pcb条码"));
      } else if (!value.toLowerCase().startsWith("40502")) {
        callback(new Error("必须要以40502开头"));
      } else {
        callback();
      }
    };
    return {
      tableHeight: 0,
      dialogVisible: false,
      workOrderList: [],
      form: {
        Wo: "",
        Pn: "",
        Spec: "",
        Name: "", //物料名称
        PcbSn: "", //pcb 序列号
        Result: "PASS", //结果 PASS or FAIL
        Status: 0, //状态 默认给0
        CheckUser: getToken(), //检验员
        CheckTime: "", //检验时间
      },
      rules: {
        PcbSn: [{ validator: PcbSnPass, trigger: "blur" }],
      },
      stringcode: "",
      options: [
        {
          lable: "PASS",
          value: "PASS",
        },
        {
          lable: "FAIL",
          value: "FAIL",
        },
      ],
      focusQRCode: false,
      tableData: [],
      dialogClass: "pass",
      toForm: {
        ContainerName: "",
        Equipment: "OQC",
        DataHeaderID: "709e558f16bf5365c6f343d20c84360d",
        TestResult: "ok",
        finishCode: "",
      },
      equipmentChoice: [
        {
          value: "OQC",
          lable: "OQC",
        },
        // {
        //   value: '9201',
        //   lable: "HCM控制器装配自动化线",
        // },
        // {
        //   value: '9301',
        //   // lable: "毫米波雷达装配自动化线",
        //   lable: '五合一自动化线'
        // },
      ],
      dialogForm: {
        upDate: {
          dialogVisible: false,
          Msg: "",
        },
        dip: {
          dialogVisible: false,
          Msg: "",
        },
        smt: {
          dialogVisible: false,
          Msg: "",
        },
        product: {
          dialogVisible: false,
          Msg: "",
        },
      },
      fail: require("@/assets/mp3/fail.mp3"),
    };
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);

    document.addEventListener("keydown", this.handleKeyDown);
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    getData() {
      getFinshOrder().then(({ data }) => {
        // let a = JSON.parse(data.Data);
        // console.log(a);
        this.workOrderList = JSON.parse(data.Data);
        // console.log(this.workOrderList);
      });
    },
    change(order) {
      let product = this.workOrderList.find((item) => item.WO == order);
      this.form.Pn = product.PdModel;
      this.form.Name = product.PdModelName;
      this.form.Spec = product.PdModelSpec;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
      // console.log(product);
      // console.log(data);
    },
    onSubmit() {
      this.form.CheckUser = getToken();
      this.form.CheckTime = this.getDate();
      this.toForm.ContainerName = this.form.PcbSn;
      this.toForm.TestResult = this.form.Result == "PASS" ? "OK" : "NG";
      this.toForm.DataHeaderID = this.generateGuid();
      this.toForm.finishCode = this.form.finishCode;
      // console.log(this.toForm);
      // XY_PCBAHisControl({
      //   seiralNumber: this.form.PcbSn,
      //   workOrder: "",
      //   operationType: "S",
      // }).then(({ data }) => {
      //   // this.dialogVisible = false;
      //   // console.log(data);
      //   if (data.Status == "OK") {
      //     // let arr = data.content;
      //     this.tableData = data.DataList.map((item) => {
      //       return {
      //         ...item,
      //         DateTime: getDate(item.DateTime),
      //       };
      //     });
      //     this.tableData.sort((a, b) => {
      //       let aTime = new Date(a.DateTime);
      //       let bTime = new Date(b.DateTime);
      //       return bTime - aTime;
      //     });
      //     this.form.Result = "PASS";
      //     this.$nextTick(() => {
      //       this.$refs.input.focus();
      //     });
      //     updateUri(this.toForm).then(({ data }) => {
      //       if (data.IsSucess == true) {
      //         getContainerMoves(this.toForm.ContainerName).then(({ data }) => {
      //           if (data.code == 100200) {
      //             this.tableData = [...this.tableData, ...data.content];
      //             this.tableData.sort((a, b) => {
      //               let aTime = new Date(a.DateTime);
      //               let bTime = new Date(b.DateTime);
      //               return bTime - aTime;
      //             });
      //             SaveIntactProduct(this.form, this.stringcode).then(
      //               ({ data }) => {
      //                 if (data.Code == 200) {
      //                   this.dialogVisible = true;
      //                   setTimeout(() => {
      //                     this.dialogVisible = false;
      //                   }, 1000);
      //                   this.stringcode = "";
      //                   this.$message({
      //                     type: "success",
      //                     message: "保存成功!",
      //                   });
      //                 } else {
      //                   this.$message({
      //                     type: "error",
      //                     message: data.Msg,
      //                   });
      //                 }
      //                 this.form.PcbSn = "";
      //               }
      //             );
      //           } else {
      //             this.$message({
      //               type: "error",
      //               message: data.msg,
      //             });
      //           }
      //         });
      //       } else {
      //         this.$message({
      //           type: "error",
      //           message: "流程检查失败，缺少过站数据",
      //         });
      //       }
      //     });
      //   } else {
      //     this.$message({
      //       type: "error",
      //       message: data.Message,
      //     });
      //   }
      // });

      // XY_PCBAHisControl({
      //   seiralNumber: this.form.PcbSn,
      //   workOrder: "",
      //   operationType: "S",
      // }).then(({ data }) => {
      //   // this.dialogVisible = false;
      //   // console.log(data);
      //   if (data.Status == "OK") {
      //     // let arr = data.content;
      //     this.tableData = data.DataList.map((item) => {
      //       return {
      //         ...item,
      //         DateTime: getDate(item.DateTime),
      //       };
      //     });
      //     this.tableData.sort((a, b) => {
      //       let aTime = new Date(a.DateTime);
      //       let bTime = new Date(b.DateTime);
      //       return bTime - aTime;
      //     });
      //     this.form.Result = "PASS";
      //     this.$nextTick(() => {
      //       this.$refs.input.focus();
      //     });
      //   } else {
      //     this.$message({
      //       type: "error",
      //       message: data.Message,
      //     });
      //   }
      // });
      updateUri(this.toForm)
        .then(({ data }) => {
          if (data.IsSucess == true) {
            XY_PCBAHisControl({
              seiralNumber: this.form.PcbSn,
              workOrder: "",
              operationType: "S",
            }).then(({ data }) => {
              // this.dialogVisible = false;
              // console.log(data);
              if (data.Status == "OK") {
                // let arr = data.content;
                this.tableData = data.DataList.map((item) => {
                  return {
                    ...item,
                    DateTime: getDate(item.DateTime),
                  };
                });
                this.tableData.sort((a, b) => {
                  let aTime = new Date(a.DateTime);
                  let bTime = new Date(b.DateTime);
                  return bTime - aTime;
                });
                this.form.Result = "PASS";
                this.$nextTick(() => {
                  this.$refs.input.focus();
                });
              } else {
                this.dialogForm.smt.dialogVisible = true;
                this.dialogForm.smt.Msg = data.Message;
              }
            });

            getContainerMoves(this.toForm.ContainerName).then(({ data }) => {
              if (data.code == 100200) {
                this.tableData = [...this.tableData, ...data.content];
                // this.tableData.sort((a, b) => {
                //   let aTime = new Date(a.DateTime);
                //   let bTime = new Date(b.DateTime);
                //   return bTime - aTime;
                // });
              } else {
                this.dialogForm.dip.dialogVisible = true;
                this.dialogForm.dip.Msg = data.msg;
              }
            });

            SaveIntactProduct(this.form, this.stringcode)
              .then(({ data }) => {
                if (data.Code == 200) {
                  this.dialogVisible = true;
                  setTimeout(() => {
                    this.dialogVisible = false;
                  }, 1000);
                  this.stringcode = "";
                  this.$message({
                    type: "success",
                    message: "保存成功!",
                  });
                } else {
                  this.dialogForm.product.dialogVisible = true;
                  this.dialogForm.product.Msg = data.Msg;
                  this.failPlay();
                }
                this.form.PcbSn = "";
              })
              .catch((err) => {
                this.dialogForm.product.dialogVisible = true;
                this.dialogForm.product.Msg = err;
                this.failPlay();
              });
          } else {
            this.failPlay();
            this.dialogForm.upDate.dialogVisible = true;
            this.dialogForm.upDate.Msg = "流程检查失败，缺少过站数据";
          }
        })
        .catch((err) => {
          this.failPlay();
          this.dialogForm.upDate.dialogVisible = true;
          this.dialogForm.upDate.Msg = err;
        });
    },
    handleKeyDown(event) {
      if (event.keyCode === 32) {
        event.preventDefault(); // 阻止默认的空格键行为（如滚动页面）
        // console.log(this.$refs.myButton);
        this.$refs.myButton.click(); // 触发按钮的点击事件
      }
    },
    generateGuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    },
    sortDate(a, b) {
      let aTime = new Date(a.DateTime);
      let bTime = new Date(b.DateTime);
      // console.log(aTime, bTime);
      return aTime - bTime;
    },
    sortChange({ column, prop, order }) {
      if (!order) {
        this.$refs.table.sort("DateTime", "ascending");
      }
    },
    getDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = ("0" + (now.getMonth() + 1)).slice(-2);
      const day = ("0" + now.getDate()).slice(-2);
      const hours = ("0" + now.getHours()).slice(-2);
      const minutes = ("0" + now.getMinutes()).slice(-2);
      const seconds = ("0" + now.getSeconds()).slice(-2);

      const formattedTime =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return formattedTime;
    },
    getScreenHeight() {
      this.$nextTick(() => {
        // console.log( window.innerHeight);
        this.tableHeight = window.innerHeight - 110;
        //后面的50：根据需求空出的高度，自行调整
      });
    },
    changeFocus() {
      if (!this.form.PcbSn.toLowerCase().startsWith("40502")) {
        this.$message.error("PCBA条码错误");
        return;
      }
      this.$refs.finishedProduct.focus();
    },
    failPlay() {
      this.$refs.fail.playAlert(); // 直接调用子组件的方法
    },
  },
};
</script>

<style lang="scss">
.left-box {
  // padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 152px);
}
.inbound .el-form-item__label {
  font-size: 20px;
}
.inbound .el-input__inner {
  font-size: 30px;
  font-weight: bolder;
}
.pass .el-dialog__body {
  padding: 0px;
  // padding-top: 5px;
  // padding-bottom: 5px;
  // margin-left: 20px;
  color: #fff;
  background: green;
  font-size: 150px;
  text-align: center;
}
.pass .el-dialog__header {
  padding: 0px;
}

.fail .el-dialog__body {
  padding: 0px;
  // padding-top: 5px;
  // padding-bottom: 5px;
  // margin-left: 20px;
  color: #fff;
  background: red;
  font-size: 150px;
  text-align: center;
}
.fail .el-dialog__header {
  padding: 0px;
}
.pass .el-dialog,
.fail .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pass .el-dialog .el-dialog__body,
.fail .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}

.dio-msg {
  font-size: 30px;
  color: red;
}
</style>
