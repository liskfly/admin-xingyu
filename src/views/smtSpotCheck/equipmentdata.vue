<template>
  <div class="firstdata">
    <el-card class="box-card">
      <div class="table_header">
        <el-button type="primary" @click="dialogVisible = true">添加</el-button>
        <!-- <div class="input_box">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="getlistText.searchText"
            class="input-with-select"
            @input="getSearchData"
            @change="getSearchData"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div> -->
      </div>
      <div class="table_container">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          border
           :height="tableHeight"
          row-key="Step1"
          style="width: 100%"
          :tree-props="{ children: 'stepItemList', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="Step1" label="检验工序"> </el-table-column>
          <el-table-column prop="Name" label="检验设备"> </el-table-column>
          <el-table-column prop="SubItem" label="检验项"> </el-table-column>
          <el-table-column prop="SubItemName" label="检验名称">
          </el-table-column>
          <el-table-column prop="SubItemAim" label="检验目标">
          </el-table-column>
          <el-table-column prop="SubItemMethod" label="检验方法">
          </el-table-column>
          <el-table-column prop="SubItemBasic" label="检验标准">
          </el-table-column>

          <el-table-column prop="SubItemSolution" label="结果处理方式">
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope" v-if="scope.row.Step1 % 1 !== 0">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>

              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 15px">
          <el-pagination
            align="center"
             background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[5,10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog title="添加" :visible.sync="dialogVisible">
      <el-form
        ref="addform"
        :rules="rules"
        :model="addForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验工序" prop="step">
              <el-input
                v-model.number="addForm.step"
                placeholder="检验工序"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="内容" prop="inspectContent">
          <el-input
            type="textarea"
            v-model="addForm.inspectContent"
            placeholder="内容"
          ></el-input>
        </el-form-item>
        <!-- <el-divider></el-divider> -->
        <!-- <el-row v-for="(addForm2, index) in addForm.stepItemList" :key="index">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="检查编号"
                :prop="`stepItemList[${index}].subItem`"
              >
                <el-input
                  v-model.number="addForm2.subItem"
                  placeholder="子项编号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检查类型">
                <el-select
                  v-model="addForm2.subItemType"
                  placeholder="检查类型"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="检查名称"
            :prop="`stepItemList[${index}].subItemName`"
          >
            <el-input
              v-model="addForm2.subItemName"
              placeholder="子项名称"
            ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="检查目标"
                :prop="`stepItemList[${index}].subItemAim`"
              >
                <el-input
                  type="textarea"
                  v-model="addForm2.subItemAim"
                  placeholder="子项检查目标"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item
                label="检验方法"
                :prop="`stepItemList[${index}].subItemMethod`"
              >
                <el-input
                  type="textarea"
                  v-model="addForm2.subItemMethod"
                  placeholder="子项检验方法"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="检验标准"
                :prop="`stepItemList[${index}].subItemBasic`"
              >
                <el-input
                  type="textarea"
                  v-model="addForm2.subItemBasic"
                  placeholder="子项检验标准"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item
                label="解决办法"
                :prop="`stepItemList[${index}].subItemSolution`"
              >
                <el-input
                  type="textarea"
                  v-model="addForm2.subItemSolution"
                  placeholder="子项检查解决办法"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
        </el-row> -->
      </el-form>
      <el-divider></el-divider>
      <el-form
        ref="addStepItem"
        :rules="rules"
        :model="addStepItem"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="编号" prop="subItem">
              <el-input
                v-model.number="addStepItem.subItem"
                placeholder="子项编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查类型" prop="subItemType">
              <el-select
                v-model="addStepItem.subItemType"
                placeholder="检查类型"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="名称" prop="subItemName">
          <el-input
            v-model="addStepItem.subItemName"
            placeholder="子项名称"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查目标">
              <el-input
                type="textarea"
                v-model="addStepItem.subItemAim"
                placeholder="子项检查目标"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="检验方法">
              <el-input
                type="textarea"
                v-model="addStepItem.subItemMethod"
                placeholder="子项检验方法"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查标准">
              <el-input
                type="textarea"
                v-model="addStepItem.subItemBasic"
                placeholder="检查标准"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="解决办法">
              <el-input
                type="textarea"
                v-model="addStepItem.subItemSolution"
                placeholder="子项检查解决办法"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="dialogEditVisible">
      <el-form ref="eidtForm" :model="editForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验工序" prop="step">
              <el-input
                v-model.number="editForm.step"
                placeholder="检验工序"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="editForm.name" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="内容" prop="inspectContent">
          <el-input
            type="textarea"
            v-model="editForm.inspectContent"
            placeholder="内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-form ref="eidtForm2" :model="stepItemList" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="编号">
              <el-input
                v-model.number="stepItemList.subItem"
                placeholder="子项编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查类型">
              <el-select
                v-model="stepItemList.subItemType"
                placeholder="检查类型"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="名称">
          <el-input
            v-model="stepItemList.subItemName"
            placeholder="子项名称"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查目标">
              <el-input
                type="textarea"
                v-model="stepItemList.subItemAim"
                placeholder="子项检查目标"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="检验方法">
              <el-input
                type="textarea"
                v-model="stepItemList.subItemMethod"
                placeholder="子项检验方法"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查标准">
              <el-input
                type="textarea"
                v-model="stepItemList.subItemBasic"
                placeholder="检查标准"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="解决办法">
              <el-input
                type="textarea"
                v-model="stepItemList.subItemSolution"
                placeholder="子项检查解决办法"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getInspectData,
  setInspectData,
  editInspectData,
  delInspectData,
} from "@/api/all";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogEditVisible: false,
      tableData: [],
      currentPage: 1, // 当前页码
      //   total: 0, // 总条数
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      inspectText: {
        product: "",
        inspectType: "EI",
        stepList: [
          {
            step: 0,
            status: "",
            name: "",
            inspectContent: "",
            stepItemList: [
              {
                subItemName: "",
                subItem: 0,
                subItemMethod: "",
                subItemBasic: "",
                subItemSolution: "",
                subItemAim: "",
                subItemType: "",
              },
            ],
          },
        ],
      },
      addForm: {
        step: "",
        status: "I",
        name: "",
        inspectContent: "",
        stepItemList: [],
      },
      addStepItem: {
        subItemName: "",
        subItem: "",
        subItemMethod: "",
        subItemBasic: "",
        subItemSolution: "",
        subItemAim: "",
        subItemType: "",
      },
      editForm: {
        step: "",
        status: "I",
        name: "",
        inspectContent: "",
        stepItemList: [],
      },
      stepItemList: {
        subItemName: "",
        subItem: "",
        subItemMethod: "",
        subItemBasic: "",
        subItemSolution: "",
        subItemAim: "",
        subItemType: "",
      },
      typeList: [
        {
          lable: "白班，夜班执行",
          value: "S",
        },
        {
          lable: "每天执行一次",
          value: "D",
        },
        {
          lable: "每周执行一次",
          value: "W",
        },
        {
          lable: "每月执行一次",
          value: "M",
        },

        {
          lable: "每季执行一次",
          value: "Q",
        },
        {
          lable: "每年执行一次",
          value: "Y",
        },
      ],
      rules: {
        step: [
          {
            required: true,
            message: "检验步骤，1,2,3,4 表示步骤",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入检验名称", trigger: "change" },
        ],
        subItem: [
          { required: true, message: "请输入子项编号", trigger: "change" },
        ],
        subItemName: [
          { required: true, message: "请子项名称", trigger: "change" },
        ],
        subItemType: [
          { required: true, message: "选择检查类型，", trigger: "change" },
        ],
      },
      itemPass1: "",
      itemPass2: "",
    };
  },
  created() {
    this.getData();
  },
  watch: {
    "addForm.step"(a) {
      this.inputValue(a);
    },
  },
   beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      this.startLoading();
      getInspectData(this.inspectText)
        .then(({ data }) => {
          // this.tableData = data.InOrList;
          let a = [];
          data.InOrList.forEach((item) => {
            let isExist = a.findIndex((ela) => ela.Name == item.Name);
            if (isExist != -1) {
              a[isExist].stepItemList.push({
                ...item,
                Step1: a[isExist].Step + "." + item.SubItem,
              });
            } else {
              let obj = {
                Name: item.Name,
                InspectContent:item.InspectContent,
                Step: item.Step,
                Step1: item.Step,
                stepItemList: [],
              };
              obj.stepItemList.push({
                ...item,
                Step1: item.Step + "." + item.SubItem,
              });
              a.push(obj);
            }
          });
          this.tableData = a;
          // console.log(a);
          if (
            this.tableData.length % this.pageSize == 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
          }
          this.endLoading();
        })
        .catch((error) => {
          this.endLoading();
          console.log(error);
        });
    },
    addCancel() {
      this.dialogVisible = false;
      this.$refs.addStepItem.resetFields();
    },
    onSubmit() {
      this.$refs.addform.validate((valid) => (this.itemPass1 = valid));
      this.$refs.addStepItem.validate((valid) => (this.itemPass2 = valid));
      if (this.itemPass1 && this.itemPass2) {
        // alert("submit!");

        let form = {
          product: "",
          inspectType: "EI",
          stepList: [],
        };
        this.addForm.stepItemList[0] = this.addStepItem;
        form.stepList.push(this.addForm);
        // console.log(form);
        this.startLoading();
        setInspectData(form)
          .then(({ data }) => {
            this.endLoading();
            this.getData();
            this.dialogVisible = false;
            // let codeData = JSON.parse(data.replace(/[\r|\n|\t]/g), "");
            if (data.Status == "NG") {
              this.$alert(codeData.Message, "错误信息", {
                confirmButtonText: "确定",
              });
            } else {
              this.$message({
                type: "success",
                message: "添加成功!",
              });
            }
          })
          .catch((error) => {
            this.endLoading();
            console.log(error);
          });
      } else {
        this.$alert("添加失败,请完成必填项", "错误信息", {
          confirmButtonText: "确定",
        });
      }
    },
    editCancel() {
      this.dialogEditVisible = false;
      this.$refs.eidtForm.resetFields();
    },
    editSubmit() {
      let editText = {
        product: "",
        inspectType: "EI",
        stepList: [],
      };
      editText.stepList.push(this.editForm);
      // console.log(editText);
      this.startLoading();
      editInspectData(editText)
        .then(({ data }) => {
          this.endLoading();
          this.getData();
          this.dialogEditVisible = false;
          if (data.Status == "NG") {
            this.$alert(data.Message, "错误信息", {
              confirmButtonText: "确定",
            });
          } else {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          }
        })
        .catch((error) => {
          this.endLoading();
          console.log(error);
        });
    },
    handleEdit(index, row) {
      this.eidtData(row);
      this.dialogEditVisible = true;
    },
    handleDelete(index, row) {
      this.eidtData(row);
      let editText = {
        product: "",
        inspectType: "EI",
        stepList: [],
      };
      editText.stepList.push(this.editForm);
      // console.log(editText);
      this.$confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delInspectData(editText).then((res) => {
            this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;

            this.getData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    eidtData(row) {
      this.editForm.status = row.Status;
      this.editForm.step = row.Step;
      this.editForm.name = row.Name;
      this.editForm.inspectContent = row.InspectContent;
      this.stepItemList = {
        subItemName: row.SubItemName,
        subItem: row.SubItem,
        subItemMethod: row.SubItemMethod,
        subItemBasic: row.SubItemBasic,
        subItemSolution: row.SubItemSolution,
        subItemAim: row.SubItemAim,
        subItemType: row.SubItemType,
      };
      this.editForm.stepItemList[0] = this.stepItemList;
    },
    inputValue(value) {
      let isExit = this.tableData.find((item) => item.Step == parseInt(value));
      console.log(isExit);
      if (value && isExit != undefined) {
        this.addForm.name = isExit.Name;
          this.addForm.inspectContent = isExit.InspectContent;
        this.addStepItem.subItem = isExit.stepItemList.length + 1;
      } else {
        this.addForm.name = "";
        this.addStepItem.subItem = 1;
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
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
    getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 300;

        //后面的50：根据需求空出的高度，自行调整
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.firstdata {
  padding: 20px;
  .table_header {
    padding-bottom: 20px;
    display: flex;
    gap: 30px;
    justify-content: space-between;
    align-items: center;
    .input_box {
      width: 400px;
    }
  }
}
</style>
