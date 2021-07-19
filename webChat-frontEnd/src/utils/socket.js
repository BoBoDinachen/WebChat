import io from 'socket.io-client';
const URL = "http://192.168.43.203:5000"; // 服务器地址
export default {
  // 创建连接
  currSocket: null,

  createSocket: function (_id,user_name) {
    const socket = io(URL, {
      path: "/WebChat/chat"
    });
    this.currSocket = socket;
    socket.emit("online", { _id,user_name });
    return socket;
  },

  // 关闭连接
  closeSocket: function (uid) {
    this.currSocket.emit("closeSocket", uid);
  },

  // 打开连接
  openSocket: function (uid) {
    this.currSocket.open();
    this.currSocket.emit("online", { uid });
  },
  
  // 发送私聊信息
  privateChat: function (params) {
    this.currSocket.emit("private_chat", params);
  },
}