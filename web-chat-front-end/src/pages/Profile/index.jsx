import React, { Component } from 'react'
import style from './index.module.scss'
import avatarUrl from '../../assets/img/默认头像.png'
export default class Profile extends Component {
  state = {
    user: {
      account: "",
      user_name: "",
      age: "",
      sex: "",
      avatar_url: ""
    }
  }
  HandleUpload = () => {
    setTimeout(() => {
      alert("你点错了~");
    }, 200)
  }
  componentDidMount() {
    // 组件加载的时候，获取用户信息
    const user_info = JSON.parse(window.sessionStorage.getItem("user_info"));
    this.setState({
      user: {
        account: user_info.account,
        user_name: user_info.user_name,
        age: user_info.age,
        sex: user_info.sex,
        avatar_url: user_info.avatar_url
      }
    })
  }
  // 退出登录
  backLogin = () => {
    setTimeout(() => {
      if (confirm("确定要退出吗?")) {
        // 清除本地sessionStorage,设置本地存储密码为空
        const account = JSON.parse(window.sessionStorage.getItem("user_info")).account;
        window.localStorage.setItem("user_login", JSON.stringify({ account, password: "" }));
        window.sessionStorage.clear();
        window.location.reload(); // 刷新页面
      } else {
        // 取消
      }
    }, 200);
  }
  render() {
    const { user } = this.state;
    console.log(user);
    return (
      <div className={style.container}>
        {/* 展示用户名和头像 */}
        <div className={style.showInfo}>
          <span onTouchEnd={this.HandleUpload}></span>
          <img src={avatarUrl} alt="" onTouchEnd={this.HandleUpload} />
          <span>{user.user_name === "" ? user.account : user.user_name}</span>
        </div>
        <ul className={style.recordList}>
          <li>
            {111}
            <label>喜欢</label>
          </li>
          <li>
            {222}
            <label>共发消息</label>
          </li>
          <li>
            {333}
            <label>点赞</label>
          </li>
        </ul>
        <ul className={style.menuList}>
          <li><span></span>设置昵称</li>
          <li><span></span>编辑资料</li>
          <li><span></span>设置背景</li>
          <li><span></span>修改密码</li>
        </ul>
        <button className={style.backLogin} onTouchEnd={this.backLogin}>退出登录</button>
      </div>
    )
  }
}
