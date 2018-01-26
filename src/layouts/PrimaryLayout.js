import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import routes from '../routes'

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

  render() {
    return (
      <Layout>
        <Header>
          <div className="logo"></div>
        </Header>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
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
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
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

export default PrimaryLayout
