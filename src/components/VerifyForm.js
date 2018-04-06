import React from 'react'
import {Form, Col, Row} from 'antd'
import {compose, lifecycle} from 'recompose'
import styled from 'react-emotion'
import {connect} from 'react-redux'
import {change, reduxForm, Field} from 'redux-form'
import {TextField, TextAreaField} from 'redux-form-antd'

import Button from '../components/Button'

import {fetchCamper, storeCamper} from '../ducks/member'

const Label = styled.div`
  color: #555;
  margin-bottom: 0.2em;
`

const locale = text => text && text.toLocaleString()
const currency = amount => amount && locale(parseFloat(amount))

const VerifyForm = ({id, record, username, member, handleSubmit}) => (
  <Form onSubmit={handleSubmit}>
    <Row gutter={16}>
      <Col span={12}>
        <div style={{marginBottom: '0.5em'}}>
          <small>
            <code>TxID: {id}</code>
          </small>
        </div>
        <Label>
          ชื่อสมาชิก: <strong>{record.member}</strong>
        </Label>
        <Label>
          ชื่อ - นามสกุล: <strong>{member.name}</strong>
        </Label>
        <Label style={{marginTop: '1.3em'}}>
          วันที่ - เวลา: <strong>{locale(record.timestamp)}</strong>
        </Label>
        <Label>
          ผู้ทำรายการ: <strong>{username}</strong>
        </Label>
      </Col>
      <Col span={12}>
        <div>
          <div>ยอดเงินฝาก:</div>
          <div style={{fontSize: '1.85em', fontWeight: '600'}}>
            {currency(record.amount)} บาท
          </div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <Label>บันทึกความจำ:</Label>
        <div>
          <Field name="note" component={TextAreaField} rows={4} />
        </div>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Button type="danger" htmlType="reset" size="large" icon="close">
          ยกเลิก
        </Button>
      </Col>
      <Col span={12}>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon="check"
          style={{width: '100%'}}>
          ยืนยัน
        </Button>
      </Col>
    </Row>
  </Form>
)

const requiredFields = ['ref', 'amountPromo']

const validate = values => {
  const errors = {}

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'โปรดระบุข้อมูล'
    }
  })

  return errors
}

const mapStateToProps = state => ({
  member: state.member.member,
  record: state.tx.record,
  username: state.user.email.replace('@jwc.in.th', ''),
  initialValues: {
    amountPromo: state.tx.record.amount,
    note: '-',
  },
})

const enhance = compose(
  connect(mapStateToProps, {change, storeCamper}),
  lifecycle({
    async componentDidMount() {
      const {id} = this.props
    },
    async componentDidUpdate(props) {
      const {change, record, storeCamper} = this.props

      if (record.amount !== props.record.amount) {
        await change('verify', 'amountPromo', record.amount)
      }

      if (record.member !== props.record.member) {
        try {
          const member = await fetchCamper(record.member)

          await storeCamper(member)
        } catch (err) {
          console.info('Camper Lookup Error:', err)
        }
      }
    },
  }),
  reduxForm({form: 'verify', validate}),
)

export default enhance(VerifyForm)
