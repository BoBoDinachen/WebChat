import React, { useState, useEffect } from 'react'
import PrivateChat from './container/PrivateChat'
import Footer from './components/Footer'
import Header from './components/Header';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import MessageList from './pages/Message'
import Home from './pages/Home'
import socketIO from './utils/socket';
import {createAppendMessageAction} from './redux/action/chat_action'
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.css'
function App(props) {
  // 执行副作用操作
  useEffect(() => {
    // 组件加载和state更新
    const uid = JSON.parse(window.sessionStorage["user_info"])._id;
    // 创建socket连接
    const socket = socketIO.createSocket(uid);
    // 接收私聊信息
    socket.on("reply_private_chat", (data) => {
      props.appendMessage(data);
      console.log("接收到的聊天数据",data);
    })
    return () => {
      // 当APP组件卸载前，将本地存储的用户信息清除
      // console.log("组件卸载");
    }
  },[])
  return (
    <div className="App">
      <Header/>
      <>
        <Switch>
          <Route path="/home" component={Home}></Route>
          <Route path="/privateChat" component={PrivateChat}/>
          <Route path="/friends" component={Friends}></Route>
          <Route path="/message" component={MessageList}></Route>
          <Route path="/profile" component={Profile}/>
          <Redirect to="/home"/>
        </Switch>
      </>
      <Footer/>
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
