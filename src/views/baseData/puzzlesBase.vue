<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <el-button type="primary" @click="openAdd">添加</el-button>
        <div>
          <el-input v-model="searchText" placeholder="请输入拼板物料编号,名称,规格" style="width: 350px"
            @keyup.enter.native="getSearchData" clearable @clear="clearData">
            <el-button slot="append" icon="el-icon-search" @click="getSearchData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table :data="tableData" border :height="tableHeight" size="small" style="width: 100%">
        <!-- <el-table-column type="index" label="序号" width="55" /> -->
        <el-table-column label="序号" width="55" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
            }}</span>
          </template>
        </el-table-column>
        <af-table-column prop="PN" label="拼板物料编号" width="220">
        </af-table-column>
        <el-table-column prop="name" label="物料名称"> </el-table-column>
        <el-table-column prop="pn_spec" label="物料规格"> </el-table-column>
        <el-table-column prop="faceNumber" label="单双面" width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.faceNumber == 1">单</span>
            <span v-else>双</span>
          </template>
        </el-table-column>
        <!-- <af-table-column prop="version" label="BOM版本"> </af-table-column> -->
        <el-table-column prop="softwareVersion" label="软件版本" width="80">
        </el-table-column>
        <af-table-column prop="Ud_usr" label="操作人" width="130">
        </af-table-column>
        <af-table-column prop="Ud_dt" label="操作时间" width="145">
        </af-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-tooltip content="详情" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-document" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
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
    <el-dialog :title="'添加'" :visible.sync="dialogVisible" width="85%" @close="addCancel()">
      <el-form :model="form" ref="formRef" label-width="auto" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item label="拼板物料编号" prop="list.pn" class="mb-2">
              <el-input v-model="form.list.pn" placeholder="" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="物料名称" prop="list.name" class="mb-2">
              <el-input v-model="form.list.name" placeholder="" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="物料规格" prop="list.model" class="mb-2">
              <el-input v-model="form.list.model" placeholder="" type="textarea" size="small" />
            </el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item label="单双面" prop="list.side" class="mb-2">
              <el-select v-model="form.list.side" placeholder="请选择" style="width: 100%" size="small">
                <el-option label="单" value="1" />
                <el-option label="双" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8" :offset="0">
            <el-form-item label="BOM版本" prop="version" class="mb-2">
              <el-input v-model="form.list.version" placeholder="" />
            </el-form-item>
          </el-col> -->
          <el-col :span="8" :offset="0">
            <el-form-item label="软件版本" prop="softwareVersion" class="mb-2">
              <el-input v-model="form.list.softwareVersion" placeholder="" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="PCB板子物料" prop="PCBMaterial" class="mb-2">
              <el-input v-model="form.list.PCBMaterial" placeholder="" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-section">
          <!-- <h3 class="section-title">小板明细</h3> -->
          <el-tabs type="border-card">
            <el-tab-pane label="小板明细">
              <el-table :data="form.Detail" style="width: 100%" border :height="300" size="small">
                <el-table-column label="序号" width="55">
                  <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="PCB物料编码">
                  <template slot-scope="scope">
                    <el-autocomplete v-model="scope.row.pcb_code" :fetch-suggestions="remoteMethod"
                      placeholder="105057开头的物料编码" @select="change($event, scope.$index)" size="small">
                    </el-autocomplete>
                    <!-- <el-select v-model="scope.row.pcb_code" @change="change($event, scope.$index)" filterable remote
                  reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" size="mini" >
                  <el-option v-for="item in options" :key="item.PN" :label="item.PN" :value="item.PN">
                  </el-option>
                </el-select> -->
                    <!-- <el-input v-model="scope.row.pcb_code" placeholder="请输入内容" size="mini" /> -->
                  </template>
                </el-table-column>
                <el-table-column label="拼板数量">
                  <template slot-scope="scope">
                    <el-input type="number" v-model.number="scope.row.small_board_qty" placeholder="请输入内容"
                      size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="模组开始序号">
                  <template slot-scope="scope">
                    <el-input type="number" v-model.number="scope.row.module_start" placeholder="请输入内容" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="模组结束序号">
                  <template slot-scope="scope">
                    <el-input type="number" v-model.number="scope.row.module_end" placeholder="请输入内容" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="小板成品编码">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.finished_code" placeholder="请输入内容" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="物料名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name" placeholder="请输入内容" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="物料规格">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.model" placeholder="请输入内容" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                  <!-- <template v-slot="{ $index }">
                <el-button v-if="$index === form.Detail.length - 1" type="text" icon="el-icon-plus"
                  @click="addSmallBoard" />
                <el-button v-else type="text" icon="el-icon-delete" class="text-red-500"
                  @click="removeBoardItem($index)" />
              </template> -->
                  <template v-slot="{ $index }">
                    <el-button type="primary" v-if="$index === form.Detail.length - 1" size="mini" icon="el-icon-plus"
                      @click="addSmallBoard"></el-button>
                    <el-button v-else type="danger" size="mini" icon="el-icon-delete"
                      @click="removeBoardItem($index)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane></el-tabs>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'详情'" :visible.sync="detailVisible" width="85%" @close="addDetailCancel()">
      <el-form :model="editForm" ref="editFormRef" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item label="拼板物料编号" prop="pn" class="mb-2">
              <el-input v-model="editForm.pn" placeholder="" disabled size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="物料名称" prop="name" class="mb-2">
              <el-input v-model="editForm.name" placeholder="" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="物料规格" prop="model" class="mb-2">
              <el-input v-model="editForm.model" placeholder="" size="small" /> </el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item label="单双面" prop="sdie" class="mb-2">
              <el-select v-model="editForm.side" placeholder="请选择" style="width: 100%" size="small">
                <el-option label="单" value="1" />
                <el-option label="双" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8" :offset="0">
            <el-form-item label="BOM版本" prop="version" class="mb-2">
              <el-input v-model="editForm.version" placeholder="" disabled />
            </el-form-item>
          </el-col> -->
          <el-col :span="8" :offset="0">
            <el-form-item label="软件版本" prop="softwareVersion" class="mb-2">
              <el-input v-model="editForm.softwareVersion" placeholder="" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="PCB板子物料" prop="PCBMaterial" class="mb-2">
              <el-input v-model="editForm.PCBMaterial" placeholder="" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-section">
          <el-tabs type="border-card">
            <el-tab-pane label="小板明细"> <el-table :data="smallBoardTable" style="width: 100%" border :height="350"
                size="small">
                <el-table-column label="序号" width="55">
                  <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="PCB物料编码" prop="pcb_code">
                  <template slot-scope="scope">
                    <el-autocomplete v-model="scope.row.pcb_code" :fetch-suggestions="remoteMethod" placeholder="10505"
                      @select="change1($event, scope.$index)" size="small">
                    </el-autocomplete>
                    <!-- <el-select v-model="scope.row.pcb_code" @change="change1($event, scope.$index)" filterable remote
                  reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod1" size="mini">
                  <el-option v-for="item in options1" :key="item.PN" :label="item.PN" :value="item.PN">
                  </el-option>
                </el-select> -->
                    <!-- <el-input v-model="scope.row.pcb_code" placeholder="" /> -->
                  </template>
                </el-table-column>
                <el-table-column label="拼板数量" prop="small_board_qty" width="100">
                  <template slot-scope="scope">
                    <el-input type="number" v-model.number="scope.row.small_board_qty" placeholder="" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="模组开始序号" prop="module_start" width="120">
                  <template slot-scope="scope">
                    <el-input type="number" v-model.number="scope.row.module_start" placeholder="" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="模组结束序号" prop="module_end" width="120">
                  <template slot-scope="scope">
                    <el-input type="number" v-model.number="scope.row.module_end" placeholder="" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="小板成品编码" prop="finished_code">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.finished_code" placeholder="" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="物料名称" prop="name">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name" placeholder="" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="物料规格" prop="model">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.model" placeholder="" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" icon="el-icon-delete"
                      @click="handleDetailDelete(scope.row)"></el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                      v-if="scope.$index === smallBoardTable.length - 1"
                      @click="handleDetailEdit(scope.row)"></el-button>

                  </template>
                </el-table-column>
              </el-table></el-tab-pane>
            <!-- <el-tab-pane label="高低配公用PCB物料"></el-tab-pane> -->
          </el-tabs>
          <!-- <div class="section-title flex justify-between">
            小板明细
          </div> -->


        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDetailCancel()">取 消</el-button>
        <el-button type="primary" @click="onDetailSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  findPanelizationList,
  // addPanelizationList,
  DeletePanelizationList,
  findPnDetail,
  addPanelizationdetail,
  // DeletePanelizationDetail,
  UpdatePanelizationDetail,
  findPartNumberData,
  UpdatePanelizationList,
} from "@/api/puzzleApi.js";
import dayjs from "dayjs";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      searchText: "",
      tableData1: [],
      tableData: [],
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
      activeName: "smallBoard",
      form: {
        list: {
          pn: "",
          model: "",
          side: "",
          name: "",
          version: "",
          softwareVersion: "",
          PCBMaterial: ""
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
        PCBMaterial: ""
      },
      upDateForm: {
        pnl_code: "",
        list: [],
      },
      smallBoardTable: [],
      songBoardVisible: false,
      detailForm: {},
      options: [],
      options1: [],
      rules: {
        "list.pn": [
          { required: true, message: "拼板物料编号不能为空", trigger: "blur" },
        ],
        " list.name": [
          { required: true, message: "物料名称不能为空", trigger: "change" },
        ],
        "list.model": [
          { required: true, message: "物料规格不能为空", trigger: "change" },
        ],
        "list.side": [
          { required: true, message: "单双面不能为空", trigger: "change" },
        ],
      },
    };
  },
  watch: {},
  beforeMount() {
    this.getScreenHeight();
    this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      findPanelizationList(this.getForm).then((res) => {
        if (res.Success) {
          this.tableData = res.Data.list.map((item) => {
            return {
              ...item,
              Ud_dt: dayjs(item.Ud_dt).format("YYYY-MM-DD HH:mm:ss"),
            };
          });
          this.total = res.Data.Total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    getSearchData() {
      findPanelizationList({
        PageIndex: 1,
        PageSize: 10000,
        SearchText: "",
        SearchModel: "",
        StartTime: "",
        EndTime: "",
      }).then((res) => {
        if (res.Data.list.length === 0) {
          this.$notify({
            type: "error",
            title: "提示信息",
            message: "未查询到相关数据",
          });
          return;
        }
        this.tableData1 = res.Data.list.map((item) => {
          return {
            ...item,
            Ud_dt: dayjs(item.Ud_dt).format("YYYY-MM-DD HH:mm:ss"),
          };
        });
        let searchName = this.searchText.toLowerCase();
        this.getForm.PageIndex = 1;
        this.tableData = this.tableData1.filter((v) => {

          if (String(v.PN).toLowerCase().indexOf(searchName) > -1 || String(v.name).toLowerCase().indexOf(searchName) > -1 || String(v.pn_spec).toLowerCase().indexOf(searchName) > -1) {
            return true;
          } else {
            return false;
          }
        });
        this.total = this.tableData.length;

      });
    },
    clearData() {
      this.searchText = "";
      this.getForm.PageIndex = 1;
      this.getData();
    },
    openAdd() {
      this.dialogVisible = true;
    },

    change(val, index) {
      this.form.Detail[index].name = val.name;
      this.form.Detail[index].model = val.pn_spec;
    },
    remoteMethod(query, cb) {
      const reg = /^105057\d*$/;
      if (query !== "" && reg.test(query)) {
        findPartNumberData(query).then((res) => {
          if (res.Success) {
            if (res.Data === null || res.Data.length === 0) {
              this.$notify({
                type: "error",
                title: "提示信息",
                message: "未查询到相关数据",
              });
              cb([]);
              return;
            }
            const searchData = JSON.parse(res.Data);
            cb(
              searchData.map((item) => {
                return {
                  value: item.PN,
                  ...item,
                };
              })
            );
          }
        });
      }
    },

    change1(val, index) {
      this.smallBoardTable[index].name = val.name;
      this.smallBoardTable[index].model = val.pn_spec;
    },
    remoteMethod1(query) {
      const reg = /^10505\d*$/;
      if (query !== "" && reg.test(query)) {
        findPartNumberData(query).then((res) => {
          if (res.Success) {
            this.options1 = JSON.parse(res.Data);
          } else {
            this.$notify({
              type: "error",
              title: "提示信息",
              message: res.Msg,
            });
          }
        });
      }
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
          DeletePanelizationList(row.PN).then((res) => {
            if (res.Success) {
              this.$notify({
                type: "success",
                title: "提示信息",
                message: res.Msg,
              });
              this.getData();
            } else {
              this.$notify({
                type: "error",
                title: "提示信息",
                message: res.Msg,
              });
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
    onSubmit() {
      // console.log(this.form);

      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // console.log("submit!");
          if (
            this.form.Detail.length === 1 &&
            this.form.Detail[0].finished_code === ""
          ) {
            this.$notify({
              type: "error",
              title: "提示信息",
              message: "小板明细不能为空",
            });
            return;
          }
          this.form.Detail = this.form.Detail.filter(
            (item) => item.finished_code !== ""
          );
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
        } else {
          this.$notify({
            type: "error",
            title: "提示信息",
            message: "请检查表单数据",
          });
          return false;
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
    handleEdit(row) {
      // console.log(row);
      this.upDateForm.pnl_code = row.PN;
      this.editForm = {
        pn: row.PN,
        model: row.pn_spec,
        side: row.faceNumber,
        name: row.name,
        version: row.version,
        softwareVersion: row.softwareVersion,
        PCBMaterial: row.PCBMaterial
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
        this.detailVisible = true;
        // console.log(this.smallBoardTable);
      });
    },
    upDateSubmit() {
      this.editForm.cr_user = getToken();
      this.editForm.cr_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      UpdatePanelizationList(this.editForm).then((res) => {
        if (res.Success) {
          // this.$notify({
          //   type: "success",
          //   title: "提示信息",
          //   message: res.Msg,
          // });
          // this.detailVisible = false;
          // this.getData();
        } else {
          this.$notify({
            type: "error",
            title: "提示信息",
            message: res.Msg,
          });
        }
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
      // if (this.smallBoardTable.length === 1 && this.smallBoardTable[0].finished_code === "") {
      //   this.$notify({
      //     type: "error",
      //     title: "提示信息",
      //     message: "小板明细不能为空",
      //   });
      //   return;
      // } else {
      this.upDateSubmit()
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
      // }
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
  padding: 20px 15px;
}
</style>
