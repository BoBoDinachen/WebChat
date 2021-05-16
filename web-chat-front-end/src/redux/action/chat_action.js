// 发送信息的action
function createSendMessageAction(data) {
  return { type: "sendMessage", data };
}
function createInitMessageAction(data) {
  return { type: "initMessage", data };
}
export {
  createSendMessageAction,
  createInitMessageAction
}