import React, {Component} from 'react'
import Image from 'react-medium-image-zoom'
import styled, {css} from 'react-emotion'

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
  render() {
    const {id, src} = this.props

    return <Image image={{src, className: imageStyle}} imageZoom={{src}} />
  }
}

export default ImagePreview
