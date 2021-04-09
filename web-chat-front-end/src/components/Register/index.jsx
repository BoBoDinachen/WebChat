import React, { Component } from 'react'
import style from './index.module.scss'
export default class Register extends Component {
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    console.log(this.props);
    if (this.props.isShow) {
      return (
        <div className={style.register_container}>
          Hello,World!
        </div>
      )
    } else {
      return null;
    }
  }
}
