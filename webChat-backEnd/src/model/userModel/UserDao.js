const connect = require("../../utils/db_utils");
const ObjectId = require('mongodb').ObjectId
// 查询用户-用户名和账号
async function findUserByNameOrAccount(params) {
  // 1.连接数据库
  const db = await connect.createDB();
  // 使用数据库对象，获取集合对象
  const collection = db.collection('users');
  const { userName, account } = params;
  // or 条件查询 用户名或者账号
  return new Promise((resolve, reject) => {
    collection.findOne({ $or: [{ "account": account }, { "user_name": userName }] }, (err, res) => {
      if (err) throw err;
      resolve(res);
      connect.close();
    });
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
async function addUser(User) {
  // 1.连接数据库
  const db = await connect.createDB();
  const collection = db.collection("users");
  const { account, password, age, sex } = User;
  return new Promise((resolve, reject) => {
    collection.insertOne({ account, password, age, sex, user_name: "", avatar_url: "" }, (err, res) => {
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
  const db = await connect.createDB();
  const collection = db.collection("users");
  const { uid } = params;
  return new Promise((resolve, reject) => {
    collection.find({ _id: ObjectId(uid) }).project({ avatar_url: 1 }).toArray(function (err, result) {
      if (err) throw err;
      resolve(result[0]);
      connect.close();
    })
  })
}
module.exports = {
  findUserByNameOrAccount,
  addUser,
  findUserByAccountAndPassword,
  setUserAvatar,
  getUserAvatar
};