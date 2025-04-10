<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="table_header">
        <el-button type="primary" @click="openAdd">添加</el-button>
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
        <el-table-column prop="puzzlesCode" label="拼板物料编号">
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称">
        </el-table-column>
        <el-table-column prop="materialSpec" label="物料规格">
        </el-table-column>
        <el-table-column prop="face" label="单双面" width="80" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-document" @click="handleEdit(scope.row)"
              ></el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              ></el-button
            >
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
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="'添加'"
      :visible.sync="dialogVisible"
      width="75%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="formRef" label-width="auto" size="mini">
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="拼板物料编号" prop="puzzlesCode">
              <el-input v-model="form.puzzlesCode" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="物料名称" prop="materialName">
              <el-input v-model="form.materialName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="物料规格" prop="materialSpec">
              <el-input
                v-model="form.materialSpec"
                placeholder=""
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="单双面" prop="face">
              <el-select v-model="form.face" placeholder="请选择">
                <el-option label="单" value="1" />
                <el-option label="双" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex justify-between">
          <el-button type="danger" @click="deleteBoard">删除</el-button>
        </div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="小板明细" name="smallBoard">
            <el-table
              :data="form.smallBoardTable"
              style="width: 100%"
              border
              :height="300"
              size="mini"
            >
              <el-table-column label="序号" width="55">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="PCB物料编码">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.PCBMaterial"
                    placeholder="请输入内容"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="拼板数量">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.puzzlesNum"
                    placeholder="请输入内容"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="模组序号">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.moduleNum"
                    placeholder="请输入内容"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="PCB成品编码">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.PCBFinishCode"
                    placeholder="请输入内容"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="物料名称">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.materialName"
                    placeholder="请输入内容"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="物料规格">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.materialSpec"
                    placeholder="请输入内容"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.$index === form.smallBoardTable.length - 1"
                    type="primary"
                    @click="addSmallBoard"
                    size="small"
                    >添加一项</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'详情'"
      :visible.sync="detailVisible"
      width="75%"
      @close="addCancel()"
      
    >
      <el-form :model="editForm" ref="formRef" label-width="auto" size="mini">
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="拼板物料编号" prop="puzzlesCode">
              <el-input v-model="editForm.puzzlesCode" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="物料名称" prop="materialName">
              <el-input v-model="editForm.materialName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="物料规格" prop="materialSpec">
              <el-input
                v-model="editForm.materialSpec"
                placeholder=""
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="单双面" prop="face">
              <el-select v-model="editForm.face" placeholder="请选择">
                <el-option label="单" value="1" />
                <el-option label="双" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="小板明细" name="smallBoard">
            <el-table
              :data="smallBoardTable"
              style="width: 100%"
              border
              :height="300"
              size="mini"
            >
              <el-table-column label="序号" width="55">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="PCB物料编码" prop="PCBMaterial">
              </el-table-column>
              <el-table-column label="拼板数量" prop="puzzlesNum">
              </el-table-column>
              <el-table-column label="模组序号" prop="moduleNum">
              </el-table-column>
              <el-table-column label="PCB成品编码" prop="PCBFinishCode">
              </el-table-column>
              <el-table-column label="物料名称" prop="materialName">
              </el-table-column>
              <el-table-column label="物料规格" prop="materialSpec">
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="handleDetailEdit(scope.row)"
                  ></el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="handleDetailDelete(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          puzzlesCode: "4050238313100+4050238313200-1",
          materialName: "E115 前照灯2日行灯",
          materialSpec: "E115 前照灯2日行灯",
          face: "单",
          updater: "admin",
          create_time: "2025-03-12 10:00:00",
        },
      ],
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
        puzzlesCode: "",
        materialName: "",
        materialSpec: "",
        face: "",
        smallBoardTable: [
          {
            PCBMaterial: "",
            puzzlesNum: "",
            PCBFinishCode: "",
            moduleNum: "",
            materialName: "",
            materialSpec: "",
          },
        ],
      },
      detailVisible: false,
      editForm: {
        puzzlesCode: "",
        materialName: "",
        materialSpec: "",
        face: "",
      },
      smallBoardTable: [
        {
          PCBMaterial: "1050570595100",
          puzzlesNum: "2",
          moduleNum: "",
          PCBFinishCode: "4050238313100-2a",
          materialName: "PCB板",
          materialSpec: "E115前照灯2驱动L四层",
        }, 
        {
          PCBMaterial: "1050570595200",
          puzzlesNum: "2",
          moduleNum: "",
          PCBFinishCode: "4050238313200-2a",
          materialName: "PCB板",
          materialSpec: "E115 前照灯2驱动R四层",
        },
      ],
    };
  },
  beforeMount() {
    this.getScreenHeight();
    // this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    openAdd() {
      this.dialogVisible = true;
    },
    addSmallBoard() {
      this.form.smallBoardTable.push({
        PCBMaterial: "",
        puzzlesNum: "",
        PCBFinishCode: "",
        materialName: "",
        materialSpec: "",
      });
    },
    deleteBoard() {
      this.form.smallBoardTable.pop();
    },
    handleEdit(row) {
      this.editForm = { ...row };
      this.detailVisible = true;
    },
    addCancel() {
      this.detailVisible = false
    },
    handleDetailEdit() {},
    handleDetailDelete() {},
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
