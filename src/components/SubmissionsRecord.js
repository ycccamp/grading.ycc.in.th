import React from 'react'
import * as R from 'ramda'
import {DateTime} from 'luxon'
import styled, {css} from 'react-emotion'
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
  updatedAt: {
    title: 'เวลาที่สมัคร',
    render: time => time && time.toLocaleString(),
  },
  status: {
    title: 'สถานะ',
    render: (text, record) => {
      if (record.delisted) {
        return `ถูกคัดออกโดย ${record.delistedBy}`
      }

      if (record.scores) {
        return 'ตรวจให้คะแนนแล้ว'
      }

      return 'รอการตรวจให้คะแนน'
    },
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

const gradedStyle = css`
  background: #7bed9f;
`

const delistedStyle = css`
  background: #dfe4ea;
`

function highlightRows(record, index) {
  if (record.delisted) {
    return delistedStyle
  }

  if (record.scores) {
    return gradedStyle
  }
}

const SubmissionsRecord = ({...props}) => (
  <Records
    fields={fields}
    rowKey="id"
    rowClassName={highlightRows}
    {...props}
  />
)

const mapStateToProps = state => ({
  data: submissionSelector(state),
})

const enhance = connect(mapStateToProps)

export default enhance(SubmissionsRecord)
