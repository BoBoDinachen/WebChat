const fs = require("fs");
const FILE_PATH = "../json/data.json";

// 添加一个用户记录
function writeUserRecord(params) {
  const { uid } = params;
  fs.readFile(FILE_PATH, (err, data) => {
    const chatInfo = JSON.parse(data.toString());
    // 判断有没有记录存在
    const isExist = chatInfo.findIndex((item) => {
      return item.uid === uid;
    })
    if (isExist === -1) {
        chatInfo.push({
          uid,
          data: [],
          total: 0
        });
        const str = JSON.stringify(chatInfo);
        fs.writeFile(FILE_PATH, str, (err) => {
          console.log("添加记录成功!");
        })
    } else {
      console.log("已经有记录存在");
    }
  })
}

// 写入信息
function writeInfo(params) {
  const { uid, receiver_uid, uname, message, time, status } = params;
  // 读取json文件
  fs.readFile(FILE_PATH, (err, data) => {
    let chatInfo = JSON.parse(data.toString());
    chatInfo.forEach(item => {
      // console.log(item);
      // 将数据分别保存到发送者和接收者中
      if (uid === item.uid) {
        item.data.push({ uid, uname, message, time, status });
        // 统计status为1的条数，将total加1
        item.total += 1;
      } else if (receiver_uid === item.uid) {
        item.data.push({ uid, uname, message, time, "status": "0" });
      }
    });
    // 然后在将数据序列化到文件中
    let str = JSON.stringify(chatInfo);
    fs.writeFile("../json/data.json", str, (err) => {
      console.log("增加成功....");
    })
    // console.log(chatInfo[0].data);
    // console.log(chatInfo[1].data);
  })
}

// 根据用户的uid,获取聊天数据
async function getMessagesById(params) {
  const { uid } = params;
  const data = await fs.readFileSync(FILE_PATH);
  // console.log(data.toString());
  const chatInfo = JSON.parse(data.toString());
  var result = [];
  chatInfo.forEach((item) => {
    if (item.uid === uid) {
      result = item.data;
    }
  })
  return result;
}

// 根据用户uid，获取发送的消息条数，total
async function getMessageTotalById(params) {
  const { uid } = params;
  const data = await fs.readFileSync(FILE_PATH)
  // console.log(data.toString());
  const chatInfo = JSON.parse(data.toString());
  var result = [];
  chatInfo.forEach((item) => {
    if (item.uid === uid) {
      result = item.total;
    }
  })
  return result;
}

let params = {
  uid: "444",
  receiver_uid: "333",
  uname: "小柚酱",
  message: "你过得还好嘛",
  time: "2021/5/17",
  status: "1"
}
writeUserRecord({ uid: "555" });
// writeInfo(params);
// getMessagesById({ uid: "222" }).then((res) => { console.log(res); });
// getMessageTotalById({ uid: "222" }).then((res) => { console.log(res); });