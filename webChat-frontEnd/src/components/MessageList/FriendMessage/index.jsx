import React, { Component } from 'react'
import style from './index.module.scss'
export default class FriendMessage extends Component {
  render() {
    return (
      <ul className={style.messageList}>
        <li>这是好友信息列表</li>
      </ul>
    )
  }
}
