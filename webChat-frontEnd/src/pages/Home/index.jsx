import React, { Component } from 'react'
import {adaptionContainerHeight} from '../../utils/dom_utils'
import style from './index.module.scss'
export default class Home extends Component {
  componentDidMount() {
    adaptionContainerHeight(this.containerBox);
  }
  render() {
    return (
      <div className={style.container} ref={(c) => {this.containerBox = c}}>
        <h2>这是首页...</h2>
      </div>
    )
  }
}
