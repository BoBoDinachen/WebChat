import React, { Component } from 'react'
import style from './index.module.scss'
import Register from '../../components/Register'
import axios from 'axios'
export default class Login extends Component {
  state = {
    isShowRegister: false
  }
  componentDidMount() {
    // this.container.style.display = "none";
  }

  // 登录请求
  handleLogin = () => {
    alert("测试");
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
    this.container.style.display = "none";
  }
  render() {
    return (
      <>
        {
          this.state.isShowRegister ? <Register goToLogin={this.goToLogin}/>: <></>
        }
        <div className={style.Login} ref={c => { this.container = c }}>
          <h2 className={style.title}>WebChat</h2>
          <div className={style.log}></div>
          <h2>Hi,欢迎登录!</h2>
          <ul className={style.input_container}>
            <li><input type="text" ref={c => {this.account = c}} className={style.input_account} placeholder="请输入邮箱账号" /></li>
            <li><input type="text" ref={c => {this.password = c}} className={style.input_password} placeholder="请输入密码" /></li>
            <li className={style.checkbox}><input type="checkbox" name="remember" value="0" />&nbsp;记住密码</li>
            <li><button className={style.btn_login} onTouchEnd={this.handleLogin}>登录</button></li>
            <li><button className={style.btn_register} onTouchEnd={this.goToRegister}>注册</button></li>
          </ul>
        </div>
      </>
    )
  }
}
