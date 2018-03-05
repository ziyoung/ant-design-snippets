// axios 实例配置
import axios from 'axios'
import { message } from 'antd'
import store from '../store'
import { actions } from '../components/App'

// 跟服务器通信的 axio 实例
const instance = axios.create({
  baseURL: '/api'
})
// 有token的话就放在请求的头部
if (store.getState().user.token) {
  instance.defaults.headers.common['token'] = store.getState().user.token
}
// 当 store 发送变化时去更新token值
store.subscribe(() => {
  instance.defaults.headers.common['token'] = store.getState().user.token
})
// 根据后端的返回值不同需要作出些调整
instance.interceptors.response.use(res => {
  const data = res.data
  if (data.code === 0) {
    return data.data
  } else if (data.code === 401) {
    console.warn('token 非法\n跳转到登录')
    // 准备跳转到登录
    setTimeout(() => {
      store.dispatch(actions.userLogout())
    }, 500)
    if (data.message) {
      message.error(data.message)
    }
    return Promise.reject({ msg: 'token非法' })
  } else {
    console.error(data)
    if (data.message) {
      message.error(data.message)
    }
    return Promise.reject({
      code: data.code,
      msg: data.message
    })
  }
})

// export {instance as default, axios}
export default instance