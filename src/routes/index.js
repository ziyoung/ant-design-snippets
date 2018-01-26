// 路由表
import LogIn from '../components/Login'
import Product from '../components/Product'
import ProductDetail from '../components/ProductDetail'

// todo: 异步组件的拆分

const routes = [
  {
    path: '/login',
    component: LogIn
  },
  {
    path: '/product',
    children: [
      {
        path: '',
        component: Product
      },
      {
        path: '/:id',
        component: ProductDetail
      }
    ]
  }
]

export default routes
