import request from "@/utils/agv";
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

// AGV看板
export function findKanBan() {
  return request({
    url: "/AGVController/findKanBan",
    method: "post"
  });
}

//一键换线额外接口
export function oneChangingLine(data) {
  return request({
    url: "/AGVController/oneChangingLine",
    method: "post",
    data
  });
}

//叫料
export function taskCall(materialPreparationID,cr_user) {
  return request({
    url: "/AGVController/taskCall",
    method: "post",
    params:{
      materialPreparationID,
      cr_user
    }
  });
}

//取消叫料
export function cancelTask(materialPreparationID,cr_user) {
  return request({
    url: "/AGVController/cancelTask",
    method: "post",
    params:{
      materialPreparationID,
      cr_user
    }
  });
}