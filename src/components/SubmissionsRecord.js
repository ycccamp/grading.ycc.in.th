import React from 'react'
import * as R from 'ramda'
import {DateTime} from 'luxon'
import styled, {css} from 'react-emotion'
import {connect} from 'react-redux'
import {Link} from 'react-static'

import Button from './Button'
import Records from './Records'

import {submissionSelector} from '../ducks/grading'

const Note = styled.span`
  font-size: 0.95em;
  word-break: break-word;
`

const fields = {
  number: {
    title: '　',
    width: 60,
    fixed: 'left',
  },
  id: {
    title: 'รหัสอ้างอิง',
    render: text => <small>{text}</small>,
  },
  scores: {
    title: 'คะแนนที่ฉันให้',
    render: list => list && `${R.sum(list)} (${list.join(' + ')})`,
  },
  notes: {
    title: 'จดบันทึก',
    render: text => <Note>{text}</Note>,
  },
  updatedAt: {
    title: 'เวลาที่สมัครเข้าค่าย',
    render: time => time && <Note>{time.toLocaleString()}</Note>,
  },
  gradedAt: {
    title: 'เวลาที่ตรวจให้คะแนน',
    render: time => time && <Note>{time.toLocaleString()}</Note>,
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
    render: (text, record) => {
      if (record.delisted) {
        return `ถูกคัดออกโดย ${record.delistedBy}`
      }

      return (
        <Link to={`/grade/${record.id}`}>
          <Button>ตรวจให้คะแนน</Button>
        </Link>
      )
    },
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
