// 根据屏幕自动适应高度
function adaptionContainerHeight(element) {
  const screenHeight = document.body.clientHeight;
  if (element.current) {
    element.current.style.height = screenHeight - (45 + 68) + 'px';
    element.current.style.padding = '5px 10px 5px';
    element.current.style.boxSizing= "border-box";
  } else {
    element.style.height = screenHeight - (45 + 68) + 'px';
    element.style.padding = '5px 10px 5px';
    element.style.boxSizing= "border-box";
  }
  
}

export {
  adaptionContainerHeight
}