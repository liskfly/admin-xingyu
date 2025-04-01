<template>
  <div class="navbar flex items-center justify-between">
    <!-- <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <bread ></bread>

    <div class="right-menu">
      <div class="" style="display: flex; gap: 8px">
        <div>
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </div>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper" style="cursor: pointer">
            <el-avatar :size="35"
              :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
            <span style="padding-left: 8px; font-weight: bold; font-size: 1.1rem">{{ logName }}</span>
            <!-- <img src="../../assets/profile.jpg" class="user-avatar" /> -->
            <!-- <i class="el-icon-caret-bottom" /> -->
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <!-- <router-link to="/">
            <el-dropdown-item> 首页</el-dropdown-item>
          </router-link> -->
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
    <el-dialog title="修改密码" :visible.sync="upPwVisible" width="400px" @close="upDateCancel()">
      <el-form :model="upPwForm" ref="upPwFormRef" :rules="rules" label-width="auto">
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="upPwForm.pwd" placeholder="请输入新密码" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="upPwForm.confirmPwd" placeholder="再次输入新密码" show-password clearable></el-input>
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
import { updatePassword } from "@/api/control";
import bread from "@/components/Bread"

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
    bread
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
      this.upPwVisible = true;
    },
    upDateCancel() {
      this.upPwVisible = false;
      this.$refs.upPwFormRef.resetFields();
    },
    upDateSubmit() {
      this.$refs.upPwFormRef.validate((valid) => {
        if (valid) {
          let data = {
            employeeName: getToken(),
            pwd: this.upPwForm.pwd,
          };
          console.log(data);

          updatePassword(data).then((res) => {
            if (res.code == 100200) {
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
                title: "修改失败",
                message: res.msg,
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
      this.$store.dispatch('user/logout')
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
  height: 45px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .item {
    margin-top: -9px;
    margin-right: 30px;
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      position: relative;
      // padding-right:15px;
      height: 100%;
      font-size: 25px;
      color: #5a5e66;
      vertical-align: text-bottom;

      .badge {
        position: absolute;
        background-color: #f3545d;
        text-align: center;
        border-radius: 10px;
        min-width: 17px;
        height: 17px;
        font-size: 10px;
        color: #fff;
        font-weight: 300;
        line-height: 17px;
        top: 3px;
        right: 3px;
        letter-spacing: -1px;
      }

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 8px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        font-size: 16px;

        // margin-top: 5px;
        // position: relative;

        // .user-avatar {
        // cursor: pointer;
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 10px;
        // }

        // .el-icon-caret-bottom {
        //   cursor: pointer;
        //   position: absolute;
        //   right: -20px;
        //   top: 25px;
        //   font-size: 12px;
        // }
      }
    }
  }
}
</style>
