import React, {useRef,useEffect} from 'react'
import style from './index.module.scss'
import successImg_url from '../../assets/img/正确.png'
import closeImg_url from '../../assets/img/取消.png'
function MessageBox(props) {
  const { type, time, text, position,isShow} = props;
  // 根据props自定义的样式
  let customStyle = {
    type: "",
    position: ""
  }
  const box = useRef(null);
  useEffect(() => {
    // 判断是否显示 和 自动关闭
    if (isShow) {
      showBox();
      setTimeout(() => {
        closeBox();
      }, time);
    }
  })
  // 显示MessageBox
  function showBox() {
    // box.current.style.display = "flex";
    box.current.style.transform = "none";
  }
  // 关闭box
  function closeBox(){
    // box.current.style.display = "none";
    box.current.style.transform = "translateY(-200%)";
  }
  return (
    <div className={style.messageBox} ref={box}>
      <img src={successImg_url}></img>
      <div className={style.content}>
        <h3>{type==="success"?"成功":"提醒"}</h3>
        <p>{text}</p>
      </div>
      <img className={style.close} src={closeImg_url} onTouchEnd={closeBox}></img>
    </div>
  )
}
export default MessageBox;