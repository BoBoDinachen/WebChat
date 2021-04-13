import React, { useState,useEffect } from 'react'
import Footer from './components/Footer'
import Header from './components/Header';
import Profile from './pages/Profile';
import Home from './pages/Home'
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.css'
function App() {
  // 执行副作用操作
  useEffect(() => {
    return () => {
      // 当APP组件卸载前，将本地存储的用户信息清除
      console.log("组件卸载");
    }
  })
  return (
    <div className="App">
      <Header />
      <>
        <Switch>
          <Route path="/home" component={Home}></Route>
          <Route path="/profile" component={Profile}/>
          <Redirect to="/home"/>
        </Switch>
      </>
      <Footer/>
    </div>
  )
}

export default App
