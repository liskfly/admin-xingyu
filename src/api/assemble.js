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

    export function AssemblyReworkHistory(data) {

    return request({
        url: "/AssSpec/AssemblyReworkHistory",
        method: "post",
        data,
    }); }

    
//分页查询获取计划信息表信息
export function GetXYL_OEE_ShutDownList(data) {

    return request({
        url: "/EquipmentMaintenance/GetXYL_OEE_ShutDownList",
        method: "post",
        data,
    });
}
    
//新增停机计划
export function InsertXYL_OEE_ShutDown(data) {
    return request({
        url: "/EquipmentMaintenance/InsertXYL_OEE_ShutDown",
        method: "post",
        data,
    });
}
    
//删除停机计划
export function DeleteXYL_OEE_ShutDown(data) {
    return request({
        url: "/EquipmentMaintenance/DeleteXYL_OEE_ShutDown",
        method: "post",
        data,
    });
}