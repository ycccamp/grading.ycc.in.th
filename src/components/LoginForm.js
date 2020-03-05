import React from 'react'
import Button from '../components/Button'

/* const Input = ({icon, ...props}) => (
  <Field
    component={TextField}
    size="large"
    prefix={<Icon type={icon} style={{color: 'rgba(0,0,0,.25)'}} />}
    addonAfter={<Icon type={icon} />}
    {...props}
  />
)

*/

const LoginForm = ({handleSubmit}) => (
  <div>
    <div style={{marginTop: '1.5em', alignSelf: 'flex-end'}}>
      <Button type="primary" htmlType="submit" size="large" icon="login">
        เข้าสู่ระบบด้วย Google
      </Button>
    </div>
  </div>
)
/*
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
*/

// const enhance = reduxForm({form: 'login', validate})

export default LoginForm
