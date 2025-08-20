<template>
  <div class="p-2">
    <el-card class="box-card" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="form" class="form" :inline="true" :model="getDataText" size="medium">
          <el-form-item class="mb-2">
            <el-select v-model="getDataText.inspectType" placeholder="检查类型">
              <el-option v-for="item in typeList" :key="item.value" :label="item.lable" :value="item.value"></el-option>
            </el-select></el-form-item>
          <el-form-item class="mb-2">
            <el-select v-model="inquire" placeholder="检查类型">
              <el-option v-for="item in inquireList" :key="item.value" :label="item.lable" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-show="inquire == 'order'" class="mb-2">
            <el-input placeholder="请输入任务编号" clearable v-model="getDataText.inspect" class="input-with-select"
              @change="getData()">
              <!-- <template slot="prepend">{{ headerType }}</template> -->
            </el-input>
          </el-form-item>
          <el-form-item v-show="inquire != 'order'" class="mb-2">
            <!-- <el-date-picker
              v-model="value1"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker> -->
            <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']" :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <el-table :data="tableData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
          " border :height="tableHeight" row-key="step1" style="width: 100%" :tree-props="{ children: 'stepItemList' }"
          size="small">
          <el-table-column prop="InspectOrder" label="任务编号" width="180">
          </el-table-column>
          <el-table-column prop="Name" label="检验设备"> </el-table-column>
          <el-table-column prop="InspectStatus" label="状态">
            <template slot-scope="scope" v-if="scope.row.InspectStatus">
              <el-tag :type="resultTag1(scope.row.InspectStatus)" effect="plain">{{
                resultText1(scope.row.InspectStatus)
              }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="Status" label="检查结果">
            <template slot-scope="scope" v-if="scope.row.Status">
              <el-tag :type="resultTag(scope.row.Status)" effect="dark">{{
                resultText(scope.row.Status)
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Attachment" label="记录图片">
            <template slot-scope="scope">
              <span v-for="(item, i) in scope.row.Attachment" :key="i">
                <el-image style="max-height: 70px; max-width: 70px; padding: 5px" :src="item"
                  :preview-src-list="[item]">
                </el-image>
                <!-- <el-popover placement="left" trigger="click" width="300">
                  <img :src="item" width="100%" />
                  <img
                    slot="reference"
                    :src="item"
                    :alt="item"
                    style="max-height: 70px; max-width: 70px; padding: 5px"
                  />
                </el-popover> -->
              </span>
            </template>
          </el-table-column>
             <el-table-column prop="SubItemSolution" label="检查实际值" v-if="getDataText.inspectType=='WI'"> </el-table-column>
               <el-table-column prop="SubItemBasic" label="单位" v-if="getDataText.inspectType=='WI'"> </el-table-column>
          <el-table-column prop="Remark" label="备注"> </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
          <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCheckResults } from "@/api/all";
import {
  shortcuts,
  disabledDate,
  setTodayDate,
  setLastDate,
} from "@/utils/dataMenu";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      getDataText: {
        inspectType: "EI",
        inspect: "*",
        dateStart: "",
        dateEnd: "",
      },
      typeList: [
        {
          lable: "首检",
          value: "FI",
        },
        {
          lable: "巡检",
          value: "RI",
        },
        {
          lable: "设备点检",
          value: "EI",
        },
        {
          lable: "工艺参数点检",
          value: "WI",
        },
      ],
      inquire: "times",
      inquireList: [
        {
          lable: "任务编号",
          value: "order",
        },
        {
          lable: "时间",
          value: "times",
        },
      ],
      value1: [],
      headerType: "XYEI",
      pickerOptions: {
        shortcuts: shortcuts,
      }
    };
  },
  created() {
    // this.getData();
  },
  watch: {
    value1(value) {
      this.getDataText.dateStart = value[0];
      this.getDataText.dateEnd = value[1];
    },
    inquire(value, value1) {
      if (value == "times") {
        this.getDataText.inspect = "*";
      } else {

        this.getDataText.inspect = "";
        if (this.getDataText.inspectType == "WI") {
          this.headerType = "XYWI"
          this.getDataText.inspect = "XYWI";
        }
        if (this.getDataText.inspectType == "FI") {
          this.headerType = "XYFI"
          this.getDataText.inspect = "XYFI";
        }
        if (this.getDataText.inspectType == "EI") {
          this.headerType = "XYEI"
          this.getDataText.inspect = "XYEI";
        }
        if (this.getDataText.inspectType == "RI") {
          this.headerType = "XYRI"
          this.getDataText.inspect = "XYRI";
        }
      }
    },
    "getDataText.inspectType"(value,oval) {
      this.value1 = [];
      if(value!=oval){
// console.log(11);
 this.tableData =[]

      }
      if (value == "WI" && this.inquire != "times") {
        this.getDataText.inspect = "XYWI";
      }
      if (value == "FI" && this.inquire != "times") {
        this.getDataText.inspect = "XYFI";
      }
      if (value == "EI" && this.inquire != "times") {
        this.getDataText.inspect = "XYEI";
      }
      if (value == "RI" && this.inquire != "times") {
        this.getDataText.inspect = "XYRI";
      }
    },
  },
  beforeMount() {
    this.getScreenHeight();
    this.value1 = [setLastDate(), setTodayDate()];
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
   },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      this.startLoading()
      getCheckResults(this.getDataText).then((res) => {
        this.endLoading()
        // console.log(res.data.DetailList);
        if (res.data.Status == "OK") {
          this.dataProcessing(res.data.DetailList);
        } else {
          this.$alert(res.data.Message, "提示信息", {
            confirmButtonText: "确定",
          });
        }
      }).catch((msg) => {
        this.$alert(msg, "提示信息", {
          confirmButtonText: "确定",
        });
      })
    },
    // dataProcessing(data) {
    //   let a = [];
    //   data.forEach((item, i) => {
    //     let isExist = a.findIndex(
    //       (ela) => ela.InspectOrder == item.InspectOrder
    //     );
    //     if (isExist != -1) {
    //       let b = a[isExist].stepItemList.findIndex((t) => t.Name == item.Name);
    //       if (b == -1) {
    //         let Attachment = [];
    //         if (item.Attachment1) {
    //           Attachment.push(item.Attachment1);
    //         }
    //         if (item.Attachment2) {
    //           Attachment.push(item.Attachment2);
    //         }
    //         if (item.Attachment3) {
    //           Attachment.push(item.Attachment3);
    //         }
    //         if (item.Attachment4) {
    //           Attachment.push(item.Attachment4);
    //         }
    //         a[isExist].stepItemList.push({
    //           Name: item.Name,
    //           Step: item.Step,
    //           Status: item.Status,
    //           Remark: item.Remark,
    //           Attachment: Attachment,
    //           InspectContent: item.InspectContent,
    //           step1: item.InspectOrder + "-" + item.Step,
    //         });
    //         // console.log(a[isExist].stepItemList.Attachment);
    //       }

    //     } else {
    //       let obj = {
    //         InspectOrder: item.InspectOrder,
    //         step1: item.InspectOrder,
    //         stepItemList: [
    //           {
    //             Name: item.Name,
    //             InspectContent: item.InspectContent,
    //             Step: item.Step,
    //             Status: item.Status,
    //             Remark: item.Remark,
    //             Attachment: [],
    //             step1: item.InspectOrder + "-" + item.Step,
    //             // stepItemList: [],
    //           },
    //         ],
    //       };
    //       if (item.Attachment1) {
    //         obj.stepItemList[0].Attachment.push(item.Attachment1);
    //       }
    //       if (item.Attachment2) {
    //         obj.stepItemList[0].Attachment.push(item.Attachment2);
    //       }
    //       if (item.Attachment3) {
    //         obj.stepItemList[0].Attachment.push(item.Attachment3);
    //       }
    //       if (item.Attachment4) {
    //         obj.stepItemList[0].Attachment.push(item.Attachment4);
    //       }

    //       a.push(obj);
    //     }
    //   });
    //   this.tableData = a;
    // },
    dataProcessing(data) {
      const resultMap = new Map();

      data.forEach(item => {
        const { InspectOrder, Name, Step, Status, Remark, InspectContent,InspectStatus,SubItemSolution ,SubItemBasic} = item;

        // 处理附件数组（优化点1：动态处理任意数量的附件）
        const attachments = [];
        for (let i = 1; i <= 4; i++) {
          const attachment = item[`Attachment${i}`];
          if (attachment) attachments.push(attachment);
        }

        // 主处理逻辑
        if (resultMap.has(InspectOrder)) {
          const group = resultMap.get(InspectOrder);
          const itemExists = group.stepItemList.some(el => el.Name === Name);

          if (!itemExists) {
            group.stepItemList.push({
              Name,
              Step,
              Status,
              Remark,
              Attachment: attachments,
              InspectContent,
              SubItemSolution,
              SubItemBasic,
              step1: `${InspectOrder}-${Step}`
            });
          }
        } else {
          resultMap.set(InspectOrder, {
            InspectOrder,
            step1: InspectOrder,
            InspectStatus:InspectStatus,
            stepItemList: [{
              Name,
              Step,
              Status,
              Remark,
              Attachment: attachments,
              InspectContent,
              SubItemSolution,
              SubItemBasic,
              step1: `${InspectOrder}-${Step}`
            }]
          });
        }
      });

      this.tableData = Array.from(resultMap.values());
    },
    resultText(value) {
      let text = "";
      switch (value) {
        case "0":
          text = "未检查";
          break;
        case "9":
          text = "正常";
          break;
        case "1":
          text = "NG";
          break;
        case "2":
          text = "报修";
          break;
        case "3":
          text = "故障";
          break;
      }
      return text;
    },
    resultTag(value) {
      let text = "";
      switch (value) {
        case "0":
          text = "";
          break;
        case "9":
          text = "success";
          break;
        case "1":
          text = "danger";
          break;
        case "2":
          text = "warning";
          break;
        case "3":
          text = "info";
          break;
      }
      return text;
    },
    resultText1(value) {
      let text = "";
      switch (value) {
        case "C":
          text = "已检验";
          break;
        case "D":
          text = "已删除";
          break;
        case "P":
          text = "进行中";
          break;
        case "I":
          text = "未开始";
          break;

      }
      return text;
    },
    resultTag1(value) {
      let text = "";
      switch (value) {

        case "C":
          text = "success";
          break;
        case "D":
          text = "danger";
          break;
        case "P":
          text = "warning";
          break;
        case "I":
          text = "info";
          break;
      }
      return text;
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
        this.tableHeight = window.innerHeight - 210;
        //后面的50：根据需求空出的高度，自行调整
      });
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
  },
};
</script>

<style lang="scss" scoped>
.checkRecord {
  padding: 8px;

  .table_header {
    .form {
      display: flex;
      justify-content: space-between;

    }
  }

  .form_Bottom {
    margin-bottom: 10px;
  }
}
</style>
