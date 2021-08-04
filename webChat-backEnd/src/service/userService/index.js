const { ObjectId } = require("bson");
const fs = require("fs");
const path = require("path");
const {
  addUser,
  findUserById,
  findUserByNameOrAccount,
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
  const avatar_url = "uploads/img/userAvatar/" + uid + ".png";
  // console.log("头像地址:", rootPath + avatar_url);
  try {
    // 保存文件到磁盘中
    fs.writeFileSync(rootPath + avatar_url, fileBuffer)
    const CommandResult = await setUserAvatar({ uid, avatar_url });
    if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
      return { path: avatar_url };
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
// 获取用户信息
async function getUserInfo(params) {
  const { uid } = params;
  const CommandResult = await findUserById({ uid });
  if (CommandResult != null) {
    return CommandResult
  }
}

// 设置用户昵称，返回新的用户昵称
async function setName(params) {
  const CommandResult = await setUserName(params);
  if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
    return params.user_name;
  } else {
    return "";
  }
}



// 获取用户好友列表信息
async function getFriendsInfo(params) {
  // 返回的数据
  const CommandResult = await getFriendList(params);
  if (CommandResult !== null) {
    let { friend_list } = CommandResult;
    // 遍历好友列表id,返回数组，使用promise.all处理
    const infos = await Promise.all(friend_list.map(async (uid) => {
      return await findUserById({ uid });
    }))
    return infos;
  }
}

// 添加好友
async function addFriend(params) {
  let isExist; // 返回结果
  const { uid, incr_uid, fname } = params;
  console.log(params);
  const CommandResult = await getFriendList({ uid }); // 获取好友列表
  let { friend_list } = CommandResult;
  //拿到该用户的好友列表 去除空字符串 和 重复的uid
  // 判断重复的uid
  friend_list.forEach((item, index) => {
    if (item === incr_uid) {
      isExist = true;
    } else {
      isExist = false;
    }
  });
  // 如果好友存在
  if (isExist) {
    return { data: "exist" }
  } else {
    friend_list.push(incr_uid); // 往数组里面添加uid
    friend_list = friend_list.filter(item => item !== ""); //过滤数组
    // console.log(friend_list);
    const CommandResult = await setFriendList({ uid, friend_list }); // 设置好友列表
    if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
      return { data: "success" }
    } else {
      return { data: "fail" }
    }
  }
}
// 搜索好友
async function searchFriend(params) {
  let { content, uid } = params;
  let userList = await findUserByNameOrAccount({ userName: content, account: content });
  const CommandResult = await getFriendList({ uid });
  // 判断里面是否存在好友
  userList.forEach((user) => {
    user['isFriend'] = false
    CommandResult.friend_list.forEach((fid) => {
      if (user._id + '' === fid) {
        user['isFriend'] = true
      }
    })
  })
  return userList;
}

// 删除好友
async function deleteFriend(params) {
  let { uid, fid } = params;
  // 1.获取好友列表，从列表中删除对应的id，然后将好友列表重新替换为删除后的列表
  const CommandResult = await getFriendList({ uid }); // 获取好友列表
  let { friend_list } = CommandResult;
  console.log("uid：" + uid + " 当前好友列表：" + friend_list);
  const new_friends = friend_list.filter((id) => {
    return id !== fid
  })
  console.log("删除后的好友列表：" + new_friends);
  const CommandResult2 = await setFriendList({ uid, friend_list: new_friends }); // 设置好友列表
  if (CommandResult2.result.n === 1 && CommandResult2.result.ok === 1) {
    return { data: "success" }
  } else {
    return { data: "fail" }
  }
}


