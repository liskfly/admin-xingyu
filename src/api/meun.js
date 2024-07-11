import csrequest from "@/utils/csRequest";

export function getMeunData() {
    return csrequest({
      url: "/WebService_API.asmx?op=SYS_Loading_BaseInfo7",
      method: "post",
      data: `<?xml version="1.0" encoding="utf-8"?>
          <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
            <soap12:Body>
              <SYS_Loading_BaseInfo7 xmlns="http://tempuri.org/">
                <MODULENAME>权限信息</MODULENAME>
              </SYS_Loading_BaseInfo7>
            </soap12:Body>
          </soap12:Envelope>`
    });
}

export function addPresion(data){
    return csrequest({
        url: "/WebService_API.asmx?op=SYS_Insert_BasnfeIo7",
        method: "post",
        data: `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <SYS_Insert_BasnfeIo7 xmlns="http://tempuri.org/">
              <Var1>${data.var1}</Var1>
              <Var2>${data.var2}</Var2>
              <Var3></Var3>
              <Var4></Var4>
              <Var5></Var5>
              <Var6></Var6>
              <Var7></Var7>
              <ModName>${data.ModName}</ModName>
            </SYS_Insert_BasnfeIo7>
          </soap12:Body>
        </soap12:Envelope>`
    })
}

export function deleteData(data) {
    return csrequest({
      url: "/WebService_API.asmx?op=Delete_BaseInfo",
      method: "post",
      data: `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <Delete_BaseInfo xmlns="http://tempuri.org/">
            <ID>${data}</ID>
          </Delete_BaseInfo>
        </soap12:Body>
      </soap12:Envelope>`
    });
}

export function editData(data) {
    return csrequest({
      url: "/WebService_API.asmx?op=Alter_BaseInfo",
      method: "post",
      data: `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <Alter_BaseInfo xmlns="http://tempuri.org/">
          <ID>${data.ID}</ID>
          <Var1>${data.var1}</Var1>
          <Var2>${data.var2}</Var2>
          <Var3></Var3>
          <Var4></Var4>
          <Var5></Var5>
          <Var6></Var6>
          <Var7></Var7>
          </Alter_BaseInfo>
        </soap12:Body>
      </soap12:Envelope>`
    });
  }