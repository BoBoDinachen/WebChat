import React, { useEffect, useState,useRef } from 'react'
import baseEmojiMap from '../../utils/emoji_map'
import style from './index.module.scss'
// 信息显示框
function ChatInfoBox(props) {
  const [content, setContent] = useState(props.message)
  const container = useRef(null);
  useEffect(() => {
    // 内容处理
    container.current.innerHTML = "";
    convertContent(content)
    return (() => {
    })
  }, []);
  // 转换表情
  function convertContent(content) {
    let chars = Array.from(content);
    let indexArray = [];
    let emoji = [];
    // 记录每个表情的位置
    for (let index = 0; index < chars.length; index++) {
      if (chars[index] === "[") {
        indexArray.push(index);
      }
      if (chars[index] === "]") {
        indexArray.push(index);
      }
    }
    // 截取表情
    if (indexArray.length > 2) {
      let a = 0;
      let b = 0;
      indexArray.forEach((i, index) => {
        if (index % 2 === 0) {
          a = i;
          b = indexArray[index + 1];
          let str = content.slice(a, b + 1);
          emoji.push({
            a,
            b,
            name: str
          });
        }
      });
    } else if(indexArray.length != 0){
      let str = content.slice(indexArray[0], indexArray[1] + 1);
      emoji.push({
        a: indexArray[0],
        b: indexArray[1],
        name: str
      });
    }
    // console.log("原字符：",content);
    // console.log(indexArray);
    // console.log(emoji);
    // 处理表情和文字，替换表情
    if (emoji.length === 1) {
      // 当只有一个表情的时候
      let str = "";
      const img = document.createElement("img");
      if (emoji[0].a === 0) {
        str = content.slice(emoji[0].b + 1);
        let text = document.createTextNode(str);
        container.current.appendChild(img);
        container.current.appendChild(text);
      } else {
        str = content.slice(0, emoji[0].a);
        let text = document.createTextNode(str);
        container.current.appendChild(text);
        container.current.appendChild(img);
      }
      // 匹配表情
      matchEmoji(img, emoji[0].name);
      // console.log(img);
    } else if (emoji.length === 0) {
      // 处理没有表情的时候
      let text = document.createTextNode(content);
      container.current.appendChild(text);
    } else if (emoji.length > 1) {
      // 处理当有多个表情的时候
      for (let index = 0; index < emoji.length; index++) {
        let p = document.createElement("p");
        if (index >= 1) {
          let img = document.createElement("img");
          let str = content.slice(emoji[index - 1].b + 1, emoji[index].a);
          let text = document.createTextNode(str);
          matchEmoji(img, emoji[index].name);
          container.current.appendChild(text);
          container.current.appendChild(img);
          // console.log(str);
        } else if (index === 0) {
          let img = document.createElement("img");
          let str = content.slice(0, emoji[index].a);
          let text = document.createTextNode(str);
          matchEmoji(img, emoji[index].name);
          container.current.appendChild(text);
          container.current.appendChild(img);
          // console.log(str);
        }
        if (index === emoji.length - 1) {
          let str = content.slice(emoji[index].b + 1);
          let text = document.createTextNode(str);
          container.current.appendChild(text);
          // console.log(str);
        }
      }
    }
  }
  // 匹配表情的方法
  function matchEmoji(img,name) {
    for (let key of baseEmojiMap.keys()) {
      if (baseEmojiMap[key].name === name) {
        // console.log(baseEmojiMap[key].index);
        // console.log(contentBox.current.innerHTML.length);
        let imgUrl = new URL(`../../assets/emoji/base/emoji_${baseEmojiMap[key].index}.webp`, import.meta.url).href
        img.src = imgUrl;
      }
    }
  }
  return (
    <div ref={container} className={style.container}>
      {/* {content} */}
    </div>
  )
}
export default ChatInfoBox;