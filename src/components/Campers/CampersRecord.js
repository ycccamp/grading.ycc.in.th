import React from 'react'
import {DateTime} from 'luxon'
import styled from 'react-emotion'
import {connect} from 'react-redux'

import Records from '../../components/Records'

const Time = styled.div`
  word-break: break-word;
`

const fields = {
  name: 'ชื่อ - นามสกุล',
  phone: 'เบอร์โทร',
  note: 'บันทึกความจำ',
  createdAt: {
    title: 'วันที่สมัคร',
    render: date => <Time>{DateTime.fromJSDate(date).toFormat('F')}</Time>,
  },
  updatedAt: {
    title: 'เวลาทำรายการ',
    render: date =>
      date ? (
        <Time>{DateTime.fromJSDate(date).toFormat('F')}</Time>
      ) : (
        'ยังไม่เคยทำรายการ'
      ),
  },
  action: {
    title: 'ทำรายการ',
    render: text => <u>แก้ไข</u>,
    fixed: 'right',
  },
}

const WithdrawRecord = ({campers, ...props}) => (
  <Records fields={fields} data={campers} rowKey="id" {...props} />
)

const mapStateToProps = state => ({
  campers: state.camper.campers,
})

const enhance = connect(mapStateToProps)

export default enhance(WithdrawRecord)
