import request from "@/request/puzzleRequest";

export function GetPrintingTranslator(data) {
    return request({
        url: "/ReportQuery/GetPrintingTranslator",
        method: "post",
        data,
    });
}

export function GetToolChkOutList(data) {
    return request({
        url: "/Pda/GetToolChkOutList",
        method: "post",
        data,
    });
}