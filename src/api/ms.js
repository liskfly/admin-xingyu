import request from "@/utils/msRequest";
//入库
export function movein(data) {
  return request({
    url: "/msd/movein",
    method: "post",
    data,
  });
}
//出库
export function moveout(data) {
    return request({
      url: "/msd/moveout",
      method: "post",
      data,
    });
  }

  //
export function downLigthing(data) {
  return request({
    url: "/msd/downLigthing",
    method: "post",
    params:{
        cell:data
    },
  });
}