import React, {Component} from 'react'
import Image from 'react-medium-image-zoom'
import styled, {css} from 'react-emotion'
import firebase from 'firebase'

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
    const {src, id} = this.props

    if (src === true && id) {
      await this.loadPreview(id)
    }
  }

  async componentWillReceiveProps(props) {
    if (this.props.id !== props.id) {
      const {src, id} = props

      if (src === true && id) {
        await this.loadPreview(id)
      }
    }
  }

  loadPreview = async uid => {
    const storage = firebase.storage().ref()
    const designs = storage.child(`designs/${uid}.jpg`)

    try {
      const url = await designs.getDownloadURL()

      if (url) {
        console.log('Design URL', url)
        this.setState({preview: url})
      }
    } catch (err) {
      if (err.code === 'storage/object-not-found') {
        console.info('Camper', uid, 'has no designs! This should not happen.')
        return
      }

      console.warn(err.message)
    }
  }

  render() {
    let src = this.state.preview || this.props.src

    return (
      <Image
        image={{src, className: this.props.imageStyle || imageStyle}}
        imageZoom={{src}}
      />
    )
  }
}

export default ImagePreview
