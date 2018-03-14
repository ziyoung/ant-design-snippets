import React from 'react'
import { Input, Button, Form } from 'antd'
import PriceInput from './PriceInput'
import Picupload from './Picupload'

const FormItem = Form.Item

class NormalForm extends React.Component {
  state = {
    data: {
      price: {},
      imgs: []
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((errs, values) => {
      console.log(values)
    })
  }
  componentDidMount () {
    console.log('手动模拟编辑过程')
    setTimeout(() => {
      this.setState({
        data: {
          ...this.state.data,
          imgs: ['FlztrlVbeldjygSU6ru5xhmCdAAC|750|598']
        }
      })
    })
  }
  render () {
    const {data} = this.state
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="价格">
          {getFieldDecorator('price', {
            initialValue: data.price
          })(
            <PriceInput />
          )}
        </FormItem>
        <FormItem label="图片列表">
          {getFieldDecorator('imgs', {
              initialValue: data.imgs
          })(
            <Picupload isEdit={true} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </Form>
    )
  }
}


export default Form.create()(NormalForm)
