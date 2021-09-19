import io from 'socket.io-client';
import host from './host'
const URL = "http://"+host.devHost; // 服务器地址
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
  privateChat: function (data) {
    this.currSocket.emit("private_chat", data);
  },

  // 发送大世界信息
  sendWorldMessage: function (data) {
    this.currSocket.emit("world_chat",data);
  },
  // 好友申请
  friendRequest: function (data) {
    this.currSocket.emit("friend_request",data);
  },
  // 好友申请通知
  requestInform: function (data) {
    this.currSocket.emit("request_result",data);
  }
}