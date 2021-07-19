import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import style from './index.module.scss'
const confirmBox = props => {
  const [showConfirm, setShowConfirm] = useState(true);
  // 关闭
  function clickClose() {
    setShowConfirm(false);
    // 卸载组件
    ReactDOM.unmountComponentAtNode(document.getElementById("confirm-box"));
  }

  // 确定
  function clickConfirm() {
    // 调用回调函数
    props.callBack();
    // 关闭
    clickClose()
  }
  return (
    <div className={`${style.container} ${showConfirm ? '' : style.hideBox}`}>
      <div className={style.confirmBox}>
        <h2>{props.title ? props.title : '这是标题'}</h2>
        <p>{props.content ? props.content : "这是内容"}</p>
        <div className={style.btns}>
          <button onClick={clickConfirm}>确定</button>
          <button onClick={clickClose}>取消</button>
        </div>
      </div>
    </div>
  )
}

confirmBox.propTypes = {

}

export default confirmBox
