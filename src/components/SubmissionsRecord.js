import React from 'react'
import * as R from 'ramda'
import {DateTime} from 'luxon'
import styled from 'react-emotion'
import {connect} from 'react-redux'
import {Link} from 'react-static'

import Button from './Button'
import Records from './Records'

import {submissionSelector} from '../ducks/grading'

const Time = styled.div`
  word-break: break-word;
`

const fields = {
  number: 'ลำดับที่',
  id: 'รหัสอ้างอิง',
  scores: {
    title: 'คะแนนที่ฉันให้',
    render: list => list && `${R.sum(list)} (${list.join(' + ')})`,
  },
  notes: 'จดบันทึก',
  coreScore: 'เฉลี่ยคำถามกลาง',
  majorScore: 'เฉลี่ยคำถามสาขา',
  totalScore: 'คะแนนเฉลี่ยรวม',
  updatedAt: {
    title: 'เวลาที่สมัคร',
    render: text => text.toLocaleString(),
  },
  action: {
    title: 'ตรวจให้คะแนน',
    render: (text, record) => (
      <Link to={`/grade/${record.id}`}>
        <Button>ตรวจให้คะแนน</Button>
      </Link>
    ),
    fixed: 'right',
  },
}

const SubmissionsRecord = ({...props}) => (
  <Records fields={fields} rowKey="id" {...props} />
)

const mapStateToProps = state => ({
  data: submissionSelector(state),
})

const enhance = connect(mapStateToProps)

export default enhance(SubmissionsRecord)
