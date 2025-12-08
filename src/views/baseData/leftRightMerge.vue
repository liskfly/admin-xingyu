<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <el-button type="primary" @click="openAdd">添加</el-button>
        <!-- <div>
          <el-input v-model="getForm.panelmerge_id" placeholder="请输入合并ID"  style="width: 350px"  @change="getData" clearable> >
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div> -->
        <div>
          <el-input v-model="searchText" placeholder="请输入ID或名称" style="width: 350px" @keyup.enter.native="getSearchData"
            clearable @clear="clearData">
            <el-button slot="append" icon="el-icon-search" @click="getSearchData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        " border :height="tableHeight" style="width: 100%" size="mini">
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="55" fixed="left" align="center">
          <template v-slot="{ $index }">
            {{ $index + 1 + (currentPage - 1) * pageSize }}
          </template>
        </el-table-column>

        <!-- 数据列 -->
        <el-table-column prop="panelmerge_id" label="合并ID" width="220" fixed="left" />
        <el-table-column prop="panelmerge_name" label="合并名称" width="150" />

        <!-- 左灯信息列组 -->
        <el-table-column label="左灯信息">
          <af-table-column prop="panelmerge_left_no" label="物料编码" width="120" />
          <af-table-column prop="panelmerge_left_name" label="物料名称" width="150" />
          <af-table-column prop="panelmerge_left_desc" label="物料规格" width="200" />
        </el-table-column>

        <!-- 右灯信息列组 -->
        <el-table-column label="右灯信息">
          <el-table-column prop="panelmerge_right_no" label="物料编码" width="120" />
          <el-table-column prop="panelmerge_right_name" label="物料名称" width="150" />
          <el-table-column prop="panelmerge_right_desc" label="物料规格" width="200" />
        </el-table-column>

        <el-table-column prop="panelmerge_manywo" label="多工单" width="90" align="center">
          <template v-slot="{ row }">
            <el-tag :type="row.panelmerge_manywo ? 'primary' : 'info'">
              {{ row.panelmerge_manywo ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>

        <af-table-column prop="panelmerge_updateuser" label="操作人">
        </af-table-column>
        <af-table-column prop="panelmerge_updatedate" label="操作时间">
        </af-table-column>
        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="140" align="center">
          <template v-slot="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-document" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100, 200]"
          layout="total,sizes, prev, pager, next" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'添加'" :visible.sync="dialogVisible" width="85%" @close="addCancel()">
      <el-form :model="form" ref="formRef" label-width="auto" size="small">
        <div class="form-section">
          <el-row :gutter="20" class="dense-row">
            <el-col :span="12">
              <el-form-item label="合并名称" class="mb-2" prop="panelmerge_name">
                <el-input v-model="form.panelmerge_name" placeholder="名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合并ID" class="mb-2">
                <el-input v-model="allCode" readonly placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-section">
          <el-row :gutter="20">
            <!-- 左灯信息 -->
            <el-col :span="12" class="compact-col">
              <div class="section-title">左灯信息</div>
              <el-row :gutter="8">
                <el-col :span="12">
                  <el-form-item label="物料编码" class="mb-2">
                    <el-autocomplete v-model="form.panelmerge_left_no" :fetch-suggestions="remoteMethod"
                      placeholder="请输入4050开头的编码" @select="change1">
                    </el-autocomplete>
                    <!-- <el-select v-model="form.panelmerge_left_no" @change="change1" filterable remote reserve-keyword
                      placeholder="请输入关键词" :remote-method="remoteMethod1">
                      <el-option v-for="item in options1" :key="item.part_no" :label="item.part_no"
                        :value="item.part_no">
                      </el-option>
                    </el-select> -->
                    <!-- <el-input v-model="form.panelmerge_left_no" placeholder="编码" /> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="名称" class="mb-2">
                    <el-input v-model="form.panelmerge_left_name" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="规格" class="mb-2">
                    <el-input v-model="form.panelmerge_left_desc" type="textarea" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <!-- 分隔线 -->
            <div class="vertical-divider"></div>

            <!-- 右灯信息 -->
            <el-col :span="12" class="compact-col">
              <div class="section-title">右灯信息</div>
              <el-row :gutter="8">
                <el-col :span="12">
                  <el-form-item label="物料编码" class="mb-2">
                    <el-autocomplete v-model="form.panelmerge_right_no" :fetch-suggestions="remoteMethod"
                      placeholder="请输入4050开头的编码" @select="change2">
                    </el-autocomplete>
                    <!-- <el-select v-model="form.panelmerge_right_no" @change="change2" filterable remote reserve-keyword
                      placeholder="请输入关键词" :remote-method="remoteMethod2">
                      <el-option v-for="item in options2" :key="item.part_no" :label="item.part_no"
                        :value="item.part_no">
                      </el-option>
                    </el-select> -->
                    <!-- <el-input v-model="form.panelmerge_right_no" placeholder="编码" /> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="名称" class="mb-2">
                    <el-input v-model="form.panelmerge_right_name" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="规格" class="mb-2">
                    <el-input v-model="form.panelmerge_right_desc" type="textarea" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-form-item label="多工单模式" prop="order">
          <el-switch v-model="form.panelmerge_manywo" active-text="启用" inactive-text="停用" :active-value="true"
            :inactive-value="false" />
        </el-form-item>

        <!-- 其他设置 -->
        <!-- <div class="form-section">
          <h3 class="section-title">其他设置</h3>
         
        </div> -->
        <!-- 大板明细 -->
        <div class="form-section">
          <h3 class="section-title">大板明细</h3>
          <el-table :data="form.bomlist" border size="small" class="sub-table" :height="200">
            <el-table-column label="序号" width="60" align="center">
              <template v-slot="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>

            <el-table-column label="拼板物料编码">
              <template v-slot="{ row, $index }">
                <el-select v-model="row.panelmergebom_no" placeholder="" size="small" filterable
                  @change="changePuzzle1($event, $index)" style="width: 100%">
                  <el-option v-for="item in puzzlesOptions" :key="item.PN" :label="item.PN" :value="item.PN">
                  </el-option>
                </el-select>
                <!-- <el-input v-model="row.panelmergebom_no" size="small" /> -->
              </template>
            </el-table-column>

            <!-- <el-table-column label="是否公用" width="100">
              <template v-slot="{ row }">
                <el-switch v-model="row.panelmergebom_isshared"> </el-switch>
              </template>
            </el-table-column> -->
            <el-table-column label="使用数量">
              <template v-slot="{ row }">
                <el-input-number v-model="row.panelmergebom_qty" size="small" :min="1"/>
              </template>
            </el-table-column>
            <el-table-column label="成品名称">
              <template v-slot="{ row }">
                <el-input v-model="row.panelmergebom_name" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="成品规格">
              <template v-slot="{ row }">
                <el-input v-model="row.panelmergebom_desc" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100" align="center">
              <!-- <template v-slot="{ $index }">
                <el-button v-if="$index === form.bomlist.length - 1" type="text" icon="el-icon-plus"
                  @click="addSmallBoard" />
                <el-button v-else type="text" icon="el-icon-delete" class="text-red-500"
                  @click="removeBoardItem($index)" />
              </template> -->
              <template v-slot="{ $index }">
                <el-button type="primary" v-if="$index === form.bomlist.length - 1" size="mini" icon="el-icon-plus"
                  @click="addSmallBoard"></el-button>
                <el-button v-else type="danger" size="mini" icon="el-icon-delete"
                  @click="removeBoardItem($index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'详情'" :visible.sync="detailVisible" width="85%" @close="addCancel()">
      <el-form :model="editForm" ref="editFormRef" label-width="auto" size="small">
        <div class="form-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="合并名称" class="mb-2">
                <el-input v-model="editForm.panelmerge_name" placeholder="名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合并ID" class="mb-2">
                <el-input :value="editForm.panelmerge_id" readonly placeholder="自动生成" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-section">
          <el-row :gutter="20">
            <!-- 左灯信息 -->
            <el-col :span="12" class="compact-col">
              <div class="section-title">左灯信息</div>
              <el-row :gutter="8">
                <el-col :span="12">
                  <el-form-item label="物料编码" class="mb-2">
                    <el-autocomplete v-model="editForm.panelmerge_left_no" :fetch-suggestions="remoteMethod"
                      placeholder="请输入内容" @select="change3">
                    </el-autocomplete>
                    <!-- <el-select v-model="editForm.panelmerge_left_no" @change="change3" filterable remote reserve-keyword
                      placeholder="请输入关键词" :remote-method="remoteMethod3">
                      <el-option v-for="item in options3" :key="item.part_no" :label="item.part_no"
                        :value="item.part_no">
                      </el-option>
                    </el-select> -->
                    <!-- <el-input v-model="editForm.panelmerge_left_no" placeholder="编码" /> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="名称" class="mb-2">
                    <el-input v-model="editForm.panelmerge_left_name" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="规格" class="mb-2">
                    <el-input v-model="editForm.panelmerge_left_desc" type="textarea" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <!-- 分隔线 -->
            <div class="vertical-divider"></div>

            <!-- 右灯信息 -->
            <el-col :span="12" class="compact-col">
              <div class="section-title">右灯信息</div>
              <el-row :gutter="8">
                <el-col :span="12">
                  <el-form-item label="物料编码" class="mb-2">
                    <el-autocomplete v-model="editForm.panelmerge_right_no" :fetch-suggestions="remoteMethod"
                      placeholder="请输入内容" @select="change4">
                    </el-autocomplete>
                    <!-- <el-select v-model="editForm.panelmerge_right_no" @change="change4" filterable remote
                      reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod4">
                      <el-option v-for="item in options4" :key="item.part_no" :label="item.part_no"
                        :value="item.part_no">
                      </el-option>
                    </el-select> -->
                    <!-- <el-input v-model="editForm.panelmerge_right_no" placeholder="编码" /> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="名称" class="mb-2">
                    <el-input v-model="editForm.panelmerge_right_name" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="规格" class="mb-2">
                    <el-input v-model="editForm.panelmerge_right_desc" type="textarea" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-form-item label="多工单模式" prop="order">
          <el-switch v-model="editForm.panelmerge_manywo" active-text="启用" inactive-text="停用" :active-value="true"
            :inactive-value="false" />
        </el-form-item>

        <!-- 其他设置 -->
        <!-- <div class="form-section">
          <h3 class="section-title">其他设置</h3>
         
        </div> -->
        <div class="form-section">
          <h3 class="section-title">大板明细</h3>
          <el-table :data="editForm.bomlist" style="width: 100%" border :height="200" size="mini">
            <el-table-column label="序号" width="55">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="拼板物料编码">
              <template v-slot="{ row, $index }">
                <!-- <el-input v-model="row.panelmergebom_no" size="small" /> -->
                <el-select v-model="row.panelmergebom_no" placeholder="" size="small" filterable
                  @change="changePuzzle($event, $index)" style="width: 100%">
                  <el-option v-for="item in puzzlesOptions" :key="item.PN" :label="item.PN" :value="item.PN">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <!-- <el-table-column label="是否公用" width="120">
              <template v-slot="{ row }">
                <el-switch v-model="row.panelmergebom_isshared"> </el-switch>
              </template>
            </el-table-column> -->
             <el-table-column label="使用数量">
              <template v-slot="{ row }">
                <el-input-number v-model="row.panelmergebom_qty" size="small" :min="1"/>
              </template>
            </el-table-column>
            <el-table-column label="成品名称">
              <template v-slot="{ row }">
                <el-input v-model="row.panelmergebom_name" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="成品规格">
              <template v-slot="{ row }">
                <el-input v-model="row.panelmergebom_desc" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template v-slot="{ $index }">
                <!-- <el-button  type="text" icon="el-icon-plus"
                  @click="addDetailSmallBoard" /> -->
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDetailDelete($index)" />
                <el-button type="primary" size="mini" icon="el-icon-plus" v-if="$index === editForm.bomlist.length - 1"
                  @click="addDetailSmallBoard"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDeailCancel()">取 消</el-button>
        <el-button type="primary" @click="onDeailSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  QueryPanelmergeAllList,
  QueryPanelmerge,
  addPanelmergeList,
  DeletePanelmerge,
  QueryFoundation,
  findPanelizationList,
} from "@/api/puzzleApi";
import { getToken } from "@/utils/auth";
import { min } from "moment";
export default {
  data() {
    return {
      searchText: "",
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableHeight: 0,
      getForm: {
        panelmerge_id: "",
      },
      dialogVisible: false,
      activeName: "smallBoard",
      form: {
        id: 0,
        panelmerge_name: "",
        panelmerge_left_no: "",
        panelmerge_left_name: "",
        panelmerge_left_desc: "",
        panelmerge_right_no: "",
        panelmerge_right_name: "",
        panelmerge_right_desc: "",
        panelmerge_manywo: false,
        panelmerge_updateuser: "",
        bomlist: [
          {
            panelmergebom_no: "",
            panelmergebom_name: "",
            panelmergebom_desc: "",
          },
        ],
      },
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      detailVisible: false,
      editForm: {
        id: 0,
        panelmerge_name: "string",
        panelmerge_left_no: "string",
        panelmerge_left_name: "string",
        panelmerge_left_desc: "string",
        panelmerge_right_no: "string",
        panelmerge_right_name: "string",
        panelmerge_right_desc: "string",
        panelmerge_manywo: false,
        panelmerge_updateuser: "string",
        bomlist: [
          {
            panelmergebom_no: "string",
            panelmergebom_name: "string",
            panelmergebom_desc: "string",
          },
        ],
      },
      allCode: "",
      puzzlesOptions: [],
    };
  },
  watch: {
    "form.panelmerge_left_no"(val) {
      this.allCode = val;
      if (this.form.panelmerge_right_no !== "") {
        this.form.panelmerge_manywo = true;
        this.allCode = val + "+" + this.form.panelmerge_right_no;
      }
      if (val == "") {
        this.form.panelmerge_left_name = "";
        this.form.panelmerge_left_desc = "";
      }
    },
    "form.panelmerge_right_no"(val) {
      this.allCode = val;
      if (this.form.panelmerge_left_no !== "") {
        this.form.panelmerge_manywo = true;
        this.allCode = this.form.panelmerge_left_no + "+" + val;
        // this.form.bomlist[0].panelmergebom_no =
        //   this.form.panelmerge_left_no +
        //   "+" +
        //   this.form.panelmerge_right_no +
        //   "-1";
      }
      if (val == "") {
        this.form.panelmerge_right_name = "";
        this.form.panelmerge_right_desc = "";
      }
    },
    "getForm.panelmerge_id"(val) {
      this.currentPage = 1;
      this.getData();
    },
    "editForm.panelmerge_right_no"(val) {
      if (val == "") {
        this.editForm.panelmerge_right_name = "";
        this.editForm.panelmerge_right_desc = "";
      }
    },
    "editForm.panelmerge_left_no"(val) {
      if (val == "") {
        this.editForm.panelmerge_left_name = "";
        this.editForm.panelmerge_left_desc = "";
      }
    },
  },
  beforeMount() {
    this.getScreenHeight();
    this.getData();
    this.getPuzzles();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      QueryPanelmergeAllList(this.getForm).then((res) => {
        if (res.Success) {
          this.tableData = res.Data;
          // this.total = res.total;
        }
      });
    },
    getPuzzles() {
      findPanelizationList({
        PageIndex: 1,
        PageSize: 1000,
        SearchText: "",
        StartTime: "",
        EndTime: "",
      }).then((res) => {
        if (res.Success) {
          this.puzzlesOptions = res.Data.list;
        }
      });
    },
    getSearchData() {
      QueryPanelmergeAllList({
        panelmerge_id: "",
      }).then((res) => {
        if (res.Success) {
          if (res.Data.length === 0) {
            this.$notify.error({
              title: "提示信息",
              message: "未查询到相关数据",
            });
            return;
          }
          let searchName = this.searchText.toLowerCase();
          this.currentPage = 1;
          this.tableData = res.Data.filter((v) => {
            if (
              String(v.panelmerge_id).toLowerCase().indexOf(searchName) > -1 ||
              String(v.panelmerge_name).toLowerCase().indexOf(searchName) > -1
            ) {
              return true;
            } else {
              return false;
            }
          });
          // this.total = res.total;
        }
      });
    },
    clearData() {
      this.searchText = "";

      this.currentPage = 1; // 清除搜索时重置页码
      this.getData();
    },
    openAdd() {
      this.dialogVisible = true;
    },
    addSmallBoard() {
      this.form.bomlist.push({
        // panelmergebom_no: (() => {
        //   const parts = [];
        //   // 将非空的左右编号加入数组
        //   if (this.form.panelmerge_left_no)
        //     parts.push(this.form.panelmerge_left_no);
        //   if (this.form.panelmerge_right_no)
        //     parts.push(this.form.panelmerge_right_no);
        //   // 使用加号连接并拼接序号
        //   const prefix = parts.join("+");
        //   return `${prefix ? prefix + "-" : ""}${1 + this.form.bomlist.length}`;
        // })(),
        panelmergebom_no: "",
        panelmergebom_name: "",
        panelmergebom_desc: "",
        // panelmergebom_isshared: false
        panelmergebom_qty:1
      });
    },
    removeBoardItem(index) {
      this.form.bomlist.splice(index, 1);
      if (this.form.bomlist.length === 0) {
        this.form.bomlist.push({
          panelmergebom_no: "",
          panelmergebom_name: "",
          panelmergebom_desc: "",
          // panelmergebom_isshared: false
           panelmergebom_qty:1
        });
      }
    },
    change1(val) {
      // console.log(val);
      this.form.panelmerge_left_name = val.part_name;
      this.form.panelmerge_left_desc = val.part_desc;
      // this.form.panelmerge_left_name = this.options1.find(
      //   (item) => item.part_no === val
      // ).part_name;
      // this.form.panelmerge_left_desc = this.options1.find(
      //   (item) => item.part_no === val
      // ).part_desc;
    },
    change2(val) {
      this.form.panelmerge_right_name = val.part_name;
      this.form.panelmerge_right_desc = val.part_desc;
    },
    change3(val) {
      this.editForm.panelmerge_left_name = val.part_name;
      this.editForm.panelmerge_left_desc = val.part_desc;
    },
    change4(val) {
      this.editForm.panelmerge_right_name = val.part_name;
      this.editForm.panelmerge_right_desc = val.part_desc;
    },
    remoteMethod(query, cb) {
      if (query.length >= 5) {
        QueryFoundation({
          part_no: query,
          part_type: "0",
        }).then((res) => {
          if (res.Data.length === 0 || !res.Data) {
            this.$notify.error({
              title: "提示信息",
              message: "未查询到相关数据",
            });
            cb([]);
            return;
          }
          const searchData = res.Data.map((item) => {
            return {
              value: item.part_no,
              ...item,
            };
          });

          cb(searchData);
        });
      }
    },
    changePuzzle1(val, index) {
      // console.log(val,index);
      const selectedOption = this.puzzlesOptions.find(
        (option) => option.PN === val
      );

      if (selectedOption) {
        this.form.bomlist[index].panelmergebom_no = selectedOption.PN;
        this.form.bomlist[index].panelmergebom_name = selectedOption.name;
        this.form.bomlist[index].panelmergebom_desc = selectedOption.pn_spec;
        this.form.bomlist[index].panelmergebom_isshared = false;
      }
    },
    changePuzzle(val, index) {
      // console.log(val,index);

      const selectedOption = this.puzzlesOptions.find(
        (option) => option.PN === val
      );
      if (selectedOption) {
        this.editForm.bomlist[index].panelmergebom_name = selectedOption.name;
        this.editForm.bomlist[index].panelmergebom_desc =
          selectedOption.pn_spec;
        this.editForm.bomlist[index].panelmergebom_isshared = false;
      }
    },
    onSubmit() {
      this.form.panelmerge_updateuser = getToken();
      if (
        this.form.bomlist.length === 1 &&
        this.form.bomlist[0].panelmergebom_no === ""
      ) {
        this.$notify.error({
          title: "提示信息",
          message: "请添加拼板物料编码",
        });
        return;
      }
      addPanelmergeList(this.form).then((res) => {
        if (res.Success) {
          this.$notify.success({
            title: "提示信息",
            message: "添加成功",
          });
          this.dialogVisible = false;
          this.options1 = [];
          this.options2 = [];
          this.getData();
        } else {
          this.$notify.error({
            title: "提示信息",
            message: res.Msg,
          });
        }
      });
    },
    addCancel() {
      this.dialogVisible = false;
      this.options1 = [];
      this.options2 = [];
      this.form = {
        id: 0,
        panelmerge_name: "",
        panelmerge_left_no: "",
        panelmerge_left_name: "",
        panelmerge_left_desc: "",
        panelmerge_right_no: "",
        panelmerge_right_name: "",
        panelmerge_right_desc: "",
        panelmerge_manywo: false,
        panelmerge_updateuser: "",
        bomlist: [
          {
            panelmergebom_no: "",
            panelmergebom_name: "",
            panelmergebom_desc: "",
            // panelmergebom_isshared: false
             panelmergebom_qty:1
          },
        ],
      };
    },
    handleEdit(row) {
      // this.editForm = { ...row };
      QueryPanelmerge({ id: row.id }).then((res) => {
        // console.log(res);

        if (res.Success) {
          this.editForm = res.Data;
          if (this.editForm.bomlist.length === 0) {
            this.editForm.bomlist.push({
              panelmergebom_no: "",
              panelmergebom_name: "",
              panelmergebom_desc: "",
              // panelmergebom_isshared: false
               panelmergebom_qty:1
            });
          }
          this.detailVisible = true;
        } else {
          this.$notify.error({
            title: "提示信息",
            message: res.Msg,
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("是否删除该数据？", "提示", {
        type: "warning",
      })
        .then(() => {
          DeletePanelmerge({ id: row.id }).then((res) => {
            if (res.Success) {
              this.$notify.success({
                title: "提示信息",
                message: "删除成功",
              });
              this.getData();
            } else {
              this.$notify.error({
                title: "提示信息",
                message: res.Msg,
              });
            }
          });
        })
        .catch(() => {
          this.$notify.info({
            title: "提示信息",
            message: "已取消删除",
          });
        });
    },
    handleDetailDelete(index) {
      this.editForm.bomlist.splice(index, 1);
      if (this.editForm.bomlist.length === 0) {
        this.editForm.bomlist.push({
          panelmergebom_no: "",
          panelmergebom_name: "",
          panelmergebom_desc: "",
          // panelmergebom_isshared: false
           panelmergebom_qty:1
        });
      }
    },
    addDetailSmallBoard() {
      this.editForm.bomlist.push({
        // panelmergebom_no: (() => {
        //   const parts = [];
        //   // 将非空的左右编号加入数组
        //   if (this.editForm.panelmerge_left_no)
        //     parts.push(this.editForm.panelmerge_left_no);
        //   if (this.editForm.panelmerge_right_no)
        //     parts.push(this.editForm.panelmerge_right_no);
        //   // 使用加号连接并拼接序号
        //   const prefix = parts.join("+");
        //   return `${prefix ? prefix + "-" : ""}${1 + this.editForm.bomlist.length}`;
        // })(),
        panelmergebom_no: "",
        panelmergebom_name: "",
        panelmergebom_desc: "",
        // panelmergebom_isshared: false
         panelmergebom_qty:1
      });
    },
    addDeailCancel() {
      this.detailVisible = false;
      this.options3 = [];
      this.options4 = [];
      this.editForm = {
        id: 0,
        panelmerge_name: "",
        panelmerge_left_no: "",
        panelmerge_left_name: "",
        panelmerge_left_desc: "",
        panelmerge_right_no: "",
        panelmerge_right_name: "",
        panelmerge_right_desc: "",
        panelmerge_manywo: false,
        panelmerge_updateuser: "",
        bomlist: [
          {
            panelmergebom_no: "",
            panelmergebom_name: "",
            panelmergebom_desc: "",
            // panelmergebom_isshared: false
             panelmergebom_qty:1
          },
        ],
      };
    },
    onDeailSubmit() {
      // if(this.editForm.bomlist.length===1&&this.editForm.bomlist[0].panelmergebom_no===""){
      //   this.$notify.error({
      //     title: "提示信息",
      //     message: "请添加拼板物料编码",
      //   });
      //   return
      // }
      this.editForm.panelmerge_updateuser = getToken();
      addPanelmergeList(this.editForm).then((res) => {
        if (res.Success) {
          this.$notify.success({
            title: "提示信息",
            message: "修改成功",
          });
          this.detailVisible = false;
          this.options3 = [];
          this.options4 = [];
          this.getData();
        } else {
          this.$notify.error({
            title: "提示信息",
            message: res.Msg,
          });
        }
      });
    },
    // handleSizeChange(value) {
    //   //
    //   this.getForm.PageSize = value;
    //   this.getData();
    // },
    // handleCurrentChange(val) {
    //   this.getForm.PageIndex = val;
    //   this.getData();
    // },
    handleSizeChange(value) {
      this.pageSize = value;
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
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
  padding: 10px;
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
</style>
