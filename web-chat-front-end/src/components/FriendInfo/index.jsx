import React, { Component } from 'react'
import style from './index.module.scss'
import avatarUrl from '../../assets/img/默认头像.png'
import SexMan_url from '../../assets/img/性别男.png';
import { withRouter } from 'react-router-dom'
import SexWoman_url from '../../assets/img/性别女.png';
class FriendInfo extends Component {

  componentDidMount() {

  }
  // 去聊天
  goToChat = () => {
    setTimeout(() => {
      this.props.history.push("/privateChat");
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
    return (
      <>
        {/* 好友资料卡片 */}
        <div className={style.container} style={{ "display": isShow ? "flex" : "none" }} ref={c => { this.boxElem = c }}>
          {/* 资料卡 */}
          <div className={style.infoBox}>
            <img src={avatarUrl} />
            <div className={style.rightBox}>
              <h1>XDEcat</h1>
              <label><img src={SexMan_url}></img>20岁</label>
              <span>喜欢音乐、游戏、编程、美食爱好者</span>
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