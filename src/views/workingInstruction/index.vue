<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-button type="primary" @click="openAdd">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        :height="tableHeight"
        style="width: 100%"
      >
        <!-- <el-table-column type="index" label="序号" width="55" /> -->
        <el-table-column label="序号" width="55">
          <template slot-scope="scope">
            <span>{{
              scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
            }}</span>
          </template>
        </el-table-column>
        <af-table-column prop="PN" label="样件唯一码"> </af-table-column>
        <af-table-column prop="name" label="样件编码"> </af-table-column>
        <af-table-column prop="pn_spec" label="样件名称"> </af-table-column>
        <el-table-column
          prop="faceNumber"
          label="样件内容"
          width="80"
          align="center"
        >
        </el-table-column>
        <af-table-column prop="version" label="版本号"> </af-table-column>
        <af-table-column prop="softwareVersion" label="封样日期">
        </af-table-column>
        <af-table-column prop="softwareVersion" label="刷新日期">
        </af-table-column>
        <af-table-column prop="softwareVersion" label="保质年">
        </af-table-column>
        <af-table-column prop="softwareVersion" label="封样人">
        </af-table-column>
        <af-table-column prop="softwareVersion" label="备注"> </af-table-column>
        <af-table-column prop="softwareVersion" label="状态"> </af-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-document"
              @click="handleDetail(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex"
          :page-size="getForm.PageSize"
          :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="'新增'"
      :visible.sync="dialogVisible"
      width="700px"
      @close="addCancel()"
    >
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        label-position="left"
        label-width="auto"
      >
      <div class="pdf-upload-container">
    <el-card class="upload-card">
      <div slot="header">
        <span>PDF文件上传</span>
      </div>
      
      <!-- 文件上传区域 -->
      <el-upload
        action="#"
        multiple
        :limit="2"
        :file-list="fileList"
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        accept=".pdf"
        ref="upload"
        class="upload-area"
      >
        <el-button size="small" type="primary">点击选择文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传PDF文件，且不超过10MB</div>
      </el-upload>
      
      <!-- 文件名编辑区域 -->
      <div v-if="fileList.length > 0" class="filename-edit-area">
        <h4>文件名设置</h4>
        <div v-for="(file, index) in fileList" :key="file.uid" class="file-item">
          <el-input
            v-model="customNames[index]"
            :placeholder="getBaseName(file.name)"
            clearable
          >
            <template slot="prepend">文件名</template>
            <template slot="append">.pdf</template>
          </el-input>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          type="primary"
          :loading="uploading"
          :disabled="fileList.length === 0"
          @click="submitUpload"
        >
          确认上传
        </el-button>
        <el-button @click="resetUpload">重置</el-button>
      </div>
    </el-card>
  </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'编辑'"
      :visible.sync="editVisible"
      width="1000px"
      @close="addDetailCancel()"
    >
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="样件唯一码" prop="path">
          <el-input
            :disabled="false"
            v-model="form.path"
            placeholder="请输入样件唯一码"
          ></el-input>
        </el-form-item>
        <el-form-item label="样件编码" prop="MenuName">
          <el-input
            v-model="form.MenuName"
            placeholder="请输入样件编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="样件名称" prop="redirect">
          <el-input
            v-model="form.redirect"
            placeholder="请输入样件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="样件内容" prop="component">
          <el-input
            v-model="form.component"
            placeholder="请输入样件内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="sortId">
          <el-input
            v-model="form.component"
            placeholder="请输入版本号"
          ></el-input>
        </el-form-item>
        <el-form-item label="封样日期" prop="sortId">
          <el-date-picker
            v-model="form.component"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="保质年" prop="sortId">
          <el-input
            v-model="form.component"
            placeholder="请输入保质年"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="sortId">
          <el-input
            v-model="form.component"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="sortId">
          <el-input
            v-model="form.component"
            placeholder="请输入状态"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'样件使用记录'"
      :visible.sync="detailVisible"
      width="800px"
      @close="addDetailCancel()"
    >
      <el-table
        :data="tableDetail"
        style="width: 100%"
        border
        :height="300"
        size="mini"
      >
        <el-table-column label="序号" width="55"></el-table-column>
        <el-table-column prop="PD_model" label="工单号"> </el-table-column>
        <el-table-column prop="PD_model" label="时间"> </el-table-column>
        <el-table-column prop="PD_model" label="使用人员"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  findPanelizationList,
  addPanelizationList,
  DeletePanelizationList,
  findPnDetail,
  addPanelizationdetail,
  DeletePanelizationDetail,
  UpdatePanelizationDetail,
} from "@/api/puzzleApi.js";
import dayjs from "dayjs";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      tableData: [],
      tableDetail: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableHeight: 0,
      getForm: {
        PageIndex: 1,
        PageSize: 10,
        SearchText: "",
        StartTime: "",
        EndTime: "",
      },
      dialogVisible: false,
      editVisible: false,
      activeName: "smallBoard",
      form: {
        list: {
          pn: "",
          model: "",
          side: "",
          name: "",
          version: "",
          softwareVersion: "",
        },
        Detail: [
          {
            version: "",
            softwareVersion: "",
            small_board_qty: 0,
            finished_code: "",
            name: "",
            model: "",
            pcb_code: "",
            module_start: 0,
            module_end: 0,
          },
        ],
      },
      detailVisible: false,
      editForm: {
        pn: "",
        model: "",
        sdie: "",
        name: "",
        version: "",
        softwareVersion: "",
      },
      upDateForm: {
        pnl_code: "",
        list: [],
      },
      smallBoardTable: [],
      songBoardVisible: false,
      detailForm: {},
      fileList: [], // 文件列表
      customNames: [], // 自定义文件名（不含扩展名）
      uploading: false // 上传状态
    };
  },
  beforeMount() {
    this.getScreenHeight();
    this.getData();
  },
  mounted() {
    setInterval(() => {
      console.log(this.fileList);
    },2000)
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      findPanelizationList(this.getForm).then((res) => {
        console.log(res);

        if (res.Success) {
          this.tableData = res.Data.list;
          this.total = res.Data.Total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    openAdd() {
      this.dialogVisible = true;
    },
    openEdit() {
      this.editVisible = true;
    },
    removeBoardItem(index) {
      this.form.Detail.splice(index, 1);
      if (this.form.Detail.length === 0) {
        this.form.Detail.push({
          version: "",
          small_board_qty: 0,
          finished_code: "",
          name: "",
          model: "",
          pcb_code: "",
          module_start: 0,
          module_end: 0,
        });
      }
    },
    addSmallBoard() {
      this.form.Detail.push({
        version: "",
        small_board_qty: 0,
        finished_code: "",
        name: "",
        model: "",
        pcb_code: "",
        module_start: 0,
        module_end: 0,
      });
    },
    deleteBoard() {
      this.form.smallBoardTable.pop();
    },
    handleDelete(row) {
      this.$confirm("是否删除该拼板物料", "提示", {
        type: "warning",
      })
        .then(() => {
          // DeletePanelizationList(row.PN).then((res) => {
          //   if (res.Success) {
          //     this.$notify({
          //       type: "success",
          //       title: "提示信息",
          //       message: res.Msg,
          //     });
          //     this.getData();
          //   } else {
          //     this.$notify({
          //       type: "error",
          //       title: "提示信息",
          //       message: res.Msg,
          //     });
          //   }
          // });
        })
        .catch(() => {
          this.$notify({
            type: "info",
            title: "提示信息",
            message: "已取消删除",
          });
        });
    },
    handleDetail() {
      this.detailVisible = true;
    },
    onSubmit() {
      this.form.Detail = this.form.Detail.filter(
        (item) => item.finished_code !== ""
      );
      if (this.form.Detail.length === 0) {
        this.$notify({
          type: "error",
          title: "提示信息",
          message: "小板明细不能为空",
        });
        return;
      }
      this.form.list.cr_user = getToken();
      this.form.list.cr_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      this.form.Detail.forEach((item) => {
        item.cr_user = getToken();
        item.cr_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      });
      addPanelizationdetail(this.form).then((res) => {
        if (res.Success) {
          this.$notify({
            type: "success",
            title: "提示信息",
            message: res.Msg,
          });
          // this.$refs.formRef.resetFields();
          // console.log(this.form);

          this.restForm();
          this.dialogVisible = false;
          this.getData();
        } else {
          this.$notify({
            type: "error",
            title: "提示信息",
            message: res.Msg,
          });
        }
      });
    },
    restForm() {
      this.form = {
        list: {
          pn: "",
          model: "",
          side: "",
          name: "",
          version: "",
        },
        Detail: [
          {
            version: "",
            small_board_qty: 0,
            finished_code: "",
            name: "",
            model: "",
            pcb_code: "",
            module_start: 0,
            module_end: 0,
          },
        ],
      };
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.formRef.resetFields();
    },
    handleEdit(row) {
      // console.log(row);
      this.upDateForm.pnl_code = row.PN;
      this.editForm = {
        pn: row.PN,
        model: row.pn_spec,
        side: row.faceNumber,
        name: row.name,
        version: row.version,
      };
      findPnDetail(row.PN).then((res) => {
        if (res.Data == null || res.Data.length === 0) {
          this.smallBoardTable.push({
            version: "",
            small_board_qty: 0,
            finished_code: "",
            name: "",
            model: "",
            pcb_code: "",
            module_start: 0,
            module_end: 0,
          });
        } else {
          this.smallBoardTable = JSON.parse(res.Data);
        }
        this.dialogVisible = true;
        // console.log(this.smallBoardTable);
      });
    },
    addDetailCancel() {
      this.detailVisible = false;
      this.smallBoardTable = [];
      this.$refs.editFormRef.resetFields();
    },
    handleDetailEdit() {
      this.smallBoardTable.push({
        version: "",
        small_board_qty: 0,
        finished_code: "",
        name: "",
        model: "",
        pcb_code: "",
        module_start: 0,
        module_end: 0,
      });
    },
    handleDetailDelete(row) {
      // console.log(row);
      this.smallBoardTable.splice(row, 1);
      if (this.smallBoardTable.length === 0) {
        this.smallBoardTable.push({
          version: "",
          small_board_qty: 0,
          finished_code: "",
          name: "",
          model: "",
          pcb_code: "",
          module_start: 0,
          module_end: 0,
        });
      }
    },
    onDetailSubmit() {
      // console.log(this.smallBoardTable);
      // if (this.smallBoardTable.length === 1&& this.smallBoardTable[0].finished_code === "") {
      //   this.$notify({
      //     type: "error",
      //     title: "提示信息",
      //     message: "小板明细不能为空",
      //   });
      //   return;
      // }
      this.smallBoardTable = this.smallBoardTable.filter(
        (item) => item.finished_code !== ""
      );
      this.smallBoardTable.forEach((item) => {
        item.cr_user = getToken();
        item.cr_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      });
      this.upDateForm.list = this.smallBoardTable;
      UpdatePanelizationDetail(this.upDateForm).then((res) => {
        if (res.Success) {
          this.$notify({
            type: "success",
            title: "提示信息",
            message: res.Msg,
          });
          this.detailVisible = false;
          this.getData();
        } else {
          this.$notify({
            type: "error",
            title: "提示信息",
            message: res.Msg,
          });
        }
      });
    },
    addCancel() {
      this.detailVisible = false;
    },
    handleSizeChange(value) {
      //
      this.getForm.PageSize = value;
      this.getData();
    },
    handleCurrentChange(val) {
      this.getForm.PageIndex = val;
      this.getData();
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 220;
        // this.tableHeight1 =
      });
    }, handleFileChange(file, fileList) {
      // 限制只能上传2个文件
      if (fileList.length > 2) {
        fileList.splice(2, fileList.length - 2);
        this.$message.warning('最多只能上传2个文件');
      }
      this.fileList = fileList;
      // 初始化自定义文件名
      this.customNames = fileList.map(f => this.getBaseName(f.name));
    },
    
    // 移除文件的回调
    handleRemove(file, fileList) {
      this.fileList = fileList;
      // 同步更新自定义文件名数组
      const index = this.fileList.findIndex(f => f.uid === file.uid);
      if (index !== -1) {
        this.customNames.splice(index, 1);
      }
    },
    
    // 上传前的校验
    beforeUpload(file) {
      const isPDF = file.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 10;
      
      if (!isPDF) {
        this.$message.error('只能上传PDF格式的文件!');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('文件大小不能超过10MB!');
        return false;
      }
      
      return true;
    },
    
    // 提交上传
    submitUpload() {
      if (this.fileList.length === 0) {
        this.$message.warning('请先选择要上传的文件');
        return;
      }
      
      this.uploading = true;
      
      const formData = new FormData();
      this.fileList.forEach((file, index) => {
        // 确定最终文件名
        let filename = this.customNames[index].trim();
        if (!filename) {
          filename = this.getBaseName(file.name);
        }
        filename += '.pdf';
        
        // 添加到FormData
        formData.append('files', file.raw, filename);
      });
      
      // 这里替换为你的实际上传API
      this.uploadFiles(formData)
        .then(response => {
          this.$message.success('文件上传成功!');
          this.resetUpload();
        })
        .catch(error => {
          console.error('上传失败:', error);
          this.$message.error('文件上传失败');
        })
        .finally(() => {
          this.uploading = false;
        });
    },
    
    // 模拟上传API调用
    uploadFiles(formData) {
      return new Promise((resolve, reject) => {
        // 这里替换为实际的API调用
        console.log('上传的文件数据:', formData);
        
        // 模拟网络请求延迟
        setTimeout(() => {
          // 模拟成功响应
          resolve({ success: true });
          // 模拟失败响应
          // reject(new Error('上传失败'));
        }, 1500);
      });
    },
    
    // 重置上传
    resetUpload() {
      this.$refs.upload.clearFiles();
      this.fileList = [];
      this.customNames = [];
    },
    
    // 获取文件名（不含扩展名）
    getBaseName(filename) {
      return filename.replace(/\.pdf$/i, '');
    }
  },
};
</script>

<style lang="scss" scoped>
.puzzles {
  padding: 8px;

  .table_header {
    margin-bottom: 8px;
  }
}

.form-section {
  // margin-bottom: 20px;
  .section-title {
    color: #409eff;
    font-size: 16px;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }

  .sub-title {
    font-size: 12px;
    color: #409eff;
    margin-bottom: 6px;
    padding-left: 4px;
  }

  .vertical-divider {
    position: absolute;
    left: 50%;
    top: 40px;
    bottom: 20px;
    width: 1px;
    background: #eee;
  }
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

.action-buttons {
  margin-top: 10px;
}
</style>
