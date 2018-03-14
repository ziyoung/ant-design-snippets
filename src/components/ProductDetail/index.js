import React from 'react'
import PropTypes from 'prop-types'

class ProductDetail extends React.Component {

  constructor (props) {
    super(props)
    
    const {id} = this.props.match.params
    this.state = {
      product: {
        id
      }
    }
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
