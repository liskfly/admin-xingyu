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