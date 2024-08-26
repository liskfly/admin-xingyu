<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  XY_OEE_Calendar,
  XY_OEE_LevelCode,
  XY_OEE_LevelType,
  XY_OEE_LineError,
  XY_OEE_LineErrorUpdate,
} from "@/api/all";
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
  durationChoice,
  delectT,
  getNowDate,
} from "@/utils/oeeFun";

import { getToken } from "@/utils/auth";
import { time } from "echarts";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      ddd: "",
      event: [],
      value1: [],
      line: 0,
      calendarOptions: {
        contentHeight: "500px",
        eventOrderStrict: true,
        locale: "zh-cn",
        // nowIndicator: true, // 启用当前时间线  
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
        buttonText: {
          today: "今天",
          month: "月",
          week: "周",
          day: "日",
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        displayEventTime: false,
        headerToolbar: {
          left: "prev,next today addEvent timeChoice allDay",
          center: "title",
          right: "lineOne lineTwo lineThree",
          // ,timeGridDay,listWeek
        },
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
          addEvent: {
            text: "添加工作日程",
            click: (e) => {
              this.addEventShow = true;
            },
          },
          timeChoice: {
            text: "时间段",
            click: (e) => {
              this.durtimeStyle.top = e.target.getBoundingClientRect().top;
              this.durtimeStyle.left = e.target.getBoundingClientRect().left;
              this.$refs.timeChoice.$el.click();
              // console.log(this.$refs.timeChoice.handleFocus);
            },
          },
          allDay: {
            text: "全天",
            click: () => {
              this.calendarOptions.slotMinTime = "00:00:00";
              this.calendarOptions.slotMaxTime = "24:00:00";
              this.calendarOptions.views.timeGridWeek.slotLabelInterval =
                "01:00:00";
              this.calendarOptions.slotDuration = "01:00:00";
            },
          },
        },
        initialView: "timeGridWeek",
        // initialEvents: [INITIAL_EVENTS], // alternatively, use the `events` setting to fetch from a feed
        events: [],
        // editable: true,
        selectable: true,
        height: "auto",
        slotDuration: "01:00:00",
        contentHeight: 600,
        // selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        eventOrder: "eventOrder",
        // select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        allDaySlot: false, //allday 整天的日程是否显示
        slotMinTime: "00:00:00", //设置显示的时间从几点开始
        slotMaxTime: "24:00:00", //设置显示的时间从几点结束
        // viewDidMount: this.handleViewRender,
        // slotEventOverlap:false,
        // slotEventOverlap:false,
        // eventsSet: this.handleEvents,
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      addEventShow: false,
      levelCodeInput: "",
      levelTypeInput: "",
      descriptionInput: "",
      operatorInput: getToken(),
      dateInput: "",
      dateRepectInput: [],
      timeInput: "",
      nameInput: "",
      repeatInput: "N",
      isWorkingInput: true,
      durationInput: "",
      isPlanStopInput: false,
      gradeInput: "1",
      changeEventShow: false,
      levelCodeChange: "",
      levelTypeChange: "",
      descriptionChange: "",
      operatorChange: "",
      dateChange: "",
      dateRepectChange: [],
      timeChange: "",
      nameChange: "",
      repeatChange: "Y",
      gradeChange: "1",
      repeatChange: false,
      isWorkingChange: false,
      isPlanStopChange: false,
      idChange: "",
      durationChange: "",
      key: 0,
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
      levelCodeData: [],
      levelTypeData: [
        { name: "计划", value: "Plan" },
        { name: "工作", value: "Work" },
        { name: "停机", value: "Stop" },
        { name: "其他", value: "Other" },
      ],
      lineInput: "",
      lineChange: "",
      radio: 0,
      radio1: 4,
      arr: [],
      test: [],
      dateChangeWrite: false,
      timeChangeWrite: false,
      dateInputWrite: false,
      timeInputWrite: false,
      eventOrder: 2,
      lineHistory: 0,
      workOrder: 0,
      maintenanceIndex: 10000001,
      completedIndex: 20000001,
      workUpdataShow: false,
      isGoingEventShow: false,
      isCompleteShow: false,
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
        mcID: "",
        mcName: "",
      },
      durtime: [],
      durtimeStyle: {
        top: 0,
        left: 0,
      },
      durtimeList: durationChoice(),
      wrongTime:{
        start:'',
        end:'',
        mcName:''
      }
    };
  },
  watch: {
    // watch第一次绑定值的时候不会执行监听，修改数据才会触发函数
    radio(newVal, oldVal) {
      if (newVal === 0) {
        this.isWorkingInput = true;
        this.isPlanStopInput = false;
      } else if (newVal === 1) {
        this.isWorkingInput = false;
        this.isPlanStopInput = true;
      } else {
        this.isWorkingInput = false;
        this.isPlanStopInput = false;
      }
    },
    radio1(newVal, oldVal) {
      if (newVal === 0) {
        this.isWorkingChange = true;
        this.isPlanStopChange = false;
      } else if (newVal === 1) {
        this.isWorkingChange = false;
        this.isPlanStopChange = true;
      } else {
        this.isWorkingChange = false;
        this.isPlanStopChange = false;
      }
    },
    line(newVal, oldVal) {
      this.calendarOptions.events = this.arr[newVal];
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
    },
  },
  created() {
    this.getdata("Line1");
    this.getLevelCode();
  },
  mounted() {
    // this.getdata();
    // this.getLevelCode();
  },
  methods: {
    getToken,
    // handleViewRender(e) {
    //   // console.log(e.view);
    //   if (e.view.type === "dayGridMonth") {
    //     this.calendarOptions.events = [this.arr[0]];
    //   } else if (e.view.type === "timeGridWeek") {
    //     this.calendarOptions.events = [];
    //     this.calendarOptions.events.push(this.arr[1]);
    //     this.calendarOptions.events.push(this.arr[2]);
    //   }
    // },
    eventColor(boolen1, boolen2, code) {
      if (code === '夜班') {
        return '#00AC6A'
      }else if (code === '白班'){
        return '#00d382'
      }
      // console.log(code);
      if (boolen1 && !boolen2) {
        return "#00AC6A";
      } else if (!boolen1 && boolen2) {
        return "#f44336";
      } else if (!boolen1 && !boolen2) {
        return "#fbc017";
      }
    },
    eventText(boolen1, boolen2) {
      if (boolen1 && !boolen2) {
        return "#FFFFFF";
      } else if (!boolen1 && boolen2) {
        return "#FFFFFF";
      } else if (!boolen1 && !boolen2) {
        return "#FFFFFF";
      }
    },
    handleEventClick({ event }) {
      let data = event["_def"].extendedProps;
      // console.log(getDurTime(data.StartTime, data.Duration), data);
      if (data.state === "work") {
        this.idChange = data.ID;
        this.levelTypeChange = data.LevelType;
        this.levelCodeChange = data.LevelCode;
        this.descriptionChange = data.Description;
        this.operatorChange = data.Operator;
        if (data.Repeat === "Y") {
          this.dateRepectChange = [
            setStartDate(data.StartTime),
            setEndDate(data.EndTime),
          ];
        } else {
          this.dateChange = setStartDate(data.StartTime);
        }
        this.lineChange = data.lineNumber;
        this.timeChange = getStartTime(data.StartTime, false);
        this.nameChange = data.Name;
        this.repeatChange = data.Repeat;
        this.gradeChange = data.Grade;
        this.durationChange = getDurTime(data.StartTime, data.Duration);
        if (data.IsWorking === "Y" && data.IsPlanStop === "N") {
          this.isWorkingChange = true;
          this.isPlanStopChange = false;
          this.radio1 = 0;
        } else if (data.IsWorking === "N" && data.IsPlanStop === "Y") {
          this.isWorkingChange = false;
          this.isPlanStopChange = true;
          this.radio1 = 1;
        } else {
          this.isWorkingChange = false;
          this.isPlanStopChange = false;
          this.radio1 = 2;
        }
        this.workUpdataShow = true;
      } else if (data.state === "onGoing") {
        this.isGoingEventShow = true;
        this.wrongTime = {
          start:data.StartTime,
          end:data.EndTime,
          mcName:data.mcName
        }
      } else if (data.state === "complete") {
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
          mcId: data.McID,
          mcName: data.McName,
        };
        this.isCompleteShow = true;
      }
    },
    // handleEvents(events) {
    //   console.log(this.calendarOptions.eventSources);
    // },
    async getdata(line) {
      this.maintenanceIndex = 20000001;
      this.completedIndex = 10000001;
      this.workOrder = 2;
      this.arr = [{ events: [] }, { events: [] }, { events: [] }];
      this.startLoading();
      await XY_OEE_Calendar({ operationType: "QA", lineNumber: "string" })
        .then(async ({ data }) => {
          if (data.Status === "NG") {
            return;
          }
          let arr1 = data.DataList.sort(function (a, b) {
            let obj1 = a["StartTime"];
            let obj2 = b["StartTime"];
            const val1 = Math.floor(new Date(obj1).getTime() / 1000);
            const val2 = Math.floor(new Date(obj2).getTime() / 1000);
            return val1 - val2;
          });
          arr1.forEach((item) => {
            let obj = {
              Name: item.Name,
              LevelCode: item.LevelCode,
              LevelType: item.LevelType,
              Description: item.Description,
              Duration: item.Duration,
              Grade: item.Grade,
              IsAtive: item.IsAtive,
              IsPlanStop: item.IsPlanStop,
              IsWorking: item.IsWorking,
              Operator: item.Operator,
              Repeat: item.Repeat,
              CreationDate: item.CreationDate,
              ModifiedDate: item.ModifiedDate,
              StartTime: item.StartTime,
              EndTime: item.EndTime,
              lineNumber: item.LineNumber,
            };
            this.arrChange(item, obj);
          });
          // this.calendarOptions.events = [this.arr[0]];
          // this.line = 0;
          // console.log(line);
          // this.line = this.lineHistory;
          // console.log(this.calendarOptions.events);
          // this.calendarOptions.eventSources = this.arr;
          // console.log(this.calendarOptions.eventSources);
          // this.key++;
        })
        .catch((err) => {
          // console.log(err);
          // this.$message({
          //   type: "error",
          //   message: `网络不良`,
          // });
          this.getWorkEvent();
        });
      await XY_OEE_LineError({
        operationType: "Q1",
        tStartTime: "2024-05-15 00:00:00",
        tEndTime: getNowDate(),
      })
        .then((res) => {
          if (res.data.Status === "OK") {
          let arr1 = res.data.DataList.sort(function (a, b) {
            let obj1 = a["StartTime"];
            let obj2 = b["StartTime"];
            const val1 = Math.floor(new Date(obj1).getTime() / 1000);
            const val2 = Math.floor(new Date(obj2).getTime() / 1000);
            return val1 - val2;
          });
            arr1.forEach((item) => {
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
          this.getCompleted();
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
            let arr1 = res.data.DataList.sort(function (a, b) {
              let obj1 = a["StartTime"];
              let obj2 = b["StartTime"];
              const val1 = Math.floor(new Date(obj1).getTime() / 1000);
              const val2 = Math.floor(new Date(obj2).getTime() / 1000);
              return val1 - val2;
            });
            arr1.forEach((item) => {
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
          if (line === "Line1") {
            this.line = 0;
            this.calendarOptions.events = this.arr[0];
            this.$nextTick(() => {
              this.DIYButton(1);
              this.endLoading();
            });
          } else if (line === "Line2") {
            this.line = 1;
            this.calendarOptions.events = this.arr[1];
            this.$nextTick(() => {
              this.DIYButton(2);
              this.endLoading();
            });
          } else if (line === "Line3") {
            this.line = 2;
            this.calendarOptions.events = this.arr[2];
            this.$nextTick(() => {
              this.DIYButton(3);
              this.endLoading();
            });
          }
        })
        .catch((res) => {
          this.getOnGoing();
          this.$message({
            message: res,
            type: "error",
          });
        });
    },
    getWorkEvent() {
      this.workOrder = 2;
      this.startLoading();
      XY_OEE_Calendar({ operationType: "QA", lineNumber: "string" })
        .then(async ({ data }) => {
          if (data.Status === "NG") {
            return;
          }
          let arr1 = data.DataList.sort(function (a, b) {
            let obj1 = a["StartTime"];
            let obj2 = b["StartTime"];
            const val1 = Math.floor(new Date(obj1).getTime() / 1000);
            const val2 = Math.floor(new Date(obj2).getTime() / 1000);
            return val1 - val2;
          });
          arr1.forEach((item) => {
            let obj = {
              Name: item.Name,
              LevelCode: item.LevelCode,
              LevelType: item.LevelType,
              Description: item.Description,
              Duration: item.Duration,
              Grade: item.Grade,
              IsAtive: item.IsAtive,
              IsPlanStop: item.IsPlanStop,
              IsWorking: item.IsWorking,
              Operator: item.Operator,
              Repeat: item.Repeat,
              CreationDate: item.CreationDate,
              ModifiedDate: item.ModifiedDate,
              StartTime: item.StartTime,
              EndTime: item.EndTime,
              lineNumber: item.LineNumber,
            };
            this.arrChange(item, obj);
          });
          this.endLoading();
          // this.calendarOptions.events = [this.arr[0]];
          // this.line = 0;
          // console.log(line);
          // this.line = this.lineHistory;
          // console.log(this.calendarOptions.events);
          // this.calendarOptions.eventSources = this.arr;
          // console.log(this.calendarOptions.eventSources);
          // this.key++;
        })
        .catch((err) => {
          // console.log(err);
          // this.$message({
          //   type: "error",
          //   message: `网络不良`,
          // });
          this.endLoading();
          this.getWorkEvent();
        });
    },
    getOnGoing() {
      this.maintenanceIndex = 20000001;
      this.startLoading();
      XY_OEE_LineError({
        operationType: "Q",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            let arr1 = res.data.DataList.sort(function (a, b) {
              let obj1 = a["StartTime"];
              let obj2 = b["StartTime"];
              const val1 = Math.floor(new Date(obj1).getTime() / 1000);
              const val2 = Math.floor(new Date(obj2).getTime() / 1000);
              return val1 - val2;
            });
            arr1.forEach((item) => {
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
          if (line === "Line1") {
            this.line = 0;
            this.calendarOptions.events = this.arr[0];
            this.$nextTick(() => {
              this.DIYButton(1);
              this.endLoading();
            });
          } else if (line === "Line2") {
            this.line = 1;
            this.calendarOptions.events = this.arr[1];
            this.$nextTick(() => {
              this.DIYButton(2);
              this.endLoading();
            });
          } else if (line === "Line3") {
            this.line = 2;
            this.calendarOptions.events = this.arr[2];
            this.$nextTick(() => {
              this.DIYButton(3);
              this.endLoading();
            });
          }
        })
        .catch((res) => {
          this.$message({
            message: res,
            type: "error",
          });
          this.getOnGoing();
        });
    },
    getCompleted() {
      this.completedIndex = 10000001;
      XY_OEE_LineError({
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
          this.getCompleted();
          this.$message({
            message: res,
            type: "error",
          });
        });
    },
    //初始化获取数据
    getLevelCode() {
      this.startLoading();
      XY_OEE_LevelCode({
        operationType: "QA",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.levelCodeData = res.data.DataList;
          } else {
            this.$message({
              type: "error",
              message: `OEE参数初始化失败!`,
            });
          }
          this.endLoading();
        })
        .catch((err) => {
          // console.log(1,'code');
          // console.log(err);
          // this.$message({
          //   type: "error",
          //   message: `OEE参数获取失败`,
          // });
          this.endLoading();
          this.getLevelCode();
        });
    },
    addData() {
      if (
        this.levelTypeInput === "" ||
        this.levelCodeInput === "" ||
        this.radio === 4 ||
        this.lineInput === ""
      ) {
        this.$message({
          type: "error",
          message: `请完整输入信息或者有信息格式不正确`,
        });
        return;
      }
      if (this.dateRepectInput === [] && this.dateInput === "") {
        this.$message({
          type: "error",
          message: `请完整输入信息或者有信息格式不正确`,
        });
        return;
      }
      if (getMin(this.timeInput, this.durationInput) <= 0) {
        this.$message({
          type: "error",
          message: `请选择正确时间段`,
        });
        return;
      }
      // if (overDay(this.timeInput, this.durationInput)) {
      //   this.$message({
      //     type: "error",
      //     message: `时间段不可超过本日，如有需要请创建两个时间段`,
      //   });
      //   return;
      // }
      this.startLoading();
      let obj = {
        grade: this.gradeInput,
        levelCode: this.levelCodeInput,
        levelType: this.levelTypeInput,
        name: this.nameInput,
        startTime:
          this.repeatInput === "Y"
            ? setStartDate(this.dateRepectInput[0]) + " " + this.timeInput
            : setStartDate(this.dateInput) + " " + this.timeInput,
        endTime:
          this.repeatInput === "Y"
            ? setStartDate(this.dateRepectInput[1])
            : "2999-12-30 23:59:59",
        repeat: this.repeatInput,
        duration: Number(getMin(this.timeInput, this.durationInput)),
        description: `${this.descriptionInput}`,
        operator: "Camstar",
        // this.operatorInput
        isWorking: this.isWorkingInput ? "Y" : "N",
        isPlanStop: this.isPlanStopInput ? "Y" : "N",
        lineNumber: this.lineInput,
        operationType: "I",
      };
      XY_OEE_Calendar(obj)
        .then((res) => {
          // console.log(obj, res.data.Status);
          if (res.data.Status === "OK") {
            this.fixedView();
            this.addEventShow = false;
            this.clearInput();
            this.endLoading();
            console.log(this.dateRepectInput);
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: `网络不良`,
          });
          this.endLoading();
        });
    },
    deleteEvent() {
      if (!this.idChange) {
        this.$message({
          type: "error",
          message: `未选中事件`,
        });
        return;
      }
      this.startLoading(this.idChange);
      XY_OEE_Calendar({
        id: this.idChange,
        lineNumber: this.lineChange,
        operationType: "D",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.fixedView();
            // this.key++;
            this.clearChange();
            this.workUpdataShow = false;
            this.endLoading();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            type: "error",
            message: `网络不良`,
          });
          this.endLoading();
        });
    },
    UpData() {
      // if (
      //   this.dateRepectChange === [] ||
      //   this.levelTypeChange === "" ||
      //   this.levelCodeChange === "" ||
      //   this.radio1 === 4 ||
      //   this.durationChange === 0 ||
      //   this.dateChange === '' ||
      //   this.lineChange === ''
      // ) {
      //   this.$message({
      //     type: "error",
      //     message: `请完整输入信息或者有信息格式不正确`,
      //   });
      //   return;
      // }
      if (!this.idChange) {
        this.$message({
          type: "error",
          message: `未选中事件`,
        });
        return;
      }
      if (getMin(this.timeChange, this.durationChange) < 0) {
        this.$message({
          type: "error",
          message: `请选择正确时间段`,
        });
        return;
      }
      // console.log({
      //   id: this.idChange,
      //   levelCode: this.levelCodeChange,
      //   levelType: this.levelTypeChange,
      //   name: this.nameChange,
      //   description: `${this.descriptionChange}`,
      //   operator: getToken(),
      //   // this.operatorChange
      //   repeat: this.repeatChange,
      //   grade: `${this.gradeChange}`,
      //   startTime:
      //     this.repeatChange === "Y"
      //       ? setStartDate(this.dateRepectChange[0]) + " " + this.timeChange
      //       : setStartDate(this.dateChange) + " " + this.timeChange,
      //   endTime:
      //     this.repeatChange === "Y"
      //       ? setStartDate(this.dateRepectChange[1])
      //       : "2999-12-30 23:59:59",
      //   duration: Number(getMin(this.timeChange, this.durationChange)),
      //   isWorking: this.isWorkingChange ? "Y" : "N",
      //   isPlanStop: this.isPlanStopChange ? "Y" : "N",
      //   lineNumber: this.lineChange,
      //   operationType: "U",
      // });
      // return;
      XY_OEE_Calendar({
        id: this.idChange,
        levelCode: this.levelCodeChange,
        levelType: this.levelTypeChange,
        name: this.nameChange,
        description: `${this.descriptionChange}`,
        operator: getToken(),
        // this.operatorChange
        repeat: this.repeatChange,
        grade: `${this.gradeChange}`,
        startTime:
          this.repeatChange === "Y"
            ? setStartDate(this.dateRepectChange[0]) + " " + this.timeChange
            : setStartDate(this.dateChange) + " " + this.timeChange,
        endTime:
          this.repeatChange === "Y"
            ? setStartDate(this.dateRepectChange[1])
            : "2999-12-30 23:59:59",
        duration: Number(getMin(this.timeChange, this.durationChange)),
        isWorking: this.isWorkingChange ? "Y" : "N",
        isPlanStop: this.isPlanStopChange ? "Y" : "N",
        lineNumber: this.lineChange,
        operationType: "U",
      })
        .then((res) => {
          if (res.data.Status === "OK") {
            this.fixedView();
            this.workUpdataShow = false;
          } else {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
          if (!this.idChange) {
            this.$message({
              type: "error",
              message: `未选中事件`,
            });
            return;
          }
        });
    },
    clearChange() {
      this.durationChange = 0;
      this.idChange = "";
      this.gradeChange = "";
      this.repeatChange = "";
      this.nameChange = "";
      this.dateChange = [];
      this.dateRepectChange = "";
      this.operatorChange = "";
      this.descriptionChange = "";
      this.levelTypeChange = "";
      this.levelCodeChange = "";
      this.radio1 = 4;
      this.durationChange = 0;
      this.lineChange = "";
      this.repeatChange = "N";
      // this.timeChange = ''
    },
    clearInput() {
      this.repeatInput = "N";
      this.gradeInput = "";
      this.durationInput = 0;
      this.nameInput = "";
      this.dateInput = "";
      this.dateRepectInput = [];
      this.descriptionInput = "";
      this.levelTypeInput = "";
      this.levelCodeInput = "";
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
    color(work, planStop) {
      if (work === "Y") {
        return "";
      }
    },
    arrChange(item, obj) {
      if (item.LineNumber === "Line1") {
        if (item.Repeat === "Y") {
          this.repeatObj(item, obj, 0);
        } else {
          this.notRepeatObj(item, obj, 0);
        }
      } else if (item.LineNumber === "Line2") {
        if (item.Repeat === "Y") {
          this.repeatObj(item, obj, 1);
        } else {
          this.notRepeatObj(item, obj, 1);
        }
      } else if (item.LineNumber === "Line3") {
        if (item.Repeat === "Y") {
          this.repeatObj(item, obj, 2);
        } else {
          this.notRepeatObj(item, obj, 2);
        }
      } else if (item.LineNumber === "All") {
        if (item.Repeat === "Y") {
          this.repeatObj(item, obj, 0);
          this.repeatObj(item, obj, 1);
          this.repeatObj(item, obj, 2);
        } else {
          this.notRepeatObj(item, obj, 0);
          this.notRepeatObj(item, obj, 1);
          this.notRepeatObj(item, obj, 2);
        }
      }
      // if (nightShift(item.StartTime, item.Duration)) {
      //   let toNight = getMin(getStartTime(item.StartTime, false), "24:00:00");
      //   if (item.Grade === 1) {
      //     if (item.Repeat === "Y") {
      //       this.arr[1].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         startTime: getStartTime(item.StartTime, false),
      //         endTime: "24:00:00",
      //         title: item.Name,
      //         startRecur: getDate(item.StartTime, 0),
      //         endRecur: getDate(item.EndTime, 0),
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         ...obj,
      //       });
      //       this.arr[1].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         startTime: "00:00:00",
      //         endTime: getEndTime(item.EndTime, item.Duration - toNight, false),
      //         title: item.Name,
      //         startRecur: getDate(item.StartTime, 1),
      //         endRecur: getDate(item.EndTime, 1),
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         ...obj,
      //       });
      //     } else {
      //       this.arr[1].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         start: getStartTime(item.StartTime, true),
      //         end: getEndTime(item.StartTime, item.Duration, true),
      //         title: item.Name,
      //         allDay: false,
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         ...obj,
      //       });
      //     }
      //   } else {
      //     if (item.Repeat === "Y") {
      //       this.arr[2].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         startTime: getStartTime(item.StartTime, false),
      //         endTime: "24:00:00",
      //         title: item.Name,
      //         startRecur: getDate(item.StartTime, 0),
      //         endRecur: getDate(item.EndTime, 0),
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         ...obj,
      //       });
      //       this.arr[2].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         startTime: "00:00:00",
      //         endTime: getEndTime(item.EndTime, item.Duration - toNight, false),
      //         title: item.Name,
      //         startRecur: getDate(item.StartTime, 1),
      //         endRecur: getDate(item.EndTime, 1),
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         ...obj,
      //       });
      //     } else {
      //       this.arr[2].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         start: getStartTime(item.StartTime, true),
      //         end: getEndTime(item.StartTime, item.Duration, true),
      //         title: item.Name,
      //         allDay: false,
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         ...obj,
      //       });
      //     }
      //   }
      // } else {
      //   if (item.Grade === 1) {
      //     if (item.Repeat === "Y") {
      //       this.arr[1].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         startTime: getStartTime(item.StartTime, false),
      //         endTime: getEndTime(item.StartTime, item.Duration, false),
      //         title: item.Name,
      //         startRecur: getStartDate(item.StartTime),
      //         endRecur: getEndDate(item.EndTime),
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         ...obj,
      //       });
      //     } else {
      //       this.arr[1].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         start: getStartTime(item.StartTime, true),
      //         end: getEndTime(item.StartTime, item.Duration, true),
      //         title: item.Name,
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         allDay: false,
      //         ...obj,
      //       });
      //     }
      //   } else {
      //     if (item.Repeat === "Y") {
      //       this.arr[2].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         startTime: getStartTime(item.StartTime, false),
      //         endTime: getEndTime(item.StartTime, item.Duration, false),
      //         title: item.Name,
      //         startRecur: getStartDate(item.StartTime),
      //         endRecur: getEndDate(item.EndTime),
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         ...obj,
      //       });
      //     } else {
      //       this.arr[2].events.push({
      //         ID: item.ID,
      //         eventOrder: item.Grade,
      //         start: getStartTime(item.StartTime, true),
      //         end: getEndTime(item.StartTime, item.Duration, true),
      //         title: item.Name,
      //         color: this.eventColor(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         textColor: this.eventText(
      //           item.IsWorking === "Y",
      //           item.IsPlanStop === "Y"
      //         ),
      //         allDay: false,
      //         ...obj,
      //       });
      //     }
      //   }
      // }

      // let data = {
      //     ID: item.ID,
      //     start: getStartDate(item.StartTime),
      //     end: getEndDate(item.EndTime),
      //     title: item.Name,
      //     allDay: true,
      //     color: this.eventColor(
      //       item.IsWorking === "Y",
      //       item.IsPlanStop === "Y"
      //     ),
      //     textColor: this.eventText(
      //       item.IsWorking === "Y",
      //       item.IsPlanStop === "Y"
      //     ),
      //     ...obj,
      //   }
      // if (item.LineNumber === "line1") {
      //   item.grade === 1 ? this.arr[0].events.push(data):this.arr[0].events.push(data);
      // } else if (item.LineNumber === "line2") {
      //   item.grade === 1 ? this.arr[1].events.push(data):this.arr[1].events.unshift(data);
      //   this.arr.forEach((item, index) => {
      //     console.log(index);
      //   });
      // } else if (item.LineNumber === "line3") {
      //   this.arr[2].events.push({
      //     ID: item.ID,
      //     start: getStartDate(item.StartTime),
      //     end: getEndDate(item.EndTime),
      //     title: item.Name,
      //     allDay: true,
      //     color: this.eventColor(
      //       item.IsWorking === "Y",
      //       item.IsPlanStop === "Y"
      //     ),
      //     textColor: this.eventText(
      //       item.IsWorking === "Y",
      //       item.IsPlanStop === "Y"
      //     ),
      //     ...obj,
      //   });
      // } else {
      //   this.arr.forEach((i, index) => {
      //     item.grade === 1 ? this.arr[index].events.push(data):this.arr[index].events.unshift(data);
      //     // this.arr[index].events.push({
      //     //   ID: item.ID,
      //     //   start: getStartDate(item.StartTime),
      //     //   end: getEndDate(item.EndTime),
      //     //   title: item.Name,
      //     //   allDay: true,
      //     //   color: this.eventColor(
      //     //     item.IsWorking === "Y",
      //     //     item.IsPlanStop === "Y"
      //     //   ),
      //     //   textColor: this.eventText(
      //     //     item.IsWorking === "Y",
      //     //     item.IsPlanStop === "Y"
      //     //   ),
      //     //   ...obj,
      //     // });
      //   });
      // }
    },
    repeatObj(item, obj, index) {
      this.workOrder = this.workOrder + 0.1;
      // this.eventOrder = this.eventOrder + (item.Grade === 1 ? 0 : 0.1);
      this.arr[index].events.push({
        ID: item.ID,
        eventOrder: this.workOrder,
        startTime: getStartTime(item.StartTime, false),
        endTime: getEndTime(item.StartTime, item.Duration, false),
        title: item.Name,
        startRecur: getStartDate(item.StartTime),
        endRecur: getEndDate(item.EndTime),
        color: this.eventColor(
          item.IsWorking === "Y",
          item.IsPlanStop === "Y",
          obj.LevelCode
        ),
        textColor: this.eventText(
          item.IsWorking === "Y",
          item.IsPlanStop === "Y"
        ),
        state: "work",
        ...obj,
      });
    },
    notRepeatObj(item, obj, index) {
      this.workOrder = this.workOrder + 0.1;
      // this.eventOrder = this.eventOrder + (item.Grade === 1 ? 0 : 0.1);
      this.arr[index].events.push({
        ID: item.ID,
        eventOrder: this.workOrder,
        start: getStartTime(item.StartTime, true),
        end: getEndTime(item.StartTime, item.Duration, true),
        title: item.Name,
        allDay: false,
        color: this.eventColor(item.IsWorking === "Y", item.IsPlanStop === "Y",
          obj.LevelCode),
        textColor: this.eventText(
          item.IsWorking === "Y",
          item.IsPlanStop === "Y"
        ),
        state: "work",
        ...obj,
      });
    },
    DIYButton(num) {
      if (num === 1) {
        this.changeBtnOne();
      } else if (num === 2) {
        this.changeBtnTwo();
      } else if (num === 3) {
        this.changeBtnThree();
      }
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
    changeBtnOne() {
      document.getElementsByClassName("fc-lineOne-button")[0].style.background =
        "linear-gradient(to right bottom, #65d1fb, #6591fb)";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.background =
        "white";
      document.getElementsByClassName(
        "fc-lineThree-button"
      )[0].style.background = "white";
      document.getElementsByClassName("fc-lineOne-button")[0].style.color =
        "white";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.color =
        "black";
      document.getElementsByClassName("fc-lineThree-button")[0].style.color =
        "black";
    },
    changeBtnTwo() {
      document.getElementsByClassName("fc-lineOne-button")[0].style.background =
        "white";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.background =
        "linear-gradient(to right bottom, #65d1fb, #6591fb)";
      document.getElementsByClassName(
        "fc-lineThree-button"
      )[0].style.background = "white";
      document.getElementsByClassName("fc-lineOne-button")[0].style.color =
        "black";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.color =
        "white";
      document.getElementsByClassName("fc-lineThree-button")[0].style.color =
        "black";
    },
    changeBtnThree() {
      document.getElementsByClassName("fc-lineOne-button")[0].style.background =
        "white";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.background =
        "white";
      document.getElementsByClassName(
        "fc-lineThree-button"
      )[0].style.background =
        "linear-gradient(to right bottom, #65d1fb, #6591fb)";
      document.getElementsByClassName("fc-lineOne-button")[0].style.color =
        "black";
      document.getElementsByClassName("fc-lineTwo-button")[0].style.color =
        "black";
      document.getElementsByClassName("fc-lineThree-button")[0].style.color =
        "white";
    },
    fixedView() {
      if (this.line === 0) {
        this.getdata("Line1");
      } else if (this.line === 1) {
        this.getdata("Line2");
      } else if (this.line === 2) {
        this.getdata("Line3");
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
        McId: item.McID,
        McName: item.McName,
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
        StartTime:item.StartTime,
        EndTime:item.EndTime
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
    durtimeChange() {
      this.calendarOptions.slotMinTime = this.durtime[0];
      this.calendarOptions.slotMaxTime = this.durtime[1];
      this.calendarOptions.views.timeGridWeek.slotLabelInterval = "00:02:00";
      this.calendarOptions.slotDuration = "00:02:00";
    },
  },
};
</script>

<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <div class="title">
        <!-- <el-select v-model="line" placeholder="工作线">
        <el-option
          v-for="item in [
            { value: 0, name: '一号线' },
            { value: 1, name: '二号线' },
            { value: 2, name: '三号线' },
          ]"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select> -->
        <div class="show-color">
          <div class="color">
            <div>工作</div>
            <div class="green"></div>
          </div>
          <div class="color">
            <div>异常</div>
            <div class="red"></div>
          </div>
          <div class="color">
            <div>已维修</div>
            <div class="yellow"></div>
          </div>
          <div class="color">
            <div v-show="line === 0">当前工作线:一号线</div>
            <div v-show="line === 1">当前工作线:二号线</div>
            <div v-show="line === 2">当前工作线:三号线</div>
          </div>
        </div>
      </div>
      <FullCalendar
        style="margin: 0; max-width: none; width: 100%"
        class="demo-app-calendar"
        :options="calendarOptions"
        :key="key"
        :eventOrder="['eventOrder']"
        ref="calendars"
      >
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>

    <el-dialog
      width="600px"
      :title="gradeInput === '1' ? '添加工作日程' : '增加事件计划'"
      :visible.sync="addEventShow"
    >
      <div>
        <el-form ref="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="nameInput"></el-input>
          </el-form-item>
          <!-- <el-form-item label="操作员">
            <el-input v-model="operatorInput"></el-input>
          </el-form-item> -->
          <el-form-item label="日期">
            <el-date-picker
              v-show="repeatInput === 'Y'"
              is-range
              v-model="dateRepectInput"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <el-date-picker
              style="width: 350px"
              v-show="repeatInput === 'N'"
              v-model="dateInput"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="时间" :inline="true">
            <!-- <el-time-picker
              is-range
              v-model="timeInput"
              format="HH:mm"
              value-format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker> -->
            <div class="flex">
              <el-time-picker
                v-model="timeInput"
                format="HH:mm"
                value-format="HH:mm:ss"
                placeholder="任意时间点"
              >
              </el-time-picker>
              <div style="margin: 0 20px">持续到</div>
              <el-time-picker
                style="width: 100px"
                v-model="durationInput"
                format="HH:mm"
                value-format="HH:mm:00"
                placeholder="任意时间点"
              >
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item label="是否重复">
            <el-switch
              v-model="repeatInput"
              active-value="Y"
              inactive-value="N"
            ></el-switch>
          </el-form-item>
          <el-form-item label="工作状态" :inline="true">
            <el-radio-group v-model="radio">
              <el-radio :label="0">工作</el-radio>
              <el-radio :label="1">计划停机</el-radio>
              <el-radio :label="2">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择">
            <div class="type">
              <el-select v-model="lineInput" placeholder="工作线">
                <el-option
                  v-for="item in [
                    { value: 'Line1', name: 'Line1' },
                    { value: 'Line2', name: 'Line2' },
                    { value: 'Line3', name: 'Line3' },
                    { value: 'All', name: 'All' },
                  ]"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select v-model="levelTypeInput" placeholder="OEE类型">
                <el-option
                  v-for="item in levelTypeData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select v-model="levelCodeInput" placeholder="OEE参数">
                <el-option
                  v-for="item in levelCodeData"
                  :key="item.LevelCode"
                  :label="item.LevelCode"
                  :value="item.LevelCode"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              type="textarea"
              size="medium"
              placeholder="请输入内容"
              v-model="descriptionInput"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEventShow = false">取 消</el-button>
        <el-button
          type="primary"
          @click="(dialogFormVisible = false), addData()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="维护" :visible.sync="isGoingEventShow">
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="设备" prop="errorLevel">
          <el-input v-model="wrongTime.mcName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="errorLevel">
          <el-input v-model="wrongTime.start" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="errorLevel">
          <el-input v-model="wrongTime.end" :disabled="true"></el-input>
        </el-form-item>
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

    <el-dialog title="已维护日常" :visible.sync="isCompleteShow">
      <el-form :model="showForm" label-width="auto">
        <el-form-item class="custom-form-item" label="线体名">
          <span>{{ showForm.lineNumber }}</span>
        </el-form-item>
        <el-form-item class="custom-form-item" label="设备名">
          <span>{{ showForm.mcName }}</span>
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
    </el-dialog>

    <el-dialog title="工作时间修改" :visible.sync="workUpdataShow">
      <el-form ref="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="nameChange"></el-input>
        </el-form-item>
        <!-- <el-form-item label="操作员">
            <el-input v-model="operatorChange"></el-input>
          </el-form-item> -->
        <el-form-item label="日期">
          <div></div>
          <el-date-picker
            v-show="repeatChange === 'Y'"
            is-range
            v-model="dateRepectChange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-date-picker
            style="width: 350px"
            v-show="repeatChange === 'N'"
            v-model="dateChange"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间">
          <div class="flex">
            <el-time-picker
              style="width: 160px"
              v-model="timeChange"
              format="HH:mm"
              value-format="HH:mm:ss"
              placeholder="任意时间点"
            >
            </el-time-picker>
            <div style="margin: 0 10px">持续到</div>
            <el-time-picker
              style="width: 100px"
              v-model="durationChange"
              format="HH:mm"
              value-format="HH:mm:00"
              placeholder="任意时间点"
            >
            </el-time-picker>
          </div>
        </el-form-item>
        <el-form-item label="是否重复">
          <el-switch
            v-model="repeatChange"
            active-value="Y"
            inactive-value="N"
          ></el-switch>
        </el-form-item>
        <el-form-item label="工作状态" :inline="true">
          <el-radio-group v-model="radio1">
            <el-radio :label="0">工作</el-radio>
            <el-radio :label="1">计划停机</el-radio>
            <el-radio :label="2">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择">
          <div class="type">
            <el-select v-model="lineChange" placeholder="工作线">
              <el-option
                v-for="item in [
                  { value: 'Line1', name: 'Line1' },
                  { value: 'Line2', name: 'Line2' },
                  { value: 'Line3', name: 'Line3' },
                  { value: 'All', name: 'All' },
                ]"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select v-model="levelTypeChange" placeholder="OEE类型">
              <el-option
                v-for="item in levelTypeData"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select v-model="levelCodeChange" placeholder="OEE参数">
              <el-option
                v-for="item in levelCodeData"
                :key="item.LevelCode"
                :label="item.LevelCode"
                :value="item.LevelCode"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            size="medium"
            placeholder="请输入内容"
            v-model="descriptionChange"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <div style="width: 100%" class="flex change-button">
            <el-button style="margin-left: 40px" type="primary" @click="UpData"
              >修改</el-button
            >
            <el-button
              style="margin-left: 100px"
              type="primary"
              @click="deleteEvent"
              >删除</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div
      class="timechoice"
      :style="{ top: `${durtimeStyle.top}px`, left: `${durtimeStyle.left}px` }"
    >
      <el-select
        v-model="durtime"
        @change="durtimeChange()"
        ref="timeChoice"
        style="width: 0px; height: 0px; overflow: hidden"
      >
        <el-option
          v-for="item in durtimeList"
          :key="item.value[0]"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<style></style>

<style lang="scss" scoped>
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

  .timechoice {
    width: 0px;
    height: 0px;
    // overflow: hidden;
    position: fixed;
  }
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
  flex-grow: 1;
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

/* 隐藏加号和减号 */
::v-deep .el-input-number__increase,
::v-deep .el-input-number__decrease {
  display: none;
}
</style>
