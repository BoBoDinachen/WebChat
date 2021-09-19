import React, { useState, useRef, useEffect } from 'react'
import style from './index.module.scss';
import { withRouter } from 'react-router-dom'
import confirm from '../../components/ConfirmBox/index'
import toast from '../../components/ToastBox/Toast'
import { request } from '../../utils/request'
import socketIO from '../../utils/socket'
function UpdatePassword(props) {
  const [showPwd, setShowPwd] = useState(false)
  const inputPwdOld = useRef(null);
  const inputNewPwd = useRef(null);
  const inputConfirmPwd = useRef(null);
  const oldPwd = JSON.parse(sessionStorage['user_info']).password;

  useEffect(() => {
    if (showPwd) {
      inputPwdOld.current.type = "text";
    } else {
      inputPwdOld.current.type = "password";
    }
  }, [showPwd])

  // 点击确认
  function handleConfirm() {
    // 判断两次密码是否一致
    if (inputNewPwd.current.value === inputConfirmPwd.current.value) {
      inputConfirmPwd.current.style.border = ""
      confirm.open({
        title: "确定修改吗?",
        content: "修改密码成功后，会进入登录页面，请重新登录！",
        hanleConfirm: () => {
          request({
            url: "/user/updatePassword",
            method: "post",
            data: {
              uid: JSON.parse(sessionStorage['user_info'])._id,
              pwd: inputConfirmPwd.current.value,
            }
          }).then((res) => {
            console.log(res);
            if (res.data.isUpdate) {
              toast({
                type: "success",
                text: "修改成功~",
                time: 1000
              })
              props.history.push("/profile");
              let user = JSON.parse(sessionStorage['user_info']);
              // 清除本地sessionStorage,设置本地存储密码为空
              socketIO.closeSocket(user._id); //断开socket连接
              window.localStorage.setItem("user_login", JSON.stringify({_id:user._id, account:user.account, password: "" }));
              window.sessionStorage.clear(); // 清除session
              window.location.reload(); // 刷新页面
            }
          }, (err) => {
            console.log(err);
          })
        }
      })
    } else {
      toast({
        type: "warning",
        text: "两次密码不一致~",
        time: 1000
      })
      inputConfirmPwd.current.style.border = "1px solid #FF6666"
    }

  }
  return (
    <div className={style.container}>
      <div className={style.titleBar}>
        <span onClick={() => { props.history.goBack() }}>
          返回
        </span>
        <h3>设置您的密码</h3>
      </div>
      <div className={style.formBox}>
        <div>
          <label>原来的密码</label>
          <div>
            <input type="password" ref={inputPwdOld} defaultValue={oldPwd} />
            <svg className="icon" aria-hidden="true" onClick={() => { setShowPwd(!showPwd); }}>
              <use xlinkHref={showPwd ? '#icon-yanjing' : '#icon-yanjing1'} ></use>
            </svg>
          </div>
        </div>
        <div>
          <label>新的密码</label>
          <div>
            <input type="password" ref={inputNewPwd} />
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-mima"></use>
            </svg>
          </div>
        </div>
        <div>
          <label>确认密码</label>
          <div>
            <input type="password" ref={inputConfirmPwd} />
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-mima"></use>
            </svg>
          </div>
        </div>
      </div>
      <button onClick={handleConfirm}>确定</button>
    </div>
  )
}

export default withRouter(UpdatePassword)
