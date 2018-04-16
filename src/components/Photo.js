import React, {Component} from 'react'
import Image from 'react-medium-image-zoom'
import {css} from 'react-emotion'
import firebase from 'firebase'
import {Spin} from 'antd'

const avatarStyle = css`
  position: relative;
  z-index: 2;

  width: 100%;
  min-height: 500px;

  margin: 0 auto;
  margin-top: 0.8em;
  margin-bottom: 1.8em;

  box-shadow: 0 1px 1.5px 1px rgba(0, 0, 0, 0.12);
  background-color: #fbfcff;
`

class PhotoPreview extends Component {
  state = {
    preview: null,
  }

  async componentDidMount() {
    const {id} = this.props

    if (id) {
      await this.loadPreview(id)
    }
  }

  async componentWillReceiveProps(props) {
    if (this.props.id !== props.id) {
      const {id} = props

      if (id) {
        await this.loadPreview(id)
      }
    }
  }

  loadPreview = async uid => {
    const storage = firebase.storage().ref()
    const designs = storage.child(`avatar/${uid}.jpg`)

    try {
      const url = await designs.getDownloadURL()

      if (url) {
        this.setState({preview: url})
      }
    } catch (err) {
      if (err.code === 'storage/object-not-found') {
        console.warn('Camper', uid, 'has no designs! This should NOT happen.')
        return
      }

      console.warn(err.message)
    }
  }

  render() {
    const src = this.state.preview

    if (!src) {
      return <Spin />
    }

    return <Image image={{src, className: avatarStyle}} imageZoom={{src}} />
  }
}

export default PhotoPreview
