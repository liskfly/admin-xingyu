<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="table_header">
        <el-button type="primary" @click="dialogVisible = true">添加</el-button>
      </div>
      <div class="table_container">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          max-height="500"
          border
          style="width: 100%"
        >
          <el-table-column
            fixed
            prop="ticket_number" 
            label="订单号"
            min-width="120"
          >
          </el-table-column>
          <el-table-column  min-width="120" prop="customer_order" label="客户单号">
          </el-table-column>
          <el-table-column prop="department" label="部门"> </el-table-column>
          <el-table-column prop="type" label="类别"> </el-table-column>
          <el-table-column min-width="100" prop="date_order" label="下单日期">
          </el-table-column>
          <el-table-column min-width="100" prop="delivery_time" label="交期"> </el-table-column>
          <el-table-column prop="salesman" label="业务员"> </el-table-column>
          <el-table-column prop="product_name" label="产品名称">
          </el-table-column>
          <el-table-column prop="product_model" label="产品型号">
          </el-table-column>
          <el-table-column prop="end_customer" label="最终客户">
          </el-table-column>
          <el-table-column prop="unit" label="单位"> </el-table-column>
          <el-table-column prop="quantity" label="数量"> </el-table-column>
          <el-table-column prop="quantity_delivered" label="已交数量">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 15px">
          <el-pagination
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="添加订单数据"
      @close="editCancel()"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="工单号">
          <el-input
            v-model="form.ticket_number"
            placeholder="请输入工单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户单号">
          <el-input
            v-model="form.customer_order"
            placeholder="请输入客户订单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input
            v-model="form.department"
            placeholder="请输入部门"
          ></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-input v-model="form.type" placeholder="请输入类别"></el-input>
        </el-form-item>
        <el-form-item label="下单日期">
          <el-date-picker
            v-model="form.date_order"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交期">
          <el-date-picker
            v-model="form.delivery_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="业务员">
          <el-input
            v-model="form.salesman"
            placeholder="请输入业务员"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input
            v-model="form.product_name"
            placeholder="请输入产品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-input
            v-model="form.product_model"
            placeholder="请输入产品类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="最终客户">
          <el-input
            v-model="form.end_customer"
            placeholder="请输入最终客户"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" placeholder="请输入单位"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="form.quantity" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item label="已交数量">
          <el-input
            v-model="form.quantity_delivered"
            placeholder="请输入已交数量"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改BOM产品"
      :visible.sync="dialogEide"
      width="50%"
      @close="editCancel()"
    >
      <el-form ref="form" :model="formEdit" label-width="80px">
        <el-form-item label="工单号">
          <el-input
            v-model="formEdit.ticket_number"
            placeholder="请输入工单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户单号">
          <el-input
            v-model="formEdit.customer_order"
            placeholder="请输入客户订单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input
            v-model="formEdit.department"
            placeholder="请输入部门"
          ></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-input v-model="formEdit.type" placeholder="请输入类别"></el-input>  
        </el-form-item>
        <el-form-item label="下单日期">
          <el-date-picker
            v-model="formEdit.date_order"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交期">
          <el-date-picker
            v-model="formEdit.delivery_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="业务员">
          <el-input
            v-model="formEdit.salesman"
            placeholder="请输入业务员"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input
            v-model="formEdit.product_name"
            placeholder="请输入产品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-input
            v-model="formEdit.product_model"
            placeholder="请输入产品类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="最终客户">
          <el-input
            v-model="formEdit.end_customer"
            placeholder="请输入最终客户"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="formEdit.unit" placeholder="请输入单位"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input
            v-model="formEdit.quantity"
            placeholder="请输入数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="已交数量">
          <el-input
            v-model="formEdit.quantity_delivered"
            placeholder="请输入已交数量"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editCancel()">取消</el-button>
        <el-button type="primary" @click="editOrder()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    
