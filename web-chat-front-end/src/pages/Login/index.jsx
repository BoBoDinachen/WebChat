import React, { Component } from 'react'
import style from './index.module.scss'
import Register from '../../components/Register'
import { request } from '../../utils/request'
export default class Login extends Component {
  state = {
    isShowRegister: false
  }
  componentDidMount() {
    // this.container.style.display = "none";
  }

  // 登录请求
  handleLogin = () => {
    const account = this.accountElem.value;
    const password = this.passwordElem.value;
    // 判断输入格式
    if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(account)) {
      console.log("true");
      if (password !== "") {
        // 发送登录请求
        request().post("/user/login", {
          account, password
        }).then((res) => {
          console.log(res);
          if (res.data.isLogin) {
            alert("OK!");
            // 将用户信息保存在本地
            let { localStorage } = window;
            localStorage.setItem("user_info", res.data.data);
            // 判断是否需要记住密码
            window.location.reload(); //刷新网页
          } else {
            alert("请检查账号和密码~");
          }
        })
      } else {
        alert("你还没有输入密码~");
      }
    } else if (account == "") {
      alert("请输入账号~");
    } else {
      alert("你的邮箱格式错误~")
    }
    console.log(account, password);
  }
  // 设置账号
  setAccount = (account) => {
    this.accountElem.value = account;
  }
  // 返回登录
  goToLogin = () => {
    // 隐藏注册框
    this.setState({
      isShowRegister: false
    })
    this.container.style.display = "block";
  }
  // 去注册
  goToRegister = () => {
    this.setState({
      isShowRegister: true
    })
    setTimeout(() => {
      this.container.style.display = "none";
    }, 200);
  }
  render() {
    return (
      <>
        {
          this.state.isShowRegister ? <Register setAccount={this.setAccount} goToLogin={this.goToLogin} /> : <></>
        }
        <div className={style.Login} ref={c => { this.container = c }}>
          <h2 className={style.title}>WebChat</h2>
          <div className={style.log}></div>
          <h2>Hi,欢迎登录!</h2>
          <ul className={style.input_container}>
            <li><input type="text" ref={c => { this.accountElem = c }} className={style.input_account} placeholder="请输入邮箱账号" /></li>
            <li><input type="text" ref={c => { this.passwordElem = c }} className={style.input_password} placeholder="请输入密码" /></li>
            <li className={style.checkbox}><input type="checkbox" name="remember" value="0" />&nbsp;记住密码</li>
            <li><button className={style.btn_login} onTouchEnd={this.handleLogin}>登录</button></li>
            <li><button className={style.btn_register} onTouchEnd={this.goToRegister}>注册</button></li>
          </ul>
        </div>
      </>
    )
  }
}
