import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

const request = axios.create({
  // baseURL: process.env['VUE_APP_BASE_API'] // 基本地址
  baseURL: '/api' // 基本地址

}) // 创建axios实例
const TimeOut = 3600 // 定义超时时间 单位s
// 设置超时时间

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

// 请求拦截器
// config是配置项
request.interceptors.request.use(config => {
  // 如果token存在 ，请求的时候把token携带到请求头里
  const token = store.getters.token
  if (token) {
    if (IsCheckTimeOut()) {
      store.dispatch('user/logOut')
      console.log('登录超时，请重新登录')
      // 跳转到登录页
      router.push('/login')
      Message('登录超时，请重新登录')
      return Promise.reject(new Error('token超时了'))
    } else {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(response => {
  const { data: { data, message, success }} = response
  // 判断success是否为true
  // true >> 请求才是成功的 >> data可用的
  if (success) {
    return data
  }
  // 如果代码走这里，证明success不存在>>接口请求有问题
  // 进行错误提示
  Message.error(message || '系统错误')

  // 失败的promise >>请求接口的地方报错
  return Promise.reject(message || '系统错误')
}, error => {
  // 处理错误代码 ，在响应的时候进行拦截
  // 如果返回的是正确的，错误代码在data里面要在成功的里面进行拦截
  if (error.response.status === 401) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error((error.response?.data?.message || '系统错误'))
  // 返回一个错误
  return Promise.reject(error)
}
)

export default request // 默认导出request请求
