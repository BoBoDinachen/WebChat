// 封装axios请求
import axios from 'axios';
const baseImgURL = "http://192.168.43.203:5000/WebChat";
const avatarUrl = "http://192.168.43.203:5000/WebChat/user/avatar"
function request(config) {
  let newAxios = axios.create({
    // 对每个请求进行全局配置
    baseURL:"http://192.168.43.203:5000/WebChat",
    timeout: 1000,
  });
  return newAxios(config);
};
export {
  request,
  baseImgURL,
  avatarUrl
}