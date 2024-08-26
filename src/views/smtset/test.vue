<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import $ from "jquery";
import { XY_OEE_Calendar, XY_OEE_LevelCode, XY_OEE_LevelType } from "@/api/all";
import {
  getStartTime,
  getEndTime,
  getEndDate,
  getStartDate,
  getMin,
  setStartDate,
  setEndDate,
  nightShift,
  getDate,
  overDay,
  getDurTime,
  splitT,
  durationChoice,
  delectT,
  getNowDate,
} from "@/utils/oeeFun";

import { getToken } from "@/utils/auth";
import { time } from "echarts";
import { mapGetters, mapState } from "vuex";
import { XY_OEE_LineError, XY_OEE_LineErrorUpdate } from "@/api/all";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      fullCalendarAM: {
        eventOrderStrict: true,
        eventOrder: "eventOrder",
        contentHeight: "auto",
        height: "auto",
        aspectRatio: 2,
        locale: "zh-cn",
        buttonText: {
          today: "今天",
          month: "月",
          week: "周",
          day: "日",
        },
        views: {
          timeGridWeek: {
            slotLabelInterval: "00:30", // 设置时间间隔为1小时
          },
        },
        slotLabelFormat: {
          hour: "2-digit", // 使用 2 位数字表示小时
          minute: "2-digit", // 使用 2 位数字表示分钟（如果你需要的话）
          hour12: false, // 使用 24 小时制
          separator: " ", // 自定义分隔符
          omitZeroMinute: false, // 是否省略零分钟
          meridiem: false, // 是否显示上午/下午（对于 12 小时制）
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        displayEventTime: false,
        headerToolbar: {
          left: "test prev,next allDay,AM,PM",
          center: "title",
          right: "lineOne lineTwo lineThree",
          // ,timeGridDay,listWeek
        },
        allDaySlot: false, //allday 整天的日程是否显示
        slotMinTime: "00:00:00", //设置显示的时间从几点开始
        slotMaxTime: "12:00:00", //设置显示的时间从几点结束
        customButtons: {
          lineOne: {
            text: "Line1",
            click: () => {
              this.line = 0;
            },
          },
          lineTwo: {
            text: "Line2",
            click: () => {
              this.line = 1;
            },
          },
          lineThree: {
            text: "Line3",
            click: () => {
              this.line = 2;
            },
          },
          AM: {
            text: "上午",
            click: () => {
              this.fullCalendarAM.slotMinTime = "00:00:00";
              this.fullCalendarAM.slotMaxTime = "12:00:00";
              this.fullCalendarAM.slotDuration = "00:30:00";
              this.time = "00:30:00";
            },
          },
          PM: {
            text: "下午",
            click: () => {
              this.fullCalendarAM.slotMinTime = "12:00:00";
              this.fullCalendarAM.slotMaxTime = "24:00:00";
              this.fullCalendarAM.slotDuration = "00:30:00";
              this.time = "00:30:00";
            },
          },
          test: {
            text: "日期选择",
            click: (e) => {
              this.$refs.datePicker.handleFocus();
            },
          },
          allDay: {
            text: "全天",
            click: () => {
              this.fullCalendarAM.slotMinTime = "00:00:00";
              this.fullCalendarAM.slotMaxTime = "24:00:00";
              this.fullCalendarAM.slotDuration = "01:00:00";
              this.time = "01:00:00";
            },
          },
        },
        initialView: "timeGridWeek",
        // initialEvents: [INITIAL_EVENTS], // alternatively, use the `events` setting to fetch from a feed
        events: [
          // {
          //   ID: "63b24cb5-1dbc-4856-a925-0d193eeb2da4",
          //   start: "2024-06-24 09:09:08",
          //   end: "2024-06-25 09:19:08",
          //   title: "未完成 09:08~09:18",
          //   color: "red",
          //   state: "onGoing",
          // },
          // {
          //   ID: "63b24cb5-1dbc-4856-a925-0d193eeb2da4",
          //   start: "2024-06-24 09:08:08",
          //   end: "2024-06-25 09:18:08",
          //   title: "未完成 09:08~09:18",
          //   color: "red",
          //   state: "onGoing",
          // }
        ],
        // editable: true,
        selectable: true,
        // height: "600px",
        slotDuration: "00:30:00",
        // selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        // select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        // viewDidMount: this.handleViewRender,
        // slotEventOverlap:false,
        // slotEventOverlap:false,
        // eventsSet: this.handleEvents,
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
        // eventSources: [
        //   {
        //     events: [
        //       // {
        //       //   ID: "63b24cb5-1dbc-4856-a925-0d193eeb2da4",
        //       //   eventOrder: 1,
        //       //   start: "2024-06-04 08:08:08",
        //       //   end: "2024-06-04 16:08:08",
        //       //   title: "工作时间",
        //       //   color: "#00AC6A",
        //       //   state: "work",
        //       //   workStart: "08:08:08",
        //       //   workEnd: "16:08:08",
        //       // },
        //       // {
        //       //   ID: "63b24cb5-1dbc-4856-a925-0d193eeb2da4",
        //       //   eventOrder: 1,
        //       //   start: "2024-06-04 09:08:08",
        //       //   end: "2024-06-04 09:18:08",
        //       //   title: "未完成 09:08~09:18",
        //       //   color: "red",
        //       //   state: "onGoing",
        //       // },
        //       // {
        //       //   ID: "63b24cb5-1dbc-4856-a925-0d193eeb2da4",
        //       //   eventOrder: 1,
        //       //   start: "2024-06-04 11:08:08",
        //       //   end: "2024-06-04 11:18:08",
        //       //   title: "已完成 11:08~11:18",
        //       //   color: "#fbc017",
        //       //   state: "complete",
        //       // },
        //     ],
        //   },
        //   {
        //     events: [],
        //   },
        //   {
        //     events: [],
        //   },
        // ],
      },
      timeState: ["00:00:00", "12:00:00"],
      time: "00:30:00",
      timeChoice: [
        {
          value: "00:01:00",
          label: "1分钟",
        },
        {
          value: "00:02:00",
          label: "2分钟",
        },
        {
          value: "00:05:00",
          label: "5分钟",
        },
        {
          value: "00:15:00",
          label: "15分钟",
        },
        {
          value: "00:30:00",
          label: "半小时",
        },
        {
          value: "00:45:00",
          label: "45分钟",
        },
        {
          value: "01:00:00",
          label: "一小时",
        },
      ],
      durtime: [],
      durtimeList: durationChoice(),
      form: {
        operationType: "U",
        serialNumber: 1,
        errorLevel: 1,
        closedTime: "",
        errorType: "",
        errorCode: "",
        errorDsc: "",
        operatorName: getToken(),
      },
      showForm: {
        operationType: "U",
        serialNumber: 1,
        errorLevel: null,
        closedTime: "",
        lineNumber: "",
        startTime: "",
        endTime: "",
        errorType: "",
        errorCode: "",
        errorDsc: "",
        operatorName: "",
      },
      completeEventShow: false,
      isGoingEventShow: false,
      title: "维护",
      isPickerVisible: false,
      date: "",
      workIndex: 1,
      maintenanceIndex: 2000001,
      completedIndex: 1000001,
      arr: [],
      line: 0,
      typeChoice: [
        {
          value: "设备异常",
          label: "设备异常",
        },
        {
          value: "换线停机",
          label: "换线停机",
        },
        {
          value: "维修保养",
          label: "维修保养",
        },
      ],
      equipment: "all",
      L1equipmentChoice: [
        {
          value: 103,
          label: "Line1-SPI",
        },
        {
          value: 104,
          label: "Line1-NPM",
        },
        {
          value: 106,
          label: "Line1-Reflow",
        },
        {
          value: 108,
          label: "Line1-ICT",
        },
        {
          value: "all",
          label: "全部",
        },
      ],
      L2equipmentChoice: [
        {
          value: 203,
          label: "Line2-SPI",
        },
        {
          value: 204,
          label: "Line2-NPM",
        },
        {
          value: 206,
          label: "Line2-Reflow",
        },
        {
          value: 208,
          label: "Line2-ICT",
        },
        {
          value: "all",
          label: "全部",
        },
      ],
      L3equipmentChoice: [
        {
          value: 303,
          label: "Line3-SPI",
        },
        {
          value: 304,
          label: "Line3-NPM",
        },
        {
          value: 306,
          label: "Line3-Reflow",
        },
        {
          value: 308,
          label: "Line3-ICT",
        },
        {
          value: "all",
          label: "全部",
        },
      ],
    };
  },
  watch: {
    line(newVal, oldVal) {
      this.equipment = "all";
      this.equipmentChange();
      document.getElementsByClassName("fc-lineOne-button")[0].style.background =
        this.line === 0
          ? "linear-gradient(to right bottom, #65d1fb, #6591fb)"
          : "white";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.background =
        this.line === 1
          ? "linear-gradient(to right bottom, #65d1fb, #6591fb)"
          : "white";
      document.getElementsByClassName(
        "fc-lineThree-button"
      )[0].style.background =
        this.line === 2
          ? "linear-gradient(to right bottom, #65d1fb, #6591fb)"
          : "white";
      document.getElementsByClassName("fc-lineOne-button")[0].style.color =
        this.line === 0 ? "white" : "black";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.color =
        this.line === 1 ? "white" : "black";
      document.getElementsByClassName("fc-lineThree-button")[0].style.color =
        this.line === 2 ? "white" : "black";
      // this.fullCalendarAM.events = this.arr[newVal].events;
    },
  },
  computed: {
    // height() {
    //   return this.$store.state.dashboardHeight
    // }

    ...mapState(["dashboardHeight"]),
  },
  created() {
    // this.getData();
  },
  mounted() {
    console.log(VUE_APP_BASE_API);
    // $('#calendar').fullCalendar('gotoDate', targetDate);
    // window.addEventListener("resize", this.getHeight, false);
  },
  methods: {
    async getData() {
      this.startLoading();
      this.workIndex = 1;
      this.maintenanceIndex = 2000001;
      this.completedIndex = 1000001;
      this.arr = [{ events: [] }, { events: [] }, { events: [] }];
      await XY_OEE_LineError({
        operationType: "Q1",
        tStartTime: "2024-05-15 00:00:00",
        tEndTime: getNowDate(),
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            res.data.DataList.forEach((item) => {
              this.completedIndex = this.completedIndex + 0.1;
              if (item.LineNumber === "Line1") {
                this.completeObject(item, 0);
              } else if (item.LineNumber === "Line2") {
                this.completeObject(item, 1);
              } else if (item.LineNumber === "Line3") {
                this.completeObject(item, 2);
              }
            });
          } else {
            if (res.data.Message !== "NG：无数据") {
              this.$message({
                message: res.data.Message,
                type: "warning",
              });
            }
          }
        })
        .catch((res) => {
          this.$message({
            message: res,
            type: "error",
          });
        });
      await XY_OEE_LineError({
        operationType: "Q2",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            res.data.DataList.forEach((item) => {
              this.maintenanceIndex = this.maintenanceIndex + 0.1;
              // if (item.LineNumber === "Line1") {
              //   this.maintenanceObject(item, 0);
              // } else if (item.LineNumber === "Line2") {
              //   this.maintenanceObject(item, 1);
              // } else if (item.LineNumber === "Line3") {
              //   this.maintenanceObject(item, 2);
              // }
              if (item.Repeat === "Y") {
                this.repeatObj(item);
              } else {
                this.notRepeatObj(item);
              }
            });
          } else {
            if (res.data.Message !== "NG：无数据") {
              this.$message({
                message: res.data.Message,
                type: "warning",
              });
            }
          }
        })
        .catch((res) => {
          this.$message({
            message: res,
            type: "error",
          });
        });
      await XY_OEE_LineError({
        operationType: "Q",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            // res.data.DataList.forEach((item) => {
            //   if (item.Repeat) {
            //     this.repeatObj(item);
            //   } else {
            //     this.notRepeatObj(item);
            //   }
            // });

            res.data.DataList.forEach((item) => {
              this.maintenanceIndex = this.maintenanceIndex + 0.1;
              if (item.LineNumber === "Line1") {
                this.maintenanceObject(item, 0);
              } else if (item.LineNumber === "Line2") {
                this.maintenanceObject(item, 1);
              } else if (item.LineNumber === "Line3") {
                this.maintenanceObject(item, 2);
              }
            });
          } else {
            if (res.data.Message !== "NG：无数据") {
              this.$message({
                message: res.data.Message,
                type: "warning",
              });
            }
          }
        })
        .catch((res) => {
          this.$message({
            message: res,
            type: "error",
          });
        });

      this.$nextTick(() => {
        // this.fullCalendarAM.events = this.arr[0].events;
        this.equipmentChange();
        this.DIYButton();
      });
      this.endLoading();
    },
    getHeight() {
      this.fullCalendarAM.contentHeight = this.height + "px";
      this.fullCalendarAM.height = this.height + "px";
    },
    change(timeArr) {
      //  console.log(this.$refs.calendars.$el.clientHeight);
      // this.$refs.calendars.getApi().render();
      this.fullCalendarAM.slotMinTime = this.durtime[0];
      this.fullCalendarAM.slotMaxTime = this.durtime[1];
      this.fullCalendarAM.slotDuration = "00:02:00";
      this.time = "00:02:00";
    },
    timeChange() {
      this.fullCalendarAM.views.timeGridWeek.slotLabelInterval = this.time;
      this.fullCalendarAM.slotDuration = this.time;
    },
    handleEventClick({ event }) {
      let data = event["_def"].extendedProps;
      if (data.state === "complete") {
        // this.completeEventShow = true;
        this.showForm = {
          serialNumber: data.serialNumber,
          errorLevel: data.errorLevel,
          closedTime: data.closedTime,
          lineNumber: data.lineNumber,
          startTime: data.StartTime,
          endTime: data.EndTime,
          errorType: data.errorType,
          errorCode: data.errorCode,
          errorDsc: data.errorDsc,
          operatorName: data.operatorName,
        };
      } else if (data.state === "onGoing") {
        this.isGoingEventShow = true;
        this.form = {
          operationType: "U",
          serialNumber: data.serialNumber,
          errorLevel: 1,
          closedTime: "",
          errorType: "",
          errorCode: "",
          errorDsc: "",
          operatorName: getToken(),
        };
      } else if (data.state === "work") {
        console.log(data);
        // this.fullCalendarAM.slotMinTime = data.StartTime;
        // this.fullCalendarAM.slotMaxTime = data.EndTime;
      }
    },
    handleUpdate() {
      if (this.form.closedTime === '' || this.form.errorType === '' || 
      this.form.errorDsc === '') {
          this.$message({
            message: "请输完整信息",
            type: "warning",
          });
        return;
      }
      XY_OEE_LineErrorUpdate(this.form)
        .then((res) => {
          if (res.data.Status === "OK") {
            this.maintenance = false;
            this.getData();
            this.$message({
              message: "成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.Message,
              type: "warning",
            });
          }
          this.isGoingEventShow = false;
        })
        .catch((res) => {
          this.isGoingEventShow = false;
          this.$message({
            message: res,
            type: "error",
          });
        });
    },
    handleInput(value) {
      // 将输入值转换为数字
      const numericValue = parseInt(value, 10);
      // 如果输入值是有效的数字且在0到5之间，则更新数据；否则，设置为上一个有效值或0
      if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
        this.form.errorLevel = numericValue.toString();
      } else {
        this.$nextTick(() => {
          this.form.errorLevel = 1;
          this.$message({
            message: "请输入1~5范围的时间",
            type: "warning",
          });
        });
      }
    },
    dateChange(date) {
      this.$refs.calendars.getApi().gotoDate(date);
    },
    repeatObj(item) {
      for (let index = 0; index < 3; index++) {
        this.arr[index].events.push({
          eventOrder: this.workIndex,
          startTime: getStartTime(item.StartTime, false),
          endTime: getEndTime(item.StartTime, item.Duration, false),
          title: item.Name,
          state: "work",
          startRecur: getStartDate(item.StartTime),
          endRecur: getEndDate(item.EndTime),
          color: "#00AC6A",
          StartTime: getStartTime(item.StartTime, false),
          EndTime: getEndTime(item.StartTime, item.Duration, false),
          // textColor: this.eventText(
          //   item.IsWorking === "Y",
          //   item.IsPlanStop === "Y"
          // ),
        });
      }
    },
    notRepeatObj(item) {
      for (let index = 0; index < 3; index++) {
        this.arr[index].events.push({
          eventOrder: this.workIndex,
          start: getStartTime(item.StartTime, true),
          end: getEndTime(item.StartTime, item.Duration, true),
          title: item.Name,
          state: "work",
          allDay: false,
          color: "#00AC6A",
          StartTime: getStartTime(item.StartTime, false),
          EndTime: getEndTime(item.StartTime, item.Duration, false),
          // textColor: this.eventText(
          //   item.IsWorking === "Y",
          //   item.IsPlanStop === "Y"
          // ),
        });
      }
    },
    completeObject(item, index) {
      this.arr[index].events.push({
        eventOrder: this.completedIndex,
        start: delectT(item.StartTime),
        end: delectT(item.EndTime),
        title: item.McName,
        color: "#fbc017",
        state: "complete",
        serialNumber: item.SerialNumber,
        errorLevel: item.ErrorLevel,
        closedTime: delectT(item.CloseTime),
        lineNumber: item.LineNumber,
        StartTime: delectT(item.StartTime),
        EndTime: delectT(item.EndTime),
        errorType: item.ErrorType,
        errorCode: item.ErrorCode,
        errorDsc: item.ErrorDsc,
        operatorName: item.OperatorName,
        mcId: item.McID,
        mcName: item.McName,
      });
    },
    maintenanceObject(item, index) {
      this.arr[index].events.push({
        eventOrder: this.maintenanceIndex,
        start: delectT(item.StartTime),
        end: delectT(item.EndTime),
        title: item.McName,
        color: "red",
        state: "onGoing",
        serialNumber: item.SerialNumber,
        lineNumber: item.LineNumber,
        startTime: delectT(item.StartTime),
        endTime: delectT(item.EndTime),
        mcId: item.McID,
        mcName: item.McName,
      });
    },
    wrokObject(item, index) {
      // this.arr[index].events.push({
      //   eventOrder: this.workIndex,
      //   start: delectT(item.StartTime),
      //   end: delectT(item.EndTime),
      //   title: item.McName,
      //   color: "#00AC6A",
      //   state: "work",
      //   serialNumber: item.SerialNumber,
      //   lineNumber: item.LineNumber,
      //   startTime: delectT(item.StartTime),
      //   endTime: delectT(item.EndTime),
      //   mcId:item.McID,
      //   mcName:item.McName
      // });
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
    DIYButton() {
      document.getElementsByClassName("fc-lineOne-button")[0].style.background =
        "linear-gradient(to right bottom, #65d1fb, #6591fb)";
      document.getElementsByClassName(
        "fc-lineTwo-button"
      )[0].style.backgroundColor = "white";
      document.getElementsByClassName(
        "fc-lineThree-button"
      )[0].style.backgroundColor = "white";
      document.getElementsByClassName("fc-lineOne-button")[0].style.color =
        "white";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.color =
        "black";
      document.getElementsByClassName("fc-lineThree-button")[0].style.color =
        "black";
      document.getElementsByClassName(
        "fc-lineOne-button"
      )[0].style.borderRadius = "999px";
      document.getElementsByClassName(
        "fc-lineTwo-button"
      )[0].style.borderRadius = "999px";
      document.getElementsByClassName(
        "fc-lineThree-button"
      )[0].style.borderRadius = "999px";
      document.getElementsByClassName("fc-lineOne-button")[0].style.border =
        "0px solid white";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.border =
        "0px solid white";
      document.getElementsByClassName("fc-lineThree-button")[0].style.border =
        "0px solid white";
    },
    equipmentChange() {
      if (this.equipment === "all") {
        this.fullCalendarAM.events = this.arr[this.line].events;
      } else {
        let obj = this.arr[this.line].events.filter((item) => {
          return item.mcId === this.equipment;
        });

        console.log(obj, this.equipment, this.arr[this.line].events);

        this.fullCalendarAM.events = obj;
      }
    },
  },
};
</script>

