import socketIO from '../../utils/socket'
const initState = []; // 初始状态
function chatInfoReducer(preState = initState,action) {
  const { type, data } = action;
  // 根据type类型加工state
  switch (type) {
    // 向状态中添加数据
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
      // 根据用户id加载对应的聊天信息,请求后端
      //....
      preState = [
        // {
        //   uid: "11111",  //用户id
        //   uname:"小柚酱", // 用户名
        //   message: "1", // 信息
        //   time: "2021/5/15", //  时间
        //   status: "0" // 0-发送者   1-接受者
        // },
        // {
        //   uid: "22222",  //用户id
        //   uname: "小喵酱", //用户名
        //   message: "2", // 信息
        //   time: "2021/5/15", //  时间
        //   status: "1" // 0-发送者   1-接受者
        // },
      ]
      // console.log("当前用户聊天的uid：",data.uid);
      return preState;
    default:
      return preState;
  }
}

export default chatInfoReducer