import React, { useRef, useEffect, useState } from 'react'
import style from './index.module.scss'
import baseEmojiMap from '../../utils/emoji_map';
export default function EmojiPackage(props) {
  const { show,inputBox } = props;
  const emojiBox = useRef(null);
  // 加载所有的表情图片
  useEffect(() => {
    loadEmoji();
    return () => {

    }
  }, [])
  // 加载基础的表情包
  function loadEmoji() {
    // 先执行清空
    while (emojiBox.current.firstChild) {
      emojiBox.current.removeChild(emojiBox.current.firstChild);
    }
    for (let index = 1; index <= 21; index++) {
      let emoji = document.createElement("img");
      const imgUrl = new URL(`../../assets/emoji/base/emoji_${index}.webp`, import.meta.url).href
      emoji.src = imgUrl;
      emoji.addEventListener("click", handleEmoji.bind(this, {type:"base",index}));
      emojiBox.current.appendChild(emoji);
    }
  }
  // 点击表情的时候
  function handleEmoji(params) {
    let { type, index} = params;
    // alert(type + "---" + index);
    switch (type) {
      case "base":
        //匹配表情符号
        // inputNode.current.value += "/" + index;
        for (let key of baseEmojiMap.keys()) {
          if (baseEmojiMap[key].index === index) {
            console.log(baseEmojiMap[key].name);
            inputBox.current.innerHTML += baseEmojiMap[key].name;
          }
        }
        break;
    }
  }
  return (
    <div className={show ? style.container : style.hiddenContainer}>
      <label>基础表情</label>
      <div className={style.emojiBox} ref={emojiBox}>

      </div>
      {/* 表情分类 */}
      <ul className={style.menus}>
        <svg className="icon">
          <use xlinkHref="#icon--neutral"></use>
        </svg>
      </ul>
    </div>
  )
}
