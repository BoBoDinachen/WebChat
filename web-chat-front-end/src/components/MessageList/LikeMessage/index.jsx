import React, { Component } from 'react'
import style from './index.module.scss'
export default class LikeMessage extends Component {
  render() {
    return (
      <ul className={style.messageList}>
        <li>这是收到的喜欢列表</li>
      </ul>
    )
  }
}
