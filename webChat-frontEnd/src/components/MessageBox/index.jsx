import React, { useEffect,useRef } from 'react'
import style from './index.module.scss';

import {avatarUrl} from '../../utils/request'
function MessageBox(props) {
  const messageBox = useRef(null)
  useEffect(() => {
    // 让盒子往下滑;
    console.log(props);
    messageBox.current.style.top = "5px";
    const timer = setTimeout(() => {
      messageBox.current.style.top = "-94px";
    }, 2500);
    return () => {
      clearTimeout(timer);
    }
  }, [])
  // 点击关闭
  function handleColse() {
    messageBox.current.style.top = "-95px";
  }
  return (
    <div className={style.container} ref={messageBox}>
      <div className={style.topBar}>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-xiaoxi1"></use>
        </svg>
        <label>{props.title}</label>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-a-tishi"></use>
        </svg>
      </div>
      <div className={style.messageBox}>
        <img src={avatarUrl+'?uid='+props.uid} alt="" />
        <span>{props.uname}: {props.content}~</span>
      </div>
      <svg className={`icon ${style.colse}`} aria-hidden="true" onClick={handleColse}>
        <use xlinkHref="#icon-guanbi"></use>
      </svg>
    </div>
  )
}

export default MessageBox
