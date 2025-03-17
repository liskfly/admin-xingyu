<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="table_header">
        <el-button type="primary" @click="openAdd">添加</el-button>
      </div>
      <el-table :data="tableData" border :height="tableHeight" style="width: 100%">
        <!-- <el-table-column type="index" label="序号" width="55" /> -->
        <el-table-column label="序号" width="55" fixed="left">
          <template slot-scope="scope">
            <span>{{
              scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="leftRightID" label="左右合并ID" width="250"  fixed="left">
        </el-table-column>
        <af-table-column prop="leftNum" label="左灯物料编码">
        </af-table-column>
        <af-table-column prop="leftName" label="左灯物料名称">
        </af-table-column>
        <af-table-column prop="leftSpec" label="左灯物料规格">
        </af-table-column>
        <af-table-column prop="rightNum" label="右灯物料编码">
        </af-table-column>
        <af-table-column prop="rightName" label="右灯物料名称">
        </af-table-column>
        <af-table-column prop="rightSpec" label="右灯物料规格">
        </af-table-column>
        <af-table-column prop="remark" label="备注 ">
        </af-table-column>
        <af-table-column prop="order" label="多工单">
          <template slot-scope="scope">
            <span>{{ scope.row.order ? "是" : "否" }}</span>

          </template>
        </af-table-column>
        
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-document" @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="'添加'" :visible.sync="dialogVisible" width="75%" @close="addCancel()" >
      <el-form :model="form" ref="formRef" label-width="auto" size="mini" style="padding: 8px;">
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="左灯物料编码" prop="leftNum">
              <el-input v-model="form.leftNum" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="左灯物料名称" prop="leftName">
              <el-input v-model="form.leftName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
        
          <el-col :span="12" :offset="0">
            <el-form-item label="左灯物料规格" prop="leftSpec">
              <el-input v-model="form.leftSpec" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="右灯物料编码" prop="rightNum">
              <el-input v-model="form.rightNum" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="右灯物料名称" prop="rightName">
              <el-input v-model="form.rightName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="右灯物料规格" prop="rightSpec">
              <el-input v-model="form.rightSpec" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
           
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="" />
            </el-form-item>


        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item >
              <el-checkbox v-model="form.order">多工单</el-checkbox>
            </el-form-item>
            </el-col>
        
        </el-row>
        <!-- <div class="flex justify-between">
          <el-button type="danger" @click="deleteBoard">删除</el-button>
        </div> -->
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="大板明细" name="smallBoard">
            <el-table :data="form.smallBoardTable" style="width: 100%" border :height="200" size="mini">
              <el-table-column label="序号" width="55">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="拼板物料编码">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.puzzleMaterial" placeholder="请输入内容" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="成品名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.finishName" placeholder="请输入内容" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="成品规格">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.finishSpec" placeholder="请输入内容" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button v-if="scope.$index === form.smallBoardTable.length - 1" type="primary"
                    @click="addSmallBoard" size="small">添加一项</el-button>
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
    <el-dialog :title="'详情'" :visible.sync="detailVisible" width="75%" @close="addCancel()">
      <el-form :model="editForm" ref="formRef" label-width="auto" size="mini">
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="左灯物料编码" prop="leftNum">
              <el-input v-model="editForm.leftNum" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="左灯物料名称" prop="leftName">
              <el-input v-model="editForm.leftName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
        
          <el-col :span="12" :offset="0">
            <el-form-item label="左灯物料规格" prop="leftSpec">
              <el-input v-model="editForm.leftSpec" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="右灯物料编码" prop="rightNum">
              <el-input v-model="editForm.rightNum" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="右灯物料名称" prop="rightName">
              <el-input v-model="editForm.rightName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="右灯物料规格" prop="rightSpec">
              <el-input v-model="editForm.rightSpec" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
           
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
              <el-input v-model="editForm.remark" placeholder="" />
            </el-form-item>


        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item >
              <el-checkbox v-model="editForm.order">多工单</el-checkbox>
            </el-form-item>
            </el-col>
        
        </el-row>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="大板明细" name="smallBoard">
            <el-table :data="smallBoardTable" style="width: 100%" border :height="200" size="mini">
              <el-table-column label="序号" width="55">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="拼板物料编码" prop="puzzleMaterial">
              </el-table-column>
              <el-table-column label="成品名称" prop="finishName">
              </el-table-column>
              <el-table-column label="成品规格" prop="finishSpec">
              </el-table-column>
             
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit"
                    @click="handleDetailEdit(scope.row)"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete"
                    @click="handleDetailDelete(scope.row)"></el-button>
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
          leftRightID: "4050238313100+4050238313200",
          leftNum: "4050238313100",
          leftName: "E115 前照灯2L",
          leftSpec: "E115 前照灯2L",
          rightNum: "4050238313200",
          rightName: "线路板分总成2",
          rightSpec: "E115前照灯2R 3711080-QR01",
          remark: "16",
          order: true,
          face: "单",
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
        leftNum: "",
        leftName: "",
        leftSpec: "",
        rightNum: "",
        rightName: "",
        rightSpec: "",
        remark: "",
        order: false,
        smallBoardTable: [
          {
            puzzleMaterial: "",
            finishName: "",
            finishSpec: "",
          },
        ],
      },
      detailVisible: false,
      editForm: {
        leftNum: "",
        leftName: "",
        leftSpec: "",
        rightNum: "",
        rightName: "",
        rightSpec: "",
        remark: "",
        order: true,
        productCraft: "",
        // smallBoardTable: [
        //   {
        //     puzzleMaterial: "",
        //     finishName: "",
        //     finishSpec: "",
        //   },
        // ],
      },
      smallBoardTable: [
        {
          puzzleMaterial: "4050238313100+4050238313200-1",
            finishName: "E115 前照灯2日行灯",
            finishSpec: "E115 前照灯2日行灯",
        },
        {
          puzzleMaterial: "4050238313100+4050238313200-2",
            finishName: "E115 前照灯2驱动板",
            finishSpec: "E115 前照灯2驱动板",
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
    handleDetailEdit() { },
    handleDetailDelete() { },
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
  padding: 10px ;
}
</style>
