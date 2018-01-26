import React from 'react'
import PorpTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'
import routes from '../../routes'
import PrimaryLayout from '../../layouts/PrimaryLayout'


const { Content, Footer } = Layout

const loginRoute = routes.find(({ path }) => path === '/login')

class App extends React.Component {
  render() {
    const { auth } = this.props
    return (
      <Layout className="app">
        <Content>
          <Switch>
            {/* 看看是不是 login 页面 */}
            <Route exact path={loginRoute.path} render={({ history }) => {
              // const Login = bundleHelper(loginRoute.component)
              const Login = loginRoute.component
              if (auth) {
                return <Redirect to="/product" />
              } else {
                return <Login history={history} />
              }
            }} />
            <Route path="/" render={() => auth ? <PrimaryLayout/> : <Redirect to="/login"/>}/>
          </Switch>
        </Content>
        <Footer>Copyright © 2018</Footer>
      </Layout>
    )
  }
}

App.propTypes = {
  username: PorpTypes.string,
  auth: PorpTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.user.token !== '',
  username: state.user.username
})

export default withRouter(connect(mapStateToProps)(App))
