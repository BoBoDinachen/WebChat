import React, { useEffect, useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'
import style from './index.module.scss'
import { formatTime} from '../../utils/base'
import socketIO from '../../utils/socket';
function WorldChat(props) {
  const listBoxElem = useRef(null);
  const inputElem = useRef(null);
  const [menusStatus, setMenusStatus] = useState(false);
  useEffect(() => {

    return () => {

    }
  }, [])
  // 点击发送
  function handleSend() {
    socketIO.sendWorldMessage({
      uid: JSON.parse(sessionStorage['user_info'])._id,
      uname: JSON.parse(sessionStorage['user_info']).user_name,
      time: formatTime(new Date(),"yyyy/MM/dd HH:mm"),
      message: "HelloWorld"
    })
  }
  return (
    <div className={style.container}>
      {/* 顶部栏 */}
      <div className={style.topBar}>
        <span className={style.close} onClick={() => { props.history.replace("/home/world") }}></span>
        世界频道
        <span className={style.iconMore} onClick={() => { setMenusStatus(menusStatus => !menusStatus) }}></span>
        {/* 顶部菜单栏 */}
        <ul className={`${menusStatus ? style.floatMenus : style.menusHide}`}>
          <li>更换聊天背景</li>
          <li>发送弹幕</li>
          <li>匿名聊天</li>
        </ul>
      </div>
      <ul className={style.messageList} ref={listBoxElem} onClick={() => { setMenusStatus(false) }}>
        {/* 消息框 */}
        <li className={style.leftMessageBox}>
          <img src="https://img2.woyaogexing.com/2018/08/08/1eb8ede3f2a666c5!400x400_big.jpg" alt="" />
          <div className={style.infoBox}>
            <label>
              <span>小柚酱</span>
              <span>2021/9/15 23:00</span>
            </label>
            <div>晚上好呀</div>
          </div>
        </li>
      </ul>
      {/* 底部栏 */}
      <div className={style.bottomBar}>
        <span></span>
        <input type="text" ref={inputElem} placeholder="和ta聊聊吧~" />
        <span></span>
        <span onClick={handleSend}></span>
      </div>
    </div>
  )
}

export default withRouter(WorldChat);
