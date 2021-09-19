const fs = require("fs");
const path = require("path");
const rootPath = path.join(__dirname, "../../");
const FILE_PATH = rootPath + "data/chat_info_data";
const FILE_PATH2 = rootPath + "data/friend_request";
const { getFriendsInfo } = require("../userService/index")

// 创建发送者文件
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
  let { uid, fid, fname, uname } = params;
  return new Promise((resolve, reject) => {
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
            // console.log(item);
            messageData.friendList.push({
              "fid": item._id + '',
              "fname": item.user_name,
              "messageList": [

              ]
            })
          })
          // 创建文件
          fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(messageData, null, '\t'), () => {
            console.log("添加好友记录成功...");
          })
        })
      } else {
        // 如果文件存在，返回文件内容
        let messageData = await fs.readFileSync(`${FILE_PATH}/${uid}.json`);
        let data = JSON.parse(messageData);
        data.friendList.push({
          "fid": fid,
          "fname": fname,
          "messageList": [

          ]
        })
        fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(data, null, '\t'), () => {
          resolve("添加好友记录成功...");
        })
      }
    })
    setTimeout(() => {
      fs.access(`${FILE_PATH}/${fid}.json`, fs.constants.F_OK, async (err) => {
        if (err) {
          // 文件不存在，则创建对应用户的消息记录文件
          let messageData = {
            "uid": fid,
            "uname": fname,
            "friendList": [

            ]
          }
          getFriendsInfo({ "uid": fid }).then((friendList) => {
            friendList.map((item) => {
              // console.log(item);
              messageData.friendList.push({
                "fid": item._id + '',
                "fname": item.user_name,
                "messageList": [

                ]
              })
            })
            // 创建文件
            fs.writeFile(`${FILE_PATH}/${fid}.json`, JSON.stringify(messageData, null, '\t'), () => {
              console.log("添加好友记录成功...");
            })
          })
        } else {
          // 如果文件存在，返回文件内容
          let messageData = await fs.readFileSync(`${FILE_PATH}/${fid}.json`);
          let data = JSON.parse(messageData);
          data.friendList.push({
            "fid": uid,
            "fname": uname,
            "messageList": [

            ]
          })
          fs.writeFile(`${FILE_PATH}/${fid}.json`, JSON.stringify(data, null, '\t'), () => {
            resolve("添加好友记录成功...");
          })
        }
      })
    }, 1000)
  }
  )
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
        let messageData2 = await fs.readFileSync(`${FILE_PATH}/${fid}.json`);
        let data = JSON.parse(messageData);
        let data2 = JSON.parse(messageData2);
        data.friendList = data.friendList.filter((friend) => {
          return friend.fid !== fid
        })
        data2.friendList = data2.friendList.filter((friend) => {
          return friend.fid !== uid
        })
        // 2.重新写入文件
        fs.writeFile(`${FILE_PATH}/${uid}.json`, JSON.stringify(data, null, '\t'), () => {
          resolve("删除好友记录成功...");
        })
        fs.writeFile(`${FILE_PATH}/${fid}.json`, JSON.stringify(data2, null, '\t'), () => {
          resolve("删除好友记录成功...");
        })
      }
    })

  })
}
// 根据用户uid，获取发送的消息条数，total
function getMessageTotalById(params) {
  const { uid } = params;
  return new Promise((resolve, reject) => {
    fs.access(`${FILE_PATH}/${uid}.json`, fs.constants.F_OK, async (err) => {
      if (err) {
        reject({ status: false, msg: "发送消息条数为0" })
      } else {
        // 1.读取文件内容
        let messageData = await fs.readFileSync(`${FILE_PATH}/${uid}.json`);
        let data = JSON.parse(messageData);
        let total = 0; // 消息数
        data.friendList.forEach(element => {
          let msgArr = element.messageList.filter((item) => {
            return item.uid === uid;
          })
          total += msgArr.length;
        });
        if (total === 0) {
          resolve({ status: false, msg: "发送消息条数为0" });
        } else {
          resolve({ status: true, msg: "获取消息条数成功", data: total });
        }
      }
    })
  })
}

