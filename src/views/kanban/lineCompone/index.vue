<template>
  <div class="w-full h-full">
    <div class="flex flex-col w-full">
      <div class="title">
        <dv-decoration-10 class="dv-dec-10 decoration" :color="['#40a0ffb8']"/>
        <dv-decoration-8 class="dv-dec-8 decoration decoration-center"  :color="['#40a0ffb8', '#40a0ffb8']"/>
        <div class="text decoration-center">
          <div style="margin: auto" class="text-white flex items-center">
            <span>星宇车灯电子二工厂 </span>
            <el-dropdown @command="handleCommand" class="custom-dropdown1">
              <span class="el-dropdown-link">
                {{ line }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="test-dropdown">
                <el-dropdown-item v-for="item in options" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <dv-decoration-8 class="dv-dec-8 transform decoration decoration-center" :color="['#40a0ffb8', '#40a0ffb8']"/>
        <dv-decoration-10 class="dv-dec-10 transform decoration" :color="['#40a0ffb8']"/>
        
        <div class="text-white flex justify-end timetext" style=" font-size: 24px">
        <span class="pr-5">{{ currentTime }}</span>
      </div>
      </div>
 
      
      <div class="bg-white h-32 dashboard-header" style="width: 1920px">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">生产工单</div>
            <div class="info-value">WO2507160429230_B</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品名称</div>
            <div class="info-value">控制器</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品编码</div>
            <div class="info-value">4051012946200</div>
          </div>
          <div class="info-item">
            <div class="info-label">实际开始时间</div>
            <div class="info-value">2025-07-12 12:00:11</div>
          </div>
          <div class="info-item">
            <div class="info-label">理论结束时间</div>
            <div class="info-value">2025-07-15 12:00:11</div>
          </div>
        </div>
      </div>
      <div class="flex" style="gap: 15px;">
        <dv-border-box-13 class="centerh ">
          <div class="header_title"><i class="fa fa-tasks"></i> 当前工单完成率</div>
          <div>
            <completion />
          </div>
        </dv-border-box-13>
        <dv-border-box-13 class="centerh">
          <div class="header_title"><i class="fa fa-check-circle"></i> SPI直通率</div>
          <div>
            <spiPassRate />
          </div>
        </dv-border-box-13>
        <dv-border-box-13 class="centerh">
          <div class="header_title"><i class="fa fa-search"></i> AOI直通率</div>
          <div>
            <aoiPassRate />
          </div>
        </dv-border-box-13>
        <dv-border-box-13 class="centerh">
          <div class="header_title"><i class="fa  fa-exclamation-triangle"></i> 不良数分布</div>
          <div>
            <badPassRate />
          </div>
        </dv-border-box-13>
      </div>
      <div class="flex gap-4">
        <dv-border-box-12 class="centerh1">
          <div class="header_title"><i class="fa fa-bar-chart"></i> 贴片机单小时产能</div>
          <div>
            <capacityChart />
          </div>
        </dv-border-box-12>
        <dv-border-box-12 class="centerh1">
          <div class="header_title"><i class="	fa fa-bar-chart"></i> 抛料TOP10</div>
          <div>
            <throwMChart />
          </div>
        </dv-border-box-12>

      </div>
    </div>
  </div>
</template>

<script>
import completion from './completion.vue';
import spiPassRate from './spiPassRate.vue';
import aoiPassRate from './aoiPassRate.vue';
import badPassRate from './badPassRate.vue';
import capacityChart from './capacityChart.vue';
import throwMChart from './throwMChart.vue';
export default {
  components: {
    completion,
    spiPassRate,
    aoiPassRate,
    badPassRate,
    capacityChart,
    throwMChart
  },
  data() {
    return {
      line: 'Line1', // 默认选中第一条线
      options: [
        { value: 'Line1', label: 'Line1' },
        { value: 'Line2', label: 'Line2' },
        { value: 'Line3', label: 'Line3' }
      ],
      currentTime: '' // 用于存储当前时间
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
        hour12: false,
      
      });
    },
    handleCommand(command) {
      this.line = command; // 更新选中的线
      this.changeLine(command); // 调用处理函数
    },
    changeLine(val) {
      console.log('Selected line:', val);
      // Handle line change logic here
    }
  }
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
  height: 380px;
  font-size: 24px;
  font-weight: bolder;
  color: #8ac6ff;
  background-color: rgba(16, 33, 68, 0.7);

  .header_title {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgb(64, 160, 255);
  }
}

.centerh1 {
  display: flex;
  flex-direction: column;
  padding: 15px;
  height: 450px;
  font-size: 24px;
  font-weight: bolder;
  color: #8ac6ff;
  background-color: rgba(16, 33, 68, 0.7);

  .header_title {
    margin-bottom: 15px;
    padding-bottom: 10px;
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

.timetext{
  position: absolute;
  top: 45px;
  right: 10px;
}
</style>