// 更新个人资料
async function updateProfile(params) {
  const CommandResult = await setUserInfo(params);
  if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
    return true;
  } else {
    return false;
  }
}
// 设置密码
async function updatePassword(params) {
  const CommandResult = await setUserPwd(params);
  if (CommandResult.result.n === 1 && CommandResult.result.ok === 1) {
    return true;
  } else {
    return false;
  }
}
// 用户点击喜欢
async function clickLike(params) {
  const { uid, fid } = params;
  // 先拿到用户喜欢的列表和粉丝列表
  const CommandResult1 = await getUserLikeList({ uid });
  const CommandResult2 = await getUserFollowList({ uid: fid });
  let newLikeList = CommandResult1.like_list;
  let newFollowList = CommandResult2.follow_list;
  newLikeList.push(fid);  // 添加喜欢的人
  newFollowList.push(uid); // 添加追随的人
  const values = await handleLike({ uid, fid, like_list: newLikeList, follow_list: newFollowList });
  console.log("喜欢成功,影响键值对：", values.length);
  if (values.length != 0) {
    // console.log("喜欢列表", CommandResult1);
    // console.log("粉丝列表", CommandResult2);
    return { status: true, load: values.length }
  } else {
    return { status: false, load: values.length }
  }
}
// 用户取消喜欢
async function cancelLike(params) {
  const { uid, fid } = params;
  // 先拿到用户喜欢的列表和粉丝列表
  const CommandResult1 = await getUserLikeList({ uid });
  const CommandResult2 = await getUserFollowList({ uid: fid });
  let LikeList = CommandResult1.like_list;
  let FollowList = CommandResult2.follow_list;
  let newLikeList = LikeList.filter((id) => {
    return id != fid;
  })
  let newFollowList = FollowList.filter((id) => {
    return id != uid;
  })
  const values = await handleLike({ uid, fid, like_list: newLikeList, follow_list: newFollowList });
  console.log("取消喜欢成功,影响键值对：", values.length);
  if (values.length != 0) {
    // console.log("喜欢列表", CommandResult1);
    // console.log("粉丝列表", CommandResult2);
    return { status: true, load: values.length }
  } else {
    return { status: false, load: values.length }
  }
}

// 检测好友是否被喜欢
async function checkLike(params) {
  const { uid, fid } = params;
  const CommandResult1 = await getUserLikeList({ uid });
  let likeList = CommandResult1.like_list;
  let res = likeList.filter((item) => {
    return item === fid;
  })
  // console.log(res);
  if (res.length === 0) {
    return { status: true, msg: "没有被喜欢" }
  } else {
    return { status: false, msg: "已经被喜欢了" }
  }
}

// 返回用户的喜欢数和被喜欢数
async function getLikeNumbers(params) {
  const { uid } = params;
  const CommandResult1 = await getUserLikeList({ uid });
  const CommandResult2 = await getUserFollowList({uid});
  let likeList = CommandResult1.like_list;
  let followList = CommandResult2.follow_list;
  // console.log(res);
  if (likeList.length !== 0 || followList.length !== 0) {
    return {
      status: true, msg: "获取成功", data: {
        likeList,
        followList
    } }
  } else {
    return { status: false, msg: "没有喜欢与被喜欢" }
  }
}

/***
 * 测试
 * Author:=> XDEcat
 * 2021/8/4 => 喜欢好友，检测是否被喜欢，返回喜欢与被喜欢的人数，取消喜欢
 */

// cancelLike({ uid: "6072a0a56407193a4029409e", fid: "608159d52f158f0588b1dbf5" }).then((res) => {
//   console.log(res);
// })
// getLikeNumbers({ uid: "6072a0a56407193a4029409e" }).then((res) => {
//   console.log(res);
// })

// getAvatar({ uid: "6072a0a56407193a4029409e" }).then((res) => {
//   console.log(res);
// })

// setName({ uid: "6078fe9de247f24538cfcb38", user_name: "JHHHH" }).then((res) => {
//   console.log(res);
// })

// searchFriend({ content: "柚子",uid:"6072a0a56407193a4029409e" }).then((res) => {
//   console.log(res);
// })

// getFriendsInfo({ uid: "6072a0a56407193a4029409e" }).then((res) => {
//   console.log(res);
// })

// addFriend({uid:"6072a0a56407193a4029409e",incr_uid:"608159d52f158f0588b1dbf5"}).then((res) => {
//   console.log(res);
// })

// checkLike({ uid: "6072a0a56407193a4029409e", fid: "608159d52f158f0588b1dbf5" }).then((res) => {
//   console.log(res);
// })

// clickLike({ uid: "6072a0a56407193a4029409e", fid: "608159d52f158f0588b1dbf5" }).then((res) => {
//   console.log(res);
// })

// updateProfile({uid:"6072a0a56407193a4029409e",age:18,sex:"男",signature:"hhhhhh"})
module.exports = {
  userRegister,
  userLogin,
  saveAvatar,
  getAvatar,
  getUserInfo,
  setName,
  getFriendsInfo,
  addFriend,
  deleteFriend,
  updateProfile,
  updatePassword,
  searchFriend,
  clickLike,
  checkLike,
  getLikeNumbers,
  cancelLike
}