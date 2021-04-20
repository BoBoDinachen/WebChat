import React, { Component } from 'react'
import style from './index.module.scss'
import {withRouter} from 'react-router-dom'
import MyNav from '../MyNav'
class Footer extends Component {
  goToShare = () => {
    const { replace } = this.props.history;
    // 前往share组件
    replace("/share");
  }
  render() {
    const Navs = [
      { id: "001", path: "/home", name: "大厅" },
      { id: "002", path: "/friends", name: "好友" },
      { id: "003", path: "/share", name: "" },
      { id: "004", path: "/message", name: "消息" },
      { id: "005", path: "/profile", name: "我的" }
    ];
    return (
      <>
        <footer className={style.footer}>
          <span className={style.increment} onTouchEnd={this.goToShare}></span>
          <ul className={style.navList}>
            {
              Navs.map((Nav, index) => {
                return <MyNav to={Nav.path} children={Nav.name} key={Nav.id} />
              })
            }
          </ul>
        </footer>
      </>
    )
  }
}
export default withRouter(Footer);
