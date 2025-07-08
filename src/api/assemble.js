import request from "@/request/assembleRequest";
// 组装过程提交
export function processSumbit(data) {

    return request({
        url: "/AssSpec/AssemblyRework",
        method: "post",
        data,
    });
}
//智驾线过程码--创建过程码
export function ExecuteAssGenerateSN(data) {

    return request({
        url: "/AssSpec/ExecuteAssGenerateSN",
        method: "post",
        data,
    });
}
//智驾线过程码--查询过程码
export function GetAssGenerateRecord(data) {

    return request({
        url: "/AssSpec/GetAssGenerateRecord",
        method: "post",
        data,
    });
}
//智驾线过程码--获取明细
export function GetAssGenerateSN(data) {

    return request({
        url: "/AssSpec/GetAssGenerateSN",
        method: "post",
        data,
    }); }