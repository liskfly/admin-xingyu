<template>
    <div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          background-color="#003750"
          :unique-opened="true"
          text-color="#bfcbd9"
          active-text-color="#ffff"
          @select="menuSelect"
        >
          <smenu-item
            v-for="v in routers"
            :key="v.path"
            :item="v"
            :base-path="'/'"
          />
        </el-menu>
      </el-scrollbar>
    </div>
  </template>
  
  <script>
  import smenuItem from "./components/smenuItem.vue"
  import { mapState, mapMutations } from "vuex";
  export default {
    name: 'SidebarMenu',
    components: {
      smenuItem
    },
    props: {
      basePath: {
        type: String,
        default: '/'
      }
    },
    data() {
      return {
        permissionStore: this.$store.state.permission // 假设使用 Vuex
      }
    },
    computed: {
      ...mapState('permission', ['menuTabRouters']),
      routers() {
        return this.menuTabRouters
      },
      activeMenu() {
        
        
        const { meta, path } = this.$route   
        console.log(path);
        return meta.activeMenu || path
      }
    },
    mounted() {
      // 可以在此处添加初始化逻辑
    },
    methods: {
      menuSelect(index) {
        this.$emit('refresh')
        this.$router.push(index)
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .el-menu-item.is-active {
    color: #ffcd50 !important;
  }
  </style>