import React, { Component } from 'react'
import style from './index.module.scss'
import {withRouter} from 'react-router-dom'
import MyNav from '../MyNav'
class Footer extends Component {
  render() {
    const Navs = [
      { id: "001", path: "/home", name: "广场" },
      { id: "002", path: "/friends", name: "好友" },
      { id: "003", path: "/message", name: "消息" },
      { id: "004", path: "/profile", name: "我的" }
    ];
    return (
      <>
        <footer className={style.footer}>
          <ul className={style.navList}>
            {
              Navs.map((Nav, index) => {
                return <MyNav to={Nav.path} id={Nav.id} menu={Nav.name} key={Nav.id} />
              })
            }
          </ul>
        </footer>
      </>
    )
  }
}
export default withRouter(Footer);
