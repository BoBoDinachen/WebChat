import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import style from './index.module.scss';
class Header extends Component {
  //返回
  handleBack = () => {
    const { goBack } = this.props.history;
    goBack(); // 后退
  }
  componentDidMount() {
  }
  render() {
    let title = "";
    const { pathname } = this.props.location;
    if (pathname.search("/home") != -1) {
      title = "广场";
    }
    switch (pathname) {
      case "/profile":
        title = "个人中心";
        break;
      case "/profile/edit":
        title = "编辑资料";
        break;
      case "/profile/updatePassword":
        title = "修改密码";
        break;
      case "/friends":
        title = "我的好友";
        break;
      case "/friends/search":
        title = "搜索好友";
        break;
      case "/message":
        title = "好友消息";
        break;
      case "/message/friendMsg":
        title = "好友消息";
        break;
      case "/message/likeMsg":
        title = "收到的喜欢";
        break;
      case "/message/requestMsg":
        title = "好友申请";
        break;
    }
    return (
      <header className={style.container}>
        <h2 className={style.title}>
          {pathname=="" ? <span className={style.back} onTouchEnd={this.handleBack}></span> : ""}
          {title}
        </h2>
      </header>
    )
  }
}
export default withRouter(Header);