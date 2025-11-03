import request from "@/request/kanbanRequest";
//当前生产工单
export function GetReport_LineCurrentWo(data) {
    return request({
        url: "/NoticeBoard/GetReport_LineCurrentWo",
        method: "post",
        data,
    });
}
//不良率
export function GetReport_LineBadnessInfo(data) {
    return request({
        url: "/NoticeBoard/GetReport_LineBadnessInfo",
        method: "post",
        data,
    });
}
//AOI一次通过率
export function GetReport_LineAOIFirstPassInfo(data) {
    return request({
        url: "/NoticeBoard/GetReport_LineAOIFirstPassInfo",
        method: "post",
        data,
    });
}
//SPI一次通过率
export function GetReport_LineSPIFirstPassInfo(data) {
    return request({
        url: "/NoticeBoard/GetReport_LineSPIFirstPassInfo",
        method: "post",
        data,
    });
}
//工单完成率
export function GetCompletionRate(data) {
    return request({
        url: "/NoticeBoard/GetCompletionRate",
        method: "post",
        data,
    });
}
//贴片产能
export function GetCapacity(data) {
    return request({
        url: "/NoticeBoard/GetCapacity",
        method: "post",
        data,
    });
}
//抛料率
export function GetFeeder(data) {
    return request({
        url: "/NoticeBoard/GetFeeder",
        method: "post",
        data,
    });
}

//工厂-工单完成
export function GetDayCompleteList(data) {
    return request({
        url: "/NoticeBoard/GetDayCompleteList",
        method: "post",
        data,
    });
}
//工厂-周月
export function GetMonthWeekCompleteList(data) {
    return request({
        url: "/NoticeBoard/GetMonthWeekCompleteList",
        method: "post",
        data,
    });
}

//获取OEE数据
export function GetAOI2OEE() {
    return request({
        url: "/NoticeBoard/GetAOI2OEE",
        method: "post",
    });
}

//当前生产工单(看板2)
export function GetReport_LineCurrentWo2(data) {
    return request({
        url: "/NoticeBoardByDay/GetReport_LineCurrentWo",
        method: "post",
        data,
    });
}

//不良率(看板2)
export function GetReport_LineBadnessInfo2(data) {
    return request({
        url: "/NoticeBoardByDay/GetReport_LineBadnessInfo",
        method: "post",
        data,
    });
}

//AOI一次通过率(看板2)
export function GetReport_LineAOIFirstPassInfo2(data) {
    return request({
        url: "/NoticeBoardByDay/GetReport_LineAOIFirstPassInfo",
        method: "post",
        data,
    });
}

//SPI一次通过率(看板2)
export function GetReport_LineSPIFirstPassInfo2(data) {
    return request({
        url: "/NoticeBoardByDay/GetReport_LineSPIFirstPassInfo",
        method: "post",
        data,
    });
}

//工单完成率(看板2)
export function GetCompletionRate2(data) {
    return request({
        url: "/NoticeBoardByDay/GetCompletionRate",
        method: "post",
        data,
    });
}