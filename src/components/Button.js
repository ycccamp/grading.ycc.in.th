import React from 'react'
import {Button} from 'antd'
import Ink from 'react-ink'

const RippleButton = ({children, ...props}) => (
  <Button {...props}>
    <Ink />&nbsp;
    {children}
  </Button>
)

export default RippleButton
