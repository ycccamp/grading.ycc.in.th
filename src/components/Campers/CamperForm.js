import React from 'react'
import {Form, Row, Col} from 'antd'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import {TextField, TextAreaField} from 'redux-form-antd'

import Label from '../../components/Label'
import Button from '../../components/Button'

const Input = ({label, placeholder = label, ...props}) => (
  <div>
    <Label>{label}:</Label>
    <Field component={TextField} placeholder={placeholder} {...props} />
  </div>
)

const CamperForm = ({handleSubmit, admin}) => (
  <Form onSubmit={handleSubmit}>
    <Row gutter={16}>
      <Col span={12}>
        <Input name="username" label="ชื่อสมาชิก" />
      </Col>
      <Col span={12}>
        <Input name="line" label="Line ID" />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={6}>
        <Input name="phone" label="เบอร์ติดต่อ" placeholder="0812345678" />
      </Col>
      <Col span={6}>
        <Input name="name" label="ชื่อ - นามสกุล" />
      </Col>
      <Col span={6}>
        <Input name="account" label="เลขบัญชีธนาคาร" placeholder="123456789" />
      </Col>
    </Row>
    <Row gutter={16}>
      <div>
        <Label>บันทึกความจำ:</Label>
        <Field name="note" component={TextAreaField} rows={4} />
      </div>
    </Row>
    <Row gutter={16}>
      <Col span={13}>
        <div>
          <span>วันที่สมัคร:&nbsp;</span>
          <code>{new Date().toLocaleString()}</code>
        </div>
        <div style={{paddingTop: '0.3em'}}>
          <span>ผู้ทำการสมัคร:&nbsp;</span>
          <code>{admin}</code>
        </div>
      </Col>
      <Col span={5}>
        <Button type="danger" htmlType="reset" size="large" icon="close">
          ยกเลิก
        </Button>
      </Col>
      <Col span={6}>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon="check"
          style={{width: '100%'}}>
          เพิ่มสมาชิก
        </Button>
      </Col>
    </Row>
  </Form>
)

const requiredFields = ['username', 'line', 'phone', 'name', 'bank', 'account']

const phoneRegex = /^[0-9\-+]{9,15}$/
const accNoRegex = /\d{10}/

const validate = values => {
  const errors = {}

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'โปรดระบุข้อมูล'
    }
  })

  if (!phoneRegex.exec(values.phone)) {
    errors.phone = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'
  }

  if (!accNoRegex.exec(values.account)) {
    errors.account = 'รูปแบบบัญชีธนาคารไม่ถูกต้อง'
  }

  return errors
}

const mapStateToProps = state => ({
  camper: state.camper,
  admin: state.user.name
  initialValues: {
    note: '-',
    bank: 'scb',
  },
})

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({form: 'camper', validate}),
)

export default enhance(CamperForm)
