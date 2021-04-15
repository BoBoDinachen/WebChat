import React, { Component } from 'react'
import style from './index.module.scss'
import avatarUrl from '../../assets/img/默认头像.png'
import PopupBox from '../../components/PopupBox'
import { request } from '../../utils/request'
export default class Profile extends Component {
  state = {
    user: {
      uid: "",
      account: "",
      user_name: "",
      age: "",
      sex: "",
      avatar_url: ""
    },
    // 模态框是否关闭
    showPopup: false
  }
  // 上传头像
  // HandleUpload = () => {
  //   setTimeout(() => {
  //     this.openUploadPopup();
  //   }, 200)
  // }
  componentDidMount() {
    // 组件加载的时候，获取用户信息
    const user_info = JSON.parse(window.sessionStorage.getItem("user_info"));
    this.setState({
      user: {
        uid: user_info._id,
        account: user_info.account,
        user_name: user_info.user_name,
        age: user_info.age,
        sex: user_info.sex,
        avatar_url: user_info.avatar_url
      }
    })
    //
    console.log(this.uploadElemt);
  }
  // 触摸头像
  HandleAvatar = () => {
    alert("喵呜~");
  }
  // 上传头像
  uploadAvatar = () => {
    // 拿到文件信息
    const img = this.uploadElemt.files[0];
    if (img.type === "image/jpeg" || img.type === "image/png") {
      const { user } = this.state;
      // 封装表单数据
      const formData = new FormData();
      formData.append("avatar", img);
      formData.append("uid",user.uid);
      console.log(img);
      // 发送请求
      request({
        url: "/user/upload/profile",
        method: "post",
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
      }).then((result) => {
        console.log(result.data);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      alert("请选择jpg或者png格式的图片~");
    }
  }
  // 退出登录
  backLogin = () => {
    setTimeout(() => {
      if (confirm("确定要退出吗?")) {
        // 清除本地sessionStorage,设置本地存储密码为空
        const account = JSON.parse(window.sessionStorage.getItem("user_info")).account;
        window.localStorage.setItem("user_login", JSON.stringify({ account, password: "" }));
        window.sessionStorage.clear();
        window.location.reload(); // 刷新页面
      } else {
        // 取消
      }
    }, 200);
  }
  // 打开模态框
  openUploadPopup() {
    this.setState({
      showPopup: true
    })
  }
  render() {
    const { user } = this.state; // 用户信息
    return (
      <div>
        <div className={style.container}>
          {/* 展示用户名和头像 */}
          <div className={style.showInfo}>
            {/* 头像上传 */}
            <span onTouchEnd={this.HandleUpload}>
              <input type="file" ref={c => { this.uploadElemt = c }} onChange={this.uploadAvatar} />
            </span>
            <img src={avatarUrl} alt="" onTouchEnd={this.HandleAvatar} />
            <span>{user.user_name === "" ? user.account : user.user_name}</span>
          </div>
          <ul className={style.recordList}>
            <li>
              {111}
              <label>喜欢</label>
            </li>
            <li>
              {222}
              <label>共发消息</label>
            </li>
            <li>
              {333}
              <label>点赞</label>
            </li>
          </ul>
          <ul className={style.menuList}>
            <li><span></span>设置昵称</li>
            <li><span></span>编辑资料</li>
            <li><span></span>设置背景</li>
            <li><span></span>修改密码</li>
          </ul>
          <button className={style.backLogin} onTouchEnd={this.backLogin}>退出登录</button>
        </div>
      </div>
    )
  }
}
