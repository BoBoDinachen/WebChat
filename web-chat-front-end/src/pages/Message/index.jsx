import React, { Component } from 'react'
import style from './index.module.scss'
export default class MessageList extends Component {
  uid = JSON.parse(sessionStorage["user_info"])._id;
  //组件加载
  componentDidMount() {
    
  }
  // 选择消息标题
  handelChange(item) {
    switch (item) {
      case "item1":
        console.log(this.messageTitle1);
        this.messageTitle1.classList.add(".active");
        break;
      case "item2":
        console.log(this.messageTitle2);
        break;
      case "item3":
        console.log(this.messageTitle3);
        break;
    }
  }
  render() {
    return (
      <div className={style.container}>
        {/* 消息标题栏 */}
        <div className={style.messageTitle}>
          <div className={style.titleItem} ref={c => {this.messageTitle1=c}}>
            <span onTouchEnd={this.handelChange.bind(this,"item1")}></span>
          </div>
          <div className={style.titleItem2} ref={c => {this.messageTitle2=c}}>
            <span onTouchEnd={this.handelChange.bind(this,"item2")}></span>
          </div>
          <div className={style.titleItem3} ref={c => {this.messageTitle3=c}}>
            <span onTouchEnd={this.handelChange.bind(this,"item3")}></span>
          </div>
        </div>
        {/* 消息标题列表 */}
        <ul className={style.messageList}>

        </ul>
      </div>
    )
  }
}
