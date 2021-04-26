import React, { Component } from 'react'
import style from './index.module.scss'
import avatarUrl from '../../assets/img/默认头像.png'
export default class Friends extends Component {
  state = {
    onlineNum: "1/2",
    friendNum: 2,
  }
  render() {
    return (
      <div className={style.container}>
        {/* 搜索框 */}
        <div className={style.searchBox}>
          <input type="text" placeholder="请输入好友名称" />
          <span></span>
        </div>
        {/* 好友列表盒子 */}
        <div className={style.listBox}>
          {/* 状态栏 */}
          <div className={style.statusBar}>
            <span>当前在线: {this.state.onlineNum}</span>
            <span>好友数: {this.state.friendNum}</span>
          </div>
          {/* 好友列表 */}
          <ul className={style.friendList}>
            {
              [1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((item) => {
                return (
                  <li>
                    {/* 头像和用户昵称 */}
                    <img src={avatarUrl} />
                    <div className={style.rightBox}>
                      <h3>XDEcat</h3>
                      <p>喵呜~</p>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}
