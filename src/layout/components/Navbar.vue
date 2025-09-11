<template>
  <div class="navbar flex items-center justify-between " style="height: 40px;">
    <bread></bread>
    <div class="right-menu">
      <div class="flex gap-2 items-center">
        <div>
          <el-tooltip effect="dark" content="全屏/正常" placement="bottom">
            <screenfull id="screenfull" class="right-menu-item hover-effect" />
          </el-tooltip>
        </div>
        <div>
          <router-link to="/">
            <el-tooltip effect="dark" content="首页" placement="bottom">
              <img src="../../assets/home.svg" alt="" width="28px" />
            </el-tooltip>
            <!-- <img src="../../assets/home.svg" alt="" width="25px" /> -->
            <!-- <i class="el-icon-house" style="font-size: 25px;margin-top:5px ;"></i> -->
          </router-link>
        </div>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="flex items-center" style="cursor: pointer">
            <el-avatar
              :size="35"
              :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            ></el-avatar>
            <span
            class="mr-2"
              style="padding-left: 5px; font-weight: bold; font-size: 18px"
              >{{ logName }}</span
            >
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="openUpEmpPwd">
              <span style="display: block">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="upPwVisible"
      width="400px"
      @close="upDateCancel()"
    >
      <el-form
        :model="upPwForm"
        ref="upPwFormRef"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item label="新密码" prop="pwd">
          <el-input
            v-model="upPwForm.pwd"
            placeholder="请输入新密码"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            v-model="upPwForm.confirmPwd"
            placeholder="再次输入新密码"
            show-password
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upDateCancel()">取 消</el-button>
        <el-button type="primary" @click="upDateSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import Message from "@/components/Message";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { ResetPwd,getEmpoyeeInfo,UpdateEmpPwd } from "@/api/control";
import bread from "@/components/Bread";

export default {
  data() {
    return {
      visible: false,
      intervalId: null,
      logName: "",
      upPwVisible: false,
      upPwForm: {
        employeeName: "",
        pwd: "",
        confirmPwd: "",
        FullName:""
      },
      rules: {
        pwd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        confirmPwd: [
          { required: true, message: "请再次输入您的密码", trigger: "blur" },
          { validator: this.equalToPassword, trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Message,
    bread,
  },
  mounted() {
    this.logName = getToken();
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    equalToPassword(rule, value, callback) {
      if (this.upPwForm.pwd !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },
    openUpEmpPwd() {
     
      getEmpoyeeInfo( getToken()).then(res=>{
         console.log(res);
         this.upPwForm.FullName=res.Data[0].FullName
        this.upPwVisible = true;
      })
    },
    upDateCancel() {
      this.upPwVisible = false;
      this.$refs.upPwFormRef.resetFields();
    },
    upDateSubmit() {
      this.$refs.upPwFormRef.validate((valid) => {
        if (valid) {
          let data = {
            EmployeeName: getToken(),
            DocManagerUser: this.upPwForm.pwd,
            FullName:this.upPwForm.FullName
          };
          // console.log(data);

          UpdateEmpPwd(data).then((res) => {
            if (res.Success) {
              this.$notify({
                title: "修改成功",
                type: "success",
              });
              this.$confirm("密码修改成功即将退出登录", "提示", {
                confirmButtonText: "确定",
                type: "warning",
              })
                .then(() => {
                  this.logoutsys();
                })
                .catch(() => {
                  this.logoutsys();
                });
            } else {
              this.$notify({
                title: "提示信息",
                message: res.Message,
                type: "error",
              });
            }
            this.upPwVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    logoutsys() {
      this.$store.dispatch("user/logout");
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .right-menu-item {
    // display: inline-block;
    position: relative;
    // // padding-right:15px;
    // height: 100%;
    
    font-size: 24px;
    color: #5a5e66;
    // vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.182);
      }
    }
  }
}
</style>
