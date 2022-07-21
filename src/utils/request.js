import axios from 'axios'

const request = axios.create({}) // 创建axios实例

// 请求拦截器
request.interceptors.request.use()

// 响应拦截器
request.interceptors.response.use()

export default request // 默认导出request请求
