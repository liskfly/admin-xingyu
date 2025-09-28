import request from "@/request/dipRequest"
//dip查询
export function getContainerMoves(data) {
    return request({
      url: "/Container/getContainerMoves",
      method: "post",
      params: {
        conName: data,
      },
    });
  }
//smt查询
export function getPCBMoves(data) {
    return request({
      url: "/Container/getPCBMoves",
      method: "post",
      params: {
        conName: data,
      },
    });
  }