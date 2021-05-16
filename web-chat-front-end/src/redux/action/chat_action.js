// 发送信息的action
function createSendMessageAction(data) {
  return { type: "sendMessage", data };
}
function createInitMessageAction(data) {
  return { type: "initMessage", data };
}
function createAppendMessageAction(data) {
  return { type: "appendMessage", data };
}
export {
  createSendMessageAction,
  createInitMessageAction,
  createAppendMessageAction
}