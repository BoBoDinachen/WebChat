import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'  // 登录组件

// 获取本地的登录状态
let { localStorage } = window;
// localStorage.setItem("user_info", "");
const user_info = localStorage.getItem("user_info");

// 判断本地存储中是否存在用户信息，如果有则进入APP，没有则进入登录界面
if (user_info !== "") {
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

