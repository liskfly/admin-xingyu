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