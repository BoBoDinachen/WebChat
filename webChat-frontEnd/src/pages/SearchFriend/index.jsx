import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'

import UserList from './UserList'
import { request } from '../../utils/request'
import style from './index.module.scss'
function SearchFriend(props) {
  const inputElem = useRef(null);
  const [userList, setUserList] = useState([]);
  useEffect(() => {

  }, []);
  // 返回
  const back = () => {
    props.history.replace('/friends');
  }
  // 监听输入的内容
  const monitorInput = (e) => {
    debounceSearch(inputElem.current.value)
  }
  // 防抖函数
  function debounce(fun, delay) {
    return function (args) {
      let that = this
      let _args = args
      clearTimeout(fun.id)
      fun.id = setTimeout(function () {
        fun.call(that, _args)
      }, delay)
    }
  }
  const debounceSearch = debounce(searchByInput, 500);
  // 执行搜索方法
  function searchByInput(content) {
    // 输入的内容不能为空
    if (content != '') {
      console.log(content);
      request({
        url: "/user/searchFriend",
        method: "get",
        params: {
          content,
          uid: JSON.parse(window.sessionStorage['user_info'])._id
        }
      }).then((res) => {
        console.log(res.data);
        setUserList(res.data.data);
      })
    } else {
      setUserList([]);
    }
  }
  return (
    <div className={style.container}>
      <div className={style.headerBox}>
        <div className={style.searchBox}>
          <span >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-sousuo"></use>
            </svg>
          </span>
          <input type="text" autoFocus placeholder="搜索好友/其他用户 账号/昵称" onInput={monitorInput} ref={inputElem} />
        </div>
        <a href="#" onClick={back}>取消</a>
      </div>
      <ul className={style.searchListBox}>
        <UserList userList={userList}></UserList>
      </ul>
    </div>
  )
}

export default withRouter(SearchFriend);