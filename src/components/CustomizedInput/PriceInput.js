import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button } from 'antd'
import ReactTestUtils from 'react-dom/test-utils'

const FormItem = Form.Item
const Option = Select.Option

class PriceInput extends React.Component {
  constructor(props) {
    super(props)

    const value = this.props.value || {}
    this.state = {
      number: value.number || 0,
      currency: value.currency || 'rmb'
    }
  }

  saveRef = (input) => {
    this.input = input
  }
  noop () {}
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState(value)
    }
  }

  handleNumberChange = (e) => {
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return
    }
    if (!('value' in this.props)) {
      this.setState({ number })
    }
    this.triggerChange({ number })
  }
  handleCurrencyChange = (currency) => {
    if (!('value' in this.props)) {
      this.setState({ currency })
    }
    this.triggerChange({ currency })
  }
  triggerChange = (changedValue) => {
    // const event = new CustomEvent('change', { detail: { ...changedValue } })
    // this.input.dispatchEvent(event)
    // https://github.com/facebook/react/blob/master/packages/react-dom/src/test-utils/ReactTestUtils.js
    // https://reactjs.org/docs/events.html
    ReactTestUtils.Simulate.change(this.input, {value: {
      ...changedValue
    }})
  }
  render() {
    const { size } = this.props
    const state = this.state
    return (
      <span ref={this.saveRef} onChange={this.props.onChange || this.noop}>
        <Input
          type="text"
          size={size}
          value={state.number}
          onChange={this.handleNumberChange}
          style={{ width: '65%', marginRight: '3%' }}
        />
        <Select
          value={state.currency}
          size={size}
          style={{ width: '32%' }}
          onChange={this.handleCurrencyChange}
        >
          <Option value="rmb">RMB</Option>
          <Option value="dollar">Dollar</Option>
        </Select>
      </span>
    )
  }
}

PriceInput.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func
}

export default PriceInput
