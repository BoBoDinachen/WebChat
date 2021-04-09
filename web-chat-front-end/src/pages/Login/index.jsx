import React, { Component } from 'react'
import style from './index.module.scss'
import Register from '../../components/Register'
export default class Login extends Component {
  state = {
    isShowRegister: true
  }
  componentDidMount() {
    
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
        <Register isHow={this.state.isShowRegister} />
        <div className={style.Login} ref={c => { this.container = c }}>
          <h2 className={style.title}>薛定谔的猫</h2>
          <div className={style.log}></div>
          <ul className={style.input_container}>
            <li><input type="text" className={style.input_account} placeholder="请输入账号" /></li>
            <li><input type="text" className={style.input_password} placeholder="请输入密码" /></li>
            <li className={style.checkbox}><input type="checkbox" name="remember" value="0" />&nbsp;记住密码</li>
            <li><button className={style.btn_login}>登录</button></li>
            <li><button className={style.btn_register} onTouchEnd={this.goToRegister}>注册</button></li>
          </ul>
        </div>
      </>
    )
  }
}
