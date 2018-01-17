import React from 'react'
import PorpTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layout } from 'antd'

import './App.less'

const { Header, Content, Footer } = Layout

class App extends React.Component {
  render() {
    const {auth, username} = this.props
    return (
      <Layout className="app">
        <Header>ant design snippets</Header>
        <Content className="main-content">
          {
            auth ? `${username}已登录` : '未登录'
          }
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

export default connect(mapStateToProps)(App)
