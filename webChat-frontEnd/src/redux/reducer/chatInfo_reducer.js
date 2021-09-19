import socketIO from '../../utils/socket'
const initState = []; // 初始状态
function chatInfoReducer(preState = initState, action) {
  const { type, data } = action;
  // 根据type类型加工state
  switch (type) {
    // 追加消息，用于接收消息
    case "appendMessage":
      return [...preState, data];
    // 添加数据的同时，向后端发送
    case "sendMessage":
      console.log(data);
      // 向后端发送请求
      socketIO.privateChat(data);
      return [...preState, data];
    // 初始化数据，从后端获得
    case "initMessage":
      //....
      preState = data.messages;
      // 执行回调函数
      data.callback();
      return preState;
    case "clearMessage":
      preState = [];
      return preState;
    default:
      return preState;
  }
}

export default chatInfoReducer