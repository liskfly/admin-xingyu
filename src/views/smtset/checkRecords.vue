<template>
  <div class="checkRecord">
    <el-card class="box-card">
      <div class="table_header">
        <el-form ref="form" class="form" :inline="true" :model="getDataText">
          <el-form-item>
            <el-select v-model="inquire" placeholder="检查类型">
              <el-option
                v-for="item in inquireList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="getDataText.inspectType" placeholder="检查类型">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              ></el-option> </el-select
          ></el-form-item>
          <el-form-item v-show="inquire == 'order'">
            <el-input
              placeholder="请输入单号"
              clearable
              v-model="getDataText.inspect"
              class="input-with-select"
              @change="getData()"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="inquire != 'order'">
            <el-date-picker
              v-model="value1"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData()">查询</el-button>
          </el-form-item>
        </el-form>
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
          row-key="step1"
          style="width: 100%"
          :tree-props="{ children: 'stepItemList' }"
        >
          <el-table-column prop="InspectOrder" label="任务编号" width="180">
          </el-table-column>
          <el-table-column prop="Name" label="检验设备"> </el-table-column>
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
                <el-image
                  style="max-height: 70px; max-width: 70px; padding: 5px"
                  :src="item"
                  :preview-src-list="[item]"
                >
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

          <el-table-column prop="Remark" label="备注"> </el-table-column>
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
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCheckResults } from "@/api/all";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      getDataText: {
        inspectType: "",
        inspect: "",
        dateStart: "",
        dateEnd: "",
      },
      typeList: [
        {
          lable: "首检",
          value: "WI",
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
          value: "FI",
        },
      ],
      inquire: "order",
      inquireList: [
        {
          lable: "单号",
          value: "order",
        },
        {
          lable: "时间",
          value: "times",
        },
      ],
      value1: [],
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
      }
      if (value != value1) {
        this.getDataText.inspectType = "";
      }
    },
    "getDataText.inspectType"(value) {
      if (value == "WI" && this.inquire != "times") {
        this.getDataText.inspect = "XYFI";
      }
      if (value == "FI" && this.inquire != "times") {
        this.getDataText.inspect = "XYWI";
      }
      if (value == "EI" && this.inquire != "times") {
        this.getDataText.inspect = "XYEI";
      }
      if (value == "RI" && this.inquire != "times") {
        this.getDataText.inspect = "XYRI";
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      // console.log( window.innerHeight);
      this.tableHeight = window.innerHeight - 300;
      //后面的50：根据需求空出的高度，自行调整
    });
  },
  methods: {
    getData() {
      getCheckResults(this.getDataText).then((res) => {
        // console.log(res.data.DetailList);
        this.dataProcessing(res.data.DetailList);
      });
    },
    dataProcessing(data) {
      let a = [];
      data.forEach((item, i) => {
        let isExist = a.findIndex(
          (ela) => ela.InspectOrder == item.InspectOrder
        );
        if (isExist != -1) {
          let b = a[isExist].stepItemList.findIndex((t) => t.Name == item.Name);
          if (b == -1) {
            let Attachment = [];
            if (item.Attachment1) {
              Attachment.push(item.Attachment1);
            }
            if (item.Attachment2) {
              Attachment.push(item.Attachment2);
            }
            if (item.Attachment3) {
              Attachment.push(item.Attachment3);
            }
            if (item.Attachment4) {
              Attachment.push(item.Attachment4);
            }
            a[isExist].stepItemList.push({
              Name: item.Name,
              Step: item.Step,
              Status: item.Status,
              Remark: item.Remark,
              Attachment: Attachment,
              InspectContent: item.InspectContent,
              step1: item.InspectOrder + "-" + item.Step,
            });
            // console.log(a[isExist].stepItemList.Attachment);
          }
          //   if (b != -1) {
          //     a[isExist].stepItemList[b].stepItemList.push({
          //       ...item,
          //       step1:
          //         item.InspectOrder +
          //         "-" +
          //         item.Step +
          //         "-" +
          //         (a[isExist].stepItemList[b].stepItemList.length + 1),
          //     });
          //   } else {
          //     a[isExist].stepItemList.push({
          //       Name: item.Name,
          //       Step: item.Step,
          //       Status: item.Status,
          //       InspectContent: item.InspectContent,
          //       step1: item.InspectOrder + "-" + item.Step,
          //       stepItemList: [
          //         {
          //           ...item,
          //           step1:
          //             item.InspectOrder + "-" + item.Step + "-" + (isExist + 1),
          //         },
          //       ],
          //     });
          //   }
        } else {
          let obj = {
            InspectOrder: item.InspectOrder,
            step1: item.InspectOrder,
            stepItemList: [
              {
                Name: item.Name,
                InspectContent: item.InspectContent,
                Step: item.Step,
                Status: item.Status,
                Remark: item.Remark,
                Attachment: [],
                step1: item.InspectOrder + "-" + item.Step,
                // stepItemList: [],
              },
            ],
          };
          if (item.Attachment1) {
            obj.stepItemList[0].Attachment.push(item.Attachment1);
          }
          if (item.Attachment2) {
            obj.stepItemList[0].Attachment.push(item.Attachment2);
          }
          if (item.Attachment3) {
            obj.stepItemList[0].Attachment.push(item.Attachment3);
          }
          if (item.Attachment4) {
            obj.stepItemList[0].Attachment.push(item.Attachment4);
          }

          a.push(obj);
        }
      });
      this.tableData = a;
      console.log(a);
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
  },
};
</script>

<style lang="scss" scoped>
.checkRecord {
  padding: 20px;
  .table_header {
    // padding-bottom: 20px;
    // display: flex;
    // gap: 30px;
    // justify-content: flex-end;
    // align-items: center;
    // .input_box {
    //   width: 400px;
    // }
    .form {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
