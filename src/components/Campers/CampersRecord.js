import React from 'react'
import {DateTime} from 'luxon'
import styled from 'react-emotion'
import {connect} from 'react-redux'

import Records from '../../components/Records'

import {submissionSelector} from '../../ducks/grading'

import {grades, genders, religions} from '../../core/options'

const Meta = styled.div`
  word-break: break-word;
`

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
    render: text => <small>{text}</small>,
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
    render: text => <small>{text}</small>,
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
    render: text => <small>{text}</small>,
  },
  generalAnswer2: {
    title: 'คำถามกลาง 2',
    width: 300,
    render: text => <small>{text}</small>,
  },
  generalAnswer3: {
    title: 'คำถามกลาง 3',
    width: 300,
    render: text => <small>{text}</small>,
  },
  majorAnswer1: {
    title: 'คำถามสาขา 1',
    width: 300,
    render: text => <small>{text}</small>,
  },
  majorAnswer2: {
    title: 'คำถามสาขา 3',
    width: 300,
    render: text => <small>{text}</small>,
  },
  majorAnswer3: {
    title: 'คำถามสาขา 3',
    width: 300,
    render: text => <small>{text}</small>,
  },
  action: {
    title: 'ทำรายการ',
    render: text => <u>แก้ไข</u>,
    fixed: 'right',
  },
}

const CampersRecord = ({campers, ...props}) => (
  <Records fields={fields} maxWidth={120} rowKey="id" {...props} />
)

const mapStateToProps = state => ({
  data: submissionSelector(state),
})

const enhance = connect(mapStateToProps)

export default enhance(CampersRecord)
