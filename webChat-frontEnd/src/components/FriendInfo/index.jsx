import React, { Component } from 'react'
import style from './index.module.scss'
import avatarUrl from '../../assets/img/默认头像.png'
import SexMan_url from '../../assets/img/性别男.png';
import { withRouter } from 'react-router-dom'
import SexWoman_url from '../../assets/img/性别女.png';
import {baseImgURL} from '../../utils/request'
import PubSub from "pubsub-js"
class FriendInfo extends Component {
  state = {
    friendInfo:{ }
  }
  // 组件加载后
  componentDidMount() {
    // 获取当前好友信息
    this.token = PubSub.subscribe("currSelectFriend", (msg, data) => {
      const friend = JSON.parse(data);
      this.setState({
        friendInfo: friend
      })
      // console.log("接收到了：",friend);
    })
  }
  componentWillUnmount() {
    // 取消订阅
    PubSub.unsubscribe(this.token);
  }
  // 去聊天
  goToChat = () => {
    const {_id,user_name} = this.state.friendInfo;
    setTimeout(() => {
      this.props.history.push("/privateChat", {
        uid: JSON.parse(sessionStorage['user_info'])._id,
        fid: _id,
        "friend_name":user_name
      });
    }, 200);
  }
  // 关闭信息盒子
  closeBox = () => {
    setTimeout(() => {
      this.props.close();
    }, 100);
  }
  render() {
    let { isShow } = this.props;
    const { friendInfo } = this.state;
    return (
      <>
        {/* 好友资料卡片 */}
        <div className={style.container} style={{ "display": isShow ? "flex" : "none" }} ref={c => { this.boxElem = c }}>
          {/* 资料卡 */}
          <div className={style.infoBox}>
            <img src={friendInfo.avatar_url === undefined?avatarUrl:baseImgURL+"/user/avatar?uid=" + friendInfo._id} />
            <div className={style.rightBox}>
              <h2>{friendInfo.user_name}</h2>
              <label><img src={friendInfo.sex==="男"?SexMan_url:SexWoman_url}></img>{friendInfo.age}岁</label>
              <span>{friendInfo.signature===""?"这个好友还没有设置签名噢~":friendInfo.signature}</span>
            </div>
          </div>
          {/* 操作选项 */}
          <ul className={style.menuList}>
            <li className={style.menu1} onTouchEnd={this.goToChat}>
              <span></span>
              <label>和他聊天</label>
            </li>
            <li className={style.menu2}>
              <span></span>
              <label>删除好友</label>
            </li>
            <li className={style.menu3}>
              <span></span>
              <label>给个点赞</label>
            </li>
          </ul>
          {/* 关闭按钮 */}
          <span onTouchEnd={this.closeBox}></span>
        </div>
      </>
    )
  }
}
export default withRouter(FriendInfo);