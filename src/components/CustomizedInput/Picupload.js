import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
// import axios from '../../common/axios'

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
  beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('上传的图片大小不能超过2M！')
    }
    return isLt2M
  }

  handleCancel = () => {
    this.setState({previewVisible: false})
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
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

  componentDidMount () {
    // axios.get('/cdn/uptoken').then(token => {
    //   this.setState({ token })
    // })
    // 正常情况下应该是调取后台接口获取七牛上传 token
    this.setState({
      token: '11111111'
    })
  }

  componentWillReceiveProps (nextProps) {
    const {value, isEdit} = nextProps
    if (value && value.length && isEdit) {
      // 仅仅在编辑状态下采取执行该操作
      this.initFileUrlsOnce(value)
    }
  }

  render () {
    const {previewVisible, previewImage, fileList} = this.state
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
          data={{token: this.state.token}}
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

export default PicUpload
