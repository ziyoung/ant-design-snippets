import React from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import { connect } from 'react-redux'
import {actions as userActions} from '../App'
import './index.less'

const FormItem = Form.Item

class LogIn extends React.Component {
  state = {
    loading: false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        message.success('登录成功!')
        this.props.userLogin({
          token: '1111',
          username: values.username
        })
      }
    })
  }

  render () {
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{required: true, message: '请输入用户名!'}],
          })(
            <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{required: true, message: '请输入密码!'}],
          })(
            <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password" placeholder="密码"/>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading}>
            登录
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const LoginForm = Form.create()(LogIn)

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin (userInfo) {
      dispatch(userActions.userLogIn(userInfo))
    }
  }
}

export default connect(null, mapDispatchToProps)(LoginForm)
