import React from 'react'
import {withRouter} from 'react-router-dom';
import style from './index.module.scss'
function Record(props) {
  return (
    <div className={style.container}>
      <div className={style.titleBar}>
        <span onClick={() => { props.history.goBack() }}>
          返回
        </span>
        <h3>留下你的照片</h3>
      </div>
    </div>
  )
}
export default withRouter(Record);