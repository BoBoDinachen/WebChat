const connect = require("../../utils/db_utils");
const ObjectId = require('mongodb').ObjectId
const { DB_NAME } = require("../../config/db_config");
const { User } = require('./User');
// 查询用户-id
async function findUserById(params) {
  // 1.连接数据库
  const db = await connect.createDB();
  // 使用数据库对象，获取集合对象
  const collection = db.collection('users');
  const { uid } = params;
  // or 条件查询 用户名或者账号
  return new Promise((resolve, reject) => {
    collection.find({ _id: ObjectId(uid) }).project({ friend_list: 0 }).toArray((err, result) => {
      if (err) throw err;
      resolve(result[0]);
      connect.close();
    });
  })
}

// 查询用户-用户名和账号
async function findUserByNameOrAccount(params) {
  // 1.连接数据库
  const db = await connect.createDB();
  // 使用数据库对象，获取集合对象
  const collection = db.collection('users');
  const { userName, account } = params;

  // or 条件查询 用户名或者账号
  return new Promise((resolve, reject) => {
    if (userName === "all") {
      collection.find({}).toArray((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result);
        connect.close();
      })
    } else {
      collection.find({ $or: [{ "account": new RegExp(account) }, { "user_name": new RegExp(userName) }] }).toArray((err, result) => {
        if (err) throw err;
        resolve(result);
        connect.close();
      })
    }
  })
}

// 查询用户-账号和密码
async function findUserByAccountAndPassword(params) {
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  const { account, password } = params;
  // and 条件查询 账号和密码
  return new Promise((resolve, reject) => {
    collection.findOne({ "account": account, "password": password }, (err, res) => {
      if (err) throw err;
      resolve(res);
      connect.close();
    })
  })
}

// 添加用户
async function addUser(params) {
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  const { account, password } = params;
  return new Promise((resolve, reject) => {
    collection.insertOne(User(account, password), (err, res) => {
      if (err) throw err;
      resolve(res);
      connect.close();
    })
  })
}

// 设置用户头像地址
async function setUserAvatar(userAvatar) {
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  const { uid, avatar_url } = userAvatar;
  return new Promise((resolve, reject) => {
    collection.updateOne({ _id: ObjectId(uid) }, { $set: { avatar_url } }, function (err, result) {
      if (err) throw err;
      resolve(result);
      connect.close();
    })
  })
}

// 获取用户头像
async function getUserAvatar(params) {
  // 1.连接数据库
  const con = await connect.createConect();
  const db = con.db(DB_NAME);
  const collection = db.collection("users");
  const { uid } = params;
  // console.log(uid);
  return new Promise((resolve, reject) => {
    // 防止频繁出现undefined，导致异常
    if (uid !== "undefined") {
      collection.find({ _id: ObjectId(uid) }).project({ avatar_url: 1 }).toArray(function (err, result) {
        if (err) throw err;
        resolve(result[0]);
        con.close();
      })
    }
  })
}

// 修改用户昵称
async function setUserName(params) {
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  const { uid, user_name } = params;
  return new Promise((resolve, reject) => {
    collection.updateOne({ _id: ObjectId(uid) }, { $set: { user_name } }, (err, result) => {
      if (err) throw err;
      resolve(result);
      connect.close();
    });
  })
}

// 获取好友列表
async function getFriendList(params) {
  const { uid } = params;
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  return new Promise((resolve, reject) => {
    collection.find({ _id: ObjectId(uid) }).project({ friend_list: 1 }).toArray(function (err, result) {
      if (err) throw err;
      resolve(result[0]);
      connect.close(); //关闭连接
    })
  })
}

// 修改好友列表
async function setFriendList(params) {
  const { friend_list, uid } = params;
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  return new Promise((resolve, reject) => {
    collection.updateOne({ _id: ObjectId(uid) }, { $set: { friend_list } }, (err, result) => {
      if (err) throw err;
      resolve(result);
      connect.close(); //关闭连接
    })
  })
}

// 修改用户昵称，性别、年龄、签名
async function setUserInfo(params) {
  const { uid, uname, sex, age, signature } = params;
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  return new Promise((resolve, reject) => {
    collection.updateOne({ _id: ObjectId(uid) }, { $set: { user_name: uname, sex, age, signature } }, (err, result) => {
      if (err) throw err;
      resolve(result);
      connect.close(); //关闭连接
    })
  })
}

// 修改用户密码
async function setUserPwd(params) {
  const { uid, pwd } = params;
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  return new Promise((resolve, reject) => {
    collection.updateOne({ _id: ObjectId(uid) }, { $set: { password: pwd } }, (err, result) => {
      if (err) throw err;
      resolve(result);
      connect.close(); //关闭连接
    })
  })
}
// 获取用户喜欢的列表
async function getUserLikeList(params) {
  const { uid } = params;
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  return new Promise((resolve, reject) => {
    collection.find({ _id: ObjectId(uid) }).project({ like_list: 1 }).toArray(function (err, result) {
      if (err) throw err;
      resolve(result[0]);
      connect.close(); //关闭连接
    })
  })
}
// 获取用户粉丝的列表
async function getUserFollowList(params) {
  const { uid } = params;
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  return new Promise((resolve, reject) => {
    collection.find({ _id: ObjectId(uid) }).project({ follow_list: 1 }).toArray(function (err, result) {
      if (err) throw err;
      resolve(result[0]);
      connect.close(); //关闭连接
    })
  })
}
// 用户点击喜欢
async function handleLike(params) {
  const { uid, fid, like_list, follow_list } = params;
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  function likeTask() {
    return new Promise((resolve, reject) => {
      collection.updateOne({ _id: ObjectId(uid) }, { $set: { like_list } }, (err, result) => {
        if (err) throw err;
        resolve(result);
        connect.close(); //关闭连接
      })
    })
  }
  function followTask() {
    return new Promise((resolve, reject) => {
      collection.updateOne({ _id: ObjectId(fid) }, { $set: { follow_list } }, (err, result) => {
        if (err) throw err;
        resolve(result);
        connect.close(); //关闭连接
      })
    })
  }
  return Promise.all([likeTask(), followTask()])
}


module.exports = {
  findUserById,
  findUserByNameOrAccount,
  addUser,
  findUserByAccountAndPassword,
  setUserAvatar,
  getUserAvatar,
  setUserName,
  getFriendList,
  setFriendList,
  setUserInfo,
  setUserPwd,
  handleLike,
  getUserLikeList,
  getUserFollowList
};