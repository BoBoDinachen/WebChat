import React, { Component } from 'react'
import style from './index.module.scss'
import { connect } from 'react-redux';
import {createSendMessageAction,createInitMessageAction} from '../../redux/action/chat_action'
class PrivateChat extends Component {
  state = {
    userName: "XDEcat",
    uid: "2333"
  }
  componentDidMount() {
    // 根据屏幕高度自动改变列表高度
    const bodyHeight = document.body.offsetHeight;
    console.log("网页可视高度", bodyHeight);
    // 减去header和footer高度
    this.listBoxElem.style.height = (bodyHeight - 50 - 60 - 68) + "px";

    // 从store中加载聊天信息
    this.props.initMessage({ uid: this.state.uid });
    console.log("聊天信息:",this.props.chatInfo);
  }
  
  
  // 返回
  back = () => {
    this.props.history.goBack();
  }
  send = () => {
    alert("准备发送");
    // 改变store状态
    this.props.sendMessage({
      uid: "333",  //用户id
      message: "你好~我是发送者", // 信息
      time: "2021/5/15", //  时间
      status: "0" // 0-发送者   1-接受者
    });
  }
  render() {
    const {chatInfo} = this.props;
    return (
      <div className={style.container}>
        {/* 顶部栏 */}
        <div className={style.topBar}>
          <span className={style.close} onTouchEnd={this.back}></span>
          {this.state.userName}
          <span className={style.iconMore}></span>
        </div>
        <ul className={style.messageList} ref={c => {this.listBoxElem = c}}>
          <li>
            1111
          </li>
          <li>
            2222
          </li>
        </ul>
        {/* 底部栏 */}
        <div className={style.bottomBar}>
          <span></span>
          <input type="text" placeholder="和ta聊聊吧~" />
          <span></span>
          <span onTouchEnd={this.send}></span>
        </div>
      </div>
    )
  }
}
export default connect(
  // 映射reducer中的state
  state => ({
    chatInfo: state.chatInfo
  }),
  // 映射action中的方法，自动调用dispatch
  {
    sendMessage: createSendMessageAction,
    initMessage: createInitMessageAction
  }
)(PrivateChat);