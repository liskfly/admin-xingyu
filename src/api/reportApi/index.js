import request from "@/request/puzzleRequest";

export function GetPrintingTranslator(data) {
    return request({
        url: "/ReportQuery/GetPrintingTranslator",
        method: "post",
        data,
    });
}
//工治具
export function GetToolChkOutList(data) {
    return request({
        url: "/Pda/GetToolChkOutList",
        method: "post",
        data,
    });
}
//接料
export function GetWoOperatorTrace(data) {
    return request({
        url: "/ReportQuery/GetWoOperatorTrace",
        method: "post",
        data,
    });
}