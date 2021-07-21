// 根据屏幕自动适应高度
function adaptionContainerHeight(element) {
  const screenHeight = document.body.clientHeight;
  element.style.height = screenHeight - (45 + 68) + 'px';
}

export {
  adaptionContainerHeight
}