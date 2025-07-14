import request from "@/request/puzzleRequest";
import noRequest from "@/request/puzzleNoRequest";
export function findPanelizationList(data) {
    return request({
        url: "/Panelization/findPanelizationList",
        method: "post",
        data,
    });
}
export function addPanelizationList(data) {
    return request({
        url: "/Panelization/addPanelizationList",
        method: "post",
        data,
    });
}

export function DeletePanelizationList(data) {
    return request({
        url: "/Panelization/DeletePanelizationList",
        method: "post",
        params:{
            Obj:data
        }
    });
}

export function findPnDetail(data) {
    return request({
        url: "/Panelization/findPnDetail",
        method: "post",
        params:{
            pn:data
        },
    });
}
export function addPanelizationdetail(data) {
    return request({
        url: "/Panelization/addPanelizationdetail",
        method: "post",
        data,
    });
}
export function DeletePanelizationDetail(data) {
    return request({
        url: "/Panelization/DeletePanelizationDetail",
        method: "post",
        data,
    });
}
export function UpdatePanelizationList(data) {
    return request({
        url: "/Panelization/UpdatePanelizationList",
        method: "post",
        data,
    });
}



export function UpdatePanelizationDetail(data) {
    return request({
        url: "/Panelization/UpdatePanelizationDetail",
        method: "post",
        data,
    });
}

export function QueryPanelmergeAllList(data) {
    return request({
        url: "/Panelmerge/QueryPanelmergeAllList",
        method: "post",
        data,
    });
}

export function QueryPanelmerge(data) {
    return request({
        url: "/Panelmerge/QueryPanelmerge",
        method: "post",
        data,
    });
}
export function addPanelmergeList(data) {
    return request({
        url: "/Panelmerge/addPanelmergeList",
        method: "post",
        data,
    });
}
export function DeletePanelmerge(data) {
    return request({
        url: "/Panelmerge/DeletePanelmerge",
        method: "post",
        data,
    });
}
export function QueryFoundation(data) {
    return request({
        url: "/Panelmerge/QueryFoundation",
        method: "post",
        data,
    });
}
export function findPartNumberData(data) {
    return noRequest({
        url: "/Panelization/findPartNumberData",
        method: "post",
        params:{
            pn:data
        }
    });
}

//新增文件SOP
export function InsertXYLProductSOP(data) {
    return request({
        url: "/ProductSOP/InsertXYLProductSOP",
        method: "post",
        data
    });
}

//查询文件SOP
export function QueryXYLProductSOP(data) {
    return request({
        url: "/ProductSOP/QueryXYLProductSOP",
        method: "post",
        data
    });
}

//查询MES料号
export function GetESReportViewProduct(data) {
    return request({
        url: "/ProductSOP/GetESReportViewProduct",
        method: "post",
        data
    });
}

//文件预览和下载
export function DQXYLProductSOP(data) {
    return request({
        url: "/ProductSOP/DQXYLProductSOP",
        method: "post",
        data
    });
}

//查询核对基础数据
export function QueryChecProductFoundation(data) {
    return request({
        url: "/ProductCheck/QueryChecProductFoundation",
        method: "post",
        data
    });
}

//新增核对基础数据
export function InsertChecProductFoundation(data) {
    return request({
        url: "/ProductCheck/InsertChecProductFoundation",
        method: "post",
        data
    });
}

//修改核对基础数据
export function UpdateChecProductFoundation(data) {
    return request({
        url: "/ProductCheck/UpdateChecProductFoundation",
        method: "post",
        data
    });
}

//删除核对基础数据
export function DeleteChecProductFoundation(data) {
    return request({
        url: "/ProductCheck/DeleteChecProductFoundation",
        method: "post",
        data
    });
}

//根据id查询核对基础数据(修改时使用)
export function QueryChecProductFoundationById(data) {
    return request({
        url: "/ProductCheck/QueryChecProductFoundationById",
        method: "post",
        data
    });
}