// 添加申请记录
function insertRequestRecord(params) {
  const { uid, uname, fid, fname, time } = params;
  // 创建文件夹，判断有无
  return new Promise((resolve, reject) => {
    fs.access(`${FILE_PATH2}/${uid}.json`, fs.constants.F_OK, async (err) => {
      if (err) {
        // 文件不存在，则创建对应用户的消息记录文件
        let requestData = {
          "uid": uid,
          "uname": uname,
          "request_list": []
        }
        // 添加数据,状态表示
        requestData.request_list.push({
          fid,
          fname,
          "request_time": time,
          "request_status": 0
        });
        // 创建文件
        fs.writeFile(`${FILE_PATH2}/${uid}.json`, JSON.stringify(requestData, null, '\t'), () => {
          console.log("添加申请记录1成功...");
          resolve({ status: "OK", msg: "添加记录成功..." })
        })
      } else {
        // 文件存在，则直接添加
        let requestData = await fs.readFileSync(`${FILE_PATH2}/${uid}.json`);
        let data = JSON.parse(requestData);
        // 添加数据,状态表示
        let index = data.request_list.findIndex((item) => {
          return item.fid === fid;
        })
        console.log("查找结果:", index);
        if (index === -1) {
          data.request_list.push({
            fid,
            fname,
            "request_time": time,
            "request_status": 0
          });
          // 创建文件
          fs.writeFile(`${FILE_PATH2}/${uid}.json`, JSON.stringify(data, null, '\t'), () => {
            console.log("添加申请记录1成功...");
            resolve({ status: "OK", msg: "添加记录成功..." })
          })
        } else {
          console.log("记录1已经存在...准备替换");
          // 替换状态为3的记录
          console.log(data.request_list[index]);
          if (data.request_list[index].request_status === 3) {
            data.request_list[index] = {
              fid,
              fname,
              "request_time": time,
              "request_status": 0
            }
          }
          fs.writeFile(`${FILE_PATH2}/${uid}.json`, JSON.stringify(data, null, '\t'), () => {
            console.log("替换申请记录1成功...");
            resolve({ status: "OK", msg: "替换记录成功..." })
          })
        }

      }
    })
    setTimeout(() => {
      fs.access(`${FILE_PATH2}/${fid}.json`, fs.constants.F_OK, async (err) => {
        if (err) {
          // 文件不存在，则创建对应用户的消息记录文件
          let requestData = {
            "uid": fid,
            "uname": fname,
            "request_list": []
          }
          // 添加数据,状态表示
          requestData.request_list.push({
            "fid": uid,
            "fname": uname,
            "request_time": time,
            "request_status": 1
          });
          // 创建文件
          fs.writeFile(`${FILE_PATH2}/${fid}.json`, JSON.stringify(requestData, null, '\t'), () => {
            console.log("添加申请记录2成功...");
            resolve({ status: "OK", msg: "添加记录成功..." })
          })
        } else {
          // 文件存在，则直接添加
          let requestData = await fs.readFileSync(`${FILE_PATH2}/${fid}.json`);
          let data = JSON.parse(requestData);
          let index = data.request_list.findIndex((item) => {
            return item.fid === uid;
          })
          if (index === -1) {
            data.request_list.push({
              "fid": uid,
              "fname": uname,
              "request_time": time,
              "request_status": 1
            });
            // 创建文件
            fs.writeFile(`${FILE_PATH2}/${fid}.json`, JSON.stringify(data, null, '\t'), () => {
              console.log("添加申请记录2成功...");
              resolve({ status: "OK", msg: "添加记录成功..." })
            })
          } else {
            console.log("记录2已经存在...准备替换");
            // 替换状态为3的记录
            if (data.request_list[index].request_status === 3) {
              data.request_list[index] = {
                "fid": uid,
                "fname": uname,
                "request_time": time,
                "request_status": 1
              }
            }
            fs.writeFile(`${FILE_PATH2}/${fid}.json`, JSON.stringify(data, null, '\t'), () => {
              console.log("替换申请记录2成功...");
              resolve({ status: "OK", msg: "替换记录成功..." })
            })
          }

        }
      })
    }, 1000)
  })

}

