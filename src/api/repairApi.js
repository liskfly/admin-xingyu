import request from "@/request/puzzleRequest";

//查询不良类别
export function QueryBadTypebasicInformation(data) {
    return request({
        url: "/Repair/QueryBadTypebasicInformation",
        method: "post",
        data,
    });
}
//新增不良类别
export function InsertBadTypeInformation(data) {
    return request({
        url: "/Repair/InsertBadTypeInformation",
        method: "post",
        data,
    });
}
//修改不良类别
export function UpdateBadTypeInformation(data) {
    return request({
        url: "/Repair/UpdateBadTypeInformation",
        method: "post",
        data,
    });
}
//删除不良类别
export function DeleteBadTypeInformation(data) {
    return request({
        url: "/Repair/DeleteBadTypeInformation",
        method: "post",
        data,
    });
}



//查询不良代码
export function QueryBadCodebasicInformation(data) {
    return request({
        url: "/Repair/QueryBadCodebasicInformation",
        method: "post",
        data,
    });
}
//新增不良代码
export function InsertBadCodeInformation(data) {
    return request({
        url: "/Repair/InsertBadCodeInformation",
        method: "post",
        data,
    });
}
//修改不良代码
export function UpdateBadCodeInformation(data) {
    return request({
        url: "/Repair/UpdateBadCodeInformation",
        method: "post",
        data,
    });
}
//删除不良代码
export function DeleteBadCodeInformation(data) {
    return request({
        url: "/Repair/DeleteBadCodeInformation",
        method: "post",
        data,
    });
}

//获取不良类别下的代码
export function QueryBadCodeFromType(data) {
    return request({
        url: "/Repair/QueryBadCodeFromType",
        method: "post",
        data,
    });
}
//获取线体
export function QueryMfgLine(data) {
    return request({
        url: "/Repair/QueryMfgLine",
        method: "post",
        data,
    });
}
//获取设备
export function QueryEquipment(data) {
    return request({
        url: "/Repair/QueryEquipment",
        method: "post",
        data,
    });
}

//新增不良产品信息
export function InsertXYL_BadProductInformation(data) {
    return request({
        url: "/Repair/InsertXYL_BadProductInformation",
        method: "post",
        data,
    });
}



export function QueryXYL_BadProductInformation(data) {
    return request({
        url: "/Repair/QueryXYL_BadProductInformation",
        method: "post",
        data,
    });
}
//查询不良待维修记录
export function QueryXYL_BadProductInformationFromContainer(data) {
    return request({
        url: "/Repair/QueryXYL_BadProductInformationFromContainer",
        method: "post",
        data,
    });
}
//维修操作
export function UpdateXYL_BadProductInformation(data) {
    return request({
        url: "/Repair/UpdateXYL_BadProductInformation",
        method: "post",
        data,
    });
}



//报废确认
export function UpdateXYL_BadProductInformationScrapRevd(data) {
    return request({
        url: "/Repair/UpdateXYL_BadProductInformationScrapRevd",
        method: "post",
        data,
    });
}

//维修记录
export function QueryXYL_BadProductInformationRepairRecord(data) {
    return request({
        url: "/Repair/QueryXYL_BadProductInformationRepairRecord",
        method: "post",
        data,
    });
}


// export function QueryXYL_BadProductInformationScrap(data) {
//     return request({
//         url: "/Repair/QueryXYL_BadProductInformationScrap",
//         method: "post",
//         data,
//     });
// }
//查询审核料号信息
export function QueryXYL_BadExamine(data) {
    return request({
        url: "/Repair/QueryXYL_BadExamine",
        method: "post",
        data,
    });
}
//新增审核料号信息
export function InsertXYL_BadExamine(data) {
    return request({
        url: "/Repair/InsertXYL_BadExamine",
        method: "post",
        data,
    });
}
//修改审核料号信息
export function UpdateXYL_BadExamine(data) {
    return request({
        url: "/Repair/UpdateXYL_BadExamine",
        method: "post",
        data,
    });
}

//获取报废审批  
export function QueryDistinctPCBIDFormScrap(data) {
    return request({
        url: "/Repair/QueryDistinctPCBIDFormScrap",
        method: "post",
        data,
    });
}
//获取报废审批明细 /Repair/QueryXYL_BadProductInformationScrap
export function QueryXYL_BadProductInformationScrap(data) {
    return request({
        url: "/Repair/QueryXYL_BadProductInformationScrap",
        method: "post",
        data,
    });
}
//查询不良明细
export function QueryXYL_BadProductInformationFromByNo(data) {
    return request({
        url: "/Repair/QueryXYL_BadProductInformationFromByNo",
        method: "post",
        data,
    });
}

//查询更换物料
export function QueryXYL_BadProductInformationRepairMaterial(data) {
    return request({
        url: "/Repair/QueryXYL_BadProductInformationRepairMaterial",
        method: "post",
        data,
    });
}