<script>
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      tableData: [
        {
          ticket_number: 'SEORD004231',
          customer_order: 'SEORD004194',
          department: '制造部',
          type: '钢板',
          date_order: '2022-10-08',
          delivery_time: '2022-10-13',
          salesman: '张三',
          product_name: "防护置",
          product_model: "T800",
          end_customer: "创新谷",
          unit: "件",
          quantity: 20,
          quantity_delivered: 0,
        },
        {
          ticket_number: "SEORD004232",
          customer_order: "SEORD004194",
          department: "制造部",
          type: "钢板",
          date_order: "2022-10-08",
          delivery_time: "2022-10-13",
          salesman: "张三",
          product_name: "防护置",
          product_model: "T800",
          end_customer: "创新谷",
          unit: "件",
          quantity: "20",
          quantity_delivered: "0",
        },
        {
          ticket_number: "SEORD004233",
          customer_order: "SEORD004194",
          department: "制造部",
          type: "钢板",
          date_order: "2022-10-08",
          delivery_time: "2022-10-13",
          salesman: "张三",
          product_name: "防护置",
          product_model: "T800",
          end_customer: "创新谷",
          unit: "件",
          quantity: "20",
          quantity_delivered: "0",
        },
        {
          ticket_number: "SEORD004234",
          customer_order: "SEORD004194",
          department: "制造部",
          type: "钢板",
          date_order: "2022-10-08",
          delivery_time: "2022-10-13",
          salesman: "张三",
          product_name: "防护置",
          product_model: "T800",
          end_customer: "创新谷",
          unit: "件",
          quantity: "20",
          quantity_delivered: "0",
        },
        {
          ticket_number: "SEORD004235",
          customer_order: "SEORD004194",
          department: "制造部",
          type: "钢板",
          date_order: "2022-10-08",
          delivery_time: "2022-10-13",
          salesman: "张三",
          product_name: "防护置",
          product_model: "T800",
          end_customer: "创新谷",
          unit: "件",
          quantity: "20",
          quantity_delivered: "0",
        },
        {
          ticket_number: "SEORD004236",
          customer_order: "SEORD004194",
          department: "制造部",
          type: "钢板",
          date_order: "2022-10-08",
          delivery_time: "2022-10-13",
          salesman: "张三",
          product_name: "防护置",
          product_model: "T800",
          end_customer: "创新谷",
          unit: "件",
          quantity: "20",
          quantity_delivered: "0",
        },
        {
          ticket_number: "SEORD004237",
          customer_order: "SEORD004194",
          department: "制造部",
          type: "钢板",
          date_order: "2022-10-08",
          delivery_time: "2022-10-13",
          salesman: "张三",
          product_name: "防护置",
          product_model: "T800",
          end_customer: "创新谷",
          unit: "件",
          quantity: "20",
          quantity_delivered: "0",
        },
      ],
      currentPage: 1,
      pageSize: 5,
      total: 10,
      dialogVisible: false,
      form: {
        ticket_number: "",
        customer_order: "",
        department: "",
        type: "",
        date_order: "",
        delivery_time: "",
        salesman: "",
        product_name: "",
        product_model: "",
        end_customer: "",
        unit: "",
        quantity: "",
        quantity_delivered: "",
      },
      dialogEide: false,
      formEdit: {
        ticket_number: "",
        customer_order: "",
        department: "",
        type: "",
        date_order: "",
        delivery_time: "",
        salesman: "",
        product_name: "",
        product_model: "",
        end_customer: "",
        unit: "",
        quantity: "",
        quantity_delivered: "",
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    onSubmit() {
      // console.log(this.form);
      this.tableData.push(this.form);
      this.form = {
        subpiece_encod: "",
        unit: "",
        quantity: "",
        description: "",
        entry_time: "",
      };
      this.dialogVisible = false;
    },
    handleDelete(a, b) {
      // console.log(a, b);
      this.tableData = this.tableData.filter((t) => {
        return t.ticket_number != b.ticket_number;
      });
    },
    handleEdit(index, row) {
      this.dialogEide = true;
      this.formEdit = row;
    },
    editOrder() {
      this.tableData = this.tableData.map((t) => {
        if (t.ticket_number == this.formEdit.ticket_number) {
          return this.formEdit;
        } else {
          return t;
        }
      });
      this.dialogEide = false;
    },
    addCancel() {
      this.dialogVisible = false;
      this.form = {
        ticket_number: "",
        customer_order: "",
        department: "",
        type: "",
        date_order: "",
        delivery_time: "",
        salesman: "",
        product_name: "",
        product_model: "",
        end_customer: "",
        unit: "",
        quantity: "",
        quantity_delivered: "",
      };
    },
    editCancel() {
      this.dialogEide = false;
      this.formEdit = {
        ticket_number: "",
        customer_order: "",
        department: "",
        type: "",
        date_order: "",
        delivery_time: "",
        salesman: "",
        product_name: "",
        product_model: "",
        end_customer: "",
        unit: "",
        quantity: "",
        quantity_delivered: "",
      };
    },
  },
};
</script>
    <style lang="scss">
.table_header {
  padding-bottom: 20px;
}
</style>