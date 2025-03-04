import request from "@/utils/agv";
import request1 from "@/request/AGVRequest";
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
export function findLineMaterialk(data) {
  return request1({
    url: "/AGVController/findLineMaterial",
    method: "post",
    params:{
      line:data
    }
  });
}
export function recycleEmptyVehicles(data) {
  return request1({
    url: "/AGVController/recycleEmptyVehicles",
    method: "post",
    params:data
  });
}
export function cancelTask1(data) {
  return request1({
    url: "/AGVController/cancelTask",
    method: "post",
    params:data
  });
}
export function findWorkStation() {
  return request1({
    url: "/AGVController/findWorkStation",
    method: "post",

  });
}
export function findPoint() {
  return request1({
    url: "/AGVController/findPoint",
    method: "post",
  
  });
}
export function findTaskPage(data) {
  return request1({
    url: "/AGVController/findTaskPage",
    method: "post",
  data
  });
}
export function findTaskData() {
  return request({
    url: "/AGVController/findTaskData",
    method: "post"
  });
}