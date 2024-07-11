import request from "@/utils/wmsRequest";

export function queryPageContainer(data) {
  return request({
    url: "/Container/QueryPageContainer",
    method: "post",
    data,
  });
}

export function saveContainer(data) {
  return request({
    url: "/Container/SaveContainer",
    method: "post",
    data,
  });
}

export function deleteContainer(data) {
  return request({
    url: "/Container/DeleteContainer",
    method: "get",
    params: data,
  });
}

export function getHistoy(id) {
  return request({
    url: "/Half/GetHalfLog",
    method: "post",
    data: {
      PageIndex: 0,
      PageSize: 10,
      SearchText: id,
    },
  });
}

export function getReportWork(data) {
  return request({
    url: "/Half/GetReportWork",
    method: "post",
    data
  });
}

export function queryCloseOrder(data) {
  return request({
    url: "/Order/QueryCloseOrder",
    method: "post",
    data
  });
}

export function closeOrder(data) {
  return request({
    url: "/Order/CloseOrder",
    method: "post",
    data
  });
}

//成品入库
//入库检验获取
export function getFinshOrder(data) {
  return request({
    url: "/Order/GetFinishOrder",
    method: "get",
    data
  });
}
//保存
export function SaveIntactProduct(data) {
  return request({
    url: "/IntactProduct/SaveIntactProduct",
    method: "post",
    data
  });
}

//成品记录

export function getPackPage(data) {
  return request({
    url: "/Pack/GetPackPage",
    method: "post",
    data
  });
}
//成品绑定
export function getPackBind(data) {
  return request({
    url: "/Pack/GetPackBind",
    method: "post",
    data
  });
}

//组装
//领料单
export function getAssembleOrderPage(data) {
  return request({
    url: "/Order/GetAssembleOrderPage",
    method: "post",
    data
  });
}
//领料详情
export function getAssembleOrderDetail(data) {
  return request({
    url: "/Order/GetAssembleOrderDetail",
    method: "post",
    data
  });
}
//创建领料
export function saveChkOutSht(data) {
  return request({
    url: "/ChkOutSht/SaveChkOutSht",
    method: "post",
    data
  });
}

//拣货单
export function getChkOutShtPage(data) {
  return request({
    url: "/ChkOutSht/GetChkOutShtPage",
    method: "post",
    data
  });
}
//配料详细
export function getChkOutShtItemDetail(data) {
  return request({
    url: "/ChkOutSht/GetChkOutShtItemDetail",
    method: "post",
    data
  });
}

export function getChkOutShtListDetail(data) {
  return request({
    url: "/ChkOutSht/GetChkOutShtListDetail",
    method: "post",
    data
  });
}

//计算锁定
export function batching(data) {
  return request({
    url: "/ChkOutSht/Batching",
    method: "post",
    data
  });
}


export function getFirstInspectionPage(data) {
  return request({
    url: "/FirstArticle/GetFirstInspectionPage",
    method: "post",
    data
  });
}

export function getReportData(data) {
  return request({
    url: "/FirstArticle/GetReportData",
    method: "post",
    data
  });
}


export function getIntactJobBooking(data) {
  return request({
    url: "/IntactProduct/GetIntactJobBooking",
    method: "post",
    data
  });
}

///上传erP


export function uploadWareHousing(data) {
  return request({
    url: "/IntactProduct/UploadWareHousing",
    method: "post",
    data
  });
}

///Store/UploadWorkingHours

export function uploadWorkingHours(data) {
  return request({
    url: "/IntactProduct/UploadWorkingHours",
    method: "post",
    data
  });
}
//人员资质
export function savePersonQualification(data) {
  return request({
    url: "/Person/SavePersonQualification",
    method: "post",
    data
  });
}

export function deletePersonQualification(data) {
  return request({
    url: "/Person/DeletePersonQualification",
    method: "post",
    data
  });
}

//

export function getPagePersonQualification(data) {
  return request({
    url: "/Person/GetPagePersonQualification",
    method: "post",
    data
  });
}