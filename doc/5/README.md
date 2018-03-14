### 谈谈 ant.design 中自定义表单组件

#### 自定义表单组件

ant.design 中的 Input，InputNumer 与 Upload 等都算是自定义表单组件，这些组件都算是对最基础的输入控件的封装。实际的开发过程中，表单的某一项数据可能是一些比较复杂的数据类型，例如说：数组或者对象，我们都可以通过编写一个自定义的输入组件来处理这些问题。

#### 自定义表单组件与 Form 的配合使用

##### 表单组件的规则

自定义表单组件与 Input 这些简单的输入组件基本一致，无非是数据复杂一点，得编写自定义的校验函数来校验数据。ant.design 中的 Form 组件可以帮我们自动收集表单数据。自定义表单控件遵守一些规则才能与 Form 组件配合使用。

> - 提供受控属性 value 或其它与 valuePropName 的值同名的属性。
> - 提供 onChange 事件或 trigger 的值同名的事件。
> - 不能是函数式组件。

官方提供了一个[例子](https://codesandbox.io/s/yvwww55mrx)来说明如何编写一个双向数据绑定的组件。核心代码如下：

```js
class PriceInput extends React.Component {
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState(value)
    }
  }
  triggerChange () {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue))
    }
  }
}
```

调用 `triggerChange` 函数执行 props 中的 onChange 来传递表单里输入的数据，在 `componentWillReceiveProps` 过程中，重新设置表单的值，这样就完成了数据的双向绑定，与 Vue 中的[自定义表单组件](https://cn.vuejs.org/v2/guide/components.html#%E4%BD%BF%E7%94%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6%E7%9A%84%E8%A1%A8%E5%8D%95%E8%BE%93%E5%85%A5%E7%BB%84%E4%BB%B6)的实现思路差不多。

##### 另一种理解

ant.design 文档中的 **提供 onChange 事件或 trigger 的值同名的事件** 这句话，我一直不太理解。上例中的 PriceInput 组件并未触发事件，只不过是调用 props 中的 onChange 函数。当用户输入时，我们尝试在这个组件上手动触发 change 事件，从而让 Form 组件帮我们自动收集数据。

以前我们用下面这种方式在一个元素上手动触发一个事件。

```js
const event = new CustomEvent('change', { detail: { ...data } })
el.dispatchEvent(event)
```

在 React 中这样做当然是可行的。但是 [React 中的事件](https://react.bootcss.com/docs/events.html)并不等同于浏览器原生事件，简单来说，React 的事件系统“向下兼容”浏览器原生事件。直接使用 dispatchEvent 来触发自定义的事件并不合适，该事件并不是 React 的事件。React 提供了 [Simulate 对象](https://reactjs.org/docs/test-utils.html#simulate)来帮我们手动触发事件。

```jsx
import ReactTestUtils from 'react-dom/test-utils'
class PriceInput extends React.Component {
  noop () {}
  saveRef = (input) => {
    this.input = input
  }
  triggerChange = () => {
    // 手动触发事件
    ReactTestUtils.Simulate.change(this.input, {value: {
      ...changedValue
    }})
  }
  render () {
    return (
      <span ref={this.saveRef} onChange={this.props.onChange || this.noop}>
        // ...
      </span>
    )
  }
}
```

从上面的代码我们可以看出，在表单元素上手动触发事件之后，最终还是调用 onChange 函数，远不及文档示例代码简洁。如果文档中的这句话：~~提供 onChange 事件或 trigger 的值同名的事件~~ 修改为调用 **onChange 函数或 trigger 的值同名函数** 会不会更好呢？😂

#### 可能不需要双向绑定

某些自定义表单组件可能并不需要双向绑定数据。在“编辑状态下”时，只需对组件中的数据进行一次初始化即可。下面的例子是在项目中基于 Upload 组件封装的一个图片上传组件，使用该例子来说明问题。

```jsx
import axios from '../../common/axios'

function once (fn, context) {
  let result
  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments)
      fn = null
    }
    return result
  }
}

class PicUpload extends React.Component {
  state = {
    token: '',
    previewVisible: false,
    previewImage: '',
    fileUrls: [],
    fileList: []
  }
  initFileUrlsOnce = once((value) => {
    let uid = -1 // uid 是负数
    let fileList = [], fileUrls = []
    value.forEach(src => {
      uid--
      fileList.push({
        uid: uid,
        name: 'preview.png',
        status: 'done',
        url: `https://obxf7cs2k.qnssl.com/${src.split('|')[0]}`
      })
      fileUrls.push({
        uid: uid,
        url: `${src}`
      })
    })
    this.setState({
      fileUrls,
      fileList
    })
  })
  // ...
  triggerChange = () => {
    const value = this.state.fileUrls.map(({url}) => url)
    const onChange = this.props.onChange
    if (onChange) {
      onChange(value)
    }
  }
  
  handleChange = ({fileList, file}) => {
    if (file.status === 'done') {
      const url = `${file.response.url}|${file.response.w}|${file.response.h}`
      const fileUrls = [...this.state.fileUrls, {
        uid: file.uid,
        url
      }]
      this.setState({fileUrls}, this.triggerChange)
    }
    this.setState({fileList})
  }

  handleRemove = ({uid}) => {
    const fileUrls = this.state.fileUrls.filter(fileUrl => fileUrl.uid !== uid)
    this.setState({fileUrls}, this.triggerChange)
    return true
  }

  componentWillReceiveProps (nextProps) {
    const {value} = nextProps
    if (value && value.length) {
      // 仅仅在编辑状态下采取执行该操作
      this.initFileUrlsOnce(value)
    }
  }

  render () {
    const {previewVisible, previewImage, fileList, token} = this.state
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const action = window.location.protocol === 'https:' ? 'https://upload.qbox.me/' : 'http://upload.qiniu.com/'
    return (
      <div className="clearfix">
        <Upload
          accept="image/jpg,image/jpeg,image/png"
          action={action}
          listType="picture-card"
          fileList={fileList}
          data={{token: token}}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onRemove={this.handleRemove}
          onChange={this.handleChange}
        >
          {fileList.length >= this.props.fileListLen ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    )
  }
}

PicUpload.propTypes = {
  fileListLen: PropTypes.number,
  isEdit: PropTypes.bool
}

PicUpload.defaultProps = {
  fileListLen: 3,
  isEdit: false
}
```

上面这个组件的功能是把图片上传到七牛，在上传成功之后获取图片的 key，宽与高，向外传递一个包含图片信息的数组。当编辑状态下时，传入该组件的时候的数据只是图片信息的列表，根据该值去拼接图片的完成路径，从而完成对 state 的初始化。

为什么这里不要表单数据的双向绑定呢？假设是双向绑定，那么在 `componentWillReceiveProps` 过程中,由 value 生成 fileUrls 的过程将执行多次，文件的 uid 需要不断的进行初始化，原来 Upload 组件生成的 uid 就丢失了，而且会引起组件的闪烁。

