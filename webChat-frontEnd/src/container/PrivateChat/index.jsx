import React, { Component } from 'react'
import style from './index.module.scss'
import { connect } from 'react-redux';
import { baseImgURL, request } from '../../utils/request'
import Confirm from '../../components/ConfirmBox/index'
import Toast from '../../components/MessageBox/Toast'
import {
  createSendMessageAction,
  createInitMessageAction,
  createClearMessageAction
} from '../../redux/action/chat_action'

class PrivateChat extends Component {
  state = {
    showMenus: false
  }
  // 组件完成加载
  componentDidMount() {
    // 根据屏幕高度自动改变列表高度
    const bodyHeight = document.body.offsetHeight;
    // console.log("网页可视高度", bodyHeight);
    // 减去header和footer高度
    this.listBoxElem.style.height = (bodyHeight - 50 - 60 - 68) + "px";
    const { uid, fid } = this.props.location.state;
    // 根据用户id加载对应的聊天信息,请求后端
    request({
      url: "/user/getMessages",
      method: "get",
      params: {
        "uid": uid,
        "fid": fid
      }
    }).then((res) => {
      console.log(res);
      // 从store中加载聊天信息
      this.props.initMessage({ "messages": res.data.data });
    })
    // console.log("所有的聊天信息:", this.props.chatInfo);
    this.scrollToBottom();
  }
  // 菜单按钮1  清除聊天消息记录
  handleMenu1 = () => {
    const { uid, fid } = this.props.location.state;
    setTimeout(() => {
      Confirm.open({
        title: "清除", content: "确定要清除聊天记录吗", hanleConfirm: () => {
          // 发送清除消息请求
          request({
            url: "/user/clearMessages",
            method: "get",
            params: {
              uid,
              fid,
            }
          }).then((res) => {
            console.log(res);
            if (res.data.success === true) {
              this.setState({
                showMenus: !this.state.showMenus
              })
              this.props.clearMessage(); //清除消息记录
              Toast({type:"success",time:"3000",text:"清除成功..."})
            }
          })
        }
      });
    }, 200);
  }
  // 返回
  back = () => {
    setTimeout(() => {
      this.props.history.goBack();
    }, 100)
  }
  // 滚动条到底部的方法
  scrollToBottom = () => {
    if (this.listBoxElem) {
      const scrollHeight = this.listBoxElem.scrollHeight;
      const height = this.listBoxElem.clientHeight;
      const maxScrollTop = scrollHeight - (height);
      this.listBoxElem.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }
  // 发送信息
  send = () => {
    // 获取输入框的内容、本地用户信息，路由中的用户id
    const content = this.inputElem.value;
    const { _id, user_name } = JSON.parse(sessionStorage["user_info"]);
    const { fid, friend_name } = this.props.location.state;
    // 改变store状态
    this.props.sendMessage({
      uid: _id,  //用户id
      receiver_uid: fid,
      receiver_name: friend_name,
      uname: user_name,
      message: content === "" ? "emmm..." : content, // 信息
      time: new Date().toLocaleString(), //  时间
      status: "1" // 0-发送者   1-接受者
    });
    this.inputElem.value = "";
    this.scrollToBottom(); // 滑动到最底部
  }
  render() {
    const { chatInfo } = this.props;
    const { fid, friend_name } = this.props.location.state;
    return (
      <div className={style.container} >
        {/* 顶部栏 */}
        <div className={style.topBar}>
          <span className={style.close} onTouchEnd={this.back}></span>
          {friend_name}
          <span className={style.iconMore} onClick={() => { this.setState({ showMenus: !this.state.showMenus }) }}></span>
          {/* 顶部菜单栏 */}
          <ul className={`${style.floatMenus} ${this.state.showMenus ? '' : style.menusHide}`}>
            <li onClick={this.handleMenu1}>清除消息记录</li>
            <li>特别关心</li>
            <li>聊天背景</li>
          </ul>
        </div>
        <ul className={style.messageList} ref={c => { this.listBoxElem = c }} onClick={() => { this.setState({ showMenus: false }) }}>
          {/* 消息框 */}
          {
            chatInfo.map((item, index) => {
              // if (this.messageBox !== undefined && this.messageBox !== null) {
              //   let boxHeight = this.messageBox.clientHeight;
              //   // console.log("消息盒子高度:" + boxHeight);
              //   // 设置每个盒子的margin-bottom
              //   this.listBox.style.marginBottom = boxHeight+10+"px";
              // }
              return (
                <li ref={c => { this.listBox = c }} className={item.status === "1" ? style.rightMessageBox : style.leftMessageBox} key={index}>
                  {/* <img src="https://www.keaidian.com/uploads/allimg/190415/15110727_19.jpg"></img> */}
                  <img src={baseImgURL + "/user/avatar?uid=" + (item.status === "1" ? item.uid : fid)} alt="" />
                  <div className={style.infoBox}>
                    <label><span>{item.uname}</span>{item.time}</label>
                    <div ref={c => { this.messageBox = c }}>{item.message}</div>
                  </div>
                </li>
              )
            })
          }
          {/* <li className={style.rightMessageBox}>
            <img src="https://img2.woyaogexing.com/2018/08/08/1eb8ede3f2a666c5!400x400_big.jpg"></img>
            <div>
              <label><span>小喵酱</span>2021/5/16</label>
              <div>你也好呀,很高兴认识你~</div>
            </div>
          </li> */}
        </ul>
        {/* 底部栏 */}
        <div className={style.bottomBar}>
          <span></span>
          <input type="text" ref={c => { this.inputElem = c }} placeholder="和ta聊聊吧~" />
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
    initMessage: createInitMessageAction,
    clearMessage: createClearMessageAction
  }
)(PrivateChat);