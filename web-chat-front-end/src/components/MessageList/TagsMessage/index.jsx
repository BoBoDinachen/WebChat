import React, { Component } from 'react'
import style from './index.module.scss'
export default class TagsMessage extends Component {
  render() {
    return (
      <ul className={style.messageList}>
        <li>这是收到的点赞列表</li>
      </ul>
    )
  }
}
