import request from "@/request/request";
export function XY_WMS_Tools_SpecImportControl(data) {
    return request({
        url: "/XingYuAPI/XY_WMS_Tools_SpecImportControl",
        method: "post",
        data,
    });
}