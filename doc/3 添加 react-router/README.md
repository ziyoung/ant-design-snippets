### 添加 react-router

#### 要实现的功能

添加了 react-router，我们就可以完成出一个简单的但网页应用。实现以下几种功能。在我们这个例子中，会演示 react-router 的常见用法。

- 结合 redux 编写定制化的 router 与 layout 组件
- 以网页的左侧 Sider 组件讲解 withRouter 的用法
- 商品列表为例说明如何从获取路由中的参数
- 如何实现路由跳转

为了说明 react-router 的用法，网页的路由分为两类，需要授权与不需要授权的。

假设现在有两个页面：登陆页面与商品列表页面。当用户已经登陆，如果打开登陆页面，则跳转到商品列表页面。如果未登陆，打开商品列表页，则跳转到登陆页面。最后，我们还要使用 webpack 的 Code Splitting 实现代组件异步加载功能。

#### 在 App.js 中的添加路由

react-router v4 

#### 编写 layout 页面

#### 参考资料

- create-react-app 关于异步组件的[介绍](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#with-react-router)
- Serverless stack 上的[文章](https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html)


