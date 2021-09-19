import React, { useEffect} from 'react'
import style from './index.module.scss'
import { withRouter } from 'react-router-dom'
import confirm from '../../components/ConfirmBox'
import { baseImgURL, request } from '../../utils/request'
import toast from '../../components/ToastBox/Toast';
import socketIO from '../../utils/socket';
import { formatTime} from '../../utils/base'
function UserList(props) {
  useEffect(() => {
    console.log("组件加载");
  },[])
  // 添加好友的方法
  function addFriend(user) {
    confirm.open({
      title: "添加好友",
      content: "确定要添加此人为好友吗?",
      hanleConfirm: () => {
        request({
          url: "/user/addFriend",
          method: "post",
          data: {
            uid: JSON.parse(sessionStorage['user_info'])._id,
            incr_uid: user._id,
            fname: user.user_name,
            uname: JSON.parse(sessionStorage['user_info']).user_name
          }
        }).then((res) => {
          console.log(res);
          if (res.data.success && res.data.msg === "好友添加成功") {
            toast({
              type: "success",
              time: 1000,
              text: "添加成功!"
            });
            props.location.callback(user); // 调用路由中的方法，改变父组件中的状态
            props.history.replace('/friends');
          } else if (res.data.msg === "该好友已添加") {
            toast({
              type: "warning",
              time: 1000,
              text: res.data.msg
            });
          }
        })
      }
    })
  }
  // 发送好友申请
  function sendRequest(friend) {
    confirm.open({
      title: "添加好友",
      content: "你的诉求将传递给对方~",
      hanleConfirm: () => {
        socketIO.friendRequest({
          uid: JSON.parse(sessionStorage['user_info'])._id,
          uname: JSON.parse(sessionStorage['user_info']).user_name,
          fid: friend._id,
          fname: friend.user_name,
          time:  formatTime(new Date(),"yyyy-MM-dd HH:mm") 
        });
        toast({
          type: "success",
          time: 1000,
          text:"发送申请成功~"
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
        <div className={style.title}>搜索结果</div>
        {
          props.userList.map((user) => {
            return (
              <li key={user._id} className={style.resultBox}>
                <img src={baseImgURL + "/user/avatar?uid=" + user._id} />
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
                    <div className={style.UserBox} onClick={sendRequest.bind(this, user)}>
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

export default withRouter(UserList);