import React from 'react'
import {Spin} from 'antd'
import {connect} from 'react-redux'
import styled, {css} from 'react-emotion'
import Image from 'react-medium-image-zoom'

import {Evaluation} from './candidatePreview'

import Card from '../components/Card'
import Photo from '../components/Photo'
import Answers from '../components/Answers'

import {candidateSelector} from '../ducks/campers.selector'

import {religions, grades, genders} from '../core/options'

const Title = styled.h1``

const personalFields = Object.entries({
  firstname: 'ชื่อ',
  lastname: 'นามสกุล',
  age: 'อายุ',
  major: 'สาขา',
  birthdate: 'วันเกิด',
  gender: 'เพศ',
  religion: 'ศาสนา',
  class: 'ระดับชั้น',
  school: 'โรงเรียน',
  phone: 'เบอร์โทรศัพท์',
  email: 'อีเมล',
  socialMedia: 'Twitter ID',
  address: 'ที่อยู่',
  disease: 'โรคประจำตัว',
  foodAllergy: 'อาหารที่แพ้',
  drugAllergy: 'ยาที่แพ้',
  shirtSize: 'ขนาดเสื้อ',
  activity: 'กิจกรรมหรือผลงานที่น้องๆ เคยทำหรือเข้าร่วม',
  facebookDisplayName: 'ชื่อ Facebook',
  facebookEmail: 'อีเมล์ Facebook',
  facebookPhotoURL: 'รูปภาพ Facebook',
})

const parentFields = Object.entries({
  parentFirstName: 'ชื่อผู้ปกครอง',
  parentLastName: 'นามสกุลผู้ปกครอง',
  parentRelation: 'ความสัมพันธ์',
  parentPhone: 'เบอร์โทรศัพท์',
})

const Item = styled.div`
  color: #333;
  font-size: 1.12em;
  line-height: 1.8em;
`

const Label = styled.strong`
  font-weight: bold;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

function format(name, data) {
  const answer = data[name]

  if (name === 'religion') {
    return religions[answer]
  }

  if (name === 'class') {
    return grades[answer]
  }

  if (name === 'gender') {
    return genders[answer]
  }

  if (answer) {
    return answer
  }

  return '-'
}

const Text = styled.Text`
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
`

const Section = ({data, title, fields}) => (
  <Card>
    <Title>{title}</Title>

    {fields.map(([name, label]) => (
      <Item key={name}>
        <Label>{label}:</Label> <Text>{format(name, data)}</Text>
      </Item>
    ))}
  </Card>
)

const CandidateSummary = ({data}) => {
  if (data) {
    return (
      <div>
        <Photo id={data.id} />

        <Section title="ข้อมูลส่วนตัว" fields={personalFields} data={data} />
        <Section title="ข้อมูลผู้ปกครอง" fields={parentFields} data={data} />

        <h1>คำถามกลาง</h1>
        <Answers data={data} type="core" />

        <h2>การประเมินผลสำหรับคำถามกลาง</h2>
        <Evaluation data={data.coreEvaluation} />

        <h1>คำถามสาขา</h1>
        <Answers data={data} type={data.major} />

        <h2>การประเมินผลสำหรับคำถามสาขา</h2>
        <Evaluation data={data.majorEvaluation} />
      </div>
    )
  }

  return <Spin />
}

const mapStateToProps = (state, {match}) => ({
  data: candidateSelector(state, match.params.id),
})

const enhance = connect(mapStateToProps)

export default enhance(CandidateSummary)
