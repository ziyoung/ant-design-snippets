### 添加 react-router

使用 React 开发单网页应用时，React Router 必不可少。刚开始接触 React Router 时，跟着文档一步步做，虽然有些概念不太理解，但最终还算是完成了项目。后来阅读了 [你不知道的 React Router 4](https://zhuanlan.zhihu.com/p/28585911) 这篇文章，意识到先前在项目中的某些用法中的用法不太正确。学习的过程中，走了些弯路。本文算是对我本人的使用经验的一点梳理与总结，希望能读者带来一些启发。

#### 1. 动态路由 (Dynamic Routing)

React Router v4 引入了动态路由(Dynamic Routing)的概念。与动态路由相对应的是静态路由(Static Routing)。如果你使用过 Express 或者 koa 的话，那么对静态路由再熟悉不过了。下面的例子中，我们使用了 [koa-route](https://www.npmjs.com/package/koa-route)，让路由与相应的 Controller 绑定。

```js
const route = require('koa-route')
 
app.use(route.get('/article', Controller1))
app.use(route.get('/article/:id', Controller2))
app.use(route.get('/article/:id/edit', Controller3))
```

像上面这种形式就是静态路由。静态路由的最明显的特征是：在代码中，把要处理的路由全部罗列出来。在项目开始运行时，我们就知道了所有的路由与 Controller 的对应关系。简单来说就是路由表示不变的。

React Router 把所有的东西都视为组件，Route 也是组件。假设有下面这样一个 Route。

```jsx
<Route path="/article" component={ArticleList} />
```

如果这个 Route 还未渲染，当我们打开 /article 这个链接时，ArticleList 组件就根本不会渲染。只有 Route 渲染了，路由才会生效。与前面的静态路由相比，现在的路由表是变化的。在运行时，路由可以动态的添加进来。当打开页面时，并不一定能知道所有的路由与组件的对应关系。

因为路由是不断变化的，我们编写的组件跟以往有很大不同。考虑下面的一个单网页应用。

![登录页面](https://user-gold-cdn.xitu.io/2018/2/24/161c5dba392850aa?w=2718&h=1754&f=png&s=223364)

![其他页面](https://user-gold-cdn.xitu.io/2018/2/24/161c5dc65dff40c3?w=2718&h=1754&f=png&s=359854)

我们观察到整个网站的页面可以分为两类：登录页面与其他的页面。在 App.js 中，可以先添加两个 Route。

```jsx
// App.js
<Switch>
  <Route path="/login" exact component={Login} />
  <Route path="/" component={PrimaryLayout} />
</Switch>
```

路由可以不断的被添加进来的，所以现在我们无需把所有的路由在 App.js 中罗列出来。在 PrimaryLayout.js 中，再添加所需的路由。

```jsx
// PrimaryLayout.js
<Switch>
  <Route path="/article" exact component={ArticleList} />
  <Route path="/article/:id" exact component={ArticleDetail} />
  <Route path="/article/:id/edit" exact component={ArticleEdit} />
</Switch>
```

#### 2. Route 组件

Route 组件的功能比较单一：当链接符合匹配规则时，渲染组件。注意到在上面的代码中，Route 组件嵌套在 Switch 组件中。一个链接符合多个 Route 的匹配规则时，那么多个组件都会被渲染。如果把 Route 嵌套在 Switch 中， 那么只会渲染第一个符合规则的路由。

Route 有一个名为 render 的 prop。设置这个 render 函数，那么就可以在路由中做出复杂的逻辑处理。

```jsx
<Switch>
  <Route path="/login" exact
    render={() => auth ? <Redirect to="/product" /> : <Login  />
  <Route path="/" 
    render={() => auth ? <PrimaryLayout/> : <Redirect to="/login"/>} />
</Switch>
```

变量 auth 为用户的登录状态，当用户已登录时无法直接访问 login 页面，未登录时无法访问之后需要权限的页面。对于更为复杂的权限管理，按照相同的方式编写 render 函数即可。

#### 3. Router 组件与 history

Router 组件是比较底层的组件。实际开发中，我们通常选用 BrowserRouter 或者 HashRouter。

```jsx
// index.js
import { BrowserRouter } from 'react-router-dom'
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'))
```

BrowserRouter 与 HashRouter 都是对 Router 的封装，自带了一个 history 对象。这二者的最大区别在于自身的 history 对象的不同。

```jsx
import { createBrowserHistory, createHashHistory } from 'history'

const history = createBrowserHistory()
// 或者下面这样
// const history = createHashHistory()

<Router history={history}>
  <App/>
</Router>
```

BrowserRouter 与 HashRouter 的 props，例如：basename, getUserConfirmation 等，都可以在创建 history 对象时进行设置。

```js
const history = createBrowserHistory({
  basename: '/admin'
})
```

#### withRouter

withRouter 是一个[高阶组件](https://reactjs.org/docs/higher-order-components.html)，把 match，location，history 三个对象注入到组件的 props 中。这是一个非常实用的函数，下面以四个小例子阐述它的用法。

1. 与 redux 的 connect 配合

在前面我们说过 Route 是组件，路由表是不断变化的。在项目中使用了 redux 来管理数据，当数据没有变化时，组件也就不会重新渲染。假设在组件中某个 Route 组件并未被渲染，数据也未发生变化，即便当前页面的链接发生了变化，也不会有任何的路由匹配该链接。因为这时候 Route 组件还是未被渲染！如何知道链接变化了呢？这时候就需要 withRouter 了。

```jsx
import { withRouter } from 'react-router-dom'
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Component))
```

2. 获取当前的路由

如下图所示，左侧的侧边栏应该根据链接的变化，决定哪一块展开，哪一块高亮。通过 withRouter 封装一下左侧组件，组件就可以响应链接的变化了。

![侧边栏](https://user-gold-cdn.xitu.io/2018/2/24/161c6a8fb6a7907d?w=740&h=1074&f=png&s=75220)


```jsx
class LeftSider extends React.Component {
  componentDidMount() {
    this.setHighLightKeys(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setHighLightKeys(nextProps)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { match, location } = this.props
    if (!(match === nextProps.match && location === nextProps.location)) {
      return true
    }
    return nextState !== this.state
  }
}

export default withRouter(LeftSider)
```

注意到 shouldComponentUpdate 函数中只是比较了两次 match 与 location 的是否相同，并未比较 history 对象。history 对象每次都是[变化的](https://reacttraining.com/react-router/web/api/history/history-is-mutable)，故这里不用作比较。

同理，面包屑也可以使用这种方式实现。

3. 页面的跳转

React Router 提供了 Link，NavLink 与 Redirect 组件来控制页面的跳转。但是我在一个 Button 的点击事件中控制页面的跳转，这几个组件就无法使用了。这里，或许你会想到使用 location 对象。

```js
// 错误的方式!!!
location.href = '/article'
```

这种方式可行，但不正确。如果先前使用的 BrowserRouter 变成 HashRouter 的话，这种方式就失效了。withRouter 封装的组件中的 props 包含 history，通过 history 对象来控制页面的跳转。history 对象有 push，replace 与 go 等方法，调用这些方式实现页面的跳转。

```jsx
class Comoponent extends React.Component {
  handleClick () {
    this.props.history.push('/article')
  }
}
export default withRouter(Component)
```

4. 获取路由中的参数

在上文的 ArticleDetail 组件中，我们需要知道当前路由中的 id 是多少。 组件 props 的 match 对象里包含了路由中的参数。

```jsx
class ArticleDetail extends React.Component {
  state = {
    id: null
  }
  componentDidMount () {
    const { id } = this.props.match
    this.setState({ id })
  }
}
```

#### 4. 代码分离

现在使用 [react-loadable](https://github.com/jamiebuilds/react-loadable) 来实现组件的异步加载，一切变得容易多了。在之前的 React Router 文档中是按照下面这种方式实现组件的异步加载的。

```js
// 一种比较繁琐的方式
import Component from 'bundle-loader!./Component'
// 为此还要编写一个组件
class Bundle extends React.Component {
  state = {
    // short for "module" but that's a keyword in js, so "mod"
    mod: null
  }

  componentWillMount () {
    this.load(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load (props) {
    this.setState({
      mod: null
    })
    props.load((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render () {
    return this.state.mod ? this.props.children(this.state.mod) : null
  }
}
// 加载异步组件
<Bundle load={Component}>
    {(Container) => <Container {...props}/>}
</Bundle>
```

如果使用 react-loadable，短短几行代码就完成了。

```jsx
import Loadable from 'react-loadable'

const Loading = () => <Spin />

const LogIn = Loadable({
  loader: () => import('../components/Login'),
  loading: Loading
})
```

更进一步，通过[命名 chunk](https://webpack.js.org/guides/code-splitting/) 来给这些拆分之后的文件起名或者把异步组件按组分块。

```jsx
const LogIn = Loadable({
  loader: () => import(/* webpackChunkName: "Login" */'../components/Login'),
  loading: Loading
})
```

#### 5. 总结

本文对 React Router 的重要知识点做了梳理，结合自己的开发经验谈了一下 React Router 的时需要注意问题。本文中的许多代码只是片段，查看完整的项目可以点击[这里](https://github.com/ziyoung/ant-design-snippets)。

##### 参考资料

- [React Router 文档](https://reacttraining.com/react-router/web)
- [React Router 的 history](https://www.npmjs.com/package/history)
- [create-react-app 文档中 关于异步组件的介绍](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#with-react-router)