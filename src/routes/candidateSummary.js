import React from 'react'
import {Spin} from 'antd'
import {connect} from 'react-redux'
import styled, {css} from 'react-emotion'
import Image from 'react-medium-image-zoom'

import {Evaluation} from './candidatePreview'

import Card from '../components/Card'
import Answers from '../components/Answers'

import {candidateSelector} from '../ducks/campers.selector'

import {religions, grades, genders} from '../core/options'

const Title = styled.h1``

const personalFields = Object.entries({
  firstname: 'ชื่อ',
  lastname: 'นามสกุล',
  age: 'อายุ',
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

const Section = ({data, title, fields}) => (
  <Card>
    <Title>{title}</Title>

    {fields.map(([name, label]) => (
      <Item key={name}>
        <Label>{label}:</Label> {format(name, data)}
      </Item>
    ))}
  </Card>
)

const imageStyle = css`
  position: relative;
  z-index: 2;

  width: 100%;
  min-height: 400px;
  max-width: 100%;

  margin-top: 0.8em;
  margin-bottom: 0.8em;
  box-shadow: 0 1px 1.5px 1px rgba(0, 0, 0, 0.12);

  background-color: #efefef;
`

const avatarStyle = css`
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 500px;
  min-height: 500px;

  margin: 0 auto;
  margin-top: 0.8em;
  margin-bottom: 1.8em;

  box-shadow: 0 1px 1.5px 1px rgba(0, 0, 0, 0.12);
  background-color: #fbfcff;
`

const CandidateSummary = ({data}) => {
  if (data) {
    return (
      <div>
        <Image
          image={{src: data.photo, className: avatarStyle}}
          imageZoom={{src: data.photo}}
        />

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
