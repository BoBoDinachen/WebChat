import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import style from './index.module.scss'
import { connect } from 'react-redux';
import { baseImgURL, request } from '../../utils/request'
import Confirm from '../../components/ConfirmBox/index'
import Toast from '../../components/ToastBox/Toast'
import Spin from '../../components/Spin/index'
import { formatTime } from '../../utils/base'
import EmojiPackage from '../../components/EmojiPackage/index';
import ChatInfoBox from '../../components/ChatInfoBox/index'
import {
  createSendMessageAction,
  createInitMessageAction,
  createClearMessageAction
} from '../../redux/action/chat_action'

function PrivateChat(props) {
  const [showMenus, setShowMenus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMeme, setShowMeme] = useState(false);
  const listBoxElem = useRef(null);
  const contentBox = useRef(null);
  const { fid,uid, friend_name, uname } = props.location.state;
  const { _id, user_name } = JSON.parse(sessionStorage["user_info"]);
  useEffect(() => {
    // 加载聊天信息
    loadChatData();
    return () => {
      props.clearMessage();
    }
  }, [])

  // 每当数据发生变化的时候调用
  useEffect(() => {
    return () => {
      // 等到数据加载完成之后，滚动到底部
      setTimeout(() => {
        scrollToBottom();
      }, 10);
    }
  }, [props.chatInfo])
  function loadChatData() {
    // 根据用户id加载对应的聊天信息,请求后端
    request({
      url: "/user/getMessages",
      method: "get",
      params: {
        "uid": uid,
        "fid": fid
      }
    }).then((res) => {
      console.log(res.data);
      if (res.data.success) {
        // 从store中加载聊天信息
        props.initMessage({
          "messages": res.data.data, "callback": () => {
            setIsLoading(false);
          }
        });
      } else {
        Toast({
          type: "warning",
          time: 1000,
          text: "消息记录为空..."
        })
      }
      if (res.data.data) {
        if (res.data.data.length === 0) {
          Toast({
            type: "warning",
            time: 1000,
            text: "消息记录为空..."
          })
        }
      }
    })
  }
  // 菜单按钮1  清除聊天消息记录
  function handleMenu1() {
    setTimeout(() => {
      Confirm.open({
        title: "清除", content: "确定要清除聊天记录吗", hanleConfirm: () => {
          // 发送清除消息请求
          request({
            url: "/user/clearMessages",
            method: "get",
            params: {
              uid,
              fid,
            }
          }).then((res) => {
            console.log(res);
            if (res.data.success === true) {
              setShowMenus(false);
              props.clearMessage(); //清除消息记录
              Toast({ type: "success", time: "2000", text: "清除成功..." })
            }
          })
        }
      });
    }, 200);
  }
  // 返回
  function handleBack() {
    setTimeout(() => {
      props.history.push("/friends");
    }, 100)
  }
  // 滚动条到底部的方法
  function scrollToBottom() {
    if (listBoxElem.current) {
      const scrollHeight = listBoxElem.current.scrollHeight;
      const height = listBoxElem.current.clientHeight;
      const maxScrollTop = scrollHeight - (height);
      listBoxElem.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }
  // 发送信息
  function sendInfo() {
    // 获取输入框的内容、本地用户信息，路由中的用户id
    const content = contentBox.current.innerHTML;
    // 改变store状态
    props.sendMessage({
      uid: _id,  //用户id
      receiver_uid: fid,
      receiver_name: friend_name,
      uname: user_name,
      message: content === "" ? "emmm..." : content, // 信息
      time: formatTime(new Date(), "yyyy/MM/dd HH:mm"), //  时间
      status: "1" // 0-发送者   1-接受者
    });
    contentBox.current.innerHTML = "";
  }
  return (
    <div className={style.container} >
      {/* 顶部栏 */}
      <div className={style.topBar}>
        <span className={style.close} onTouchEnd={handleBack}></span>
        {friend_name}
        <span className={style.iconMore} onClick={() => { setShowMenus(true) }}></span>
        {/* 顶部菜单栏 */}
        <ul className={`${style.floatMenus} ${showMenus ? '' : style.menusHide}`}>
          <li onClick={handleMenu1}>清除消息记录</li>
          <li onClick={() => { Toast({ type: "warning", text: "功能待开发...", time: 1500 }) }}>特别关心</li>
          <li onClick={() => { Toast({ type: "warning", text: "功能待开发...", time: 1500 }) }}>聊天背景</li>
        </ul>
      </div>
      <ul className={style.messageList} ref={listBoxElem} onClick={() => { setShowMenus(false) }}>
        {/* 消息框和加载组件 */}
        <Spin loading={isLoading}></Spin>
        {
          props.chatInfo.map((item, index) => {
            // if (this.messageBox !== undefined && this.messageBox !== null) {
            //   let boxHeight = this.messageBox.clientHeight;
            //   // console.log("消息盒子高度:" + boxHeight);
            //   // 设置每个盒子的margin-bottom
            //   this.listBox.style.marginBottom = boxHeight+10+"px";
            // }
            if (item.uid === fid || item.uid === _id) {
              return (
                <li className={item.status === "1" ? style.rightMessageBox : style.leftMessageBox} key={index}>
                  {/* <img src="https://www.keaidian.com/uploads/allimg/190415/15110727_19.jpg"></img> */}
                  {
                    item.status === "1" ?
                      <>
                        <div className={style.infoBox}>
                          <label>
                            <span>{item.time}</span>
                            <span>{uname}</span>
                          </label>
                          <ChatInfoBox message={item.message}></ChatInfoBox>
                        </div>
                        <img src={baseImgURL + "/user/avatar?uid=" + item.uid} alt="" />
                      </>
                      :
                      <>
                        <img src={baseImgURL + "/user/avatar?uid=" +fid} alt="" />
                        <div className={style.infoBox}>
                          <label>
                            <span>{friend_name}</span>
                            <span>{item.time}</span>
                          </label>
                          <ChatInfoBox message={item.message}></ChatInfoBox>
                        </div>
                      </>
                  }
                </li>
              )
            }
          })
        }
        {/* <li className={style.rightMessageBox}>
            <img src="https://img2.woyaogexing.com/2018/08/08/1eb8ede3f2a666c5!400x400_big.jpg"></img>
            <div>
              <label><span>小喵酱</span>2021/5/16</label>
              <div>你也好呀,很高兴认识你~</div>
            </div>
          </li> */}
      </ul>
      {/* 底部栏 */}
      <div className={style.bottomBar}>
        <span onClick={() => { Toast({ type: "warning", text: "功能待开发...", time: 1500 }) }}></span>
        <div contentEditable className={style.inputBox} ref={contentBox} onClick={() => { setShowMeme(false)}}></div>
        {/* <input type="text" ref={c => { this.inputElem = c }} placeholder="和ta聊聊吧~" /> */}
        <span onClick={() => {setShowMeme(showMeme => !showMeme)}}></span>
        <button onTouchEnd={sendInfo}>发送</button>
        <EmojiPackage show={showMeme} inputBox={contentBox}></EmojiPackage>
      </div>
    </div>
  )
}
export default withRouter(
  connect(
    // 映射reducer中的state
    state => ({
      chatInfo: state.chatInfo
    }),
    // 映射action中的方法，自动调用dispatch
    {
      sendMessage: createSendMessageAction,
      initMessage: createInitMessageAction,
      clearMessage: createClearMessageAction
    }
  )(PrivateChat)
);