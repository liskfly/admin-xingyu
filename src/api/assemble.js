import request from "@/request/assembleRequest";
// 组装过程提交
export function processSumbit(data) {

    return request({
        url: "Device2Mes/AssemblyRework",
        method: "post",
        data,
    });
}