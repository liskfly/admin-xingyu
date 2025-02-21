<template>
  <div id="data-view">
    <dv-loading v-if="!loading">Loading...</dv-loading>
    <div class="full-scrll" style="height: 100%" v-else="loading">
      <div class="title">
        <dv-decoration-10 class="dv-dec-10 decoration" />
        <dv-decoration-8 class="dv-dec-8 decoration decoration-center" />
        <div class="text decoration-center">
          <div style="margin: auto" @click="changedata()">
            星宇车灯电子二工厂AGV调度看板
          </div>
        </div>
        <dv-decoration-8
          class="dv-dec-8 transform decoration decoration-center"
        />
        <dv-decoration-10 class="dv-dec-10 transform decoration" />
      </div>
      <div class="chart">
        <dv-border-box-7 class="horizontal-bar-chart">
          <State></State>
        </dv-border-box-7>
        <dv-border-box-7 class="bar-chart">
          <Number></Number>
        </dv-border-box-7>
      </div>
      <div class="detail">
        <div
          class="detail-box"
          style="border: 1px solid yellow"
          v-for="item in machineData"
        >
          <img src="./img/agv.png" alt="" />
          <div class="detail-text">
            <div>线体:{{ item.lineNumber }}</div>
            <div>工单:{{ item.workOrder }}</div>
            <div>产品:{{ item.product }}</div>
            <div>状态:{{ returnStatus(item.status) }}</div>
            <div class="light">
              <div
                class="light-size"
                :class="returnClass(item.taskStatus1)"
              ></div>
              <div
                class="light-size"
                :class="returnClass(item.taskStatus2)"
              ></div>
            </div>
          </div>
        </div>
        <dv-border-Box-9 class="warning">
          <dv-scroll-board :config="config" style="width: 100%; height: 100%" />
        </dv-border-Box-9>
      </div>
    </div>
  </div>
</template>

<script>
import State from "./state.vue";
import Number from "./number.vue";
import { findKanBan } from "@/api/agvApi";
import { loading } from "@jiaminghi/data-view";
export default {
  // name: "DataView",
  components: {
    State,
    Number,
  },
  data() {
    return {
      DepartmentList: [],
      ProjectTeamList: [],
      originalDepartment: [],
      originalProjectTeam: [],
      yearList: [],
      config: {
        data: [
          ["异常报错1"],
          ["异常报错2"],
          ["异常报错3"],
          ["异常报错4"],
          ["异常报错5"],
          ["异常报错6"],
          ["异常报错7"],
          ["异常报错8"],
        ],
        oddRowBGC: "#00d5ff00",
        evenRowBGC: "#00d5ff00",
      },
      machineData: [
        {
          lineNumber: "Line1",
          workOrder: "",
          product: "",
          side: "",
          programName: null,
          deviceID: "",
          status: "0",
          taskID1: "",
          taskStatus1: "",
          taskID2: "",
          taskStatus2: "",
          ud_date: "",
          remark: null,
        },
        {
          lineNumber: "Line2",
          workOrder: "",
          product: "",
          side: "",
          programName: null,
          deviceID: "",
          status: "0",
          taskID1: "",
          taskStatus1: "",
          taskID2: "",
          taskStatus2: "",
          ud_date: "",
          remark: null,
        },
        {
          lineNumber: "Line3",
          workOrder: "",
          product: "",
          side: "",
          programName: null,
          deviceID: "",
          status: "0",
          taskID1: "",
          taskStatus1: "",
          taskID2: "",
          taskStatus2: "",
          ud_date: "",
          remark: null,
        },
        {
          lineNumber: "Line4",
          workOrder: "",
          product: "",
          side: "",
          programName: null,
          deviceID: "",
          status: "0",
          taskID1: "",
          taskStatus1: "",
          taskID2: "",
          taskStatus2: "",
          ud_date: "",
          remark: null,
        },
        {
          lineNumber: "Line5",
          workOrder: "",
          product: "",
          side: "",
          programName: null,
          deviceID: "",
          status: "0",
          taskID1: "",
          taskStatus1: "",
          taskID2: "",
          taskStatus2: "",
          ud_date: "",
          remark: null,
        },
        {
          lineNumber: "Line6",
          workOrder: "",
          product: "",
          side: "",
          programName: null,
          deviceID: "",
          status: "0",
          taskID1: "",
          taskStatus1: "",
          taskID2: "",
          taskStatus2: "",
          ud_date: "",
          remark: null,
        },
        {
          lineNumber: "Line7",
          workOrder: "",
          product: "",
          side: "",
          programName: null,
          deviceID: "",
          status: "0",
          taskID1: "",
          taskStatus1: "",
          taskID2: "",
          taskStatus2: "",
          ud_date: "",
          remark: null,
        },
      ],
      loading: false,
      intervalId: null,
    };
  },
  mounted() {
    this.getData();
    this.startLoop();
  },
  beforeDestroy() {
    this.stopLoop();
  },
  methods: {
    getData() {
      findKanBan().then((res) => {
        if (res.data.Success) {
          this.machineData = JSON.parse(res.data.Data);
        }
          setTimeout(() => {
            this.loading = true;
          }, 1000);
      });
    },
    returnStatus(num) {
      if (num === "0") {
        return "待叫料";
      } else if (num === "2") {
        return "叫料中";
      } else if (num === "3") {
        return "已取料";
      } else if (num === "22") {
        return "异常";
      } else if (num === "99") {
        return "已完成";
      }
    },
    returnClass(num) {
      if (num === "0") {
        return "purple";
      } else if (num === "2") {
        return "yellow";
      } else if (num === "22") {
        return "red";
      } else if (num === "99") {
        return "green";
      } else if (num === "3") {
        return "blue";
      } else {
        return "grey";
      }
    },
    changedata() {
      this.config = {
        data: [["异常报错1"], ["异常报错2"]],
        oddRowBGC: "#00d5ff00",
        evenRowBGC: "#00d5ff00",
      };
    },
    startLoop() {
      this.intervalId = setInterval(() => {
        this.getData();
      }, 10000); // Loop every second
    },
    stopLoop() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    },
  },
};
</script>

