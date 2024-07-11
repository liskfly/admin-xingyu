<template>
  <div class="big-box">
    待开发
  </div>
</template>

<script>
import "@/utils/protocolcheck.js";
export default {
  data() {
    return {
      form: {
        group: "",
      },
      lineData1: [
        {
          id: 1,
          name: "Laser",
          equipment: true,
          orbit: true,
        },
        {
          id: 2,
          name: "Printer",
          equipment: false,
          orbit: false,
        },
        {
          id: 3,
          name: "SPI",
          equipment: false,
          orbit: false,
        },
      ],
      lineData2: [
        {
          id: 4,
          name: "Reflow",
          equipment: false,
          orbit: false,
        },
        {
          id: 5,
          name: "S-AOI",
          equipment: false,
          orbit: false,
        },
        {
          id: 6,
          name: "ICT",
          equipment: false,
          orbit: false,
        },
      ],
      lineData3: [
        {
          id: 7,
          name: "Mounter",
          equipment: false,
          orbit: false,
        },
        {
          id: 8,
          name: "M-AOI",
          equipment: false,
          orbit: false,
        },
      ],
    };
  },
  methods: {
    change() {
      window.protocolCheck(
        "D:\GenericProgramEditor\GenericProgramEditor",
        () => {
          alert("下载");
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>

.left-box {
  // padding: 20px 0;
   box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 142px);
}
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: calc(100vh - 100px);
  padding: 20px 30px;
  background: #f1f4f9;
}
.box-top {
  flex: 1;
  width: 100%;
  height: calc(100vh - 100px - 20vh);
  display: flex;
  gap: 30px;
  .box-top-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 100px - 20vh);
    flex: 1;
  }
  .box-top-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
    height: calc(100vh - 100px - 20vh);
  }
}
.box-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20vh;

  .change-button {
    padding: 8px 50px;
    text-align: center;
    border-radius: 999px;
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 2px;
    color: #fff;
    background-color: #1f4cc1;
  }
}
.box-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  .box-header {
    padding-right: 5px;
    display: flex;
    gap: 5px;
    // justify-content: end;
    font-size: 12px;
  }
}
.box-content-bottom {
  display: flex;
  flex-direction: column;
  gap: 15px;
  .box-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.list-content {
  display: flex;
  gap: 20px;
  font-size: 12px;
  .light {
    display: flex;
    gap: 5px;
    align-items: center;
    .icon {
      display: inline-block;
      border-radius: 999px;
      width: 2vh;
      height: 2vh;
      background: red;
    }
  }
}
.active {
  background: #5ab059;
}
.tongzi {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 400px;
  overflow: auto;
}
.tongzi::-webkit-scrollbar {
  display: none;
}
</style>
