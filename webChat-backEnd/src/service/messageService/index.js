const fs = require("fs");
const path = require("path");
const rootPath = path.join(__dirname, "../../");
const FILE_PATH = rootPath + "data/chat_info_data";
const { getFriendsInfo } = require("../userService/index")

// 初始化发送者消息记录文件
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
            console.log("创建消息记录文件成功...");
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
// 创建接收者文件
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
            console.log("创建消息记录文件成功...");
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
    // console.log(res);
    // 将追加的信息内容重新写入文件中
    fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(res, null, '\t'), () => {
      console.log("保存消息记录(发送者)成功...");
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
      // console.log(res);
      // 将追加的信息内容重新写入文件中
      fs.writeFile(`${FILE_PATH}/${receiver_uid}.json`, JSON.stringify(res, null, '\t'), () => {
        console.log("保存消息记录(接收者)成功...");
      })
    })
  }, 1000);
}

// 根据用户的uid和好友的id,获取聊天数据
function getMessagesById(params) {
  const { uid, fid } = params;
  return new Promise(async (resolve, reject) => {
    // 检查文件是否存在
    fs.access(`${FILE_PATH}/${uid}.json`, fs.constants.F_OK, async (err) => {
      if (err) {
        reject("找不到对应的消息文件");
      } else {
        // 读取相应用户的文件
        const data = await fs.readFileSync(`${FILE_PATH}/${uid}.json`);
        JSON.parse(data).friendList.forEach(item => {
          if (item.fid === fid) {
            resolve(item.messageList);
          }
        });
      }
    })

  })

}
//根据用户id和对应的好友id清除记录数据
function clearMessage(params) {
  const { uid, fid } = params;
  return new Promise(async (resolve, reject) => {
    let data = await fs.readFileSync(`${FILE_PATH}/${uid}.json`); // 读取对应用户的文件
    let messageData = JSON.parse(data);
    messageData.friendList.forEach(item => {
      if (item.fid === fid) {
        item.messageList = []; // 清空这个消息列表
      }
    });
    // 重新写入到对应用户文件
    fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(messageData, null, '\t'), () => {
      console.log("清除消息记录成功...");
      resolve({ msg: "清除成功...", isOk: true });
    });
  })
}
// 根据用户id和对应的好友id添加一个记录
function insertFriendData(params) {
  let { uid, fid, fname } = params;
  return new Promise((resolve, reject) => {
    fs.access(`${FILE_PATH}/${uid}.json`, fs.constants.F_OK, async (err) => {
      if (err) {
        reject("没有对应文件");
      } else {
        // 1.读取文件内容
        let messageData = await fs.readFileSync(`${FILE_PATH}/${uid}.json`);
        let data = JSON.parse(messageData);
        data.friendList.push({
          "fid": fid,
          "fname": fname,
          "messageList": [

          ]
        })
        // 2.重新写入文件
        fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(data, null, '\t'), () => {
          resolve("添加好友记录成功...")
        })
      }
    })

  })

}
// 根据用户id和对应的好友id删除整个记录
function deleteFriendData(params) {
  let { uid, fid } = params;
  return new Promise(async (resolve, reject) => {
    fs.access(`${FILE_PATH}/${uid}.json`, fs.constants.F_OK, async (err) => {
      if (err) {
        reject("没有对应文件...")
      } else {
        // 1.读取文件内容
        let messageData = await fs.readFileSync(`${FILE_PATH}/${uid}.json`);
        let data = JSON.parse(messageData);
        data.friendList = data.friendList.filter((friend) => {
          return friend.fid !== fid
        })
        // 2.重新写入文件
        fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(data, null, '\t'), () => {
          resolve("删除好友记录成功...");
        })
      }
    })

  })
}
// 根据用户uid，获取发送的消息条数，total
async function getMessageTotalById(params) {

}

// 改变用户状态

module.exports = {
  writeInfo,
  getMessagesById,
  getMessageTotalById,
  clearMessage,
  insertFriendData,
  deleteFriendData
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