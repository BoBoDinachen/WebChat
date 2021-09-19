import React, { useEffect,useRef,useState } from 'react'
import style from './index.module.scss'
import { withRouter } from 'react-router-dom'
function BigWorld(props) {
  const warpBox = useRef(null);
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    if (activeStatus) {
      warpBox.current.style.height = '100%';
    } else {
      warpBox.current.style.height = '35%';
    }
    return () => {

    }
  }, [activeStatus])
  // 向上拉
  function handleUpward() {
    setActiveStatus(activeStatus => !activeStatus);
  }
  return (
    <div className={style.container}>
      {/* 中间的盒子 */}
      <div className={style.warpBox}>
        <div className={style.rotateBox}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <button onClick={() => { setTimeout(() => {props.history.replace("/worldChat")},300)}}>进入</button>
      </div>
      <div className={style.bjBottom} ref={warpBox}>
        {/* 显示状态的盒子 */}
        <div className={style.statusBox}>
          <span>大世界</span>
          <span>在线人数:233</span>
          <span>共发消息数:233</span>
        </div>
        <svg className={`icon ${activeStatus ? style.downward : style.upward}`} aria-hidden="true" onTouchStart={handleUpward}>
          <use xlinkHref={activeStatus?'#icon-fjxiangxiala':'#icon-xiala'}></use>
        </svg>
      </div>
    </div>
  )
}
export default withRouter(BigWorld);
