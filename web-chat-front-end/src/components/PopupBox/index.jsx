import React, { Component } from 'react'
import * as style from './index.module.scss'
import close_url from '../../assets/img/关闭.png'
// 弹出框高阶组件
export default function PopupBox(WrappedComponent) {
  return class extends Component {
    state = {

    }
    componentDidMount() {
      const { showPopup } = this.props;
      if (showPopup) {
        this.openPopup();
      }
    }
    // 关闭模态框
    colsePopup = () => {
      this.popupBox.style.display = "none";
    }
    // 打开模态框
    openPopup = () =>{
      this.popupBox.style.display = "flex";
    }
    render() {
      return (
        <div ref={c => {this.popupBox = c}} className={style.popup}>
          <div className={style.content}>
            {/* 传入的组件 */}
            <WrappedComponent/>
          </div>
          <a className={style.close} onTouchEnd={this.colsePopup}>
            <img src={close_url}/>
          </a>
        </div>
      )
    }
  }
}