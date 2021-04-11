const express = require("express");
const { userLogin } = require("../service/userService/index");
// 1.创建路由
const router = express.Router();

// 2.配置路由
// 处理登录
router.post("/login", (req, res) => {
  const { account, password } = req.body;
  userLogin({ "account": account, "password": password }).then((result) => {
    if (result) {
      res.json({"status":200,"isLogin":true,"msg":"验证成功"});
    } else {
      res.json({"status":200,"isLogin":false,"msg":"用户名和密码错误"});
    }
  })
})
// 处理注册
router.post("/register", (req, res) => {
  console.log(req.body);
  // res.send("注册");
})

// 3. 导出路由
module.exports = router;