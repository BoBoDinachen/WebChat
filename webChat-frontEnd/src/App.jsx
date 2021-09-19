import React, { useState, useEffect } from 'react'
import PrivateChat from './container/PrivateChat'
import WorldChat from './container/WorldChat'
import Footer from './components/Footer'
import Header from './components/Header';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import MessageList from './pages/Message'
import Home from './pages/Home'
import PopupMessage from './components/MessageBox/PopupMsg'
import toast from './components/ToastBox/Toast'
import socketIO from './utils/socket';
import { createAppendMessageAction } from './redux/action/chat_action'
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.css'
function App(props) {
  // 执行副作用操作
  useEffect(() => {
    
    // 组件加载和state更新
    const { _id, user_name } = JSON.parse(window.sessionStorage["user_info"]);
    // 创建socket连接
    const socket = socketIO.createSocket(_id, user_name);
    // 接收私聊信息
    socket.on("reply_private_chat", (data) => {
      props.appendMessage(data);
      console.log("接收到的聊天数据", data);
    })
    // 接收大世界的聊天信息
    socket.on("reply_world_chat", (data) => {
      console.log(data);
      const {uid,uname,message,time} = data;
      PopupMessage({
        title: "大世界消息",
        uid,
        uname,
        content:message
      })
    })
    // 接收申请信息
    socket.on("reply_friend_request", (data) => {
      toast({
        type: "success",
        text: "宁有一条好友申请噢~",
        time: 3000
      })
      console.log("收到好友申请", data);
    })
    // 接收申请结果
    socket.on("reply_request_result", (data) => {
      const { uid, fid, status } = data;
      if (status === 2) {
        toast({
          type: "success",
          text: "好友申请已通过~",
          time: 3000
        })
      } else if (status === 3) {
        toast({
          type: "warning",
          text: "好友申请被拒绝了~",
          time: 3000
        })
      }
      console.log("收到申请通知:", data);
    })
    return () => {
      // 当APP组件卸载前，将本地存储的用户信息清除
      // console.log("组件卸载");
    }
  }, [])
  return (
    <div className="App">
      <Header />
      <>
        <Switch>
          <Route path="/home" component={Home}></Route>
          <Route path="/privateChat" component={PrivateChat} />
          <Route path="/worldChat" component={WorldChat}></Route>
          <Route path="/friends" component={Friends}></Route>
          <Route path="/message" component={MessageList}></Route>
          <Route path="/profile" component={Profile} />
          <Redirect to="/home" />
        </Switch>
      </>
      <Footer />
    </div>
  )
}

export default connect(
  state => ({
    chatInfo: state.chatInfo
  }),
  // 映射action中的方法，自动调用dispatch
  {
    appendMessage: createAppendMessageAction
  }
)(App);
