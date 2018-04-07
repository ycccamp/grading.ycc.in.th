import React, {Component} from 'react'
import styled from 'react-emotion'

import Button from '../components/Button'

const Frame = styled.iframe`
  display: flex;

  width: 60vw;
  height: 100vh;

  border: none;
`

export default class WebPreview extends Component {
  state = {open: false}

  componentDidUpdate() {
    const {src} = this.props
    const ref = this.iframe

    if (ref) {
      const iframe =
        ref.contentWindow ||
        (ref.contentDocument.document || ref.contentDocument)

      iframe.document.open()
      iframe.document.write(src)
      iframe.document.close()
    }
  }

  toggle = () => this.setState({open: !this.state.open})

  render() {
    const {open} = this.state

    return (
      <div>
        <Button style={{marginBottom: '1em'}} onClick={this.toggle}>
          ดูผลลัพธ์ของโค้ด HTML
        </Button>

        {open && <Frame innerRef={r => (this.iframe = r)} />}
      </div>
    )
  }
}
