<template>
  <div id="data-view">
    <div class="full-scrll" style="height: 100%">
      <div class="title">
        <dv-decoration-10 class="dv-dec-10 decoration" />
        <dv-decoration-8 class="dv-dec-8 decoration decoration-center" />
        <div class="text decoration-center">
          <div style="margin: auto" @click="changedata()">星宇车灯电子二工厂AGV调度看板</div>
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
        <div class="detail-box" style="border: 1px solid yellow">
          <img src="./img/agv.png" alt="" />
          <div class="detail-text">
            <div>线体:Line1</div>
            <div>工单:W523467042606456_A</div>
            <div>产品:542656345665465</div>
            <div>状态:已完成</div>
            <div class="light">
              <div class="light-left"></div>
              <div class="light-right"></div>
            </div>
          </div>
        </div>
        <div class="detail-box" style="border: 1px solid greenyellow">
          <img src="./img/agv.png" alt="" />
          <div class="detail-text">
            <div>线体:Line1</div>
            <div>工单:W523467042606456_A</div>
            <div>产品:542656345665465</div>
            <div>状态:已完成</div>
            <div class="light">
              <div class="light-left"></div>
              <div class="light-right"></div>
            </div>
          </div>
        </div>
        <div class="detail-box" style="border: 1px solid red">
          <img src="./img/agv.png" alt="" />
          <div class="detail-text">
            <div>线体:Line1</div>
            <div>工单:W523467042606456_A</div>
            <div>产品:542656345665465</div>
            <div>状态:已完成</div>
            <div class="light">
              <div class="light-left"></div>
              <div class="light-right"></div>
            </div>
          </div>
        </div>
        <div class="detail-box" style="border: 1px solid yellow">
          <img src="./img/agv.png" alt="" />
          <div class="detail-text">
            <div>线体:Line1</div>
            <div>工单:W523467042606456_A</div>
            <div>产品:542656345665465</div>
            <div>状态:已完成</div>
            <div class="light">
              <div class="light-left"></div>
              <div class="light-right"></div>
            </div>
          </div>
        </div>
        <div class="detail-box" style="border: 1px solid greenyellow">
          <img src="./img/agv.png" alt="" />
          <div class="detail-text">
            <div>线体:Line1</div>
            <div>工单:W523467042606456_A</div>
            <div>产品:542656345665465</div>
            <div>状态:已完成</div>
            <div class="light">
              <div class="light-left"></div>
              <div class="light-right"></div>
            </div>
          </div>
        </div>
        <div class="detail-box" style="border: 1px solid red">
          <img src="./img/agv.png" alt="" />
          <div class="detail-text">
            <div>线体:Line1</div>
            <div>工单:W523467042606456_A</div>
            <div>产品:542656345665465</div>
            <div>状态:已完成</div>
            <div class="light">
              <div class="light-left"></div>
              <div class="light-right"></div>
            </div>
          </div>
        </div>
        <div class="detail-box" style="border: 1px solid yellow">
          <img src="./img/agv.png" alt="" />
          <div class="detail-text">
            <div>线体:Line1</div>
            <div>工单:W523467042606456_A</div>
            <div>产品:542656345665465</div>
            <div>状态:已完成</div>
            <div class="light">
              <div class="light-left"></div>
              <div class="light-right"></div>
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
//   import { OrganizationalInfor, AggregateStatistics, StatisticalYearWork } from "@/api/test";
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
        oddRowBGC:'#00d5ff00',
        evenRowBGC:'#00d5ff00'
      },
    };
  },
  mounted() {
    // this.getChoiceList();
    // this.getYear();
  },
  methods: {
    getChoiceList() {
      OrganizationalInfor().then((res) => {
        if (res.data && res.data.success) {
          console.log(res);
          this.DepartmentList = res.data.content.DepartmentList.map((item) => {
            return item.Departmentitem;
          });
          this.ProjectTeamList = res.data.content.ProjectTeamList.map(
            (item) => {
              return item.ProjectTeamitem;
            }
          );
          this.DepartmentList.unshift("请选择");
          this.ProjectTeamList.unshift("请选择");
          this.originalDepartment = res.data.content.DepartmentList;
          this.originalProjectTeam = res.data.content.ProjectTeamList;
        }
      });
    },
    getYear() {
      StatisticalYearWork().then((res) => {
        if (res.data && res.data.success) {
          this.yearList = res.data.content.map((item) => {
            return item.submit_year;
          });
        }
      });
    },
    changedata() {
      this.config = {
        data: [
          ["异常报错1"],
          ["异常报错2"]
        ],
      }
    }
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
      .light-left {
        width: 23px;
        height: 23px;
        border-radius: 999px;
        background-color: red;
      }
      .light-right {
        width: 23px;
        height: 23px;
        margin-left: 15px;
        border-radius: 999px;
        background-color: red;
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
  font-size: 20px;
}
</style>
