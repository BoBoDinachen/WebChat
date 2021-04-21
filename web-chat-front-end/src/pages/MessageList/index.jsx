import React, { Component } from 'react'
import Button from '../../components/Button';
import socketIO from '../../utils/socket';
export default class MessageList extends Component {
  //组件加载
  componentDidMount() {
    console.log("执行了");
    socketIO.createSocket(); // 创建连接
  }

  // 关闭socket
  closeSocket = ()=>{
    socketIO.closeSocket();
  }
  // 打开socket
  openSocket = () => {
    socketIO.openSocket();
  }
  render() {
    return (
      <div>
        <h2>这是消息列表...</h2>
        <Button click={this.openSocket}>打开连接</Button><br/>
        <Button click={this.closeSocket}>断开连接</Button>
      </div>
    )
  }
}
