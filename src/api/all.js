import request from "@/utils/request";
// 查询设备数据
export function getProduct(data) {
  return request({
    url: "/XingYuAPI/XY_CO_ProductControl",
    method: "post",
    data,
  });
}

export function getProductDetail(data) {
  return request({
    url: "/XingYuAPI/XY_CO_Product_CControl",
    method: "post",
    data,
  });
}
export function insetProductData(data) {
  return request({
    url: "/XingYuAPI/XY_CO_Product_CControl",
    method: "post",
    data,
  });
}

export function getChangeOverOrder() {
  return request({
    url: "/XingYuAPI/XY_SMT_ChangeOver_Q1Control",
    method: "post",
    data: {
      workOrder: "ChangeOver",
    },
  });
}

export function getChangeOverOrderInfor(data) {
  return request({
    url: "/XingYuAPI/XY_SMT_ChangeOver_Q2Control",
    method: "post",
    data,
  });
}

export function getChangeOverStatus(value){
  return request({
    url: "/XingYuAPI/XY_SMT_ChangeOver_Q3Control",
    method: "post",
    data:value
  });
}

export function changeoverRequests(data) {
  return request({
    url: "/XingYuAPI/XY_SMT_ChangeOver_UControl",
    method: "post",
    data,
  });
}

//首检查询
export function getInspectData(data) {
  return request({
    url: "/XingYuAPI/XY_MB_InspectSpec_QControl",
    method: "post",
    data,
  });
}

//首检输入
export function setInspectData(data) {
  return request({
    url: "/XingYuAPI/XY_MB_InspectSpec_IControl",
    method: "post",
    data,
  });
}

//首检修改
export function editInspectData(data) {
  return request({
    url: "/XingYuAPI/XY_MB_InspectSpec_UControl",
    method: "post",
    data,
  });
}
//删除
export function delInspectData(data) {
  return request({
    url: "/XingYuAPI/XY_MB_InspectSpec_DControl",
    method: "post",
    data,
  });
}
///XingYuAPI/XY_MB_Inspect_Q4Control

export function getCheckResults(data) {
  return request({
    url: "/XingYuAPI/XY_MB_Inspect_Q4Control",
    method: "post",
    data,
  });
}
//治具类型录入
export function moldControl(data) {
  return request({
    url: "/XingYuAPI/XY_WMS_Tools_MoldControl",
    method: "post",
    data,
  });
}

//治具ID录入
export function iDControll(data) {
  return request({
    url: "/XingYuAPI/XY_WMS_Tools_IDControl",
    method: "post",
    data,
  });
}

//产品消耗
export function specControl(data) {
  return request({
    url: "/XingYuAPI/XY_WMS_Tools_SpecControl",
    method: "post",
    data,
  });
}

///XingYuAPI/XY_WMS_Tools_OrderControl

export function orderControl(data) {
  return request({
    url: "/XingYuAPI/XY_WMS_Tools_OrderControl",
    method: "post",
    data,
  });
}

///湿敏元器件
export function dryComponentControl(data) {
  return request({
    url: "/XingYuAPI/DryComponentControl",
    method: "post",
    data,
  });
}

////XingYuAPI/XY_PCBAHisControl
export function XY_PCBAHisControl(data) {
  return request({
    url: "/XingYuAPI/XY_PCBAHisControl",
    method: "post",
    data
  });
}

export function XY_PCBAHisQTYControl(data) {
  return request({
    url: "/XingYuAPI/XY_PCBAHisQTYControl",
    method: "post",
    data
  });
}

export function XY_PCBAHisYieldControl(data) {
  return request({
    url: "/XingYuAPI/XY_PCBAHisYieldControl",
    method: "post",
    data
  });
}



export function XY_OEE_InquiryControl(data) {
  return request({
    url: "/XingYuAPI/XY_OEE_InquiryControl",
    method: "post",
    data
  });
}

//OE类型
export function XY_OEE_LevelType(data) {
  return request({
    url: "/XingYuAPI/XY_OEE_LevelTypeControl",
    method: "post",
    data
  });
}

//OE参数
export function XY_OEE_LevelCode(data) {
  return request({
    url: "/XingYuAPI/XY_OEE_LevelCodeControl",
    method: "post",
    data
  });
}

//OEE日历
export function XY_OEE_Calendar(data) {
  return request({
    url: "/XingYuAPI/XY_OEE_CalendarControl",
    method: "post",
    data
  });
}

export function XYL_OEE_ProductCycle(data) {
  return request({
    url: "/HYCAPI/XYL_OEE_ProductCycle",
    method: "post",
    data
  });
}

export function XY_Prod_MissSNs(data) {
  return request({
    url: "/XingYuAPI/XY_Prod_MissSNs",
    method: "post",
    data
  });
}

export function XY_Prod_AddMissSN(data) {
  return request({
    url: "/XingYuAPI/XY_Prod_AddMissSN",
    method: "post",
    data
  });
}

export function XY_OEE_LineError(data) {
  return request({
    url: "/XingYuAPI/XY_OEE_LineError",
    method: "post",
    data
  });
}

export function XY_OEE_LineErrorUpdate(data) {
  return request({
    url: "/XingYuAPI/XY_OEE_LineErrorUpdate",
    method: "post",
    data
  });
}

export function XY_Assembly_OrderStatus(data) {
  return request({
    url: "/XingYuAPI/XY_Assembly_OrderStatus",
    method: "post",
    data
  });
}

export function XY_SMT_OrderStatus(data) {
  return request({
    url: "/XingYuAPI/XY_SMT_OrderStatus",
    method: "post",
    data
  });
}