// 获取指定用户的好友申请记录列表
function getRequestRecordList(params) {
  const { uid } = params;
  return new Promise((resolve, reject) => {
    fs.access(`${FILE_PATH2}/${uid}.json`, fs.constants.F_OK, async (err) => {
      if (err) {
        // 文件不存在
        resolve({ "status": 233, "msg": "没有记录文件~" });
      } else {
        let requestData = await fs.readFileSync(`${FILE_PATH2}/${uid}.json`);
        let data = JSON.parse(requestData);
        if (data.request_list.length === 0) {
          resolve({ "status": 233, "msg": "记录列表为空~" });
        } else {
          resolve({ "status": "200", "msg": "获取成功~", "data": data.request_list })
        }
      }
    })
  })
}

// 修改指定用户的申请状态
function changeRequestStatus(params) {
  const { status, uid, fid } = params;
  return new Promise(async (resolve, reject) => {
    let requestData = await fs.readFileSync(`${FILE_PATH2}/${uid}.json`);
    let requestData2 = await fs.readFileSync(`${FILE_PATH2}/${fid}.json`);
    let data = JSON.parse(requestData);
    data.request_list.forEach((item) => {
      if (item.fid === fid) {
        item.request_status = status;
      }
    })
    let data2 = JSON.parse(requestData2);
    data2.request_list.forEach((item) => {
      if (item.fid === uid) {
        item.request_status = status;
      }
    })
    // 创建文件
    fs.writeFile(`${FILE_PATH2}/${uid}.json`, JSON.stringify(data, null, '\t'), () => {
      console.log("修改记录状态1成功...");
      resolve({ status: "OK", msg: "修改状态成功..." })
    })
    setTimeout(() => {
      fs.writeFile(`${FILE_PATH2}/${fid}.json`, JSON.stringify(data2, null, '\t'), () => {
        console.log("修改记录状态2成功...");
      })
    }, 1000)
  })
}

// 删除指定好友的申请记录
function deleteRequestRecord(params) {
  const { uid, fid } = params;
  return new Promise(async (resolve,reject) => {
    let requestData = await fs.readFileSync(`${FILE_PATH2}/${uid}.json`);
    let requestData2 = await fs.readFileSync(`${FILE_PATH2}/${fid}.json`);
    let data1 = JSON.parse(requestData);
    data1.request_list = data1.request_list.filter((item) => {
      return item.fid != fid;
    })
    let data2 = JSON.parse(requestData2);
    data2.request_list = data2.request_list.filter((item) => {
      return item.fid != uid;
    })
    // 重新写入文件
    fs.writeFile(`${FILE_PATH2}/${uid}.json`, JSON.stringify(data1, null, '\t'), () => {
      console.log("删除记录1成功...");
      resolve({ status: "OK", msg: "删除记录成功..." });
    });
    setTimeout(() => {
      fs.writeFile(`${FILE_PATH2}/${fid}.json`, JSON.stringify(data2, null, '\t'), () => {
        console.log("删除记录2成功...");
        resolve({ status: "OK", msg: "删除记录成功..." });
      })
    },1000)
  })
}

// deleteRequestRecord({ uid: "6072a0a56407193a4029409e", fid: "6092b566ae1e8540bc95b178" }).then((res) => {
//   console.log(res);
// })
// insertReuestRecord({
//   uid: "233", uname: "小红", fid: "666", fname: "小花", time: "晚上"
// }).then((res) => {
//   console.log(res);
// })
// 清空申请记录
// 删除一条申请记录
// 同意申请
// 拒绝申请
// getMessageTotalById({ uid: "608159d52f158f0588b1dbf5" }).then((res) => {
//   console.log(res);
// })
// 改变用户状态
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
module.exports = {
  writeInfo,
  getMessagesById,
  getMessageTotalById,
  clearMessage,
  insertFriendData,
  deleteFriendData,
  getMessageTotalById,
  insertRequestRecord,
  getRequestRecordList,
  changeRequestStatus,
  deleteRequestRecord
}