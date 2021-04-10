import React, { useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header';
import Profile from './pages/Profile';
import Home from './pages/Home'
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.css'
function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <Switch>
          <Route path="/home" component={Home}></Route>
          <Route path="/profile" component={Profile}/>
          <Redirect to="/home"/>
        </Switch>
      </div>
      <Footer/>
    </div>
  )
}

export default App
