import request from "@/utils/test";
// 查询设备数据
export function findLineMaterial(data) {
  return request({
    url: "/AGVController/findLineMaterial",
    method: "post",
    params:{
        line:data
    }
  });
}