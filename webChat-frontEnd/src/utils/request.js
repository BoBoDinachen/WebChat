// 封装axios请求
import axios from 'axios';
import host from './host'
const baseImgURL = "http://"+host.devHost+"/WebChat";
const avatarUrl = "http://"+host.devHost+"/WebChat/user/avatar"
function request(config) {
  let newAxios = axios.create({
    // 对每个请求进行全局配置
    baseURL:"http://"+host.devHost+"/WebChat",
    timeout: 5000,
  });
  return newAxios(config);
};
export {
  request,
  baseImgURL,
  avatarUrl
}