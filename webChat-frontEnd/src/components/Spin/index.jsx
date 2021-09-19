import React, { useEffect, useRef } from 'react'
import style from './index.module.scss'
function Spin(props) {
  const { size, loading, color } = props;
  const loaderNode = useRef(null);
  useEffect(() => {
    // console.log(loading);
    if (loading === true) {
      loaderNode.current.style.display = "flex";
    } else {
      loaderNode.current.style.display = "none";
    }
  })
  return (
    <div className={style.container} ref={loaderNode}>
      <div className={style.loader}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>拼命加载中...</p>
    </div>
  )
}
export default Spin;


