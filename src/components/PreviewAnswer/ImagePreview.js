import React, {Component} from 'react'
import Image from 'react-medium-image-zoom'
import styled, {css} from 'react-emotion'
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
    const {id} = this.props

    if (id) {
      await this.loadPreview(id)
    }
  }

  // eslint-disable-next-line react/no-deprecated
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
    const designsFolder = storage.child(`registation/designs/${uid}/image`)

    let designs
    await designsFolder.listAll().then(res => {
      designs = res.items[0]
    })

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

    return (
      <Image
        image={{src, className: this.props.imageStyle || imageStyle}}
        imageZoom={{src}}
      />
    )
  }
}

export default ImagePreview
