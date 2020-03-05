import React, {Component} from 'react'
import * as R from 'ramda'
import styled, {css} from 'react-emotion'
import {connect} from 'react-redux'
import {Link} from 'react-static'

import Button from '../components/Button'
import Records from '../components/Records'

import {campersSelector} from '../ducks/campers.selector'

import {grades, genders, religions} from '../core/options'

const Meta = styled.div`
  word-break: break-word;
`

const Trigger = styled.div`
  cursor: pointer;
`

const Text = styled.small`
  cursor: pointer;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

function getStatus(record) {
  if (record.delisted) {
    return `ถูกคัดออกแล้วโดย ${record.delistedBy}`
  }

  if (!record.coreEvaluation && !record.majorEvaluation) {
    return 'ยังไม่ได้รับการประเมินผล'
  }

  if (!record.coreEvaluation) {
    return 'ยังไม่ได้ตรวจคำถามสาขา'
  }

  if (!record.majorEvaluation) {
    return 'ยังไม่ได้ตรวจคำถามกลาง'
  }

  return 'ประเมินผลไปบ้างแล้ว'
}

function truncate(text) {
  if (typeof text !== 'string') {
    return null
  }

  if (text.length < 100) {
    return text
  }

  return text.substring(0, 100) + '...'
}

class Answer extends Component {
  state = {shown: false}

  toggle = () => this.setState({shown: !this.state.shown})

  render() {
    const {shown} = this.state
    const {children} = this.props

    if (children) {
      return (
        <Text onClick={this.toggle} title="กดเพื่อดูข้อความเต็ม">
          {shown ? children : truncate(children)}
        </Text>
      )
    }

    return null
  }
}

class Grading extends Component {
  state = {shown: false}

  toggle = () => this.setState({shown: !this.state.shown})

  render() {
    const {shown} = this.state
    const {data} = this.props

    if (data) {
      return (
        <Trigger onClick={this.toggle} title="กดเพื่อดูคอมเม้นต์ของกรรมการ">
          {Object.entries(data).map(([gradedBy, entry]) => (
            <div style={{marginBottom: '0.5em'}} key={gradedBy}>
              <strong>
                <small>{gradedBy}:</small>
              </strong>
              <div>
                {entry.scores.join(' + ')} = {R.sum(entry.scores)}
              </div>
              <Text>{shown ? entry.notes : truncate(entry.notes)}</Text>
            </div>
          ))}
        </Trigger>
      )
    }

    return null
  }
}

const fields = {
  number: {
    title: '　',
    width: 60,
    render: (text, record, index) => <code>{index + 1}</code>,
    fixed: 'left',
  },
  id: {
    title: 'รหัสอ้างอิง',
    render: text => <small>{text}</small>,
  },
  track: 'สาขา',
  totalScore: {
    title: 'คะแนนเฉลี่ย 100',
    render: num => num && num.toFixed(2),
  },
  coreScore: {
    title: 'คะแนนกลาง 40',
    render: num => num && num.toFixed(2),
  },
  majorScore: {
    title: 'คะแนนสาขา 60',
    render: num => num && num.toFixed(2),
  },
  extraScore: {
    title: 'คะแนนเพิ่มเติม',
    render: num => num && num.toFixed(2),
  },
  coreEvaluation: {
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
    render: (text, record) => <Meta>{getStatus(record)}</Meta>,
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
    width: 200,
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
  more: {
    title: 'ดูเพิ่มเติม',
    render: (text, record) => (
      <Link to={`/summary/${record.id}`}>
        <Button icon="export" />,
      </Link>
    ),
    width: 100,
    fixed: 'right',
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

const CandidatesRecord = ({campers, ...props}) => (
  <Records
    fields={fields}
    maxWidth={130}
    rowClassName={highlightRows}
    rowKey="id"
    {...props}
  />
)

const mapStateToProps = state => ({
  data: campersSelector(state),
})

const enhance = connect(mapStateToProps)

export default enhance(CandidatesRecord)
