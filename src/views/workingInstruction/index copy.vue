<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <el-form :inline="true" size="medium" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="openAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入料号" clearable v-model="getForm.SearchModel.ProductName" class="input-with-select"
            @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border :height="tableHeight" style="width: 100%">
        <!-- <el-table-column type="index" label="序号" width="55" /> -->
        <el-table-column label="序号" width="55">
          <template slot-scope="scope">
            <span>{{
              scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
            }}</span>
          </template>
        </el-table-column>
        <af-table-column prop="prosop_product" label="料号"> </af-table-column>
        <!-- <af-table-column prop="PN" label="规格"> </af-table-column>
        <af-table-column prop="PN" label="描述"> </af-table-column> -->
        <af-table-column prop="prosop_name" label="作业指导书">
          <template #default="scope">
            <div style="text-decoration: underline" @click="getPdfSrc(scope.row.prosop_guid, scope.row.prosop_name)">
              {{ scope.row.prosop_name }}
            </div>
          </template>
        </af-table-column>
        <af-table-column prop="prosop_name2" label="生产条件表">
          <template #default="scope">
            <div style="text-decoration: underline" @click="getPdfSrc(scope.row.prosop_guid2, scope.row.prosop_name2)">
              {{ scope.row.prosop_name2 }}
            </div>
          </template></af-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'新增'" :visible.sync="dialogVisible" width="700px" @close="resetUpload()">
      <el-form ref="formRef" :inline="true" :model="form" label-position="left" label-width="auto">
        <div class="pdf-upload-container">
          <el-card class="upload-card">
            <div slot="header">
              <span>PDF文件上传</span>
            </div>
            <el-form>
              <el-form-item label="料号">
                <el-autocomplete v-model="productSelect" style="width: 600px;" :fetch-suggestions="getProductName" placeholder="请输入内容"
                  @select="handleSelect" :value-key="'ProductName'"></el-autocomplete>
              </el-form-item>
            </el-form>
            <!-- 文件上传区域 -->
            <div class="upload">
              <div class="file1">
                <el-upload action="#" multiple :limit="1" :file-list="fileListUp1" :auto-upload="false"
                  :on-change="file1UpChange" :on-remove="file1UpRemove" :before-upload="beforeUpload" accept=".pdf"
                  ref="upload" class="upload-area">
                  <el-button size="small" type="primary">点击选择作业指导书</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">
                    只能上传PDF文件，且不超过5MB
                  </div> -->
                </el-upload>
              </div>
              <div class="file2">
                <el-upload action="#" multiple :limit="1" :file-list="fileListUp2" :auto-upload="false"
                  :on-change="file2UpChange" :on-remove="file2UpRemove" :before-upload="beforeUpload" accept=".pdf"
                  ref="upload" class="upload-area">
                  <el-button size="small" type="primary">点击选择生产条件表</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">
                    只能上传PDF文件，且不超过5MB
                  </div> -->
                </el-upload>
              </div>
            </div>

            <!-- 文件名编辑区域 -->
            <div class="filename-edit-area">
              <h4>文件名设置</h4>
              <!-- <div class="file-item">
                <el-input v-model="customNames[0]" clearable>
                  <template slot="prepend">作业指导书名称</template>
                  <template slot="append">.pdf</template>
                </el-input>
              </div>
              <div class="file-item">
                <el-input v-model="customNames[1]" clearable>
                  <template slot="prepend">生产条件表名称</template>
                  <template slot="append">.pdf</template>
                </el-input>
              </div> -->
              <el-form :inline="true" size="medium" @submit.native.prevent>
                <div class="upload-name">
                  <el-form-item class="file1" label="作业指导书">
                    <el-input v-model="customNames[0]" clearable> </el-input>
                  </el-form-item>
                  <el-form-item class="file2" label="生产条件表">
                    <el-input v-model="customNames[1]" clearable> </el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>

            <!-- 操作按钮 -->
            <!-- <div class="action-buttons">
              <el-button
                type="primary"
                :loading="uploading"
                @click="submitUpload"
              >
                确认上传
              </el-button>
              <el-button @click="resetUpload">重置</el-button>
            </div> -->
          </el-card>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="upLoad()" :disabled="(fileListUp1.length === 0 && fileListUp2.length === 0) ||
          productName === ''
          ">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'编辑'" :visible.sync="editVisible" width="700px" @close="resetEdit()">
      <el-form ref="formRef" :inline="true" :model="form" label-position="left" label-width="auto">
        <div class="pdf-upload-container">
          <el-card class="upload-card">
            <div slot="header">
              <span>PDF文件上传</span>
            </div>
            <el-form>
              <el-form-item label="料号">
                <el-input placeholder="" disabled v-model="editForm.ProductName"></el-input>
              </el-form-item>
              <el-form-item label="是否只修改作业指导书名称">
                <el-checkbox v-model="editForm.upfilename1"></el-checkbox>
              </el-form-item>
              <el-form-item label="是否只修改生产条件表名称">
                <el-checkbox v-model="editForm.upfilename2"></el-checkbox>
              </el-form-item>
            </el-form>
            <!-- 文件上传区域 -->
            <div class="upload">
              <div class="file1">
                <el-upload action="#" multiple :limit="1" :file-list="fileListEdit1" :auto-upload="false"
                  :on-change="file1EditChange" :on-remove="file1EditRemove" :before-upload="beforeUpload" accept=".pdf"
                  ref="upload" class="upload-area" v-if="!editForm.upfilename1">
                  <el-button size="small" type="primary">点击选择作业指导书</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">
                    只能上传PDF文件，且不超过5MB
                  </div> -->
                </el-upload>
              </div>
              <div class="file2">
                <el-upload action="#" multiple :limit="1" :file-list="fileListEdit2" :auto-upload="false"
                  :on-change="file2EditChange" :on-remove="file2EditRemove" :before-upload="beforeUpload" accept=".pdf"
                  ref="upload" class="upload-area" v-if="!editForm.upfilename2">
                  <el-button size="small" type="primary">点击选择生产条件表</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">
                    只能上传PDF文件，且不超过5MB
                  </div> -->
                </el-upload>
              </div>
            </div>
            <!-- 文件名编辑区域 -->
            <div class="filename-edit-area">
              <h4>文件名设置</h4>
              <!-- <div class="file-item">
                <el-input
                  v-model="editForm.filename1"
                  clearable
                  :disabled="!checked1"
                >
                  <template slot="prepend">作业指导书名称</template>
                  <template slot="append">.pdf</template>
                </el-input>
              </div>
              <div class="file-item">
                <el-input
                  v-model="editForm.filename2"
                  clearable
                  :disabled="!checked2"
                >
                  <template slot="prepend">生产条件表名称</template>
                  <template slot="append">.pdf</template>
                </el-input>
              </div> -->
              <el-form :inline="true" size="medium" @submit.native.prevent>
                <div class="upload-name">
                  <el-form-item class="file1" label="作业指导书">
                    <el-input v-model="editForm.filename1" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item class="file2" label="生产条件表">
                    <el-input v-model="editForm.filename2" clearable>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>

            <!-- 操作按钮 -->
            <!-- <div class="action-buttons">
              <el-button
                type="primary"
                :loading="uploading"
                :disabled="fileList.length === 0"
                @click="submitUpload"
              >
                确认上传
              </el-button>
              <el-button @click="resetUpload">重置</el-button>
            </div> -->
          </el-card>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="浏览" :visible.sync="browseVisible" width="1000px" @close="">
      <div slot="title" class="dialog-header">
        <!-- <span>浏览</span> -->
        <el-button type="primary" size="mini" class="ml-5" @click="downLoadPdf">下载</el-button>
        <el-button type="primary" size="mini" class="ml-5" @click="srcFull">全屏</el-button>
        <!-- <el-button
          type="primary"
          size="mini"
          class="ml-5"
          @click="changePdfPage(0)"
          >上一页</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="ml-5"
          @click="changePdfPage(1)"
          >下一页</el-button
        > -->
      </div>

      <!-- 弹窗内容 -->
      <div style="width: 100%; height: 600px" id="src">
        <div class="full" ref="myElement">
          <el-form :inline="true" size="medium" @submit.native.prevent>
            <el-form-item>
              <el-button type="primary" size="mini" class="ml-5" @click="srcFull">全屏</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <pdf
          :src="pdfsrc"
          :page="currentPagePdf"
          @num-pages="pageCountPdf = $event"
          @page-loaded="currentPagePdf = $event"
          @loaded="loadPdfHandler"
        >
        </pdf> -->
        <iframe :src="pdfsrc" style="width: 100%; height: 100%"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenfull from "screenfull";
