import request from "@/utils/timeRequest";

export function XY_Prod_MissSNs(data) {
    return request({
      url: "/XingYuAPI/XY_Prod_MissSNs",
      method: "post",
      data
    });
  }