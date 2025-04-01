import request from "@/request/request";


//获取用户信息
export function getEmpoyeeInfo(data) {
    return request({
        url: "/employee/findByEmployeeName",
        method: "post",
        params:{
            employeeName:data
        }
    });
}
export function getInfo() {
    return request({
        url: "/employee/findUserInfoBytoken",
        method: "post",
    });
}

// export function getMenu() {
//     return request1({
//         url: "/employee/findMenuBytoken",
//         method: "post",
//     });
// }

export function getMenuOPUI() {
    return request({
        url: "/employee/findMenuListByOPUI",
        method: "post",
    });
}

export function getWorksMenuOPUI() {
    return request({
        url: "/employee/findWorkstationListByOPUI",
        method: "post",
    });
}

//获取全部菜单
export function getFirstMeun() {
    return request({
        url: "/menu/findAll",
        method: "post",
    });
}
//获取角色的菜单
export function getRoleMenuse(data) {
    return request({
        url: "/role/getRoleMenus",
        method: "post",
        params: {
            roleid: data,
        },
    });
}



//添加菜单
export function addMeun(data) {
    return request({
        url: "/menu/add",
        method: "post",
        data,
    });
}

//删除菜单
export function deleteMeun(data) {
    return request({
        url: "/menu/delete",
        method: "post",
        params: {
            id: data,
        },
    });
}

//修改菜单
export function updateMeun(data) {
    return request({
        url: "/menu/update",
        method: "post",
        data,
    });
}

//获取所有角色
export function getAllRole() {
    return request({
        url: "/role/findAll",
        method: "post",
    });
}

//
export function addRole(data) {
    return request({
        url: "/role/add",
        method: "post",
        data,
    });
}

export function getMeunRole(data) {
    return request({
        url: "/role/getRoleMenus",
        method: "post",
        params: {
            roleId: data,
        },
    });
}

export function updateRoleMeun(data) {
    return request({
        url: "/role/update",
        method: "post",
        data
    });
}
export function deleteRole(data) {
    return request({
        url: "/role/delete",
        method: "post",
        params: {
            roleId: data,
        },
    });
}

export function getEmployee() {
    return request({
        url: "/employee/findAll",
        method: "post",

    });
}
//获取用户角色
export function findEmployeeRoles(data) {
    return request({
        url: "/employeerole/findEmployeeRoles",
        method: "post",
        params: {
            empid: data,
        },
    });
}
export function addEmployeeRole(data) {
    return request({
        url: "/employeerole/add",
        method: "post",
        data,
    });
}

export function deletefirstRole(data) {
    return request({
        url: "/employeerole/deleteRole",
        method: "post",
        params: data
    });
}

export function deleteEmployee(data) {
    return request({
        url: "/employee/DeleteEmployee",
        method: "post",
        params: {
            employeeName: data,
        }
    });
}

export function getOrganization(){
    return request({
        url: "/employee/findOrganization",
        method: "post",
    });
}

//重置密码
export function ResetPwd(data) {
    return request({
        url: "/employee/UpdateEmpPwd",
        method: "post",
        params: data
    });
}

//重置密码
export function AddEmployee(data) {
    return request({
        url: "/employee/AddEmployee",
        method: "post",
        params: data
    });
}

//根据工号查询员工登录历史
export function findEmpLoginLog(data) {
    return request({
        url: "/employee/findEmpLoginLog",
        method: "post",
        params: {
            employeeName:data
        }
    });
}