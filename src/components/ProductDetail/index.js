import React from 'react'
import PropTypes from 'prop-types'

class ProductDetail extends React.Component {
  state = {
    product: {}
  }

  componentDidMount () {
    const {id} = this.props.match.params
    console.log(`id is ${id}`)
    this.setState({
      product: {
        id
      }
    })
  }

  render () {
    const {id} = this.state.product
    return (
      <div className="product-detail">
        {
          id ? <h3>匹配的商品 id 是 {id}</h3> : <div>加载中...</div>
        }
      </div>
    )
  }
}

ProductDetail.propTypes = {
  match: PropTypes.object.isRequired
}

export default ProductDetail
