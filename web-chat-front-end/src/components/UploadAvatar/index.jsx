import React, { Component } from 'react'
import style from './index.module.scss'
import defaultAvatar from '../../assets/img/默认头像.png';
// 上传头像的组件
export default class UploadAvatar extends Component {
  componentDidMount() {
    console.log(this.uploadElemt);
  }
  
  render() {
    return (
      <div className={style.upload_container}>
        <img src={defaultAvatar}></img>
        <button className={style.upload_btn}>
          上传头像
          <input type="file"  ref={c => {this.uploadElemt = c}}/>
        </button>
      </div>
    )
  }
}
