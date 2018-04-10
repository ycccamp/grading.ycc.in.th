import React from 'react'
import * as R from 'ramda'
import styled, {css} from 'react-emotion'
import {connect} from 'react-redux'

import Records from '../../components/Records'

import {submissionSelector} from '../../ducks/grading'

import {grades, genders, religions} from '../../core/options'

const Meta = styled.div`
  word-break: break-word;
`

const Notes = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
`

const Answer = styled.small`
  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

const Grading = ({data}) => {
  if (data) {
    return (
      <div>
        {Object.entries(data).map(([gradedBy, entry]) => (
          <div style={{marginBottom: '0.5em'}} key={gradedBy}>
            <strong>
              <small>{gradedBy}:</small>
            </strong>
            <div>
              {entry.scores.join(' + ')} = {R.sum(entry.scores)}
            </div>
            <Notes>{entry.notes}</Notes>
          </div>
        ))}
      </div>
    )
  }

  return null
}

const fields = {
  number: {
    title: '　',
    width: 60,
  },
  id: {
    title: 'รหัสอ้างอิง',
    render: text => <small>{text}</small>,
  },
  firstname: {
    title: 'ชื่อ',
    width: 100,
  },
  lastname: {
    title: 'นามสกุล',
    width: 100,
  },
  major: 'สาขา',
  totalScore: {
    title: 'คะแนนเฉลี่ย',
    render: num => num && num.toFixed(2),
  },
  coreScore: {
    title: 'คะแนนกลาง',
    render: num => num && num.toFixed(2),
  },
  majorScore: {
    title: 'คะแนนสาขา',
    render: num => num && num.toFixed(2),
  },
  core: {
    title: 'การประเมินกลาง',
    render: data => <Grading data={data} />,
    width: 300,
  },
  majorEvaluation: {
    title: 'การประเมินสาขา',
    render: data => <Grading data={data} />,
    width: 300,
  },
  status: {
    title: 'สถานะผู้สมัคร',
    render: (text, record) => {
      if (record.delisted) {
        return `ถูกคัดออกแล้วโดย ${record.delistedBy}`
      }

      if (record.core || !record.majorEvaluation) {
        return 'ยังไม่ได้ตรวจคำถามสาขา'
      }

      if (!record.core || record.majorEvaluation) {
        return 'ยังไม่ได้ตรวจคำถามกลาง'
      }

      if (record.core && record.majorEvaluation) {
        return 'มีการตรวจไปบ้างแล้ว'
      }

      return 'ยังไม่มีการตรวจ'
    },
  },
  age: {
    title: 'อายุ',
    width: 80,
  },
  gender: {
    title: 'เพศ',
    width: 80,
    render: text => genders[text] || text,
  },
  birthdate: 'วันเกิด',
  religion: {
    title: 'ศาสนา',
    render: text => religions[text] || text,
  },
  class: {
    title: 'ชั้นเรียน',
    render: text => grades[text] || text,
  },
  school: 'โรงเรียน',
  address: {
    title: 'ที่อยู่',
    render: text => <Answer>{text}</Answer>,
  },
  phone: 'เบอร์โทรศัพท์',
  email: 'อีเมล',
  shirtSize: {
    title: 'ไซส์เสื้อ',
    width: 80,
  },
  activity: {
    title: 'กิจกรรมที่ทำ',
    width: 300,
    render: text => <Answer>{text}</Answer>,
  },
  parentFirstName: 'ชื่อผู้ปกครอง',
  parentLastName: 'นามสกุลผู้ปกครอง',
  parentRelation: 'ความสัมพันธ์ผปค.่',
  parentPhone: 'เบอร์โทรผปค.',
  createdAt: {
    title: 'เริ่มต้นกรอกฟอร์มวันที่',
    width: 150,
    render: time => time && <Meta>{time.toLocaleString()}</Meta>,
  },
  updatedAt: {
    title: 'สมัครเข้าร่วมค่ายวันที่',
    width: 150,
    render: time => time && <Meta>{time.toLocaleString()}</Meta>,
  },
  generalAnswer1: {
    title: 'คำถามกลาง 1',
    width: 300,
    render: text => <Answer>{text}</Answer>,
  },
  generalAnswer2: {
    title: 'คำถามกลาง 2',
    width: 300,
    render: text => <Answer>{text}</Answer>,
  },
  generalAnswer3: {
    title: 'คำถามกลาง 3',
    width: 300,
    render: text => <Answer>{text}</Answer>,
  },
  majorAnswer1: {
    title: 'คำถามสาขา 1',
    width: 300,
    render: text => <Answer>{text}</Answer>,
  },
  majorAnswer2: {
    title: 'คำถามสาขา 2',
    width: 300,
    render: text => <Answer>{text}</Answer>,
  },
  majorAnswer3: {
    title: 'คำถามสาขา 3',
    width: 300,
    render: text => <Answer>{text}</Answer>,
  },
}

const delistedStyle = css`
  background: #dfe4ea;
`

function highlightRows(record, index) {
  if (record.delisted) {
    return delistedStyle
  }
}

const CampersRecord = ({campers, ...props}) =>
  console.log(props.data) || (
    <Records
      fields={fields}
      maxWidth={120}
      rowClassName={highlightRows}
      rowKey="id"
      {...props}
    />
  )

const mapStateToProps = state => ({
  data: submissionSelector(state),
})

const enhance = connect(mapStateToProps)

export default enhance(CampersRecord)
