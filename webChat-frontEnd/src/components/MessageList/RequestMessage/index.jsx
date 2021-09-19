import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { request, avatarUrl } from '../../../utils/request'
import Spin from '../../../components/Spin/index'
import toast from '../../ToastBox/Toast'
import Socket from '../../../utils/socket'
export default function RequestMessage() {
  const [requestList, setRequestList] = useState([]);
  const [status, setStatus] = useState(false);  // 控制更新
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("组件加载...");
    request({
      url: "/message/getRequestList",
      method: "get",
      params: {
        uid: JSON.parse(sessionStorage["user_info"])._id
      }
    }).then((res) => {
      console.log("申请列表:",res.data);
      if (res.data.data) {
        setRequestList(res.data.data);
        setIsLoading(false);
      } else {
        setRequestList([]);
        setIsLoading(false);
      }
    })
    return () => {

    }
  }, [status])

  // 同意申请
  function consentRequest(friend) {
    request({
      url: "/message/addFriend",
      method: "post",
      data: {
        uid: JSON.parse(sessionStorage["user_info"])._id,
        uname: JSON.parse(sessionStorage["user_info"]).user_name,
        incr_uid: friend.fid,
        fname: friend.fname
      }
    }).then((res) => {
      console.log(res.data);
      if (res.data.success) {
        toast({
          type: "success",
          text: "同意申请成功~",
          time: 1000
        })
        // 申请通过通知
        Socket.requestInform({ uid: JSON.parse(sessionStorage["user_info"])._id, fid: friend.fid, status: 2 });
        // 改变状态
        setStatus(!status);
      }
    })
  }
  // 拒绝申请
  function refuseRequest(friend) {
    request({
      url: "/message/refuseRequest",
      method: "post",
      data: {
        uid: JSON.parse(sessionStorage["user_info"])._id,
        fid: friend.fid,
      }
    }).then((res) => {
      console.log(res.data);
      if (res.data.status === 'OK') {
        // 拒绝申请通知
        Socket.requestInform({ uid: JSON.parse(sessionStorage["user_info"])._id, fid: friend.fid, status: 3 });
        // 改变状态
        setStatus(!status);
      }
    })
  }
  return (
    <ul className={style.messageList}>
      <Spin loading={isLoading}></Spin>
      {
        requestList.length === 0 ? <div style={{marginTop:'20px'}}><h3>还没有申请记录噢~</h3></div>:
        requestList.map((item) => {
          return (
            <li key={item.fid}>
              <img src={avatarUrl + "?uid=" + item.fid} alt="" />
              <div className={style.infoBox}>
                <span>{item.fname}</span>
                <span>{item.request_time}</span>
              </div>
              {
                item.request_status === 0 ? <span className={style.status0}>等待验证</span> :
                  item.request_status === 1 ? <div className={style.status1}><button onClick={consentRequest.bind(this, item)}>同意</button><button onClick={refuseRequest.bind(this, item)}>拒绝</button></div> :
                    item.request_status === 2 ? <span className={style.status2}>已同意</span> :
                      item.request_status === 3 ? <span className={style.status3}>已拒绝</span> : <></>
              }
            </li>
          )
        })
      }
    </ul>
  )
}

