// 封装axios请求
import axios from 'axios';
export function request(config) {
  let newAxios = axios.create({
    // 对每个请求进行全局配置
    baseURL: "http://172.21.231.28:5000/WebChat",
    timeout: 500,
  });
  return newAxios(config);
};