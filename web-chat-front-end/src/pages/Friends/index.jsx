import React, { Component } from 'react'
import style from './index.module.scss'
import FriendInfo from '../../components/FriendInfo'
import avatarUrl from '../../assets/img/默认头像.png'
import PubSub from 'pubsub-js'
import {request,baseImgURL} from '../../utils/request'
export default class Friends extends Component {
  // 当前用户id
  uid = JSON.parse(sessionStorage['user_info'])._id;
  state = {
    friends: [],
    onlineNum: "1/2",
    friendNum: 2,
    isShowInfo: false,
  }
  // 组件加载前
  componentDidMount() {
    // 根据屏幕高度自动改变列表高度
    const bodyHeight = document.body.offsetHeight;
    console.log("网页可视高度", bodyHeight);
    // 减去header和footer高度
    this.containerElem.style.height = (bodyHeight - 45 - 68) + "px";
    // 加载用户信息
    request({
      url: "/user/getFriends",
      method: "get",
      params: {
        uid: this.uid
      }
    }).then((res) => {
      const { data } = res.data;
      const friends = data;
      console.log(friends);
      // 更新state
      this.setState({
        friends
      })
    }).catch((err) => {
      console.log(err);
    })
    // 
  }
  // 并行加载图片的方法
  
  // 显示好友信息
  showInfoBox() {
    this.setState({ isShowInfo: true });
  }
  //关闭好友信息
  closeInfoBox = () => {
    this.setState({ isShowInfo: false });
  }
  // 选择好友
  selectFriend(friend) {
    setTimeout(() => {
      this.showInfoBox();
      // 发布当前好友信息
      PubSub.publish("currSelectFriend", JSON.stringify(friend));
    }, 300)
  }
  render() {
    return (
      <>
        {/* 好友信息页 */}
        <FriendInfo isShow={this.state.isShowInfo}  close={this.closeInfoBox}></FriendInfo>
        <div className={style.container} ref={c => {this.containerElem = c}}>
          {/* 搜索框 */}
          <div className={style.searchBox}>
            <input type="text" placeholder="请输入好友名称" />
            <span></span>
          </div>
          <hr/>
          {/* 好友列表盒子 */}
          <div className={style.listBox}>
            {/* 状态栏 */}
            <div className={style.statusBar}>
              <span>当前在线: {this.state.onlineNum}</span>
              <span>好友数: {this.state.friends.length}</span>
            </div>
            {/* 好友列表 */}
            <ul className={style.friendList}>
              {
                // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item, index) => {
                //   return (
                //         <li onClickCapture={this.selectFriend.bind()} key={index}>
                //           {/* 头像和用户昵称 */}
                //           <img src={avatarUrl}/>
                //           <div className={style.rightBox}>
                //             <h3>hhhh</h3>
                //             <p>喵呜~</p>
                //           </div>
                //         </li>
                //       )
                // })
                this.state.friends.map((friend, index) => {
                  return (
                    <li onClickCapture={this.selectFriend.bind(this,friend)} key={friend._id}>
                      {/* 头像和用户昵称 */}
                      <img src={friend.avatar_url===""?avatarUrl:baseImgURL + "/user/avatar?uid=" + friend._id}/>
                      <div className={style.rightBox}>
                        <h3>{friend.user_name}</h3>
                        <p>{friend.signature === ""?"这个好友还没有签名噢~":friend.signature}</p>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </>
    )
  }
}
