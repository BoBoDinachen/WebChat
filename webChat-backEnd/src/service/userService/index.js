const fs = require("fs");
const path = require("path");
const {
  addUser,
  findUserByNameOrAccount,
  findUserByAccountAndPassword,
  setUserAvatar,
  getUserAvatar,
  setUserName
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
  const { uid, fileBuffer } = params;
  const rootPath = path.join(__dirname, "../../");
  const avatar_url = "uploads/img/userAvatar/" + uid+".png";
  // console.log("头像地址:", rootPath + avatar_url);
  try {
    // 保存文件到磁盘中
    fs.writeFileSync(rootPath + avatar_url, fileBuffer);
    const CommandResult = await setUserAvatar({ uid, avatar_url });
    if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
      return {path:avatar_url};
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
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
// 设置用户昵称，返回新的用户昵称
async function setName(params) {
  const CommandResult = await setUserName(params);
  if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
    return params.user_name;
  } else {
    return "";
  }
}

// setName({ uid: "6078fe9de247f24538cfcb38", user_name: "JHHHH" }).then((res) => {
//   console.log(res);
// })
module.exports = {
  userRegister,
  userLogin,
  saveAvatar,
  getAvatar,
  setName
}