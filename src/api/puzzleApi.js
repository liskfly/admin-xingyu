import request from "@/request/puzzleRequest";
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
export function UpdatePanelizationDetail(data) {
    return request({
        url: "/Panelization/UpdatePanelizationDetail",
        method: "post",
        data,
    });
}