import {
  InsertXYLProductSOP,
  QueryXYLProductSOP,
  GetESReportViewProduct,
  DQXYLProductSOP,
  UpdateXYLProductSOP,
  DeleteXYLProductSOP,
} from "@/api/puzzleApi.js";
import dayjs from "dayjs";
// import pdf from "vue-pdf";
import { getToken } from "@/utils/auth";
import { data } from "jquery";
import { getDate } from "@/utils/getDate";
export default {
  // components: {
  //   pdf,
  // },
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
        SearchModel: {
          ProductName: "",
        },
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
      browseVisible: false,
      pdfsrc: null,
      pdfBlob: "",
      pdfName: "",
      detailVisible: false,
      editForm: {
        ProductName: "",
        upfilename1: true,
        filename1: "",
        base64String1: "",
        upfilename2: true,
        filename2: "",
        base64String2: "",
        UserNo: "",
      },
      upDateForm: {
        pnl_code: "",
        list: [],
      },
      smallBoardTable: [],
      songBoardVisible: false,
      detailForm: {},
      fileList: [],
      fileListUp1: [], // 文件列表
      fileListUp2: [], // 文件列表
      fileListEdit1: [], // 文件列表
      fileListEdit2: [], // 文件列表
      customNames: ["", ""], // 自定义文件名（不含扩展名）
      customNamesEdit: ["", ""],
      uploading: false, // 上传状态
      productSelect: "",
      productName: "",
      checked1: true,
      checked2: true,
      currentPagePdf: 1,
      pageCountPdf: 0,
      isFullscreen: true,
      isFull: false,
    };
  },
  beforeMount() {
    this.getScreenHeight();
    this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    window.addEventListener("fullscreenchange", this.handleKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
    window.removeEventListener("fullscreenchange", this.handleKeyDown);
  },
  watch: {
    "editForm.upfilename1"(val, old) {
      if (val) {
        this.editForm.filename1 = this.customNamesEdit[0];
      } else {
        this.editForm.filename1 = "";
        this.fileListEdit1 = [];
      }
    },
    "editForm.upfilename2"(val, old) {
      if (val) {
        this.editForm.filename2 = this.customNamesEdit[1];
      } else {
        this.editForm.filename2 = "";
        this.fileListEdit2 = [];
      }
    },
  },
  methods: {
    getData() {
      QueryXYLProductSOP(this.getForm).then((res) => {
        if (res.Success) {
          this.tableData = res.Data.list;
          this.total = res.Data.Total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    getProductName(queryString, cb) {
      if (queryString != "") {
        GetESReportViewProduct({
          ProductName: queryString,
        }).then((res) => {
          cb(res.Data);
        });
      }
    },
    getPdfSrc(guid, name) {
      DQXYLProductSOP({
        prosop_guid: guid,
      }).then((res) => {
        this.pdfsrc = `data:application/pdf;base64,${res.Data}`;
        this.pdfBlob = res.Data;
        this.pdfName = name;
        this.browseVisible = true;
      });
    },
    downLoadPdf() {
      const url = URL.createObjectURL(
        new Blob([this.pdfBlob], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = this.pdfName;
      link.click();
      URL.revokeObjectURL(url);
    },
    handleSelect(obj) {
      this.productName = obj.ProductName;
    },
    openAdd() {
      this.dialogVisible = true;
    },
    openEdit() {
      this.editVisible = true;
    },
    handleDelete(row) {
      this.$confirm("是否删除", "提示", {
        type: "warning",
      })
        .then(() => {
          DeleteXYLProductSOP({
            ProductName: row.prosop_product,
            UserNo: getToken(),
          }).then((res) => {
            if (res.Success) {
              this.$message({
                message: res.Msg,
                type: "success",
              });
              this.getData();
            } else {
              this.$message.warning(res.Msg);
            }
          });
        })
        .catch(() => {
          this.$notify({
            type: "info",
            title: "提示信息",
            message: "已取消删除",
          });
        });
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.formRef.resetFields();
    },
    handleEdit(row) {
      this.editVisible = true;
      this.editForm.ProductName = row.prosop_product;
      this.editForm.filename1 = row.prosop_name;
      this.editForm.filename2 = row.prosop_name2;
      this.customNamesEdit = [row.prosop_name, row.prosop_name2];
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
    handleKeyDown() {
      if (document.fullscreenElement) {
        // console.log('已进入全屏');
        this.isFullscreen = true;
        this.$refs.myElement.style.opacity = "1";
        this.$refs.myElement.style.height = "auto";
      } else {
        // console.log('已退出全屏');
        this.isFullscreen = false;
        this.$refs.myElement.style.opacity = "0";
        this.$refs.myElement.style.height = "0";
      }
    },
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 220;
        // this.tableHeight1 =
      });
    },
    srcFull() {
      let full = document.fullscreenElement;
      if (!full) {
        // document自带的全屏方法
        // document.documentElement.requestFullscreen();
        this.isFullscreen = true;
        this.isFull = false;
        this.$refs.myElement.style.opacity = "1";
        this.$refs.myElement.style.height = "auto";
      } else {
        // document自带的推出全屏方法
        // document.exitFullscreen();
        this.isFullscreen = false;
        this.isFull = true;
        this.$refs.myElement.style.opacity = "0";
        this.$refs.myElement.style.height = "0";
      }

      let fullDiv = "";
      // console.log(this.$route.path);

      fullDiv = document.getElementById("src");
      // console.log(fullDiv);

      if (fullDiv) {
        //找到后调用自带的toggle事件进行放大操作
        screenfull.toggle(fullDiv);
        this.isFullscreen = false;
      } else {
        //判断浏览器是否支持该组件
        if (!screenfull.enabled) {
          // this.$message({
          //   message: "you browser can not work",
          //   type: "warning",
          // });
          // return false;
          // this.isFullscreen = false;
        }
        //放大页面 左侧菜单栏不会隐藏
        screenfull.toggle();
      }
    },

    // 重置上传
    resetUpload() {
      this.productSelect = "";
      this.productName = "";
      this.$refs.upload.clearFiles();
      this.fileList = [];
      this.customNames = [];
    },
    resetEdit() {
      this.editForm = {
        ProductName: "",
        upfilename1: true,
        filename1: "",
        base64String1: "",
        upfilename2: true,
        filename2: "",
        base64String2: "",
        UserNo: "",
      };
      this.fileListEdit1 = [];
      this.fileListEdit2 = [];
    },
    // 获取文件名（不含扩展名）
    getBaseName(filename) {
      return filename.replace(/\.pdf$/i, "");
    },

    //上传部分
    file1UpChange(file, fileList) {
      // 限制只能上传1个文件
      if (fileList.length > 1) {
        fileList.splice(1, fileList.length - 1);
        this.$message.warning("最多只能上传1个文件");
      }
      this.fileListUp1 = fileList;
      // 初始化自定义文件名
      this.customNames[0] = file.name;
    },
    file1UpRemove(file, fileList) {
      this.fileListUp1 = fileList;
      // 同步更新自定义文件名数组
      this.customNames[0] = "";
    },
    file2UpChange(file, fileList) {
      // 限制只能上传1个文件
      if (fileList.length > 1) {
        fileList.splice(1, fileList.length - 1);
        this.$message.warning("最多只能上传1个文件");
      }
      this.fileListUp2 = fileList;
      // 初始化自定义文件名
      this.customNames[1] = file.name;
    },
    file2UpRemove(file, fileList) {
      this.fileListUp2 = fileList;
      // 同步更新自定义文件名数组
      this.customNames[1] = "";
    },
    async upLoad() {
      if (this.fileListUp1.length === 0 && this.fileListUp2.length === 0) {
        this.$message.warning("请先选择要上传的文件");
        return;
      }
      this.startLoading();
      let file1Base64 = "";
      let file2Base64 = "";
      if (this.fileListUp1.length != 0) {
        await this.blobToBase64(this.fileListUp1[0].raw).then((base64) => {
          // 如果只需要纯 Base64 部分，可以去掉前缀：
          file1Base64 = base64.split(",")[1];
        });
      }
      if (this.fileListUp2.length != 0) {
        await this.blobToBase64(this.fileListUp2[0].raw).then((base64) => {
          // 如果只需要纯 Base64 部分，可以去掉前缀：
          file2Base64 = base64.split(",")[1];
        });
      }
      // const formData = new FormData();
      // if (this.fileListUp1.length !== 0) {
      //   formData.append("filename1", this.customNames[0]);
      //   formData.append(
      //     "base64String1",
      //     this.fileListUp1[0].raw,
      //     this.customNames[0]
      //   );
      // }
      // if (this.fileListUp2.length !== 0) {
      //   formData.append("filename2", this.customNames[0]);
      //   formData.append(
      //     "base64String2",
      //     this.fileListUp2[0].raw,
      //     this.customNames[1]
      //   );
      // }
      // formData.append("ProductName", "4050212144400");
      // formData.append("UserNo", getToken());
      InsertXYLProductSOP({
        ProductName: this.productName,
        filename1: this.customNames[0],
        base64String1: file1Base64,
        filename2: this.customNames[1],
        base64String2: file2Base64,
        UserNo: getToken(),
      }).then((res) => {
        if (res.Code == 200) {
          this.$message({
            message: res.Msg,
            type: "success",
          });
          this.dialogVisible = false;
          this.getData();
        } else {
          this.$message.error(res.Msg);
        }
        this.endLoading();
      });
    },

    //修改部分
    file1EditChange(file, fileList) {
      // 限制只能上传1个文件
      if (fileList.length > 1) {
        fileList.splice(1, fileList.length - 1);
        this.$message.warning("最多只能上传1个文件");
      }
      this.fileListEdit1 = fileList;
      // 初始化自定义文件名
      this.editForm.filename1 = file.name;
    },
    file1EditRemove(file, fileList) {
      this.fileListEdit1 = fileList;
      // 同步更新自定义文件名数组
      this.editForm.filename1 = "";
    },
    file2EditChange(file, fileList) {
      // 限制只能上传1个文件
      if (fileList.length > 1) {
        fileList.splice(1, fileList.length - 1);
        this.$message.warning("最多只能上传1个文件");
      }
      this.fileListEdit2 = fileList;
      // 初始化自定义文件名
      this.editForm.filename2 = file.name;
    },
    file2EditRemove(file, fileList) {
      this.fileListEdit2 = fileList;
      // 同步更新自定义文件名数组
      this.editForm.filename2 = "";
    },
    async edit() {
      if (this.fileListEdit1.length === 0 && !this.editForm.upfilename1) {
        this.$message.warning("请先选择要上传的文件");
        return;
      }
      if (this.fileListEdit2.length === 0 && !this.editForm.upfilename2) {
        this.$message.warning("请先选择要上传的文件");
        return;
      }
      if (this.editForm.filename1 == "") {
        this.$message.warning("文件名不能为空");
        return;
      }
      if (this.editForm.filename2 == "") {
        this.$message.warning("文件名不能为空");
        return;
      }
      this.startLoading();
      let file1Base64 = "";
      let file2Base64 = "";
      if (this.fileListEdit1.length != 0) {
        await this.blobToBase64(this.fileListEdit1[0].raw).then((base64) => {
          // 如果只需要纯 Base64 部分，可以去掉前缀：
          file1Base64 = base64.split(",")[1];
        });
      }
      if (this.fileListEdit2.length != 0) {
        await this.blobToBase64(this.fileListEdit2[0].raw).then((base64) => {
          // 如果只需要纯 Base64 部分，可以去掉前缀：
          file2Base64 = base64.split(",")[1];
        });
      }
      // const formData = new FormData();
      // if (this.fileListUp1.length !== 0) {
      //   formData.append("filename1", this.customNames[0]);
      //   formData.append(
      //     "base64String1",
      //     this.fileListUp1[0].raw,
      //     this.customNames[0]
      //   );
      // }
      // if (this.fileListUp2.length !== 0) {
      //   formData.append("filename2", this.customNames[0]);
      //   formData.append(
      //     "base64String2",
      //     this.fileListUp2[0].raw,
      //     this.customNames[1]
      //   );
      // }
      // formData.append("ProductName", "4050212144400");
      // formData.append("UserNo", getToken());
      UpdateXYLProductSOP({
        ...this.editForm,
        base64String1: file1Base64,
        base64String2: file2Base64,
        UserNo: getToken(),
      }).then((res) => {
        if (res.Code == 200) {
          this.$message({
            message: res.Msg,
            type: "success",
          });
          this.editVisible = false;
          this.getData();
        } else {
          this.$message.error(res.Msg);
        }
        this.endLoading();
      });
    },

    // 全部的上传前的校验
    beforeUpload(file) {
      const isPDF = file.type === "application/pdf";
      const isLt20M = file.size / 1024 / 1024 < 5;

      if (!isPDF) {
        this.$message.error("只能上传PDF格式的文件!");
        return false;
      }
      if (!isLt20M) {
        this.$message.error("文件大小不能超过5MB!");
        return false;
      }

      return true;
    },
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); // 转换为 Base64
        reader.onload = () => resolve(reader.result); // 返回 data:URL 格式（如 "data:image/png;base64,..."）
        reader.onerror = (error) => reject(error);
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
    changePdfPage(val) {
      if (val === 0 && this.currentPagePdf > 1) {
        this.currentPagePdf--;
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPagePdf < this.pageCountPdf) {
        this.currentPagePdf++;
        // console.log(this.currentPage)
      }
    },

    // pdf加载时
    loadPdfHandler(e) {
      this.currentPagePdf = 1; // 加载的时候先加载第一页
    },
    pdfError(e) {
      console.log(e);
    },
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

.file-item {
  width: 620px;
}

::v-deep .el-form-item {
  margin-bottom: 10px;
}

/* 自定义头部样式 */
.dialog-header {
  display: flex;
  //justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* 固定按钮在顶部右侧 */
.top-button {
  position: absolute;
  right: 20px;
  top: 12px;
}

.upload {
  display: flex;
  justify-content: space-between;

  .file1 {
    width: 50%;
  }

  .file2 {
    width: 50%;
  }
}

.upload-name {
  display: flex;
  justify-content: space-between;

  .file1 {
    width: 50%;
  }

  .file2 {
    width: 50%;
  }
}

.full {
  width: 100%;
  height: 0;
  background-color: #4a4a4acf;
  overflow: hidden;
  opacity: 0;

  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
