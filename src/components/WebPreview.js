import React, {Component} from 'react'

import Button from '../components/Button'

export default class WebPreview extends Component {
  state = {open: false}

  toggle = () => this.setState({open: !this.state.open})

  render() {
    const {open} = this.state
    const {src} = this.props

    return (
      <div>
        <Button style={{marginBottom: '1em'}} onClick={this.toggle}>
          ดูผลลัพธ์ของเว็บไซต์
        </Button>

        {open && (
          <div
            dangerouslySetInnerHTML={{
              __html: src,
            }}
          />
        )}
      </div>
    )
  }
}
