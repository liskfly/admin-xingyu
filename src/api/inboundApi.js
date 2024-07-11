import request from "@/utils/inbound";
export function updateUri(data) {
  return request({
    url: "/agency/updateUri",
    method: "post",
    params: {
      apiType: 1,
      data: data,
      uri: "http://172.20.99.42/PcbApi/api/repair/es_move",
    },
  });
}

export function getContainerMoves(data) {
  return request({
    url: "/container/getContainerMoves",
    method: "post",
    params: {
      conName: data,
    },
  });
}
