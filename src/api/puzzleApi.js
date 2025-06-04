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
        params: {
            pn: data,
        },
    });
}


