import React, { ReactDOM } from 'react'
import style from './index.module.scss'
function Button(props) {
  const { type } = props;
  let extendStyle = {
    backgroundColor: ""
  }
  switch (type){
    case "success":
      extendStyle.backgroundColor = "#009966";
      break;
    case "primary":
      extendStyle.backgroundColor = "#FF6666";
      break;
    default:
      extendStyle.backgroundColor = "#99CC99";
      
  }
  return (
    <a className={style.btn} style={extendStyle} onTouchEnd={props.click}>{props.children}</a>
  )
}
export default Button;