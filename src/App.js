import React from 'react'
import { Layout } from 'antd'

import './App.less'

const { Header, Content, Footer } = Layout

class App extends React.Component {
  render() {
    return (
      <Layout className="app">
        <Header>ant design snippets</Header>
        <Content className="main-content">
          Content
        </Content>
        <Footer>Copyright © 2018</Footer>
      </Layout>
    )
  }
}

export default App
