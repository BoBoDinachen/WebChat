const { Binary } = require("bson");
const fs = require("fs");
const {
  addUser,
  findUserByNameOrAccount,
  findUserByAccountAndPassword,
  setUserAvatar,
  getUserAvatar
} = require("../../model/userModel/UserDao");


// 用户注册
async function userRegister(params) {
  const { account } = params;
  const user = await findUserByNameOrAccount({ account, "userName": null });
  if (user !== null) {
    // 如果查找的账号不为空,则返回false
    console.log("该账号已存在");
    return false;
  } else {
    // 没有找到用户，则执行添加用户
    const res = await addUser(params);
    if (res.result.ok === 1) {
      return true;
    }
  }
}

// 用户登录
async function userLogin(params) {
  const user = await findUserByAccountAndPassword(params);
  if (user !== null) {
    return user;
  } else {
    console.log("检查用户名和密码");
    return false;
  }
}

// 设置用户头像
async function saveAvatar(params) {
  const CommandResult = await setUserAvatar(params);
  if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
    return true;
  } else {
    return false;
  }
}

// 获取用户头像
async function getAvatar(params) {
  // 拿到用户头像地址
  const CommandResult = await getUserAvatar(params);
  console.log(CommandResult.avatar_url);
  if (CommandResult != null) {
    return CommandResult.avatar_url
  }
}
// getAvatar({ uid: "6072a0a56407193a4029409e" }).then((res) => {
//   console.log(res);
// })
module.exports = {
  userRegister,
  userLogin,
  saveAvatar,
  getAvatar
}