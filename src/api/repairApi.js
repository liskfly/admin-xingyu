import request from "@/request/puzzleRequest";
import noRequest from "@/request/puzzleNoRequest";

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
export function InsertBadCodebasicInformation(data) {
    return request({
        url: "/Repair/InsertBadCodebasicInformation",
        method: "post",
        data,
    });
}
//修改不良代码
export function UpdateBadCodebasicInformation(data) {
    return request({
        url: "/Repair/UpdateBadCodebasicInformation",
        method: "post",
        data,
    });
}
//删除不良代码
export function DeleteBadCodebasicInformation(data) {
    return request({
        url: "/Repair/DeleteBadCodebasicInformation",
        method: "post",
        data,
    });
}

