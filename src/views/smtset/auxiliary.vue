<template>
  <div class="auxiliary">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :model="form"
          ref="form"
          class="form"
          label-width="80px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="产品名">
            <el-select
              v-model="form.product"
              @change="change"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in productArr"
                :key="item.Product"
                :label="item.Product"
                :value="item.Product"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="6" :offset="0">
              <el-form-item label="宽度(cm)">
                <el-input v-model="form.width" placeholder="宽度"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="速度(s)" size="normal">
                <el-input v-model="form.speed" placeholder="速度"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16" :offset="0">
              <el-form-item class="btn">
                <el-button type="primary" @click="onSubmit">设定 </el-button>
                <!-- <el-button>取消</el-button> -->
              </el-form-item></el-col
            >
          </el-row>
        </el-form>
      </div>  

      <div class="box" v-if="showBox">
        <!-- <div>设定：</div> -->
        <div>产品：{{ setData.product }}</div>
        <div>宽度：{{ setData.width }} cm</div>
        <div>速度：{{ setData.speed }} s</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getProduct, getProductDetail, insetProductData } from "@/api/all";
export default {
  data() {
    return {
      form: {
        product: "",
        width: "",
        speed: "",
        updatetime: "",
      },
      productArr: [],
      showBox: false,
      setData: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getProduct({
        product: "string",
      }).then(({ data }) => {
        this.productArr = data.Products;
        // console.log(this.productArr);
      });
    },
    onSubmit() {
      this.form.updatetime = new Date().toJSON();
      this.showBox = true;
      
      insetProductData(this.form).then(({data}) => {
        if(data.Status=="OK"){
          this.setData = { ...this.form };
            this.$message({
              type:'success',
              message:'设定成功'
            })
        }else{
            this.$alert(data.Message, "提示信息", {
            confirmButtonText: "确定",
          });
        }
      });
      // console.log(this.form);
    },
    change(name) {
      this.form.width = "";
      this.form.speed = "";
      let productName = {
        product: `${name}`,
      };
      getProductDetail(productName).then(({ data }) => {
        // console.log(data);
        this.form.width = data.Width;
        this.form.speed = data.Speed;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.auxiliary {
  box-sizing: border-box;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .form {
    display: flex;
    flex-direction: column;
    // gap: 5vh;
    .btn {
      display: flex;
      // margin-left: 200px;
      justify-content: center;
    }
  }
  .box {
    // flex: 1 0 150px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    // min-height:175px;
    // background: #f4f4f4;
  }
}
</style>
