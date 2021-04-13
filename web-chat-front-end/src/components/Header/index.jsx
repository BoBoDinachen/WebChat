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
    switch (pathname) {
      case "/home":
        title = "大厅";
        break;
      case "/profile":
        title = "个人中心";
    }
    return (
      <header>
        <h2 className={style.title}>
          <span className={style.back} onTouchEnd={this.handleBack}></span>
          {title}
        </h2>
      </header>
    )
  }
}
export default withRouter(Header);