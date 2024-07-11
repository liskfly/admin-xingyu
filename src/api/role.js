import request from "@/utils/request";

export function getRolesList() {
  return request({
    url: "/api/role/arrlist",
    method: "get",
  });
}

export function getRoles(params) {
  return request({
    url: "/api/role/single",
    method: "get",
    params,
  });
}

export function getMuenList() {
  return request({
    url: "/api/page/list1",
    method: "get",
  });
}

export function getRoleMuen(params) {
  return request({
    url: "/api/page/allocateds",
    method: "get",
    params,
  });
}

export function setRoleKeys(params, keys) {
  return request({
    url: `/api/page/binding`,
    method: "post",
    data: keys,
    params,
  });
}

export function getCurrentMuen(params) {
  return request({
    url: "/api/page/list",
    method: "get",
    params,
  });
}
export function addRole(data) {
  return request({
    url: "/vue-element-admin/role",
    method: "post",
    data,
  });
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: "put",
    data,
  });
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: "delete",
  });
}
