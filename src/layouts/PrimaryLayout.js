import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Button } from 'antd'
import { Route, Switch, withRouter, Redirect, NavLink } from 'react-router-dom'
import { actions as userActions } from '../components/App'

import routes from '../routes'

import './PrimaryLayout.less'

const { Sider, Content, Header } = Layout
const { SubMenu } = Menu

const primaryRoutes = []

routes.filter(({ path }) => path !== '/login').forEach(({ path, component, children }) => {
  if (children && children.length) {
    // 扁平化
    children.forEach(subRoute => {
      primaryRoutes.push({
        path: `${path}${subRoute.path}`,
        // component: bundleHelper(subRoute.component)
        component: subRoute.component
      })
    })
  } else {
    primaryRoutes.push({
      path,
      // component: bundleHelper(component)
      component: component
    })
  }
})

class PrimaryLayout extends React.Component {
  state = {
    openKeys: [],
    selectedKeys: []
  }
  handleOpenChange = (keys) => {
    let openKeys = []
    if (keys.length) {
      openKeys = keys.slice(-1)
    }
    this.setState({ openKeys })
  }
  setHighLightKeys = (props) => {
    const { pathname } = props.location
    let selectedKey = ''
    let openKey = ''
    if (pathname) {
      openKey = pathname.substr(1).split('/')[0]
      selectedKey = pathname.substr(1).replace('/', '.')
      // 对于类似 '/product/' 路由作特殊处理
      if (selectedKey.substr(-1) === '.') {
        selectedKey = selectedKey.substring(0, selectedKey.length - 1)
      }
    }
    this.setState({
      openKeys: [openKey],
      selectedKeys: [selectedKey]
    })
  }

  componentDidMount() {
    this.setHighLightKeys(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setHighLightKeys(nextProps)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { match, location, history } = this.props
    if (!(match === nextProps.match && location === nextProps.location && history === nextProps.history)) {
      return true
    }
    return nextState !== this.state

  }

  render() {
    const { openKeys, selectedKeys } = this.state
    const { username, userLogout } = this.props
    return (
      <Layout>
        <Header className="layout-header">
          <h2 className="logo">欢迎你, {username}</h2>
          <Button className="logout-btn" onClick={userLogout}>退出</Button>
        </Header>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              openKeys={openKeys}
              selectedKeys={selectedKeys}
              onOpenChange={this.handleOpenChange}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="product" title={<span><Icon type="user" />商品管理</span>}>
                <Menu.Item key="product">
                  <NavLink to="/product">商品列表</NavLink>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content style={{ margin: 24, minHeight: 280, backgroundColor: "white" }}>
            <Switch>
              {
                primaryRoutes.map(({ path, component }) =>
                  <Route key={path} path={path} exact component={component} />)
              }
              <Redirect to="/product" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

PrimaryLayout.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  userLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  username: state.user.username
})

const mapDispatchToProps = (dispatch) => {
  return {
    userLogout() {
      dispatch(userActions.userLogout())
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout))
