const express = require("express");
// 1.创建路由
const router = express.Router();

// 2.配置路由
// 处理登录
router.post("/login", (req, res) => {
  const { account, password } = req.body;
  console.log(req.body);
  res.send("登录");
})
// 处理注册
router.post("/register", (req, res) => {
  console.log(req.body);
  res.send("注册");
})

// 3. 导出路由
module.exports = router;