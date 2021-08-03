import React, { Component } from 'react'
import { adaptionContainerHeight } from '../../utils/dom_utils';
import style from './index.module.scss'
import avatarUrl from '../../assets/img/默认头像.png'
import SexMan_url from '../../assets/img/性别男.png';
import SexWoman_url from '../../assets/img/性别女.png';
import PopupBox from '../../components/PopupBox'
import Button from '../../components/Button'
import MessageBox from '../../components/MessageBox'
import { request } from '../../utils/request'
import socketIO from '../../utils/socket'
import confirm from '../../components/ConfirmBox/index'
export default class Profile extends Component {
  // 组件状态
  userInfo = JSON.parse(sessionStorage.getItem("user_info"));
  state = {
    user: {
      uid: this.userInfo._id,
      account: this.userInfo.account,
      user_name: this.userInfo.user_name,
      age: this.userInfo.age,
      sex: this.userInfo.sex,
      avatar_url: this.userInfo.avatar_url,
      signature: this.userInfo.signature
    },
    // 模态框是否关闭
    showSetName: false,
    showMessageSetAvatar: false,
    showMessageSetName: false,
    showEditProfile: false,
    showMessageEditProfile: false
  }
  // 组件state更新的时候
  componentDidUpdate(prevProps, prevState) {
    console.log("Profile组件更新...");
    const { user } = this.state; // 用户信息
    // console.log("原来的头像", prevState);
    // console.log("现在的头像",user.avatar_url);
    // console.log(user);
    if (user.avatar_url !== "") {
      // 获取新头像
      this.getAvatar(user.uid);
    }
  }
  // 组件加载
  componentDidMount() {
    adaptionContainerHeight(this.containerBox);
    // 组件加载的时候，获取用户信息和头像
    const user_info = JSON.parse(window.sessionStorage.getItem("user_info"));
    if (user_info.avatar_url !== "") {
      this.setState({
        user: {
          uid: user_info._id,
          account: user_info.account,
          user_name: user_info.user_name,
          age: user_info.age,
          sex: user_info.sex,
          avatar_url: user_info.avatar_url,
          signature: user_info.signature
        }
      })
    } else {
      // 默认头像
      this.setState({
        user: {
          uid: user_info._id,
          account: user_info.account,
          user_name: user_info.user_name,
          age: user_info.age,
          sex: user_info.sex,
          avatar_url: "",
          signature: user_info.signature
        }
      }, () => {
        this.avatarElem.src = avatarUrl;
      })
    }
  }
  // 触摸头像
  HandleAvatar = () => {
    alert("喵呜~");
  }
  // 获取头像
  getAvatar(uid) {
    // 发送设置用户请求
    request({
      url: "/user/avatar",
      method: "get",
      params: {
        uid
      },
      responseType: "blob"
    }).then((res) => {
      // 创建头像的url
      const avatar_url = window.URL.createObjectURL(res.data);
      // 设置头像
      this.avatarElem.src = avatar_url;
    }).catch(err => {
      console.log(err);
    })
  }
  // 上传头像
  uploadAvatar = () => {
    // 拿到文件信息
    const img = this.uploadElem.files[0];
    console.log(img);
    // 限制头像的大小小于2MB以下
    if ((img.type === "image/jpeg" || img.type === "image/png") && img.size <= 2000000) {
      const { user } = this.state;
      // console.log(user);
      // 封装表单数据
      const formData = new FormData();
      formData.append("avatar", img);
      formData.append("uid", user.uid);
      // 确认框
      if (confirm("确定选择这张头像吗")) {
        // 发送请求
        request({
          url: "/user/upload/profile",
          method: "post",
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData
        }).then((result) => {
          // 上传成功
          console.log(result.data);
          if (result.data.setAvatar) {
            this.openMessageSetAvatarBox();
            // 更新sessionStorage
            let user_info = JSON.parse(window.sessionStorage.getItem("user_info"));
            user_info.avatar_url = result.data.url;
            window.sessionStorage.setItem("user_info", JSON.stringify(user_info));
            // 更新state
            setTimeout(() => {
              this.setState({
                user: {
                  uid: user_info._id,
                  account: user_info.account,
                  user_name: user_info.user_name,
                  age: user_info.age,
                  sex: user_info.sex,
                  avatar_url: result.data.url,
                  signature: user_info.signature
                }
              })
            }, 500);
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    } else {
      alert("请选择jpg或者png格式的图片,并且不大于2MB噢~");
    }
  }

  // 设置用户名
  setUserName = () => {
    // 获取输入框内容
    const inputValue = this.inputNameElem.value;
    if (inputValue === "") {
      alert("没有输入~");
    } else {
      // 发送请求
      request({
        url: "/user/profile/setName",
        method: "post",
        data: {
          uid: this.state.user.uid,
          user_name: inputValue
        }
      }).then((res) => {
        const { isSet, user_name } = res.data;
        // 如果设置成功,更新state和sessionStorage
        if (isSet) {
          // 关闭模态框,打开消息框
          this.openMessageSetNameBox();
          const { userInfo } = this;
          // const user_info = JSON.parse(window.sessionStorage.getItem("user_info"));
          userInfo.user_name = user_name;
          window.sessionStorage.setItem("user_info", JSON.stringify(userInfo));
          // 更新state
          this.setState({
            user: {
              uid: userInfo._id,
              account: userInfo.account,
              user_name: user_name,
              age: userInfo.age,
              sex: userInfo.sex,
              avatar_url: userInfo.avatar_url,
              signature: userInfo.signature
            }
          })
        } else {
          alert("设置失败!");
        }
      }).catch((err) => {
        console.log(err);
      })
    }

  }

  // 保存用户资料
  saveProfile = () => {
    // 获取修改资料框里面的值
    const age = this.inputAgeElem.value;
    const sex = this.radioSexElem.value;
    const signature = this.textareaElem.value;
    console.log(age, sex, signature);
    // 判断年龄是否为空
    if (age === "") {
      alert("你还没有设置年龄")
    } else {
      // 发起请求
      request({
        url: "/user/updateProfile",
        method: "post",
        data: {
          "uid": this.state.user.uid,
          sex,
          age,
          signature
        }
      }).then((res) => {
        const { isUpdate } = res.data;
        console.log(res.data);
        if (isUpdate) {
          // 如果设置成功，则刷新sessionstorage和打开消息框
          const { userInfo } = this;
          userInfo.age = age;
          userInfo.sex = sex;
          userInfo.signature = signature;
          window.sessionStorage.setItem("user_info", JSON.stringify(userInfo));
          // 更新state
          this.setState({
            user: {
              uid: userInfo._id,
              account: userInfo.account,
              user_name: userInfo.user_name,
              age: age,
              sex: sex,
              avatar_url: userInfo.avatar_url,
              signature: signature
            }
          })
          this.openMessageEditProfile();
        }
      })
    }
  }
  // 退出登录
  backLogin = () => {
    const { _id, account } = this.userInfo;
    setTimeout(() => {
      confirm.open({
        title: "退出登录",
        content: "确定要退出登录吗?",
        hanleConfirm: () => {
          // 清除本地sessionStorage,设置本地存储密码为空
          socketIO.closeSocket(_id); //断开socket连接
          window.localStorage.setItem("user_login", JSON.stringify({ _id, account, password: "" }));
          window.sessionStorage.clear(); // 清除session
          window.location.reload(); // 刷新页面
        }
      })
    }, 200);
  }

  // 打开设置昵称模态框
  openPopup = () => {
    setTimeout(() => {
      this.setState({
        showSetName: true,
        showMessageSetAvatar: false,
        showMessageSetName: false,
        showEditProfile: false,
        showMessageEditProfile: false,
      })
    }, 200)
  }

  // 打开编辑资料模态框
  openPopupEditProfile = () => {
    setTimeout(() => {
      this.setState({
        showSetName: false,
        showMessageSetAvatar: false,
        showMessageSetName: false,
        showEditProfile: true,
        showMessageEditProfile: false,
      })
    }, 200)
  }
  // 打开消息框设置头像
  openMessageSetAvatarBox() {
    this.setState({
      showSetName: false,
      showMessageSetName: false,
      showMessageSetAvatar: true,
      showEditProfile: false,
      showMessageEditProfile: false
    })
  }
  // 打开消息框设置用户名
  openMessageSetNameBox() {
    this.setState({
      showSetName: false,
      showMessageSetAvatar: false,
      showMessageSetName: true,
      showEditProfile: false,
      showMessageEditProfile: false
    })
  }
  // 打开消息框编辑用户资料
  openMessageEditProfile() {
    this.setState({
      showSetName: false,
      showMessageSetAvatar: false,
      showMessageSetName: false,
      showEditProfile: false,
      showMessageEditProfile: true
    })
  }
  render() {
    const { user } = this.state; // 用户信息
    // 设置用户昵称的弹窗
    const SetNameBox = PopupBox(
      <>
        <input ref={c => { this.inputNameElem = c }} type="text" className={style.input_box} placeholder="给自己取个新名字吧..." />
        <Button type="success" click={this.setUserName}>确定修改</Button>
      </>
    );
    // 编辑用户资料
    const EditProfile = PopupBox(
      <>
        <div className={style.age_box}>
          <label>设置年龄:</label>
          <input ref={c => { this.inputAgeElem = c }} type="number" className={style.input_box_age} placeholder="输入年龄..." defaultValue={user.age} />
        </div>
        <div className={style.radio_box}>
          选择性别:
          <label>
            <input ref={c => { this.radioSexElem = c }} type="radio" name="sex" defaultChecked={this.state.user.sex === "男"} onChange={(e) => { console.log("11111"); this.radioSexElem.value = "男" }} />&nbsp;男
          </label>
          <label>
            <input ref={c => { this.radioSexElem = c }} type="radio" name="sex" defaultChecked={this.state.user.sex === "女"} onChange={(e) => { console.log("22222"); this.radioSexElem.value = "女" }} />&nbsp;女
          </label>
        </div>
        <textarea ref={c => { this.textareaElem = c }} defaultValue={this.userInfo.signature} name="signature" id="" className={style.textarea_box} placeholder="这里输入你的个性签名..."></textarea>
        <Button type="success" click={this.saveProfile}>保存</Button>
      </>
    )
    return (
      <div className={style.container} ref={(c) => { this.containerBox = c }}>
        <MessageBox time="1500" text="头像设置成功..." type="success" isShow={this.state.showMessageSetAvatar}></MessageBox>
        <MessageBox time="1500" text="设置昵称成功..." type="success" isShow={this.state.showMessageSetName}></MessageBox>
        <MessageBox time="1500" text="保存资料成功..." type="success" isShow={this.state.showMessageEditProfile}></MessageBox>
        <SetNameBox showPopup={this.state.showSetName} />
        <EditProfile showPopup={this.state.showEditProfile} />
        <div className={style.containerInfo}>
          {/* 展示用户名和头像 */}
          <div className={style.showInfo}>
            {/* 头像上传 */}
            <span onTouchEnd={this.HandleUpload}>
              <input type="file" ref={c => { this.uploadElem = c }} onChange={this.uploadAvatar} />
            </span>
            {/* 头像图片 */}
            <img ref={c => { this.avatarElem = c }} alt="" onTouchEnd={this.HandleAvatar} />
            <span>{user.user_name === "" ? user.account : user.user_name}</span>
            <label><img src={user.sex === "男" ? SexMan_url : SexWoman_url}></img> {user.age}岁</label>
            <span>{user.signature === "" ? "在编辑资料里面设置自己的签名吧" : user.signature}</span>
          </div>
          {/* 显示用户的记录 */}
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
          {/*菜单项  */}
          <ul className={style.menuList}>
            <li onClick={this.openPopup}><span></span>设置昵称</li>
            <li onClick={this.openPopupEditProfile}><span></span>编辑资料</li>
            <li><span></span>设置背景</li>
            <li><span></span>修改密码</li>
          </ul>
          <button className={style.backLogin} onTouchEnd={this.backLogin}>退出登录</button>
        </div>
      </div>
    )
  }
}
