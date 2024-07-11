import request from "@/utils/smdRequest";
export function saveMjsID(data) {
  return request({
    url: "/Mounter/SaveMjsID",
    method: "post",
    data,
  });
}

export function queryMjsID(data) {
  return request({
    url: "/Mounter/QueryMjsID",
    method: "post",
    data,
  });
}

export function getMjsList(data) {
  return request({
    url: "/Mounter/GetMjsList",
    method: "post",
    data,
  });
}

export function deleteMjsID(data) {
  return request({
    url: "/Mounter/DeleteMjsID",
    method: "post",
    data,
  });
}





