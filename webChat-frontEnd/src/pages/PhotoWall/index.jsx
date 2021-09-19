import React from 'react'
import style from './index.module.scss'
import Spin from '../../components/Spin/index'
export default function PhotoWall() {
  return (
    <div className={style.container}>
      <Spin loading={true}></Spin>
    </div>
  )
}
