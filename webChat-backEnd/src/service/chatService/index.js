const {writeInfo,insertRequestRecord} = require("../../service/messageService");
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
      const {_id,user_name} = data;
      // console.log("uid", data.uid);
      // console.log("socketID:", socket.id);
      // 保存用户状态和socketID到用户列表中
      users[_id] = {
        socketID: socket.id,
        status: user_status[0]
      }
      console.log("当前用户列表:",users);
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
      socket.disconnect(true);
    })

    // 私聊信息
    socket.on("private_chat", (data,saveData) => {
      const {uid,uname,message, time, receiver_uid,receiver_name,status} = data; // 拿到发送方的数据
      const receiver = users[receiver_uid];
      console.log(data);
      // 判断接收者的状态
      if (receiver && receiver.status === "ON_LINE") {
        // 如果接收用户在线，则发送数据并将信息写入到文件中
        socket.to(receiver.socketID).emit("reply_private_chat", { uid, uname, message, time, status: "0" });
        writeInfo({uid,uname,message, time, receiver_uid,receiver_name,status});
      } else {
        // 如果不在线,则将待发送数据离线处理
        writeInfo({uid,uname,message, time, receiver_uid,receiver_name,status});
      }
    })

    // 世界信息
    socket.on("world_chat", (data) => {
      console.log(data);
      const { uid, uname, time, message } = data;
      // 遍历map用户列表，给每个用户发送信息
      for(const key of Object.keys(users)) {
        if (users[key] && users[key].status === "ON_LINE" && users[key].socketID !== users[uid].socketID) {
          // 如果用户在线，发送给用户,除自己外
          socket.to(users[key].socketID).emit("reply_world_chat", { uid, uname, message, time });
        }
      }
      // 将数据写入文件
      console.log("写入文件");
    })
    // 好友申请通知
    socket.on("friend_request", (data) => {
      const { uid, uname, fid, fname, time } = data;
      // console.log(data);
      const receiver = users[fid];
      if (receiver && receiver.status === "ON_LINE") {
        socket.to(receiver.socketID).emit("reply_friend_request", data);
        insertRequestRecord(data);
      } else {
        insertRequestRecord(data);
      }
      // 添加用户的申请记录和好友的申请记录
    })

    // 申请结果通知
    socket.on("request_result", (data) => {
      const { uid, fid, status } = data;
      const receiver = users[fid];
      if (receiver && receiver.status === "ON_LINE") {
        socket.to(receiver.socketID).emit("reply_request_result", data);
      }
    })
    // 内置事件
    socket.on("disconnect", (reason) => {
      for (const key in users) {
        // 如果断开连接的socket.id与用户列表映射的socketID相等的话，就改变离线状态
        if (users[key].socketID === socket.id) {
          users[key].status = user_status[1];
        }
      }
      console.log("断开连接后的用户列表:", users);
      console.log("用户断开了连接");
    });
    
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