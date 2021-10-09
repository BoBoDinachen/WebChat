// 发送世界信息
function createSendWorldMessageAction(data) {
  return { type: "sendWorldInfo", data };
}
function createAppendWorldMessageAction(data) {
  return { type: "appendWorldInfo", data };
}
function createClearWorldMessageAction(data) {
  return { type: "clearWorldInfo", data };
}
export {
  createAppendWorldMessageAction,
  createSendWorldMessageAction,
  createClearWorldMessageAction
}