<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <div class="function">
        <el-form ref="form" label-width="auto">
          <el-form-item label="时间段选择">
            <!-- <el-time-picker
              is-range
              v-model="timeState"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              value-format="HH:mm:ss"
              format="HH:mm"
              @change="change"
            >
            </el-time-picker> -->
            <el-select
              v-model="durtime"
              placeholder="请选择"
              @change="change()"
            >
              <el-option
                v-for="item in durtimeList"
                :key="item.value[0]"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间间隔">
            <el-select
              v-model="time"
              placeholder="请选择"
              @change="timeChange()"
            >
              <el-option
                v-for="item in timeChoice"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备">
            <el-select
              v-model="equipment"
              placeholder="请选择"
              @change="equipmentChange()"
              v-show="line === 0"
            >
              <el-option
                v-for="item in L1equipmentChoice"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="equipment"
              placeholder="请选择"
              @change="equipmentChange()"
              v-show="line === 1"
            >
              <el-option
                v-for="item in L2equipmentChoice"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="equipment"
              placeholder="请选择"
              @change="equipmentChange()"
              v-show="line === 2"
            >
              <el-option
                v-for="item in L3equipmentChoice"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <h2 class="el-subtitle">已维护异常数据</h2>
        <el-form :model="showForm" label-width="auto">
          <el-form-item class="custom-form-item" label="线体名">
            <span>{{ showForm.lineNumber }}</span>
          </el-form-item>
          <el-form-item class="custom-form-item" label="开始时间">
            <span>{{ showForm.startTime }}</span></el-form-item
          >
          <el-form-item class="custom-form-item" label="结束时间">
            <span>{{ showForm.endTime }}</span></el-form-item
          >
          <el-form-item class="custom-form-item" label="关闭时间">
            <span>{{ showForm.closedTime }}</span></el-form-item
          >
          <el-form-item class="custom-form-item" label="异常等级">
            <span>{{ showForm.errorLevel }}</span></el-form-item
          >
          <el-form-item class="custom-form-item" label="异常类型">
            <span>{{ showForm.errorType }}</span></el-form-item
          >
          <el-form-item class="custom-form-item" label="处理说明">
            <span>{{ showForm.errorDsc }}</span></el-form-item
          >
          <el-form-item class="custom-form-item" label="异常代码">
            <span>{{ showForm.errorCode }}</span></el-form-item
          >
          <el-form-item class="custom-form-item" label="处理人">
            <span>{{ showForm.operatorName }}</span></el-form-item
          >
        </el-form>
      </div>
      <div style="width: 0px; height: 0px; overflow: hidden">
        <el-date-picker
          ref="datePicker"
          v-model="date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="dateChange"
        >
        </el-date-picker>
      </div>
      <FullCalendar
        style="margin: 0; max-width: none; width: 100%"
        class="demo-app-calendar"
        :options="fullCalendarAM"
        ref="calendars"
        id="calendar"
      >
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>

      <el-dialog title="维护" :visible.sync="isGoingEventShow">
        <el-form :model="form" ref="form" label-width="80px">
          <el-form-item label="异常等级" prop="errorLevel">
            <el-input-number
              v-model="form.errorLevel"
              @input="handleInput"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="异常类型" prop="errorType">
            <el-select v-model="form.errorType" placeholder="请选择">
              <el-option
                v-for="item in typeChoice"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- <el-input v-model="form.errorType"></el-input> -->
          </el-form-item>
          <el-form-item label="处理说明" prop="errorDsc">
            <el-input v-model="form.errorDsc"></el-input>
          </el-form-item>
          <el-form-item label="异常代码" prop="errorCode">
            <el-input v-model="form.errorCode"></el-input>
          </el-form-item>
          <el-form-item label="关闭时间" prop="status">
            <el-date-picker
              v-model="form.closedTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isGoingEventShow = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdate()"> 确 定 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style></style>

