import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import style from './index.module.scss'
import profileUrl from '../../assets/img/个人中心.png'
import friendUrl from '../../assets/img/好友.png'
import messageUrl from '../../assets/img/消息.png'
import homeUrl from '../../assets/img/主页.png'

export default class MyNav extends Component {
  componentDidMount() {
    const { id } = this.props;
    switch (id) {
      case "001":
        this.imgElem.src = homeUrl;
        break;
      case "002":
        this.imgElem.src = friendUrl;
        break;
      case "003":
        this.imgElem.src = messageUrl;
        break;
      case "004":
        this.imgElem.src = profileUrl;
        break;
    }
  }

  render() {
    return (
      <li className={style.list_item}>
        <NavLink {...this.props} activeClassName={style.active} className={style.link} >
          <img ref={c => { this.imgElem = c }} />
          <span>{this.props.activeName}</span>
        </NavLink>
      </li>
    )
  }
}
