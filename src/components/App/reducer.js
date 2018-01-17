import { USER_LOGIN, USER_LOGOUT } from './actionTypes'

export default function (state = {token: '', username: ''}, action) {
  switch (action.type) {
    case USER_LOGIN:
      return {
        token: action.token,
        username: action.username 
      }
    case USER_LOGOUT:
      return {token: '', username: ''}
    default:
      return state
  }
}
