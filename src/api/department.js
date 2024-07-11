import csrequest from "@/utils/csRequest";


export function getDepartData() {
  return csrequest({
    url: "/WebService_API.asmx?op=SYS_Loading_BaseInfo7",
    method: "post",
    data: `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <SYS_Insert_BasnfeIo7 xmlns="http://tempuri.org/">
              <MODULENAME>部门信息</MODULENAME>
            </SYS_Insert_BasnfeIo7>
          </soap12:Body>
        </soap12:Envelope>`
  });
}


export function setField(data) {
  return csrequest({
    url: "/WebService_API.asmx?op=SYS_Insert_BasnfeIo7",
    method: "post",
    data: `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <SYS_Insert_BasnfeIo7 xmlns="http://tempuri.org/">
            <Var1>${data.name}</Var1>
            <Var2>${data.state}</Var2>
            <Var3>${data.head}</Var3>
            <Var4>${data.phone}</Var4>
            <Var5>${data.email}</Var5>
            <Var6>测试1</Var6>
            <Var7>测试2</Var7>
            <ModName>部门信息</ModName>
          </SYS_Insert_BasnfeIo7>
        </soap12:Body>
      </soap12:Envelope>`
  });
}