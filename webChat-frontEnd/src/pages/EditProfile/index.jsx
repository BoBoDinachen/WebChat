import React, { useEffect, useRef, useState } from 'react'
import style from './index.module.scss'
import { withRouter } from 'react-router-dom';

import { request } from '../../utils/request'
import Toast from '../../components/ToastBox/Toast';
function EditProfile(props) {
  const containerBox = useRef();
  const inputName = useRef();
  const inputAge = useRef();
  const inputTextArea = useRef();

  const [activeSex, setActiveSex] = useState('');
  const [userInfo, setUserInfo] = useState({}); //用户信息

  useEffect(() => {
    // 加载用户信息
    request({
      url: "/user/profile",
      method: "get",
      params: {
        uid: JSON.parse(sessionStorage['user_info'])._id
      }
    }).then((res) => {
      // console.log(res.data);
      let user = res.data.data;
      setActiveSex(user.sex);
      setUserInfo(user);
    }, (err) => {
      console.log(err);
    })
  }, [])
  // 保存用户资料
  function saveProfile() {
    let uname = inputName.current.value;
    let age = inputAge.current.value;
    let signature = inputTextArea.current.value;
    request({
      url: "/user/updateProfile",
      method: "post",
      data: {
        uid: JSON.parse(sessionStorage['user_info'])._id,
        uname,
        age,
        signature,
        sex: activeSex
      }
    }).then((res) => {
      console.log(res.data);
      if (res.data.isUpdate) {
        Toast({
          type: "success",
          text: "保存成功",
          time: 1000
        })
        props.history.updateProfile();
        props.history.goBack();
      }
    }, (err) => {
      console.log(err);
    })
  }
  return (
    <div className={style.container} ref={containerBox}>
      <div className={style.titleBar}>
        <span onClick={() => { props.history.goBack() }}>
          返回
        </span>
        <h3>编辑个人资料</h3>
      </div>
      <div className={style.formBox}>
        <div>
          <label>昵称</label>
          <input ref={inputName} type="text" placeholder="尊姓大名" defaultValue={userInfo.user_name} />
        </div>
        <div>
          <label>年龄</label>
          <input ref={inputAge} type="text" placeholder="输入你的年龄" defaultValue={userInfo.age} />
        </div>
        <div>
          <label>个性签名</label>
          <textarea ref={inputTextArea} defaultValue={userInfo.signature}>

          </textarea>
        </div>
        <div>
          <label>性别</label>
          <ul>
            <li className={activeSex === '男' ? style.activeItem : ''} onClick={() => { setActiveSex('男') }}>男</li>
            <li className={activeSex === '女' ? style.activeItem : ''} onClick={() => { setActiveSex('女') }}>女</li>
          </ul>
        </div>
        <button onClick={saveProfile}>保存</button>
      </div>
    </div>
  )
}
export default withRouter(EditProfile);