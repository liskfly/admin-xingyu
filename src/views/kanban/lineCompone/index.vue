<template>
  <div class="w-full h-full">
    <div class="flex flex-col w-full">
      <div class="title">
        <dv-decoration-10 class="dv-dec-10 decoration" :color="['#40a0ffb8']" />
        <dv-decoration-8
          class="dv-dec-8 decoration decoration-center"
          :color="['#40a0ffb8', '#40a0ffb8']"
        />
        <div class="text decoration-center">
          <div style="margin: auto" class="text-white flex items-center">
            <span>星宇车灯电子二工厂 </span>
            <div class="custom-select-wrapper">
              <select
                id="customSelect"
                class="custom-select"
                v-model="line"
                @change="handleCommand(line)"
              >
                <option
                  v-for="item in options"
                  :value="item.value"
                  :key="item.value"
                >
                  <span class="text-center">{{ item.label }}</span>
                </option>
              </select>
            </div>
          </div>
        </div>
        <dv-decoration-8
          class="dv-dec-8 transform decoration decoration-center"
          :color="['#40a0ffb8', '#40a0ffb8']"
        />
        <dv-decoration-10
          class="dv-dec-10 transform decoration"
          :color="['#40a0ffb8']"
        />

        <div
          class="text-white flex justify-end timetext"
          style="font-size: 24px"
        >
          <span class="pr-5">{{ currentTime }}</span>
        </div>
      </div>

      <div class="h-32 dashboard-header" v-if="!isVertical">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">生产工单</div>
            <div class="info-value">{{ lineData.OrderName || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品编码</div>
            <div class="info-value">{{ lineData.ProductNO || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品</div>
            <div class="info-value">{{ lineData.ProductDsc || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label text-center">面别</div>
            <div class="info-value text-center">{{ lineData.Side || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">计划开始时间</div>
            <div class="info-value">{{ lineData.PlannedStartTime || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">计划结束时间</div>
            <div class="info-value">{{ lineData.PlannedFinishTime || "" }}</div>
          </div>
        </div>
      </div>
      <div class="h-64 dashboard-header-vertical" v-if="isVertical">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">生产工单</div>
            <div class="info-value">{{ lineData.OrderName || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品编码</div>
            <div class="info-value">{{ lineData.ProductNO || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品</div>
            <div class="info-value">{{ lineData.ProductDsc || "" }}</div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">面别</div>
            <div class="info-value">{{ lineData.Side || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">计划开始时间</div>
            <div class="info-value">{{ lineData.PlannedStartTime || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">计划结束时间</div>
            <div class="info-value">{{ lineData.PlannedFinishTime || "" }}</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col" v-if="isVertical">
        <div class="flex" style="gap: 15px">
          <dv-border-box-13 class="centerh centerh-vertical">
            <div class="header_title">
              <i class="fa fa-tasks"></i> 当前工单完成率
            </div>
            <div>
              <completion :Line="line" :rateHeight="rateHeight" />
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh centerh-vertical">
            <div class="header_title">
              <i class="fa fa-check-circle"></i> SPI直通率
            </div>
            <div>
              <spiPassRate :Line="line" :rateHeight="rateHeight" />
            </div>
          </dv-border-box-13>
        </div>
        <div class="flex" style="gap: 15px">
          <dv-border-box-13 class="centerh centerh-vertical">
            <div class="header_title">
              <i class="fa fa-search"></i> AOI直通率
            </div>
            <div>
              <aoiPassRate :Line="line" :rateHeight="rateHeight" />
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh centerh-vertical">
            <div class="header_title">
              <i class="fa fa-exclamation-triangle"></i> 不良数分布
            </div>
            <div>
              <badPassRate :Line="line" :rateHeight="rateHeight" />
            </div>
          </dv-border-box-13>
        </div>
        <div>
          <dv-border-box-12 class="centerh1 centerh1-vertical">
            <div class="header_title">
              <i class="fa fa-bar-chart"></i>贴片机单小时产能<span style="color:  #F39C12;font-size: 24px;">（12小时）</span>
            </div>
            <div>
              <capacityChart :Line="line" :barHeight="barHeight" />
            </div>
          </dv-border-box-12>
        </div>
        <div>
          <dv-border-box-12 class="centerh1 centerh1-vertical">
            <div class="header_title">
              <i class="fa fa-bar-chart"></i> 抛料<span style="color: #ff0000;font-size: 24px;">TOP10</span>
            </div>
            <div>
              <throwMChart :Line="line" :barHeight="barHeight" />
            </div>
          </dv-border-box-12>
        </div>
      </div>

      <div class="flex flex-col" v-if="!isVertical">
        <div class="flex" style="gap: 15px">
          <dv-border-box-13 class="centerh">
            <div class="header_title">
              <i class="fa fa-tasks"></i> 当前工单完成率
            </div>
            <div>
              <completion :Line="line" :rateHeight="rateHeight" />
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh">
            <div class="header_title">
              <i class="fa fa-check-circle"></i> SPI直通率
            </div>
            <div>
              <spiPassRate :Line="line" :rateHeight="rateHeight" />
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh">
            <div class="header_title">
              <i class="fa fa-search"></i> AOI直通率
            </div>
            <div>
              <aoiPassRate :Line="line" :rateHeight="rateHeight" />
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh">
            <div class="header_title">
              <i class="fa fa-exclamation-triangle"></i> 不良数分布
            </div>
            <div>
              <badPassRate :Line="line" :rateHeight="rateHeight" />
            </div>
          </dv-border-box-13>
        </div>
        <div class="flex" style="gap: 15px">
          <dv-border-box-12 class="centerh1">
            <div class="header_title">
              <i class="fa fa-bar-chart"></i> 贴片机单小时产能<span style="color: #F39C12;font-size: 24px;">（12小时）</span>
            </div>
            <div>
              <capacityChart :Line="line" :barHeight="barHeight" />
            </div>
          </dv-border-box-12>
          <dv-border-box-12 class="centerh1">
            <div class="header_title">
              <i class="fa fa-bar-chart"></i> 抛料<span style="color: #ff0000;font-size: 24px;">TOP10</span>
            </div>
            <div>
              <throwMChart :Line="line" :barHeight="barHeight" />
            </div>
          </dv-border-box-12>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetReport_LineCurrentWo } from "@/api/kanbanApi";
import completion from "./completion.vue";
import spiPassRate from "./spiPassRate.vue";
import aoiPassRate from "./aoiPassRate.vue";
import badPassRate from "./badPassRate.vue";
import capacityChart from "./capacityChart.vue";
import throwMChart from "./throwMChart.vue";
import dayjs from "dayjs";
export default {
  props: ["isVertical"],
  components: {
    completion,
    spiPassRate,
    aoiPassRate,
    badPassRate,
    capacityChart,
    throwMChart,
  },
  data() {
    return {
      line: "Line1", // 默认选中第一条线
      options: [
        { value: "Line1", label: "Line1" },
        { value: "Line2", label: "Line2" },
        { value: "Line3", label: "Line3" },
        { value: "Line4", label: "Line4" },
        { value: "Line5", label: "Line5" },
        { value: "Line6", label: "Line6" },
        { value: "Line7", label: "Line7" },
      ],
      currentTime: "", // 用于存储当前时间
      lineData: {
        LineName: "",
        OrderName: "",
        CustomerPO: "",
        Side: "",
        ProgramName: "",
        ProductName: "",
        ProductDsc: "",
        ProductNO: "",
        MachineID: 101,
        PlannedStartTime: "",
        PlannedFinishTime: "",
      },
      refreshCountdown: 60,
      lastUpdatedTime: "",
      dataRefreshInterval: null,
      countdownInterval: null,
      rateHeight: 300,
      barHeight: 370,
    };
  },
  watch: {
    // 监听Line属性变化
    isVertical: {
      immediate: true, // 立即触发一次
      handler(nVal) {
        if (nVal) {
          this.rateHeight = 270;
          this.barHeight = 370;
        } else {
          this.rateHeight = 300;
          this.barHeight = 385;
        }
      },
    },
  },
  beforeMount() {
    const savedLine = localStorage.getItem("LINEkANBAN");
    if (savedLine) {
      this.line = savedLine; // 如果有保存的线，使用它
    }
  },
  mounted() {
    this.updateTime();
    this.getData();
    setInterval(this.updateTime, 1000);
    // 设置数据刷新定时器（每分钟一次）
    this.setDataRefreshInterval();

    // 设置倒计时定时器
    this.countdownInterval = setInterval(() => {
      this.refreshCountdown -= 1;
      if (this.refreshCountdown <= 0) {
        this.refreshCountdown = 60;
      }
    }, 1000);
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
          this.lineData = {
            ...res.Data[0],
            PlannedStartTime: res.Data[0].PlannedStartTime
              ? dayjs(res.Data[0].PlannedStartTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "",
            PlannedFinishTime: res.Data[0].PlannedFinishTime
              ? dayjs(res.Data[0].PlannedFinishTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "",
          };
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
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 8px 0;
  padding: 10px 0px;
  background: rgba(16, 33, 68, 0.7);
  border-radius: 8px;
  border: 2px solid rgba(64, 160, 255, 0.723);
  box-shadow: 0 0 20px rgba(0, 100, 255, 0.1);

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr 85px 280px 280px;
    gap: 15px;
  }

  .info-item {
    background: rgba(16, 33, 68, 0.5);
    padding: 0 15px;
    border-radius: 6px;
    border-left: 3px solid #40a9ff;
  }

  .info-item:first-child {
    border-left: none;
  }

  .info-label {
    font-size: 24px;
    color: #8ac6ff;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .info-value {
    // height: 70px;
    font-size: 25px;
    font-weight: bolder;
    color: #ffffff;
    display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示
    -webkit-box-orient: vertical; // 设置或检索伸缩盒对象的子元素的排列方式
    -webkit-line-clamp: 2; // 显示两行
    overflow: hidden;
  }

}

.dashboard-header-vertical {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  // align-items: center;
  margin: 20px 0 10px 0;
  padding: 10px 0px;
  background: rgba(16, 33, 68, 0.7);
  border-radius: 8px;
  border: 2px solid rgba(64, 160, 255, 0.723);
  box-shadow: 0 0 20px rgba(0, 100, 255, 0.1);

  .info-grid {
    display: grid;
    grid-template-columns: 290px 290px 1fr;
    gap: 15px;
  }

  .info-item {
    background: rgba(16, 33, 68, 0.5);
    padding: 0 15px;
    border-radius: 6px;
    border-left: 3px solid #40a9ff;
  }

  .info-item:first-child {
    border-left: none;
  }

  .info-label {
    font-size: 24px;
    color: #8ac6ff;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .info-value {
    // height: 70px;
    font-size: 25px;
    font-weight: bolder;
    color: #ffffff;
    display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示
    -webkit-box-orient: vertical; // 设置或检索伸缩盒对象的子元素的排列方式
    -webkit-line-clamp: 3; // 显示两行
    overflow: hidden;
  }
  
}

.centerh {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 380px;
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 460px;
  font-size: 22px;
  font-weight: bolder;
  color: #8ac6ff;
  background-color: rgba(16, 33, 68, 0.9);

  .header_title {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgb(64, 160, 255);
  }
}
.centerh-vertical{
   height: 330px;
}
.centerh1-vertical{
   height: 445px;
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
