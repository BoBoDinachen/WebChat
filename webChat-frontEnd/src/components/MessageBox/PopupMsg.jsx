import React from 'react'
import ReactDOM from 'react-dom'
import MessageBox from './index'
function PopupMessage(props) {
  const {title,uid,uname,content} = props;
  let node = document.getElementById("message-box");
  if (!node) {
    // 如果不存在，则创建一个div
    let node = document.createElement("div");
    node.id = "message-box";
    document.body.appendChild(node);
    ReactDOM.render(<MessageBox {...props} />, node);
  } else {
    // 卸载组件,重新渲染
    ReactDOM.unmountComponentAtNode(node);
    ReactDOM.render(<MessageBox {...props}/>, node);
  }
}
export default PopupMessage;