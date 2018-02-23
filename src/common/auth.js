const tokenName = 'ADMIN_USER_TOKEN'
const userInfoName = 'USER_NAME'

export default {
  status () {
    return !!localStorage.getItem(tokenName)
  },
  getUserInfo () {
    return {
      token: localStorage.getItem(tokenName) || '',
      username: localStorage.getItem(userInfoName) || ''
    }
  },
  logIn ({token, username}) {
    if (!(token && username)) {
      console.warn('token 与 username 不能为空')
      return
    }
    localStorage.setItem(tokenName, token)
    localStorage.setItem(userInfoName, username)
  },
  logOut () {
    localStorage.removeItem(tokenName)
    localStorage.removeItem(userInfoName)
  }
}