<style lang="scss">
#data-view {
  width: 100%;
  height: 100%;
  // background-color: #030409;
  color: #fff;

  .full-scrll {
    width: 100%;
    background-size: 100% 100%;
    // box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .mh-left {
      font-size: 20px;
      color: rgb(1, 134, 187);

      a:visited {
        color: rgb(1, 134, 187);
      }
    }

    .mh-middle {
      font-size: 30px;
    }

    .mh-left,
    .mh-right {
      width: 420px;
    }
  }

  .chart {
    width: 100%;
    padding: 0 20px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .horizontal-bar-chart {
      width: 49%;
      height: 330px;
    }
    .bar-chart {
      width: 49%;
      height: 330px;
    }
  }

  .warning {
    width: 1220px;
    height: 200px;
    padding: 15px;
    background-color: #00d5ff4d;
  }

  .detail {
    width: 100%;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .detail-box {
    width: 550px;
    height: 200px;
    padding: 5px;
    font-size: 22px;
    background-color: rgba(0, 213, 255, 0.3); /* 半透明白色背景 */
    backdrop-filter: blur(10px); /* 模糊滤镜 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
    margin-bottom: 10px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    img {
      width: 170px;
      height: 170px;
    }
  }

  .detail-text {
    height: 170px;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    // color: rgb(0, 183, 255);
    color: #fff;
    font-size: 1200;
    justify-content: space-between;
    .light {
      padding-left: 15px;
      display: flex;
      .light-size {
        width: 23px;
        height: 23px;
        margin-right: 15px;
        border-radius: 999px;
      }
      .yellow {
        background-color: yellow;
      }
      .blue {
        background-color: blue;
      }
      .green {
        background-color: rgb(0, 255, 0);
      }
      .red {
        background-color: red;
      }
      .purple {
        background-color: purple;
      }
      .grey {
        background-color: grey;
      }
    }
  }
}

.title {
  width: 100%;
  height: 80px;
  padding: 20px;
  display: flex;
  .transform {
    transform: rotateY(180deg);
  }

  .text {
    width: 500px;
    font-size: 30px;
    display: flex;
  }

  .decoration {
    width: calc((100% - 500px) / 4);
  }

  .decoration-center {
    padding-top: 20px;
  }
}

.ceil {
  color: red;
  font-size: 25px;
  font-weight: 900;
}
</style>
