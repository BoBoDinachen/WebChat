import React, { Component } from 'react'
import style from './index.module.scss'
import Button from '../../components/Button';
import socketIO from '../../utils/socket'
export default class MessageList extends Component {
  socket = null;
  uid = JSON.parse(sessionStorage["user_info"])._id;
  //组件加载
  componentDidMount() {
    // socketIO.openSocket(this.socket,this.uid);
  }
  // 关闭socket
  closeSocket = () => {
    // socketIO.createSocket(this.uid).emit("closeSocket", this.uid);
    socketIO.closeSocket(this.uid);
  }
  // 打开socket
  openSocket = () => {
    socketIO.openSocket(this.uid);
  }

  // 发送信息
  sendMessage = () => {
    let params = {
      send_uid: this.uid,
      message: this.inputValue.value,
      sendTime: new Date().toLocaleString(),
      receiver_uid: "608159d52f158f0588b1dbf5"
    }
    socketIO.privateChat(params);
  }

  render() {
    return (
      <div>
        <h2>这是消息列表...</h2>
        <Button click={this.openSocket}>打开连接</Button><br/>
        <Button click={this.closeSocket}>断开连接</Button><br/>
        <textarea name="" id="" cols="30" rows="10">
          {

          }
        </textarea>
        <input type="text" className={style.inputMessage} ref={c => {this.inputValue = c} }/>
        <Button click={this.sendMessage}>发送信息</Button>
      </div>
    )
  }
}
