<template>
  <div class="w-full h-full">
    <div class="flex flex-col w-full">
      <div class="title">
        <dv-decoration-10 class="dv-dec-10 decoration" :color="['#40a0ffb8']" />
        <dv-decoration-8 class="dv-dec-8 decoration decoration-center" :color="['#40a0ffb8', '#40a0ffb8']" />
        <div class="text decoration-center">
          <div style="margin: auto" class="text-white flex items-center">
            <span>电子二工厂 工厂看板 </span>
          </div>
        </div>
        <dv-decoration-8 class="dv-dec-8 transform decoration decoration-center" :color="['#40a0ffb8', '#40a0ffb8']" />
        <dv-decoration-10 class="dv-dec-10 transform decoration" :color="['#40a0ffb8']" />

        <div class="text-white flex justify-end timetext" style="font-size: 24px">
          <span class="pr-5">{{ currentTime }}</span>
        </div>
      </div>
      <div class="pt-2">
        <el-row :gutter="5">
          
          <el-col :span="6" :offset="0">

            <dv-border-box-12 class="centerh">
              <div class="header_title">
                <i class="fa fa-tasks"></i> 周完成率
              </div>
              <div>
                <weekPassRate />
              </div>
            </dv-border-box-12>
          </el-col>
        
          <el-col :span="6" :offset="0">
            <dv-border-box-12 class="centerh">
              <div class="header_title">
                <i class="fa fa-check-circle"></i>月完成率
              </div>
              <div>
                <monthPassRate />
              </div>
            </dv-border-box-12>
          </el-col>
            <el-col :span="12" :offset="0">
            <dv-border-box-12 class="centerh">
              <div class="w-full header_title flex items-center justify-between">
                <div class="flex items-center"><i class="fa fa-check-circle"></i> OEE </div>
                <div>{{ ' 总OEE' + (allOee * 100).toFixed(0) + '%' }}</div>
              </div>
              <div>
                <oeeChart @update-data="handleDataFromChild" />
                <!-- <dayChart /> -->
              </div>
            </dv-border-box-12>
          </el-col>
        </el-row>



      </div>
      <div>
        <dv-border-box-12 class="centerh1">
          <div class="header_title">
            <i class="fa fa-check-circle"></i> 日生产工单
          </div>
          <div>
            <dayChart />
          </div>
        </dv-border-box-12>
      </div>

    </div>
  </div>
</template>

<script>
import dayChart from "./dayChart.vue";
import monthPassRate from "./monthPassRate.vue";
import weekPassRate from "./weekPassRate.vue";
import oeeChart from "./oeeChart.vue";
export default {
  components: {
    weekPassRate,
    monthPassRate,
    dayChart,
    oeeChart
  },
  data() {
    return {
      currentTime: "", // 用于存储当前时间
      refreshCountdown: 60,
      lastUpdatedTime: "",
      dataRefreshInterval: null,
      countdownInterval: null,
      allOee:0
    };
  },
  beforeMount() {
    const savedLine = localStorage.getItem("LINEkANBAN");
    if (savedLine) {
      this.line = savedLine; // 如果有保存的线，使用它
    }
  },
  mounted() {
    this.updateTime();
    // this.getData();
    setInterval(this.updateTime, 1000);
    // 设置数据刷新定时器（每分钟一次）
    // this.setDataRefreshInterval();

    // // 设置倒计时定时器
    // this.countdownInterval = setInterval(() => {
    //   this.refreshCountdown -= 1;
    //   if (this.refreshCountdown <= 0) {
    //     this.refreshCountdown = 60;
    //   }
    // }, 1000);
  },
  beforeDestroy() {
    // 清除定时器
    if (this.dataRefreshInterval) {
      clearInterval(this.dataRefreshInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },
  methods: {
    handleDataFromChild(data) {
      this.allOee = data;
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "short",
        hour12: false,
      });
    },
    handleCommand(command) {
      this.line = command; // 更新选中的线
      this.changeLine(command); // 调用处理函数
    },
    changeLine(val) {
      localStorage.setItem("LINEkANBAN", val);
      this.getData();
      // 重置刷新倒计时
      this.refreshCountdown = 60;

      // 重新设置数据刷新定时器
      this.setDataRefreshInterval();
    },
    getData() {
      GetReport_LineCurrentWo({ line: this.line }).then((res) => {
        if (res.Success) {
          this.lineData = res.Data[0]
        }
      });
    },
    setDataRefreshInterval() {
      // 清除现有的定时器
      if (this.dataRefreshInterval) {
        clearInterval(this.dataRefreshInterval);
      }

      // 设置新的定时器（每分钟一次）
      this.dataRefreshInterval = setInterval(() => {
        this.getData();
      }, 60000); // 60秒 = 60000毫秒
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 10px 0;
  padding: 15px 20px;
  background: rgba(16, 33, 68, 0.7);
  border-radius: 8px;
  border: 2px solid rgba(64, 160, 255, 0.723);
  box-shadow: 0 0 20px rgba(0, 100, 255, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.info-item {
  background: rgba(16, 33, 68, 0.5);
  padding: 10px 15px;
  border-radius: 6px;
  border-left: 3px solid #40a9ff;
}

.info-item:first-child {
  border-left: none;
}

.info-label {
  font-size: 24px;
  color: #8ac6ff;
  margin-bottom: 5px;
}

.info-value {
  font-size: 30px;
  font-weight: bold;
  color: #ffffff;
}

.centerh {
  display: flex;
  flex-direction: column;
  padding: 15px;
  height: 480px;
  font-size: 22px;
  font-weight: bolder;
  color: #8ac6ff;
  background-color: rgba(16, 33, 68, 0.7);

  .header_title {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgb(64, 160, 255);
  }
}

.centerh1 {
  display: flex;
  flex-direction: column;
  padding: 15px;
  height: 500px;
  font-size: 22px;
  font-weight: bolder;
  color: #8ac6ff;
  background-color: rgba(16, 33, 68, 0.7);

  .header_title {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgb(64, 160, 255);
  }
}

.el-dropdown-link {
  color: #ffffff;
  font-size: 32px;
}

.test-dropdown {
  background: #05162f !important;
  border: 1px solid #4472cb !important;
}

.el-dropdown-menu__item {
  color: #47c4ff !important;
  background: #05162f !important;

  &:hover {
    background-color: #4472cb !important;
    color: #b2dde9 !important;
  }

  &:not(.is-disabled):focus {
    background-color: #4472cb !important;
    color: #b2dde9 !important;
  }
}

.popper__arrow {
  border-color: #4472cb !important;

  &::after {
    border-top-color: #46bcff !important;
    border-bottom-color: #46bcff !important;
  }
}

.timetext {
  position: absolute;
  top: 45px;
  right: 10px;
}

.custom-select-wrapper {
  position: relative;
  width: 120px;
  // margin: 15px 0;
}

.custom-select {
  width: 100%;

  font-size: 2rem;
  color: #ffffff;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;
}

.custom-select:hover {
  border-color: #5a8cff;
}

.custom-select:focus {
  border-color: #5a8cff;
  box-shadow: 0 0 5px rgba(71, 196, 255, 0.5);
}

.custom-select-wrapper::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 5px;

  // left: 10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #fff;
  pointer-events: none;
}

/* 选项样式 */
.custom-select option {
  background-color: #05162f;
  color: #47c4ff;
  font-size: 1rem;
  border: none;
  text-align: center;

}


.custom-select option:hover,
.custom-select option:focus,
.custom-select option:checked {
  background-color: #4472cb !important;
  color: #fff !important;
  border: none;
}
</style>