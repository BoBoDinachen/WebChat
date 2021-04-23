import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import style from './index.module.scss'
export default class MyNav extends Component {
  render() {
    const { id} = this.props;
    return (
      <li className={style.list_item}>
        <NavLink {...this.props} activeClassName={style.active} className={style.link} >
        </NavLink>
      </li> 
    )
  }
}
