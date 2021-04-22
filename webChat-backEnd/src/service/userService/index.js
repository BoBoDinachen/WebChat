const fs = require("fs");
const path = require("path");
const {
  addUser,
  findUserByNameOrAccount,
  findUserByAccountAndPassword,
  setUserAvatar,
  getUserAvatar,
  setUserName,
  getFriendList,
  setFriendList
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
  // console.log(CommandResult.avatar_url);
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

// 获取用户好友列表
async function getFriends(params) {
  // 返回的数据
  const CommandResult = await getFriendList(params);
  if (CommandResult !== null) {
    return CommandResult.friend_list;
  }
}

// 添加好友
async function addFriend(params) {
  let isExist; // 返回结果
  const { uid, incr_uid } = params;
  const friends = await getFriends({ uid }); // 获取好友列表
  //拿到该用户的好友列表 去除空字符串 和 重复的uid
  // 判断重复的uid
  friends.forEach((item,index) => {
    if (item === incr_uid) {
      isExist = true;
    } else {
      isExist = false;
    }
  });
  // 如果好友存在
  if (isExist) {
    return {data: "exist"}
  } else {
    friends.push(incr_uid); // 往数组里面添加uid
    let friend_list = friends.filter(item => item !== ""); //过滤数组
    console.log(friend_list);
    const CommandResult = await setFriendList({ uid, friend_list }); // 设置好友列表
    if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
      return {data: "success"}
    } else {
      return {data: "fail"}
    }
  }
}
// getFriends({ uid: "6072a0a56407193a4029409e" }).then((res) => {
//   console.log(res);
// })
// addFriend({uid:"6072a0a56407193a4029409e",incr_uid:"608159d52f158f0588b1dbf5"}).then((res) => {
//   console.log(res);
// })
module.exports = {
  userRegister,
  userLogin,
  saveAvatar,
  getAvatar,
  setName,
  getFriends,
  addFriend
}