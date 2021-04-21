var io;
const users = []; //线上的用户列表
const user_status = ["ON_LINE", "OFF_LINE"]; //用户在在线状态
const initChat = function (http) {
  io = require("socket.io")(http, {
    path: "/WebChat/chat",
    serveClient: false,
    cors:true //允许跨域
  });
  io.on("connection", (socket) => {
    console.log("有用户连接上了");
    // console.log(socket.handshake.query.uid); // 查询参数

    // 上线通知
    socket.on("online", (data) => {
      const uid = data.uid;
      console.log("uid", data.uid);
      console.log("socketID:", socket.id);
      // 保存用户状态和socketID到用户列表中
      users[uid] = {
        socketID: socket.id,
        status: user_status[0]
      }
      console.log(users);
    })

    // 关闭连接
    socket.on("closeSocket", (uid) => {
      console.log("断开用户的ID:",uid);
      for (const key in users) {
        if (key === uid) {
          // 设置用户离线状态
          users[key].status = user_status[1];
        }
      }
      console.log("断开连接后的用户列表:", users);
      socket.disconnect(true);
    })

    // 内置事件
    socket.on("disconnect", (reason) => {
      console.log("用户断开了连接");
    })
    
  })
}
// 关闭io
function closeIo() {
  io.close(); //关闭io
}

module.exports = {
  initChat,
  closeIo
}