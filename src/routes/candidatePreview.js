import React from 'react'
import * as R from 'ramda'
import {connect} from 'react-redux'
import styled from 'react-emotion'
import {Spin, Button} from 'antd'

import Card from '../components/Card'
import Answers from '../components/Answers'

import {chooseCamper} from '../ducks/campers'
import {candidateSelector} from '../ducks/campers.selector'

import {grades, genders} from '../core/options'

const ButtonGroup = Button.Group

const Heading = styled.h1`
  color: #333;
  font-size: 1.58em;

  margin-top: 0.3em;
  margin-bottom: 0.95em;

  text-transform: capitalize;
`

const Paragraph = styled.p`
  color: #555;
  font-size: 1.38em;
  font-weight: 500;
  font-family: 'Taviraj';

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;

  padding: 0.8em;
  background: white;

  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 1.5px 1px;
  transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
`

export const Evaluation = ({data}) => {
  if (data) {
    return (
      <Card>
        {Object.entries(data).map(([gradedBy, entry]) => (
          <div style={{marginBottom: '0.5em'}} key={gradedBy}>
            <strong>{gradedBy}:</strong>
            <div>
              {entry.scores.join(' + ')} = {R.sum(entry.scores)}
            </div>
            <div style={{fontSize: '1.28em'}}>{entry.notes}</div>
          </div>
        ))}
      </Card>
    )
  }

  return <Spin />
}

const CandidatePreview = ({data, choose}) => {
  if (data) {
    return (
      <div>
        <Heading>
          อายุ: {data.age} | ระดับชั้น: {grades[data.class]} | เพศ:{' '}
          {genders[data.gender]} | สาขา: {data.major}
        </Heading>

        <ButtonGroup size="large" style={{marginBottom: '2em'}}>
          <Button
            type={data.selected && !data.alternate && 'primary'}
            onClick={() => choose()}>
            ตัวจริง
          </Button>
          <Button
            type={data.alternate && 'primary'}
            onClick={() => choose('alternate')}>
            ตัวสำรอง
          </Button>
          <Button
            type={!data.selected && 'primary'}
            onClick={() => choose('cancel')}>
            ไม่ถูกเลือก
          </Button>
        </ButtonGroup>

        <h2>กิจกรรมที่เคยเข้าร่วม</h2>

        <Paragraph>{data.activity}</Paragraph>

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

const mapDispatchToProps = (dispatch, {match}) => ({
  choose: mode => dispatch(chooseCamper(match.params.id, mode)),
})

const enhance = connect(mapStateToProps, mapDispatchToProps)

export default enhance(CandidatePreview)
