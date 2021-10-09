import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import style from './index.module.scss'
import { baseImgURL } from '../../utils/request'
import { formatTime } from '../../utils/base'
import confirm from '../../components/ConfirmBox/index';
import { createClearWorldMessageAction, createSendWorldMessageAction } from '../../redux/action/world_action';
import Toast from '../../components/ToastBox/Toast';
import EmojiPackage from '../../components/EmojiPackage/index';
import ChatInfoBox from '../../components/ChatInfoBox/index'

function WorldChat(props) {
  const { _id, user_name } = JSON.parse(sessionStorage['user_info']);
  const listBoxElem = useRef(null);
  const contentBox = useRef(null);
  const [menusStatus, setMenusStatus] = useState(false);
  const [showMeme, setShowMeme] = useState(false);
  // 加载世界信息
  useEffect(() => {
    // 只会第一次执行
    return () => {
      
    }
  }, [])
  useEffect(() => {
    // 刷新世界信息
    // console.log("刷新世界信息列表:", props.worldInfo);
    // 消息滑倒底部
    scrollToBottom();
    return () => {

    }
  }, [props.worldInfo])
  // 点击发送
  function handleSend() {
    let content = contentBox.current.innerHTML;
    props.sendWorldInfo({
      message: {
        uid: _id,
        uname: user_name,
        time: formatTime(new Date(), "yyyy/MM/dd HH:mm"),
        message: content === "" ? 'emm...' : content
      },
      callback: () => {
        contentBox.current.innerHTML = "";
      }
    })
  }
  // 清除消息
  function clearMessages() {
    confirm.open({
      title: "确定要清除吗?",
      content: "清除当前显示的世界消息",
      hanleConfirm: () => {
        props.clearWorldInfo({
          callback: () => {
            // 关闭菜单栏,提示
            setMenusStatus(false);
            Toast({
              type: "success",
              text: "清除成功~",
              time: 1000
            })
          }
        });
      }
    })
  }
  // 滚动条到底部的方法
  function scrollToBottom() {
    if (listBoxElem) {
      const scrollHeight = listBoxElem.current.scrollHeight;
      const height = listBoxElem.current.clientHeight;
      const maxScrollTop = scrollHeight - (height);
      listBoxElem.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
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
          <li onClick={() => { Toast({type:"warning",text:"功能待开发...",time:1500})}}>更换聊天背景</li>
          <li onClick={clearMessages}>清除消息</li>
          <li onClick={() => { Toast({type:"warning",text:"功能待开发...",time:1500})}}>发送弹幕</li>
          <li onClick={() => { Toast({type:"warning",text:"功能待开发...",time:1500})}}>匿名聊天</li>
        </ul>
      </div>
      <ul className={style.messageList} ref={listBoxElem} onClick={() => { setMenusStatus(false);setShowMeme(false) }}>
        {/* 消息列表 */}
        {
          props.worldInfo.map((item, index) => {
            return (
              <li className={item.uid === _id ? style.rightMessageBox : style.leftMessageBox} key={index} >
                {
                  item.uid === _id ?
                    <>
                      <div className={style.infoBox}>
                        <label>
                          <span>{item.time}</span>
                          <span>{item.uname}</span>
                        </label>
                        <ChatInfoBox message={item.message}></ChatInfoBox>
                      </div>
                      < img src={baseImgURL + "/user/avatar?uid=" + item.uid} alt="" />
                    </>
                    :
                    <>
                      < img src={baseImgURL + "/user/avatar?uid=" + item.uid} alt="" />
                      <div className={style.infoBox}>
                        <label>
                          <span>{item.uname}</span>
                          <span>{item.time}</span>
                        </label>
                        <ChatInfoBox message={item.message}></ChatInfoBox>
                        {/* <div>{item.message}</div> */}
                      </div>
                    </>
                }
              </li>
            )
          })
        }
      </ul>
      {/* 底部栏 */}
      <div className={style.bottomBar}>
        <span onClick={() => { Toast({ type: "warning", text: "功能待开发...", time: 1500 }) }}></span>
        <div contentEditable className={style.inputBox} ref={contentBox} onClick={() => { setShowMeme(false)}}></div>
        <span onClick={() => { setTimeout(() => {setShowMeme(!showMeme)},100)}}></span>
        <button onClick={handleSend}>发送</button>
        <EmojiPackage show={showMeme} inputBox={contentBox}></EmojiPackage>
      </div>
    </div >
  )
}

export default withRouter(connect(
  // 映射reducer中的state
  state => ({
    worldInfo: state.worldInfo
  }),
  // 映射action中的方法，自动调用dispatch
  {
    sendWorldInfo: createSendWorldMessageAction,
    clearWorldInfo: createClearWorldMessageAction,
  }
)(WorldChat));
