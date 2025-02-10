<template>
    <div id="data-view">
      <div class="full-scrll" style="height: 100%">
        <div class="main-header">
          <div class="mh-left"></div>
          <div class="mh-middle">星宇车灯电子二工厂AGV调度看板</div>
          <div class="mh-right">
          </div>
        </div>
        <div style="width: 100%;display: flex;justify-content: space-between;flex-wrap: wrap;margin-top: 10px;">
            <div style="width: 400px;height: 150px;background-color: white;margin-bottom: 10px;border-radius: 15px;" v-for="item in 9">{{ item }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
//   import leftTop from './leftTop.vue';
//   import leftBottom from './leftBottom.vue';
//   import rightTop from './rightTop.vue';
//   import rightBottom from './rightBottom.vue';
//   import { OrganizationalInfor, AggregateStatistics, StatisticalYearWork } from "@/api/test";
  export default {
    // name: "DataView",
    // components: {
    //   leftTop,
    //   leftBottom,
    //   rightBottom,
    //   rightTop
    // },
    data() {
      return {
        DepartmentList: [],
        ProjectTeamList: [],
        originalDepartment: [],
        originalProjectTeam: [],
        yearList:[]
      };
    },
    mounted() {
        // this.getChoiceList();
        // this.getYear();
    },
    methods:{
      getChoiceList() {
        OrganizationalInfor().then((res) => {
          if (res.data && res.data.success) {
              console.log(res);
            this.DepartmentList = res.data.content.DepartmentList.map((item) => {
              return item.Departmentitem
            })
            this.ProjectTeamList = res.data.content.ProjectTeamList.map((item) => {
              return item.ProjectTeamitem
            })
            this.DepartmentList.unshift('请选择');
            this.ProjectTeamList.unshift('请选择');
            this.originalDepartment = res.data.content.DepartmentList;
            this.originalProjectTeam = res.data.content.ProjectTeamList;
          }
        });
      },
      getYear() {
        StatisticalYearWork().then((res) => {
          if (res.data && res.data.success) {
            this.yearList = res.data.content.map((item) => {
              return item.submit_year
            })
          }
        })
      }
    }
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
  
    .main-con {
      // height: calc(~"100% - 200px");
      height: 100%;
      display: flex;
  
      .left {
        box-sizing: border-box;
        height: 100%;
        width: 35%;
        padding: 1rem;
  
        .leftTop {
          height: 50%;
          width: 100%;
        }
  
        .leftBottom {
          height: 50%;
          width: 100%;
        }
      }
  
      .right {
        box-sizing: border-box;
        height: 100%;
        width: 65%;
        padding: 1rem;
        // background-color: cornsilk;
  
        .rightTop {
          height: 50%;
          width: 100%;
        }
  
        .rightBottom {
          height: 50%;
          width: 100%;
        }
      }
    }
  
    .left-chart-container {
      width: 22%;
      padding: 10px;
      box-sizing: border-box;
  
      .border-box-content {
        flex-direction: column;
      }
    }
  
    .right-main-container {
      width: 78%;
      padding-left: 5px;
      box-sizing: border-box;
    }
  
    .rmc-top-container {
      height: 65%;
      display: flex;
    }
  
    .rmctc-left-container {
      width: 65%;
    }
  
    .rmctc-right-container {
      width: 35%;
    }
  
    .rmc-bottom-container {
      height: 35%;
    }
  
    .rmctc-chart-1,
    .rmctc-chart-2 {
      height: 50%;
    }
  }
  </style>
  