const express = require("express");
const multer = require('multer');
const path = require("path");
const multer = require('multer');
var upload = multer({ dest: 'uploads/img/userAvatar' })
const {
  userLogin,
  userRegister,
  saveAvatar,
  getAvatar
} = require("../service/userService/index");  // 导入业务操作模块

// 1.创建路由
const router = express.Router();

// 2.配置路由
// 处理登录
router.post("/login", (request, response) => {
  const { account, password } = request.body;
  userLogin({ "account": account, "password": password }).then((result) => {
    if (result) {
      response.json({ "status": 200, "isLogin": true, "msg": "验证成功", "data": result });
    } else {
      response.json({ "status": 200, "isLogin": false, "msg": "用户名和密码错误" });
    }
  })
})

// 处理注册
router.post("/register", (request, response) => {
  // 获取请求参数
  const { account, password, sex, age } = request.body;
  userRegister({ account, password, sex, age }).then((result) => {
    if (result) {
      response.json({ "status": 200, "isRegister": true, "msg": "注册成功" });
    } else {
      response.json({ "status": 200, "isRegister": false, "msg": "注册失败，可能该邮箱账号已被注册" });
    }
  })
})

// 上传头像
router.post("/upload/profile",upload.single("avatar"), function (request, response, next) {
  // 保存头像地址
  const uid = request.body.uid;
  // 将文件名字设置为用户id
  console.log("uid:", request.body.uid);
  console.log(request.file);
  const path = request.file.path;
  saveAvatar({ "uid": uid, "avatar_url": path }).then((res) => {
    if (res) {
      response.json({ "status": 200, "setAvatar": true, "msg": "设置头像成功", "url": path });
    } else {
      response.json({ "status": 200, "setAvatar": false, "msg": "设置失败，服务器错误.." })
    }
  })
});

// 获取用户头像
router.get("/avatar", (request, response, next) => {
  // 拿到uid
  const { uid } = request.query;
  getAvatar({ uid }).then((result) => {
    const rootPath = path.join(__dirname, "../");
    response.sendFile(rootPath + result);
    // response.send(result);
  });

})
// 3. 导出路由
module.exports = router;