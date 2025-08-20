<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2 flex gap-2 items-center">
        <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" size="small" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']" :clearable="false">
        </el-date-picker>
        <el-input v-model="getForm.SearchText" placeholder="请输入条码" style="width: 300px;" size="small" clearable
          @keyup.enter.native="getData" @clear="clear"></el-input>
        <el-button type="primary" size="small" @click="getData">查询</el-button>
      </div>
      <el-table :data="tableData" ref="imageTable"  border :height="tableHeight" style="width: 100%"
        highlight-current-row size="small">
        <el-table-column type="index" label="序号" width="55" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
            }}</span>
          </template>
        </el-table-column>

       
        <el-table-column prop="tpm_container" label="条码"> </el-table-column>
         <el-table-column prop="tpm_mfgorder" label="工单"> </el-table-column>
        <el-table-column prop="tpm_stts" label="设备判断" align="center" width="100">

        </el-table-column>
  
        <el-table-column prop="tpm_stts2" label="人工判断" align="center" width="100">
        </el-table-column>
        <!-- <el-table-column label="图片" width="100" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.tpm_imgno" :scroll-container="scrollContainer" lazy
              style="width: 60px; height: 33.35px" :preview-src-list="[scope.row.tpm_imgno]">
              <div slot="placeholder" class="image-placeholder">
                <i class="el-icon-loading"></i>
              </div>
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="文件" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-view"
              @click="previewFile(scope.row.tpm_logno)">预览</el-button>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="日志文件" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" icon="el-icon-download"
              @click="downloadFile(scope.row.tpm_logno)">下载</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="详情" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-document" @click="rowClick(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :visible.sync="previewVisible" title="文件预览" width="60%">
      <div v-loading="progress < 100" element-loading-text="文件加载中...">
        <!-- 错误提示 -->
        <el-alert v-if="previewError" :title="previewError" type="error" show-icon style="margin-bottom: 15px">
        </el-alert>

        <!-- 文本预览区域 -->
        <div v-if="!previewError && previewContent" class="preview-container">
          <pre>{{ previewContent }}</pre>
        </div>

        <!-- 进度条 -->
        <el-progress v-show="progress > 0 && progress < 100" :percentage="progress" :stroke-width="16"
          :status="progress === 100 ? 'success' : ''">
        </el-progress>
      </div>
      <span slot="footer">
        <el-button type="primary" size="small" icon="el-icon-download" @click="downloadFile(previewUrl)">下载</el-button>
        <el-button size="small" icon="el-icon-close" @click="previewVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="detailVisible" :title="'详情：' + container" width="75%">
      <el-table :data="tableData2" border style="width: 100%" size="small" height="450"  tooltip-effect="light">
        <el-table-column type="index" label="序号" width="55" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template></el-table-column>
          <el-table-column prop="tpm_equip" label="设备名称" width="80" align="center"> </el-table-column>
           <el-table-column prop="tpm_line" label="线体" width="80" align="center"> </el-table-column>
            <el-table-column prop="tpm_productname" label="产品" > </el-table-column>
             <el-table-column prop="tpm_productdsc" label="产品描述" show-overflow-tooltip> </el-table-column>
        
         <el-table-column prop="tpm_position" label="设备"> </el-table-column>
         <el-table-column prop="tpm_createuser" label="生成设备"> </el-table-column>
        <el-table-column prop="tpm_logtime" label="生成时间" width="150"> </el-table-column>
          <el-table-column prop="tpm_stts" label="设备判断" align="center" width="80">
        </el-table-column>
  
        <el-table-column prop="tpm_stts2" label="人工判断" align="center" width="80">
        </el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.tpm_imgno" lazy :scroll-container="detailScrollContainer"
              style="width: 60px; height: 33.35px" :preview-src-list="[scope.row.tpm_imgno]">
                  <div slot="placeholder" class="image-placeholder">
                <i class="el-icon-loading"></i>
              </div>
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="文件" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-view"
              @click="previewFile(scope.row.tpm_logno)">预览</el-button>
          </template>
        </el-table-column>

        <!-- <el-table-column label="日志文件" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" icon="el-icon-download"
              @click="downloadFile(scope.row.tpm_logno)">下载</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <span slot="footer">
        <el-button size="small" icon="el-icon-close" @click="detailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  shortcuts1,
  disabledDate,
  setTodayDate,
  setLastDate,
} from "@/utils/dataMenu";
import dayjs from "dayjs";
import {
  QuerySDZHHeadData,
  QuerySDZHDetailData,
  QueryXYL_BadProductInformationRepairRecord,
  QueryXYL_ThreePointMatchingDetailInfo,
  QueryXYL_ThreePointMatchingDetailFinalStateInfo
} from "@/api/sdzApi";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: shortcuts1,
        disabledDate: disabledDate,
      },
      tableData: [],
      tableData2: [],
      currentPage: 1, // 当前页码
      pageSize: 50, // 每页的数据条数
      tableHeight: 0,
      dateValue: [],
      tableHeight2: 0,
      getForm: {
        PageIndex: 1,
        PageSize: 20,
        SearchText: "",
        StartTime: "",
        EndTime: "",
      },
      total: 0,
      previewVisible: false,
      previewUrl: "",
      previewContent: "",
      previewFileName: "",
      progress: 0,
      previewError: "",
      currentRowIndex: null,
      scrollContainer: null,
      detailVisible: false,
      tableData2: [],
      container: '',
       detailScrollContainer: null,
    };
  },
  watch: {
    dateValue(value) {
      if (value == null) {
        this.getForm.StartTime = "";
        this.getForm.EndTime = "";
      } else {
        this.getForm.StartTime = value[0];
        this.getForm.EndTime = value[1];
      }
      this.getForm.PageIndex = 1;
      this.getData();
    },
  },
  beforeMount() {
    let end = setTodayDate();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
    // let start= setLastDate();
    this.dateValue = [
      dayjs(todayStart).format("YYYY-MM-DD HH:mm:ss"),
      dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    // console.log(this.dateValue);

    this.getScreenHeight();
    // this.getData();
  },
  mounted() {
    // this.$nextTick(() => {
    //   // 获取表格的滚动容器
    //   this.scrollContainer = this.$refs.imageTable?.$el?.querySelector(
    //     ".el-table__body-wrapper"
    //   );
    // });
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    handleTableScroll() {
      // 强制更新懒加载检查
      if (this.scrollContainer) {
        this.$nextTick(() => {
          const event = new CustomEvent("scroll");
          this.scrollContainer.dispatchEvent(event);
        });
      }
    },
    refreshDate() {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      this.dateValue = [
        dayjs(todayStart).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      ];
    },
    clear() {
      this.getForm.SearchText = "";
      this.getData();
    },
    getData() {
      this.tableData2 = [];
      QueryXYL_ThreePointMatchingDetailFinalStateInfo(this.getForm).then((res) => {
        this.tableData = res.Data.list.map((item) => {
          return {
            ...item,
            tpm_imgno: `${item.tpm_imgno}`,
            tpm_logno: `${item.tpm_logno}`,
          };
        });
        this.total = res.Data.Total;
        //  console.log(data);
      });
    },
    // 预览文件
    previewFile(url) {
      if (!url) {
        this.$message.warning("文件路径不存在");
        return;
      }
      this.previewVisible = true;
      this.previewUrl = url;
      this.previewFileName = url.split("/").pop();
      this.previewContent = "";
      this.previewError = "";
      this.progress = 0;

      // 模拟文件加载进度
      const progressInterval = setInterval(() => {
        if (this.progress < 90) {
          this.progress += 10;
        }
      }, 200);

      // 获取文件内容
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error("文件加载失败");
          return response.text();
        })
        .then((text) => {
          clearInterval(progressInterval);
          this.progress = 100;
          setTimeout(() => {
            this.previewContent = text;
          }, 300);
        })
        .catch((error) => {
          clearInterval(progressInterval);
          this.progress = 100;
          this.previewError = error.message || "无法加载文件内容";
          console.error("文件预览失败:", error);
        });
    },

    // 下载文件
    downloadFile(url) {
      if (!url) {
        this.$message.warning("文件路径不存在");
        return;
      }

      const fileName = url.split("/").pop();
      this.$message.info(`开始下载: ${fileName}`);

      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          // 创建下载链接
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // 释放URL对象
          window.URL.revokeObjectURL(downloadUrl);

          this.$message.success(`文件下载成功: ${fileName}`);
        })
        .catch((error) => {
          console.error("文件下载失败:", error);
          this.$message.error(`文件下载失败: ${error.message}`);
        });
    },
    rowClick(val) {
      this.container = val.tpm_container;
      QueryXYL_ThreePointMatchingDetailInfo({ Container: val.tpm_container }).then((res) => {
        this.tableData2 = res.Data.map((item) => {
          return {
            ...item,
            tpm_stts: item.tpm_stts=="GOOD"||item.tpm_stts=="OK"?"OK":"NG",
            tpm_stts2:  item.tpm_stts2=="GOOD"||item.tpm_stts2=="OK"?"OK":"NG",
          };
        });
        this.detailVisible = true;
          this.$nextTick(() => {
      this.detailScrollContainer = document.querySelector(
        '.el-dialog__body .el-table__body-wrapper'
      );
      // 手动触发滚动事件初始化
      this.triggerScrollEvent();
    });
      });
    },
    triggerScrollEvent() {
  if (this.detailScrollContainer) {
    const event = new Event('scroll');
    this.detailScrollContainer.dispatchEvent(event);
  }
},
    changeDate(val) { },
    handleSizeChange(value) {
      this.getForm.PageSize = value;
      this.getData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);

      this.getForm.PageIndex = val;
      this.getData();
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-container {
  max-height: 60vh;
  overflow: auto;
  background: #f8f8f8;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.preview-container pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
  margin: 0;
}

.image-placeholder,
.image-error {
  width: 60px;
  height: 33.3px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  color: #909399;
}

.image-error {
  background: #fef0f0;
  color: #f56c6c;
}

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
