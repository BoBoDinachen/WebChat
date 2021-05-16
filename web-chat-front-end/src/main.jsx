import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import socketIO from './utils/socket'
import './index.css'
import App from './App'
import Login from './pages/Login'  // 登录组件
import { Provider } from 'react-redux'
import store from './redux/store'
var uid = "";
if (localStorage["user_login"]) {
  uid= JSON.parse(localStorage["user_login"])._id; //用户id
}
// 获取本地的登录状态
let { sessionStorage } = window;
const user_info = sessionStorage.getItem("user_info");
// 判断本地存储中是否存在用户信息，如果有则进入APP，没有则进入登录界面
if (user_info !== null) {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter basename="/WebChat">
        {/* 传递store */}
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  )
} else {
  ReactDOM.render(
    <React.StrictMode>
      <Login></Login>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

window.onload = function () {
  console.log("页面加载");
  window.onunload = function () {
    console.log("页面刷新");
    window.onbeforeunload = function () {
      console.log("页面关闭");
      socketIO.closeSocket(uid); // 断开socket连接
    }
  }
}
