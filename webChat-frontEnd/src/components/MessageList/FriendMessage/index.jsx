import React, { Component } from 'react'
import style from './index.module.scss'
import Spin from '../../../components/Spin/index'
export default class FriendMessage extends Component {
  render() {
    return (
      <ul className={style.messageList}>
        <Spin loading={true}></Spin>
      </ul>
    )
  }
}
