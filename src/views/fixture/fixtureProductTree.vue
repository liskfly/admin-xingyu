<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-1 flex justify-between items-center">
        <div class="flex">
        </div>
        <div>
          <el-input v-model="searchName" clearable placeholder="请输入" @keyup.enter.native="searchData()"
            style="width: 350px">
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="searchData()"></el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table :data="tableData1.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
          " border :height="tableHeight" style="width: 100%" size="mini" ref="operaRecordRef" row-key="PD_modelID"
          :tree-props="{ children: 'children' }">
          <!-- <el-table-column prop="PD_model" label="产品编号"> </el-table-column> -->
          <el-table-column prop="PD_model" label="产品编号"> </el-table-column>
          <el-table-column prop="PN_Model" label="类型"> </el-table-column>
          <el-table-column prop="MaterialName" label="类型描述"> </el-table-column>
          <el-table-column prop="Category" label="类别">
            <template slot-scope="scope">
              <div>{{ returnType(scope.row.Category) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Qty" label="消耗量"> </el-table-column>
          <el-table-column prop="Dsc" label="描述"> </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData1.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { moldControl, specControl } from "@/api/all";
import { XY_WMS_Tools_SpecImportControl } from "@/api/fixtureProduct";
import { importExcelToJSON, exportTableToExcel } from "@/utils/exportExcel";
import dayjs from "dayjs";
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      tableData1: [],
      searchName: "",
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      tableHeight: 0,
      form: {
        productName: "",
        useage: "",
        toolsMold: "",
        remark: "",
        operationType: "I",
      },
      getText: {
        toolsMold: "*",
        remark: "",
        operationType: "Q",
      },
      getAllText: {
        toolsMold: "",
        remark: "",
        productName: "*",
        useage: 0,
        operationType: "Q",
      },
      typeList: [],
      itemPass1: "",
      titleType: "",
    };
  },
  watch: {
    searchName(newdata) {
      if (newdata == "") {
        this.tableData1 = this.tableData;
      } else {
        this.tableData1 = this.table1(newdata);
      }
    },
  },
  created() {
    // this.getData();
    this.getIDdata();
  },
  beforeMount() {
    this.getScreenHeight();
  },
  mounted() {
    window.addEventListener("resize", this.getScreenHeight);
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
  methods: {
    getData() {
      moldControl(this.getText).then((res) => {
        this.typeList = res.data.DataList;
      });
    },
    getIDdata() {
      this.startLoading();
      specControl(this.getAllText)
        .then(({ data }) => {
          this.endLoading();
          if (data.Status == "OK") {
            this.tableData = this.dataProcess(data.DataList);
            this.tableData.sort((a, b) => {
              return a.PD_model - b.PD_model;
            });
            console.log(this.tableData);
            
            this.tableData1 = this.tableData
            // console.log(this.tableData1);
            
          }
          if (
            this.tableData.length % this.pageSize == 0 &&
            this.currentPage > 1
          ) {
            this.currentPage--;
          }
        })
      // .catch(() => {
      //   this.endLoading();
      //   this.$message.error("请求数据失败，请刷新");
      // });
    },
    table1(newdata) {
      let searchName = newdata.toLowerCase();
      this.currentPage = 1;

      return this.tableData.filter((parentItem) => {
        // 检查父级的 PD_model 是否匹配
        const parentMatch = String(parentItem.PD_model).toLowerCase().includes(searchName);

        // 检查子级中是否有匹配项
        const childMatches = parentItem.children.filter(child =>
          String(child.PN_Model).toLowerCase().includes(searchName)
        );

        // 如果父级匹配或子级有匹配项，保留这个父级项目
        if (parentMatch || childMatches.length > 0) {
          // 如果需要只显示匹配的子项，可以替换 children 数组
          // parentItem.children = childMatches;
          return true;
        }

        return false;
      });
    },
    searchData() {
      if (this.searchName == "") {
        this.tableData1 = this.tableData;
      } else {
        this.tableData1 = this.table1(this.searchName);
      }
    },
    dataProcess(data) {
      const resultMap = new Map();
      // let reg=
      const dataArr=data.map(item=>{
        let lastIndex =item.PD_model.lastIndexOf('-')
        if(lastIndex !== -1){
          return {
            ...item,
            PD_model:item.PD_model.substring(0, lastIndex)
          }
        }
        return item
      })
      // console.log(dataArr);
      
      dataArr.forEach((item) => {
        const { PD_model, PN_Model, Qty, Dsc, Category, MaterialName } = item;

        if (!resultMap.has(PD_model)) {
          // 为每个唯一的PD_model创建一个新组
          resultMap.set(PD_model, {
            PD_model,
            PD_modelID: PD_model,
            children: []
          });
        }

        const group = resultMap.get(PD_model);

        // 检查此PD_model组中是否已存在相同的PN_Model
        const existingChildIndex = group.children.findIndex(child =>
          child.PN_Model === PN_Model
        );

        if (existingChildIndex === -1) {
          // 添加新的子项
          group.children.push({
            // PD_model,
            PN_Model,
            Qty,
            Dsc,
            Category,
            MaterialName,
            PD_modelID: `${PD_model}-${PN_Model}`
          });
        }
      });

      return Array.from(resultMap.values());
    },
    returnType(num) {
      let arr = [
        { Value: "1", Text: "印刷工治具" },
        { Value: "2", Text: "ICT工治具" },
        { Value: "3", Text: "样件" },
      ];
      let text = ''
      arr.forEach((i) => {
        if (i.Value == num) {
          text = i.Text;
        }
      })
      return text;
    },
    handleSizeChange(value) {
      this.pageSize = value;
    },
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
        this.tableHeight = window.innerHeight - 210;
        // this.tableHeight1 =
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
