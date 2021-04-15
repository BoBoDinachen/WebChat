import React, { Component } from 'react'
import style from './index.module.scss'
import LogUrl from '../../assets/img/Log.jpg'
import { request } from '../../utils/request'
export default class Register extends Component {
  componentDidMount() {
  }
  // 处理注册
  handleRegister = () => {
    // 获取注册数据
    const account = this.accountElem.value;
    const password = this.pwdElem.value;
    const confirm_pwd = this.repwdElem.value;
    const sex = this.sexElem.value;
    const age = this.ageElem.value;
    // 判断为空和格式
    if (account === "") {
      alert("请输入账号~")
    } else if (password === "") {
      alert("请输入密码~");
    } else if (confirm_pwd === "") {
      alert("请确认密码~");
    } else if (age === "") {
      alert("请输入年龄~");
    } else {
      // 验证账号格式,发送注册请求
      if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(account)) {
        alert("请输入正确的邮箱格式~");
      } else if (!/^[A-Za-z0-9]+$/.test(password)) {
        alert("密码只能由数字和字母组成~");
      } else if (password !== confirm_pwd) {
        alert("两次输入的密码不一致~");
      } else {
        // 所有的验证通过后，发送注册请求
        request().post("/user/register", {
          account, password, sex, age
        }).then((res) => {
          if (res.data.isRegister) {
            alert("注册成功!");
            // 将账号发送给登录页
            this.props.setAccount(account);
            // 清空表单数据
            this.clearRegisterData();
            // 返回登录页面
            this.props.goToLogin();
          }
          
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  }
  // 清空表单数据
  clearRegisterData() {
    this.accountElem.value = "";
    this.pwdElem.value = "";
    this.repwdElem.value = "";
    this.sexElem.value = "男";
    this.ageElem.value = "";
  }
  render() {
    return (
      <div className={style.register_container}>
        <h2 className={style.topBar}><span className={style.back_btn} onTouchEnd={this.props.goToLogin}></span>注册</h2>
        <div className={style.welcome}>
          <div>
            <h1>Hi,欢迎加入！</h1>
            <hr />
            <p>WebChat,一个在web网页上面的即时聊天应用</p>
          </div>
          <img src={LogUrl} alt="" />
        </div>
        {/* 注册框 */}
        <div className={style.register_input}>
          <ul>
            <li>
              <label>邮箱</label>
              <input ref={c => { this.accountElem = c }} type="text" placeholder="输入邮箱作为账号" />
            </li>
            <li>
              <label>密码</label>
              <input ref={c => { this.pwdElem = c }} type="text" placeholder="输入密码" />
            </li>
            <li>
              <label>确认密码</label>
              <input ref={c => { this.repwdElem = c }} type="text" placeholder="请确认密码" />
            </li>
            <li>
              <label>性别</label>
              <select ref={c => { this.sexElem = c }}>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </li>
            <li>
              <label>年龄</label>
              <input ref={c => { this.ageElem = c }} type="number" placeholder="输入年龄" />
            </li>
          </ul>
        </div>
        {/* 确认按钮 */}
        <button className={style.confirm_btn} onTouchEnd={this.handleRegister}>确认注册</button>
      </div>
    )
  }
}
