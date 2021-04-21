import io from 'socket.io-client';
const URL = "http://172.21.231.28:5000"; // 服务器地址
const uid = JSON.parse(sessionStorage["user_info"])._id; //用户id
export default {
  currSocket: null,
  // 创建连接
  createSocket: function () {
    const socket = io(URL, {
      path: "/WebChat/chat"
    });
    this.createSocket = socket;
    // 上线通知
    this.createSocket.emit("online", {uid});
  },
  // 关闭连接
  closeSocket: function () {
    this.currSocket.emit("closeSocket",uid);
  },
  // 开启连接
  openSocket: function () {
    this.currSocket.open();
    this.createSocket.emit("online", {uid});
  }
}