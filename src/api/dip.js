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