const { addUser, findUserByNameOrAccount,findUserByAccountAndPassword } = require("../../model/userModel/UserDao");


// 用户注册
async function userRegister(params) {
  const user = await findUserByNameOrAccount({ userName: "Xfdsfdsf" });
  if (user !== null) {
    // 如果查找的用户不为空,则返回false
    return false;
  } else {
    // 没有找到用户，则执行添加用户
    console.log("添加用户");
    return true;
  }
}

// 用户登录
async function userLogin(params) {
  const user = await findUserByAccountAndPassword(params);
  if (user !== null) {
    return true;
  } else {
    console.log("检查用户名和密码");
    return false;
  }
}

// userLogin({ account: "492697494@qq.com", password: "123456" }).then((res) => {
//   console.log(res);
// })

module.exports = {userRegister,userLogin}