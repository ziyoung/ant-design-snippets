import { USER_LOGIN, USER_LOGOUT } from './actionTypes'
// 这里有异步的操作
import auth from '../../common/auth'

export const addUserInfo = (userInfo) => ({
  type: USER_LOGIN,
  token: userInfo.token,
  username: userInfo.username
})

export const removeUserInfo = () => ({
  type: USER_LOGOUT
})

// 接下来是两个异步的过程
export const userLogIn = (userInfo) => {
  return (dispatch) => {
    auth.logIn(userInfo)
    dispatch(addUserInfo(userInfo))
  }
}

export const userLogout = () => {
  return (dispatch) => {
    auth.logOut()
    dispatch(removeUserInfo())
  }
}
