import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { adaptionContainerHeight } from '../../utils/dom_utils';
import style from './index.module.scss'
import Toast from '../../components/ToastBox/Toast'
import { request, avatarUrl } from '../../utils/request'
import socketIO from '../../utils/socket'
import confirm from '../../components/ConfirmBox/index'
import EditProfile from '../EditProfile/index'
import UpdatePassword from '../UpdatePassword/index'
class Profile extends Component {
  // 组件状态
  userInfo = JSON.parse(sessionStorage.getItem("user_info"));
  state = {
    isUpdate: false,
    user: {
      uid: this.userInfo._id,
      // account: this.userInfo.account,
      // user_name: this.userInfo.user_name,
      // age: this.userInfo.age,
      // sex: this.userInfo.sex,
      // avatar_url: this.userInfo.avatar_url,
      // signature: this.userInfo.signature
    },
    likeList: [],
    followList: [],
    messageTotal: []
  }
  // 组件state更新的时候
  componentDidUpdate(prevProps, prevState) {
    console.log("Profile组件更新...");
    // this.getUserInfo();
    const { user } = this.state; // 用户信息
    if (user.avatar_url !== "") {
      // 获取新头像
      console.log(user);
      this.getAvatar(user.uid);
    }
  }
  // 组件加载
  componentDidMount() {
    console.log("组件加载");
    adaptionContainerHeight(this.containerBox);
    // 组件加载的时候,初始化信息
    this.initializeInfo();
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

  // 初始化信息
  initializeInfo = () => {
    Promise.all([this.getUserInfo(), this.getLikeList(), this.getMessageTotal()]).then((results) => {
      results.forEach((res) => {
        console.log(res);
      })
    })
  }
  // 加载用户信息
  getUserInfo() {
    return new Promise((resolve, reject) => {
      // 加载用户的基本信息
      request({
        url: "/user/profile",
        method: "get",
        params: {
          uid: this.userInfo._id
        }
      }).then((res) => {
        // console.log(res.data.data);
        let user_info = res.data.data;
        console.log("用户信息", user_info);
        if (user_info) {
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
          }, () => {
            resolve("基本信息加载完成...")
            //更新sessionStorage
            sessionStorage.setItem('user_info', JSON.stringify(user_info));
          })
        }
      }, (err) => {
        reject(err);
      })
    })
  }
  // 加载喜欢与被喜欢
  getLikeList() {
    return new Promise((resolve, reject) => {
      // 加载喜欢与被喜欢的人数
      request({
        url: "/user/getLikeNumbers",
        method: "get",
        params: {
          uid: this.userInfo._id
        }
      }).then((res) => {
        if (res.data.success) {
          let result = res.data.data;
          // console.log(result);
          this.setState({
            likeList: result.likeList,
            followList: result.followList
          }, () => {
            resolve("加载喜欢与被喜欢列表完成...")
          })
        } else {
          this.setState({
            likeList: [],
            followList: []
          }, () => {
            resolve("加载喜欢与被喜欢列表完成...")
          })
        }
      }, (err) => {
        reject(err);
      })
    })
  }
  // 加载消息条数
  getMessageTotal() {
    return new Promise((resolve, reject) => {
      // 加载消息的条数
      request({
        url: "/user/getMessageTotal",
        method: "get",
        params: {
          uid: this.userInfo._id
        }
      }).then((res) => {
        // console.log(res);
        if (res.data.success) {
          this.setState({
            messageTotal: res.data.total
          }, () => {
            resolve("加载消息条数完成...")
          })
        } else {
          this.setState({
            messageTotal: res.data.total
          }, () => {
            resolve("加载消息条数完成...");
          })
        }
      }, (err) => {
        reject(err);
      })
    })
  }
  // 上传头像
  uploadAvatar = () => {
    // 拿到文件信息
    const img = this.uploadElem.files[0];
    // 限制头像的大小小于2MB以下
    if ((img.type === "image/jpeg" || img.type === "image/png") && img.size <= 2000000) {
      const { user } = this.state;
      // console.log(user);
      // 封装表单数据
      const formData = new FormData();
      formData.append("avatar", img);
      formData.append("uid", user.uid);
      // 确认框
      confirm.open({
        title: "更换头像",
        content: "确定选择这张头像吗?",
        hanleConfirm: () => {
          this.hiddenMenuBar();
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
              Toast({
                type: "success",
                text: "已更换头像",
                time: 1000
              })
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
      })
    } else {
      alert("请选择jpg或者png格式的图片,并且不大于2MB噢~");
    }
  }
  // 去编辑
  goToEdit = () => {
    this.props.history.push("/profile/edit")
    this.props.history['updateProfile'] = () => {
      this.getUserInfo();
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
  // 显示菜单栏
  showMenuBar = () => {
    this.menuBarElem.style.display = 'flex';
  }
  // 隐藏菜单栏
  hiddenMenuBar = () => {
    this.menuBarElem.style.display = 'none';
  }



  render() {
    const { user } = this.state; // 用户信息
    return (
      <div className={style.container} ref={(c) => { this.containerBox = c }}>

        {/* 菜单 */}
        <div className={style.menuButton}>
          <svg className='icon' aria-hidden="true" onClick={this.showMenuBar}>
            <use xlinkHref="#icon-caidan-2-xian"></use>
          </svg>
        </div>
        {/* 头像框和标签 */}
        <div className={style.avatarBox} onClick={this.hiddenMenuBar}>
          <img className={style.avatar} onClick={this.HandleAvatar} ref={(c) => { this.avatarElem = c }} src={`${avatarUrl}?uid=${user.uid}`} alt="" />
          <div className={style.tagList}>
            <div>
              <span>{this.state.likeList.length}</span>
              <span>我喜欢</span>
            </div>
            <div>
              <span>{this.state.followList.length}</span>
              <span>喜欢我</span>
            </div>
            <div>
              <span>{this.state.messageTotal}</span>
              <span>发消息</span>
            </div>
          </div>
        </div>
        {/* 个人资料 */}
        <div className={style.profileInfo} onClick={this.hiddenMenuBar}>
          <div className={style.infoBox}>
            <div className={style.info}>
              <span>{user.user_name}</span>
              <span>{user.account}</span>
              <span>{user.signature}</span>
            </div>
            <span className={style.editButton} onClick={this.goToEdit}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-bianji"></use>
              </svg>
              &nbsp;
              编辑资料
            </span>
          </div>
          <div className={style.infoTag}>
            <span>
              {/* <img src={user.sex === "男" ? SexMan_url : SexWoman_url} alt="" /> */}
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={user.sex === '女' ? '#icon-nv' : '#icon-nan1'}></use>
              </svg>
              {user.sex}
            </span>
            <span>{user.age}</span>
            <span>金牛座</span>
          </div>
        </div>
        {/* 弹出的菜单栏 */}
        <div className={style.menuBar} ref={(c) => { this.menuBarElem = c }}>
          <span>
            更换头像
            <input type="file" ref={(c) => { this.uploadElem = c }} onChange={this.uploadAvatar} />
          </span>
          <span onClick={() => { setTimeout(() => { this.props.history.push("/profile/updatePassword") }, 300) }}>
            修改密码
          </span>
          <span onClick={this.backLogin}>
            退出登录
          </span>
        </div>
        {/* 标题一 */}
        <label className={style.cardTitle}>我的系统</label>
        {/* 我的钱袋和我的任务 */}
        <div className={style.cardBox} onClick={this.hiddenMenuBar}>
          <div className={`${style.card} ${style.cardFirst}`} onClick={() => { Toast({type:"warning",text:"功能待开发...",time:1500})}}>
            <div>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-qiandai2"></use>
              </svg>
            </div>
            <div>
              <span>钱袋</span>
              <span>999金</span>
            </div>
          </div>
          <div className={`${style.card} ${style.cardSecond}`} onClick={() => { Toast({type:"warning",text:"功能待开发...",time:1500})}}>
            <div>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-renwu"></use>
              </svg>
            </div>
            <div>
              <span>任务</span>
              <span>0/10</span>
            </div>
          </div>
          <div className={`${style.card} ${style.cardThirdly}`} onClick={() => { Toast({type:"warning",text:"功能待开发...",time:1500})}}>
            <div>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-ziyuan"></use>
              </svg>
            </div>
            <div>
              <span>宠物</span>
              <span>v.100</span>
            </div>
          </div>
        </div>
        <Switch>
          <Route path="/profile/edit" component={EditProfile}></Route>
          <Route path="/profile/updatePassword" component={UpdatePassword}></Route>
        </Switch>
      </div>
    )
  }
}
export default withRouter(Profile);