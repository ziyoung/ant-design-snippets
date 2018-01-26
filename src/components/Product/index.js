import React from 'react'
import { Spin, Table } from 'antd'

class ProductList extends React.Component {
  state = {
    productList: []
  }

  componentDidMount () {
    const data = []
    for (let index = 0; index < 9; index++) {
      data.push({
        id: index,
        name: `商品-${index}`,
        price: parseInt(Math.random() * 100, 10)
      })
    }
    this.setState({
      productList: data
    })
  }

  render () {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name'
      },
      {
        title: '价格',
        dataIndex: 'price'
      },
      {
        title: '自定义字段',
        key: 'info',
        render: (value, row, index) => <div>
          <h2>商品名称是{row.name}</h2>
          <p>价格是{row.price}</p>
        </div>
      }
    ]
    const {productList} = this.state
    if (!productList.length) {
      return <Spin />
    }
    return (
      <div className="product-detail">
        <Table columns={columns} dataSource={productList} rowKey="id" />
      </div>
    )
  }
}

export default ProductList
