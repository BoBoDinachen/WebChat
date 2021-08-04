import React, { Component } from 'react'
import style from './index.module.scss'
import avatarUrl from '../../assets/img/默认头像.png'
import SexMan_url from '../../assets/img/性别男.png';
import { withRouter } from 'react-router-dom'
import SexWoman_url from '../../assets/img/性别女.png';
import { baseImgURL, request } from '../../utils/request'
import PubSub from "pubsub-js"
import confirm from '../../components/ConfirmBox'
import toast from '../../components/MessageBox/Toast'
class FriendInfo extends Component {
  state = {
    friendInfo: {},
    isLike: false
  }
  // 组件加载后
  componentDidMount() {
    // 获取当前好友信息
    this.token = PubSub.subscribe("currSelectFriend", (msg, data) => {
      const friend = JSON.parse(data);
      this.setState({
        friendInfo: friend
      }, () => {
        // 判断是否加入喜欢
        this.checkLike();
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
    const { _id, user_name } = this.state.friendInfo;
    setTimeout(() => {
      this.props.history.push("/privateChat", {
        uid: JSON.parse(sessionStorage['user_info'])._id,
        fid: _id,
        "friend_name": user_name
      });
    }, 300);
  }
  // 删除好友
  deleteFriend = () => {
    const { handleDelete } = this.props;
    const { friendInfo } = this.state;
    setTimeout(() => {
      confirm.open({
        title: "删除好友",
        content: "确定要删除此好友吗?",
        hanleConfirm: () => {
          request({
            url: "/user/deleteFriend",
            method: "post",
            data: {
              uid: JSON.parse(sessionStorage['user_info'])._id,
              fid: friendInfo._id
            }
          }).then((res) => {
            console.log(res);
            if (res.data.success) {
              handleDelete(friendInfo);
              this.closeBox();
              toast({
                type: "success",
                time: 2000,
                text: "删除成功!"
              })
            }
          })
        }
      })
    }, 300)

  }
  // 判断当前好友是否加入喜欢
  checkLike = () => {
    request({
      url: "/user/checkLike",
      method: "post",
      data: {
        uid: JSON.parse(sessionStorage['user_info'])._id,
        fid: this.state.friendInfo._id
      }
    }).then((res) => {
      // console.log(res);
      if (res.data.success) {
        // 没有被喜欢
        this.setState({
          isLike: false
        })
      } else {
        // 已经被喜欢了
        this.setState({
          isLike: true
        })
      }
    }, (err) => {
      console.log(err);
    })
  }
  // 点击喜欢
  clickLike = () => {
    // console.log(this.state.friendInfo);
    request({
      url: "/user/clickLike",
      method: "post",
      data: {
        uid: JSON.parse(sessionStorage['user_info'])._id,
        fid: this.state.friendInfo._id
      }
    }).then((res) => {
      // console.log(res);
      if (res.data.success) {
        toast({
          type: "success",
          text: "已喜欢上了♥",
          time: 1000
        })
        this.setState({
          isLike: true
        })
      }
    }, (err) => {
      console.log(err);
    })
  }

  // 取消喜欢
  cancelLike = () => {
    confirm.open({
      title: "取消喜欢",
      content: "确定要取消吗?",
      hanleConfirm: () => {
        request({
          url: "/user/cancelLike",
          method: "post",
          data: {
            uid: JSON.parse(sessionStorage['user_info'])._id,
            fid: this.state.friendInfo._id
          }
        }).then((res) => {
          console.log(res);
          if (res.data.success) {
            toast({
              type: "success",
              text: "已取消喜欢",
              time: 1000
            })
            this.setState({
              isLike: false
            })
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }
  // 关闭信息盒子
  closeBox = () => {
    setTimeout(() => {
      this.props.close();
    }, 100);
  }
  render() {
    let { isShow } = this.props;
    const { friendInfo, isLike } = this.state;
    return (
      <>
        <div className={style.containerShell} style={{ "display": isShow ? "block" : "none" }}>
          {/* 好友资料卡片 */}
          <div className={style.container} ref={c => { this.boxElem = c }}>
            {/* 资料卡 */}
            <div className={style.infoBox}>
              {
                friendInfo.avatar_url === undefined ?
                  <img src={avatarUrl} alt="" />
                  :
                  <img src={baseImgURL + "/user/avatar?uid=" + friendInfo._id} />
              }
              <div className={style.rightBox}>
                <h2>{friendInfo.user_name}</h2>
                <label><img src={friendInfo.sex === "男" ? SexMan_url : SexWoman_url}></img>{friendInfo.age}岁</label>
                <span>{friendInfo.signature === "" ? "这个好友还没有设置签名噢~" : friendInfo.signature}</span>
              </div>
            </div>
            {/* 操作选项 */}
            <ul className={style.menuList}>
              <li className={style.menu1} onTouchEnd={this.goToChat}>
                <span></span>
                <label>和他聊天</label>
              </li>
              <li className={style.menu2} onClick={this.deleteFriend}>
                <span></span>
                <label>删除好友</label>
              </li>
              {
                isLike ?
                  <li className={style.menu4} onClick={this.cancelLike}>
                    <span></span>
                    <label>X取消喜欢</label>
                  </li>
                  :
                  <li className={style.menu3} onClick={this.clickLike}>
                    <span></span>
                    <label>喜欢ta</label>
                  </li>
              }
            </ul>
            {/* 关闭按钮 */}
            <span onTouchEnd={this.closeBox}></span>
          </div>
        </div>
      </>
    )
  }
}
export default withRouter(FriendInfo);