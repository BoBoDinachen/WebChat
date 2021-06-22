const fs = require("fs");
const path = require("path");
const rootPath = path.join(__dirname, "../../");
const FILE_PATH = rootPath + "data/chat_info_data";
const { getFriendsInfo } = require("../userService/index")

// 初始化消息记录文件
function initSendMessageFile(params) {
  return new Promise((resolve, reject) => {
    const { uid, uname } = params;
    fs.access(`${FILE_PATH}/${uid}.json`, fs.constants.F_OK, async (err) => {
      if (err) {
        // 文件不存在，则创建对应用户的消息记录文件
        let messageData = {
          "uid": uid,
          "uname": uname,
          "friendList": [

          ]
        }
        getFriendsInfo({ uid }).then((friendList) => {
          friendList.map((item) => {
            console.log(item);
            messageData.friendList.push({
              "fid": item._id + '',
              "fname": item.user_name,
              "messageList": [

              ]
            })
          })
          // 创建文件
          fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(messageData, null, '\t'), () => {
            console.log("创建成功...");
            resolve(messageData);
          })
        })
      } else {
        // 如果文件存在，返回文件内容
        let messageData = await fs.readFileSync(`${FILE_PATH}/${uid}.json`);
        resolve(JSON.parse(messageData));
      }
    })
  })
}

function initReceiverMessageFile(params) {
  return new Promise((resolve, reject) => {
    const { receiver_uid, receiver_name } = params;
    fs.access(`${FILE_PATH}/${receiver_uid}.json`, fs.constants.F_OK, async (err) => {
      if (err) {
        // 文件不存在，则创建对应用户的消息记录文件
        let messageData = {
          "uid": receiver_uid,
          "uname": receiver_name,
          "friendList": [

          ]
        }
        getFriendsInfo({ uid: receiver_uid }).then((friendList) => {
          friendList.map((item) => {
            messageData.friendList.push({
              "fid": item._id + '',
              "fname": item.user_name,
              "messageList": [

              ]
            })
          })
          // 创建文件
          fs.writeFile(`${FILE_PATH}/${receiver_uid}.json`, JSON.stringify(messageData, null, '\t'), () => {
            console.log("创建成功...");
            resolve(messageData);
          })
        })
      } else {
        // 如果文件存在，返回文件内容
        let messageData = await fs.readFileSync(`${FILE_PATH}/${receiver_uid}.json`);
        resolve(JSON.parse(messageData));
      }
    })
  })
}
// 写入信息
function writeInfo(params) {
  const { uid, receiver_uid, receiver_name, uname, message, time, status } = params;
  // 创建并写入指定用户的消息记录json文件
  initSendMessageFile({ uid, uname }).then((res) => {
    // 先拿到json文件中的内容
    res.friendList.forEach(item => {
      if (item.fid === receiver_uid) {
        item.messageList.push({
          uid,
          uname,
          receiver_uid,
          receiver_name,
          message,
          time,
          status
        })
      }
    });
    console.log(res);
    // 将追加的信息内容重新写入文件中
    fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(res, null, '\t'), () => {
      console.log("追加成功...");
    })
  });
  // 创建接收者的消息文件
  setTimeout(() => {
    initReceiverMessageFile({ receiver_uid, receiver_name }).then((res) => {
      res.friendList.forEach(item => {
        if (item.fid === uid) {
          item.messageList.push({
            uid,
            uname,
            receiver_uid,
            receiver_name,
            message,
            time,
            status: "0"
          })
        }
      });
      console.log(res);
      // 将追加的信息内容重新写入文件中
      fs.writeFile(`${FILE_PATH}/${receiver_uid}.json`, JSON.stringify(res, null, '\t'), () => {
        console.log("追加成功...");
      })
    })
  }, 500);
  // let sendData = {
  //   "sid": uid,
  //   "sname": uname,
  //   "rid": receiver_uid,
  //   "rname": receiver_name,
  //   "message": message,
  //   time,
  //   status
  // }
  // let receiverData = {
  //   "uid": uid,
  //   "uname": uname,
  //   "receiver_uid": receiver_uid,
  //   "receiver_name": receiver_name,
  //   "message": message,
  //   status: 0
  // }
  // fs.appendFile(`${FILE_PATH}/${uid}.json`, message, () => {
  //   console.log("创建成功....");
  // })

}

// 根据用户的uid,获取聊天数据
function getMessagesById(params) {
  const { uid, fid } = params;
  // 读取相应用户的文件
  return new Promise(async(resolve, reject) => {
    const data = await fs.readFileSync(`${FILE_PATH}/${uid}.json`);
    JSON.parse(data).friendList.forEach(item => {
      if (item.fid === fid) {
        resolve(item.messageList);
        // return item.messageList;
      }
    });
  })

}

// 根据用户uid，获取发送的消息条数，total
async function getMessageTotalById(params) {

}

// 改变用户状态

module.exports = {
  writeInfo,
  getMessagesById,
  getMessageTotalById
}
// let params = {
//   uid: "6072a0a56407193a4029409e",
//   receiver_uid: "608159d52f158f0588b1dbf5",
//   receiver_name: "XDEcat",
//   uname: "小柚酱",
//   message: "你过得还好嘛",
//   time: "2021/5/17",
//   status: "1"
// }
// writeUserRecord({ uid: "555" });
// writeInfo(params);
// getMessagesById({ uid: "222" }).then((res) => { console.log(res); });
// getMessageTotalById({ uid: "222" }).then((res) => { console.log(res); });