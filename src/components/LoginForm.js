import React from 'react'
import {Form, Icon} from 'antd'
import {Field, reduxForm} from 'redux-form'
import {TextField} from 'redux-form-antd'

import Label from '../components/Label'
import Button from '../components/Button'

const Input = ({icon, ...props}) => (
  <Field
    component={TextField}
    size="large"
    prefix={<Icon type={icon} style={{color: 'rgba(0,0,0,.25)'}} />}
    addonAfter={<Icon type={icon} />}
    {...props}
  />
)

const LoginForm = ({handleSubmit}) => (
  <Form onSubmit={handleSubmit}>
    <div>
      <Label>ชื่อผู้ใช้:</Label>
      <Input name="username" icon="user" placeholder="Username" />
    </div>
    <div style={{marginTop: '1.5em'}}>
      <Label>รหัสผ่าน:</Label>
      <Input
        name="password"
        icon="lock"
        placeholder="Password"
        type="password"
      />
    </div>
    <div style={{marginTop: '1.5em', alignSelf: 'flex-end'}}>
      <Button type="primary" htmlType="submit" size="large" icon="login">
        เข้าสู่ระบบ
      </Button>
    </div>
  </Form>
)

const validate = values => {
  const errors = {}

  if (!values.username) {
    errors.username = 'โปรดระบุชื่อผู้ใช้'
  }

  if (!values.password) {
    errors.password = 'โปรดระบุรหัสผ่าน'
  }

  return errors
}

const enhance = reduxForm({form: 'login', validate})

export default enhance(LoginForm)
