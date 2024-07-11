import csrequest from "@/utils/csRequest";

export function login(userInfo) {
    return csrequest({
      url: "/WebService_API.asmx?op=SYS_Login",
      method: "post",
      data: `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <SYS_Login xmlns="http://tempuri.org/">
            <USER_ID>${userInfo.username}</USER_ID>
            <PASSWORD>${userInfo.password}</PASSWORD>
          </SYS_Login>
        </soap12:Body>
      </soap12:Envelope>`
    });
  }


  export function getRoutes(data) {
    return csrequest({
      url: "/WebService_API.asmx?op=SYS_UserLoadingRole",
      method: "post",
      data: `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <SYS_UserLoadingRole xmlns="http://tempuri.org/">
            <USER_ID>${data}</USER_ID>
          </SYS_UserLoadingRole>
        </soap12:Body>
      </soap12:Envelope>`
    });
  }
