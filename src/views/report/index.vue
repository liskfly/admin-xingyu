<template>
  <div class="report">
    <!-- <el-button type="primary" @click="dialogVisible = true"
      >不合格品报表</el-button
    > -->
    <!-- <el-dialog
      title="不合格品处理单"
      :visible.sync="dialogVisible"
      width="60%"
      custom-class="my-dialog"
      @close="editCancel()"
    > --> 
      <el-row>
        <el-col :span="24" :offset="0">
          <div>不合格品处理单</div>
          <el-form ref="form" :model="form" label-width="100px">
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="申请人" size="normal">
                  <el-input v-model="form.people" placeholder=""></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12" :offset="0">
                <el-form-item label="申请时间" size="normal">
                  <el-input
                    v-model="form.time"
                    placeholder="申请时间"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="所属部门">
                  <el-select
                    v-model="form.department"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option label="部门1" value="shanghai"></el-option>
                    <el-option label="部门2" value="beijing"></el-option>
                  </el-select> </el-form-item
              ></el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="审批状态">
                  <el-input
                    v-model="form.status"
                    placeholder="审批状态"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
            <div>审批内容</div>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="生产车间">
                  <el-input
                    v-model="form.workshop"
                    placeholder="生产车间"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="责任人" size="normal">
                  <el-input
                    v-model="form.responsible"
                    placeholder="责任人"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="名称规格">
                  <el-input
                    v-model="form.specification"
                    placeholder="产品名称规格"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="批量数" size="normal">
                  <el-input
                    v-model="form.batches"
                    placeholder="批量数"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="生产日期">
                  <el-input
                    v-model="form.date"
                    placeholder="生产日期"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="班次" size="normal">
                  <el-input v-model="form.shift" placeholder="班次"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="不良数L">
                  <el-input
                    v-model="form.defectiveL"
                    placeholder="不良数L"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="不良数R" size="normal">
                  <el-input
                    v-model="form.defectiveR"
                    placeholder="不良数R"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="不合格项" size="normal">
              <el-input
                v-model="form.nonconformances"
                placeholder="不合格项"
              ></el-input>
            </el-form-item>
            <el-form-item label="不合格描述" size="normal">
              <el-input
                v-model="form.description"
                placeholder="不合格描述"
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="注塑工序">
                  <el-input
                    v-model="form.injection"
                    placeholder="注塑工序"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="表处工序" size="normal">
                  <el-input
                    v-model="form.surface"
                    placeholder="表处工序"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="组装工序">
                  <el-input
                    v-model="form.assembling"
                    placeholder="组装工序"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="现场仓" size="normal">
                  <el-input
                    v-model="form.warehouse"
                    placeholder="现场仓"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="半成品库">
                  <el-input
                    v-model="form.semiFinished"
                    placeholder="半成品库"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="成品库" size="normal">
                  <el-input
                    v-model="form.finishedProduct"
                    placeholder="成品库"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="在途">
                  <el-input v-model="form.way" placeholder="在途"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="二库" size="normal">
                  <el-input
                    v-model="form.reservoir"
                    placeholder="二库"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="附件">
                  <el-input v-model="form.annex" placeholder="附件"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="检验员" size="normal">
                  <el-input
                    v-model="form.inspectors"
                    placeholder="检验员"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="0">
                <el-form-item label="检验班长">
                  <el-input
                    v-model="form.inspectionLeader"
                    placeholder="检验班长"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="处理意见" size="normal">
                  <el-input
                    v-model="form.comments"
                    placeholder="处理意见"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleCancel()">取 消</el-button>
        <el-button type="primary" @click="roleVerify()">确 定</el-button>
      </span>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        people: "罗",
        time: new Date().toLocaleDateString(),
        department: "",
        status: "",
        workshop: "",
        responsible: "",
        specification: "",
        batches: "",
        date: "",
        shift: "",
        defectiveL: "",
        defectiveR: "",
        nonconformances: "",
        description: "",
        injection: "",
        surface: "",
        assembling: "",
        warehouse: "",
        semiFinished: "",
        finishedProduct: "",
        way: "",
        reservoir: "",
        annex: "",
        inspectors: "",
        inspectionLeader: "",
        comments: "",
      },
      options: [
        {
          value: "部门1",
          lable: "部门1",
        },
        {
          value: "部门2",
          lable: "部门2",
        },
        {
          value: "部门3",
          lable: "部门3",
        },
      ],
    };
  },
  methods: {
    roleVerify() {
      this.dialogVisible = !this.dialogVisible;
    },
    roleCancel() {
      this.dialogVisible = !this.dialogVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
.report{
  padding: 15px;
  // width: 100%;
  // height: calc(100vh - 100px);
  // overflow: hidden;
}

</style>