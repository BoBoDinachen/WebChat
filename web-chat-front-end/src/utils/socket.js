import io from 'socket.io-client';
const URL = "http://172.21.231.28:5000"; // 服务器地址
export default {
  // 创建连接
  currSocket: null,

  createSocket: function (uid) {
    const socket = io(URL, {
      path: "/WebChat/chat"
    });
    this.currSocket = socket;
    socket.emit("online", { uid });
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