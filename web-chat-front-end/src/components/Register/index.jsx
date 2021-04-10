import React, { Component } from 'react'
import style from './index.module.scss'
import LogUrl from '../../assets/img/Log.png'
import UploadAvatar from '../../components/UploadAvatar'
export default class Register extends Component {
  componentDidMount() {
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
              <label>邮箱</label><br />
              <input type="text" placeholder="输入邮箱作为账号" />
            </li>
            <li>
              <label>密码</label><br />
              <input type="text" placeholder="输入密码" />
            </li>
            <li>
              <label>确认密码</label><br />
              <input type="text" placeholder="确认密码" />
            </li>
            <li>
              <label>性别</label>&nbsp;&nbsp;&nbsp;&nbsp;
              <select>
                <option value="0">男</option>
                <option value="1">女</option>
              </select>
            </li>
            <li>
              <label>年龄</label><br />
              <input type="number" placeholder="输入年龄"/>
            </li>
          </ul>
          <UploadAvatar />
        </div>
        {/* 确认按钮 */}
        <button className={style.confirm_btn}>确认注册</button>
      </div>
    )
  }
}
