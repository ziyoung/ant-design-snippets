### 添加 Redux

#### 用到的库

除了 Redux，还会使用 react-react ，redux-thunk 以及 redux-immutable-state-invariant。

#### Redux 管理什么数据

存储登陆用户的身份信息: 用户名以及token。

#### 添加 Redux 相关代码

网上的许多教程是按角色来组织代码的，但这里我们按照代码的功能功能来组织代码。两者的区别以及优劣，可以查看 [深入浅出React和Redux](https://book.douban.com/subject/27033213/) 一书的第 4 章。

根据 Redux 中存储的用户信息，可以判断出应该网页应该显示什么样的内容。首先想到的是，App 这个组件需要 Redux 中的信息。在 `components` 文件夹下新建一个 `App` 文件夹，添加一些需要的文件。

#### 下一步

Redux 的知识点是比较多的，但是不结合具体的场景很难解释其用法。😂 所以本章节中，我们只是添加了 Redux 相关的代码，并未对一些知识点做解释。如果对 Redux 相关概念不熟悉，可以先查看[文档](http://cn.redux.js.org/)。下一步我们讲解 react-router 的用法，并且编写 layout 组件。
