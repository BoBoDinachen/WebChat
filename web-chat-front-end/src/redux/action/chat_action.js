// 发送信息的action
function createSendMessageAction(data) {
  return { type: "sendMessage", data };
}
function createInitMessageAction(data) {
  return { type: "initMessage", data };
}
function createClearMessageAction(data) {
  return { type: "clearMessage", data };
}
function createAppendMessageAction(data) {
  return { type: "appendMessage", data };
}
export {
  createAppendMessageAction,
  createSendMessageAction,
  createInitMessageAction,
  createClearMessageAction
}