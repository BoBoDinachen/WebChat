const connect = require("../../utils/db_utils");

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
      console.log(res);
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
    collection.insertOne({ account, password, age, sex }, (err, res) => {
      if (err) throw err;
      resolve(res);
      connect.close();
    })
  })
}

module.exports = { findUserByNameOrAccount, addUser, findUserByAccountAndPassword };