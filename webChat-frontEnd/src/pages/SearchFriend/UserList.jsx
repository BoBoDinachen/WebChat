import React from 'react'
import style from './index.module.scss'

import confirm from '../../components/ConfirmBox'
import { baseImgURL, request } from '../../utils/request'
import avatarUrl from '../../assets/img/默认头像.png'
export default function UserList(props) {
  
  function addFriend(fid) {
    confirm.open({
      title: "添加好友",
      content: "确定要添加此人为好友吗?",
      hanleConfirm: () => {
        request({
          url: "/user/addFriend",
          method: "post",
          data: {
            uid: JSON.parse(sessionStorage['user_info'])._id,
            incr_uid: fid
          }
        }).then((res) => {
          console.log(res);
        })
      }
    })
  }

  if (props.userList.length === 0) {
    return (
      <li className={style.showNull}>搜索结果为空</li>
    )
  } else {
    return (
      <>
        <div className={style.title}>查找人</div>
        {
          props.userList.map((user) => {
            return (
              <li key={user._id} className={style.resultBox}>
                <img src={user.avatar_url === "" ? avatarUrl : baseImgURL + "/user/avatar?uid=" + user._id} />
                <div className={style.userInfo}>
                  <span>{`${user.user_name}(${user.account.split('@')[0]})`}</span>
                  <div>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref={user.sex === '女' ? '#icon-nv' : '#icon-nan1'}></use>
                    </svg>
                    <span>{user.age}岁</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{user.signature}</span>
                  </div>
                </div>
                {
                  user.isFriend ?
                    <div className={style.FriendBox}>
                      已添加
                    </div>
                    :
                    <div className={style.UserBox} onClick={addFriend.bind(this,user._id)}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-jia"></use>
                      </svg>
                      加好友
                    </div>
                }
              </li>
            )
          })
        }
      </>
    )
  }
}
