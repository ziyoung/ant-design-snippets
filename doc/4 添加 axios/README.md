### 添加 axios

#### axios 的使用

axios 的常见用法，以前写过一篇[文章](https://juejin.im/post/59e81bedf265da43294d2886)。

#### 与 Redux 配合使用

Redux 创建的 state 树 [Store](http://cn.redux.js.org/docs/api/Store.html)有几个 subScrible 以及 dispatch 方法。在 axios 的配置文件中，我们要监听 store 的变化或者根据情况改变 store 的值。

```js
// 当 store 发送变化时去更新token值
store.subscribe(() => {
  instance.defaults.headers.common['token'] = store.getState().token
})

instance.interceptors.response.use(res => {
  const data = res.data
  // 正常返回的数据
  if (data.code === 0) {
    return data.data
  } else if (data.code === 401) { // token 过期了， 这里的 code 值由后端定义
    // 清除 token
    setTimeout(() => {
      store.dispatch(actions.userLogOut())
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
```
#### 本地开发时配置 proxy

本地开发时，需要转发接口到测试服务器。在创建 axios 实例时，我们添加了 baseURL，那么转发规则就简单很多。

在 package.json 中，添加一项。

```json
{
  // ...
  "proxy": {
    "/api": {
      "target": "http://you.dev.server/",
      "changeOrigin": true
    }
  },
  // ..
}
```