const express = require("express");

const app = express();
const http = require("http").Server(app); // httpServer
const {
  initChat
} = require("./service/chatService/index");
//body-parser - node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。
// const bodyParser = require('body-parser')
app.use(express.json());

// 监听每个请求
app.use((req, res, next) => {
  // console.log('请求地址', req.url);
  next();
})

// 处理静态资源
app.use("/WebChat/home", express.static("static/"));
//设置允许跨域访问
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers 
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 处理路由
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");
app.use("/WebChat/user", userRouter);
app.use("/WebChat/message", messageRouter);
initChat(http);  //启动socket.io服务

// 匹配到不正确的路径时，重定向到首页
app.get('*', function (request, response) {
  response.redirect("/WebChat/home");
})
// 监听服务实例
const server = http.listen("5000", (err) => {
  if (!err) {
    console.log("服务器运行在：http://localhost:%s", server.address().port);
  }
})
