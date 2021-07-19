import React from 'react'
import ReactDOM from 'react-dom'
import ConfirmBox from './ConfirmBox'
export default {
  open(options) {
    let element = document.getElementById("confirm-box");
    const {title,content,hanleConfirm} = options;
    if (!element) {
      // 创建元素
      element = document.createElement('div');
      element.id = 'confirm-box';
      document.body.appendChild(element);
      ReactDOM.render(<ConfirmBox title={title} content={content} callBack={hanleConfirm}/>, element);
    } else {
      ReactDOM.render(<ConfirmBox title={title} content={content} callBack={hanleConfirm}/>, element);
    }
  }
};