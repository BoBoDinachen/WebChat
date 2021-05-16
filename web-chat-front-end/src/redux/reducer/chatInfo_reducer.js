const initState = [
  {
    uid: "11111",  //用户id
    message: "你好~我是发送者", // 信息
    time: "2021/5/15", //  时间
    status: "0" // 0-发送者   1-接受者
  },
  {
    uid: "22222",  //用户id
    message: "你也好~我是接收者", // 信息
    time: "2021/5/15", //  时间
    status: "1" // 0-发送者   1-接受者
  },
]; // 初始状态
function chatInfoReducer(preState = initState,action) {
  const { type, data } = action;
  // 根据type类型加工state
  switch (type) {
    case "sendMessage":
      console.log(data);
      // preState.push(data);
      // 向后端发送请求
      return [...preState, data];
    case "initMessage":
      // 根据用户id加载对应的聊天信息,请求后端
      //....
      console.log("当前用户聊天的uid：",data.uid);
      return preState;
    default:
      return preState;
  }
}

export default chatInfoReducer