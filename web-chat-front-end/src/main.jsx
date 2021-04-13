import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'  // 登录组件

// 获取本地的登录状态
let { sessionStorage } = window;
// localStorage.setItem("user_info", "");
const user_info = sessionStorage.getItem("user_info");
// console.log(user_info);
// 判断本地存储中是否存在用户信息，如果有则进入APP，没有则进入登录界面
if (user_info !== null) {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter basename="/WebChat">
        <App />
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

// // 页面关闭时，清除本地存储的用户登录信息
// window.onbeforeunload = function () {
//   const { localStorage } = window;
//   localStorage.setItem("user_info", "");
// }