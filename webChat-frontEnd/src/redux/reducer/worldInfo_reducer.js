import socketIO from '../../utils/socket'
const initState = []; // 初始状态
function worldInfoReducer(preState = initState, action) {
  const { type, data } = action;
  // 根据type类型加工state
  switch (type) {
    // 追加消息，用于接收消息
    case "appendWorldInfo":
      return [...preState, data];
    // 添加数据的同时，向后端发送
    case "sendWorldInfo":
      // 向后端发送请求
      socketIO.sendWorldMessage(data.message);
      data.callback();
      return [...preState, data.message];
    // 初始化数据，从后端获得
    case "clearWorldInfo":
      //....
      preState = [];
      data.callback();
      return preState;
    default:
      return preState;
  }
}

export default worldInfoReducer