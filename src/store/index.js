import {createStore, compose, combineReducers, applyMiddleware} from 'redux'
import reduxThunk from 'redux-thunk'
import auth from '../common/auth'
import {reducer as userReducer} from '../components/App'

const reducer = combineReducers({
  user: userReducer
})

const middlewares = [reduxThunk]
if (process.env.NODE_ENV !== 'production') {
  // 如果是新版本，要调用 default()
  middlewares.push(require('redux-immutable-state-invariant').default())
}

const devToolsExtension = window.devToolsExtension ? window.devToolsExtension() : (f) => f

const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  devToolsExtension
)

const preloadedState = {
  user: auth.getUserInfo()
}

export default createStore(reducer, preloadedState, storeEnhancers)
