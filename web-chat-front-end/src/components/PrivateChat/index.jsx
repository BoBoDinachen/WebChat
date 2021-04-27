import React, { Component } from 'react'
import style from './index.module.scss'
export default class ChatRoom extends Component {
  state = {
    userName: "XDEcat"
  }
  // 返回
  back = () => {
    this.props.history.goBack();
  }
  render() {
    return (
      <div className={style.container}>
        {/* 顶部栏 */}
        <div className={style.topBar}>
          <span className={style.close} onTouchEnd={this.back}></span>
          {this.state.userName}
        </div>
        {/* 底部栏 */}
        <div className={style.bottomBar}>
          <input type="text" placeholder="请输入要发送的内容..."/>
          <a>发送</a>
        </div>
      </div>
    )
  }
}
