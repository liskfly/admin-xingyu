import request from "@/request/WMSRequest";
export function QuerySDZHHeadData(data) {
    return request({
      url: "/ReportQuery/QuerySDZHHeadData",
      method: "post",
      data
    });
  }
  export function QuerySDZHDetailData(data) {
    return request({
      url: "/ReportQuery/QuerySDZHDetailData",
      method: "post",
      data
    });
  }
  export function addProductCodeRules(data) {
    return request({
      url: "/ProductCodeRules/addProductCodeRules",
      method: "post",
      data
    });
  }
  export function findProductCodeRules(data) {
    return request({
      url: "/ProductCodeRules/findProductCodeRules",
      method: "post",
      data
    });
  }
  export function DeleteProductCodeRules(data) {
    return request({
      url: "/ProductCodeRules/DeleteProductCodeRules",
      method: "post",
      data
    });
  }
  export function updateProductCodeRules(data) {
    return request({
      url: "/ProductCodeRules/updateProductCodeRules",
      method: "post",
      data
    });
  }
  export function PSNMoveParam_thtPressFit(data) {
    return request({
      url: "/DataCollect/PSNMoveParam_thtPressFit",
      method: "post",
      data
    });
  }
  export function PSNMoveParam_AOI(data) {
    return request({
      url: "/DataCollect/PSNMoveParam_AOI",
      method: "post",
      data
    });
  }
  export function PSNMoveParam_dePanel(data) {
    return request({
      url: "/DataCollect/PSNMoveParam_dePanel",
      method: "post",
      data
    });
  }
  export function addPressFitBOM(data) {
    return request({
      url: "/pressFitBOM/add",
      method: "post",
      data
    });
  }
  export function updatePressFitBOM(data) {
    return request({
      url: "/pressFitBOM/update",
      method: "post",
      data
    });
  }
  export function deletePressFitBOM(data) {
    return request({
      url: "/pressFitBOM/delete",
      method: "post",
      data
    });
  }
  export function findAllPressFitBOM(data) {
    return request({
      url: "/pressFitBOM/findAll",
      method: "post",
      data
    });
  }
  export function findAllNamePressFitBOM(data) {
    return request({
      url: "/pressFitBOM/findAllName",
      method: "post",
      data
    });
  }

  export function GetCompId(data) {
    return request({
      url: "/Pda/GetCompId",
      method: "post",
      data
    });
  }
  
  export function QueryOperator(data) {
    return request({
      url: "/Pda/QueryOperator",
      method: "post",
      data
    });
  }

  //
  export function QueryXYL_BadProductInformationRepairRecord(data) {
    return request({
      url: "/ReportQuery/QueryXYL_BadProductInformationRepairRecord",
      method: "post",
      data
    });
  }

  //获取三点照合详细信息
  export function QueryXYL_ThreePointMatchingDetailInfo(data) {
    return request({
      url: "/ReportQuery/QueryXYL_ThreePointMatchingDetailInfo",
      method: "post",
      data
    });
  }
  //获取三点照合
   export function QueryXYL_ThreePointMatchingDetailFinalStateInfo(data) {
    return request({
      url: "ReportQuery/QueryXYL_ThreePointMatchingDetailFinalStateInfo",
      method: "post",
      data
    });
  }
