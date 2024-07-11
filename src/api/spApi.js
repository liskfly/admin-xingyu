import request from "@/utils/spRequest";

export function GetinformationPage(data) {
  return request({
    url: "/SparepartsInformation/GetinformationPage",
    method: "post",
    data
  });
}

export function SavaInformation(data) {
  return request({
    url: "/SparepartsInformation/SavaInformation",
    method: "post",
    data
  });
}

export function UPdateInformation(data) {
  return request({
    url: "/SparepartsInformation/UPdateInformation",
    method: "post",
    data
  });
}

export function DeleteInformation(data) {
  return request({
    url: "/SparepartsInformation/DeleteInformation",
    method: "post",
    data
  });
}

export function GetScrapPage(data) {
  return request({
    url: "/SparePartsScrap/GetScrapPage",
    method: "post",
    data
  });
}

export function DeleteScrap(data) {
  return request({
    url: "/SparePartsScrap/DeleteScrap",
    method: "post",
    data
  });
}

export function UPdateScrap(data) {
  return request({
    url: "/SparePartsScrap/UPdateScrap",
    method: "post",
    data
  });
}

export function SavaScrap(data) {
  return request({
    url: "/SparePartsScrap/SavaScrap",
    method: "post",
    data
  });
}

export function GetChkOutShtPage(data) {
  return request({
    url: "/SpareParts/GetChkOutShtPage",
    method: "post",
    data
  });
}

export function GetRequisitionPage(data) {
  return request({
    url: "/Requisition/GetRequisitionPage",
    method: "post",
    data
  });
}