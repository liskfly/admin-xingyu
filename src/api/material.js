import csrequest from "@/utils/csRequest"

export function getContainerMoves(conName) {
  return csrequest({
    url: "/container/getContainerMoves",
    method: "post",
    data: conName
  });
}
// export function getContainerMoves(data) {
//   return csrequest({
//     url: "/Container/getContainerMoves",
//     method: "post",
//     params: {
//       conName: data,
//     },
//   });
// }