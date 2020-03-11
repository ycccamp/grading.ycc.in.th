import React, {Component} from 'react'
import Image from 'react-medium-image-zoom'
import {css} from 'react-emotion'
import firebase from 'firebase'
import {Spin} from 'antd'

const imageStyle = css`
  position: relative;
  z-index: 2;

  width: 100%;
  min-height: 500px;
  max-width: 100%;

  margin-top: 0.8em;
  margin-bottom: 0.8em;

  box-shadow: 0 1px 1.5px 1px rgba(0, 0, 0, 0.12);

  background-color: #fbfcff;
`

class ImagePreview extends Component {
  state = {
    preview: null,
  }

  async componentDidMount() {
    const {path, uid} = this.props

    if (path || uid) {
      await this.loadPreview(path, uid)
    }
  }

  async componentWillReceiveProps(props) {
    if (this.props.path !== props.path) {
      const {path, uid} = props

      if (path || uid) {
        await this.loadPreview(path, uid)
      }
    }
  }

  loadPreview = async (path, uid) => {
    const storage = firebase.storage().ref()

    const {items: fileList} = await storage
      .child(`registation/design/${uid}/image`)
      .listAll()

    console.log(
      'Designs for uid',
      uid,
      'is',
      fileList.map(x => x.fullPath),
    )

    const designs = storage.child(path)

    try {
      if (path) {
        const url = await designs.getDownloadURL()

        if (url) {
          console.log('Design> Uploaded Path:', url)

          this.setState({preview: url})
          return
        }
      }

      const first = fileList[0]

      if (first) {
        const url = await first.getDownloadURL()

        console.log('Design> First Image:', url)

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

    return (
      <Image
        image={{src, className: this.props.imageStyle || imageStyle}}
        imageZoom={{src}}
      />
    )
  }
}

export default ImagePreview