<style lang="scss" scoped>
.function {
  min-width: 350px;
  // padding: 5px;
}

/* 隐藏加号和减号 */
::v-deep .el-input-number__increase,
::v-deep .el-input-number__decrease {
  display: none;
}

.fc-test-button {
  position: relative;
}

.date {
  display: flex;
}

.type {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
}

.demo-app {
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding: 1em;
  .title {
    display: flex;
    align-items: center;
    .show-color {
      display: flex;
      align-items: center;
      .color {
        display: flex;
        align-items: center;
        margin-left: 10px;
        .red {
          width: 20px;
          height: 10px;
          border-radius: 3px;
          background-color: #f44336;
          margin-left: 5px;
        }
        .green {
          width: 20px;
          height: 10px;
          border-radius: 3px;
          background-color: #00ac6a;
          margin-left: 5px;
        }
        .yellow {
          width: 20px;
          height: 10px;
          border-radius: 3px;
          background-color: #fbc017;
          margin-left: 5px;
        }
      }
    }
  }
}

.flex {
  display: flex;
}

.center {
  align-items: center;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

.change-buttom {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.calendars-right {
  width: 450px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-top: 40px;
  padding-right: 60px;
}

.input-text {
  width: 60px;
  flex: none;
  margin-right: 10px;
  margin-top: 5px;
}

.event-data {
  margin: 10px;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  // border: 1px solid;
}

.background {
  background-color: red;
}

.popul-item {
  margin-bottom: 15px;
}

.fc-day-number {
  font-size: 20px;
}

.fc-agenda-slots .fc-slot-content {
  height: 30px; /* 设置为你想要的行高 */
  line-height: 30px; /* 确保文本垂直居中 */
}

.custom-form-item {
  margin-bottom: 10px; /* 修改垂直间隔 */
}
</style>
