import React from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import {Row, Col} from 'antd'
import styled from 'react-emotion'

import Card from '../components/Card'

import {getEvaluation} from '../core/evaluation'

const Name = styled.div`
  color: #555;
  font-size: 1.28em;
  font-weight: 400;
`

const Progress = styled.div`
  color: #333;
  font-size: 1.8em;
  font-weight: 500;
`

const Info = styled.div`
  color: #555;
  font-size: 1.04em;
`

const Stats = ({data}) => (
  <div>
    <h1>สถิติการตรวจคำถาม</h1>

    <Row type="flex" justify="start" gutter={32}>
      {data.map(staff => (
        <Col span={6} key={staff.id}>
          <Card>
            <Name>
              {staff.nick} ({staff.name}) - {staff.role}
            </Name>
            <Progress>{staff.progress.toFixed(2)}%</Progress>
            <Info>
              ตรวจไปแล้ว {staff.evaluated} คน เหลืออีก {staff.remaining} คน
            </Info>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
)

// List of graders' nickname.

// ใครตรวจไปที่คำถามแล้ว
// ตรวจครบมั้ย

const countSelector = createSelector(
  s => s.camper.campers,
  candidates => {
    const list = candidates.filter(x => !x.delisted)

    const total = list.length
    const design = list.filter(x => x.major === 'design').length
    const marketing = list.filter(x => x.major === 'marketing').length
    const programming = list.filter(x => x.major === 'programming').length
    const content = list.filter(x => x.major === 'content').length

    return {total, design, marketing, programming, content}
  },
)

const statsSelector = createSelector(
  s => s.grading.data,
  s => s.grading.staffs,
  countSelector,
  (grading, staffs, count) => {
    const stats = staffs.filter(staff => staff.role !== 'admin').map(staff => {
      const evaluations = grading
        .map(item => getEvaluation(item, staff.name, staff.role))
        .filter(x => x)

      const role = staff.role === 'core' ? 'total' : staff.role

      const evaluated = evaluations.length
      const remaining = count[role] - evaluated
      const progress = evaluated / count[role] * 100

      return {
        ...staff,
        evaluated,
        remaining,
        progress,
        evaluations,
      }
    })

    return stats.sort((a, b) => b.progress - a.progress)
  },
)

const mapStateToProps = state => ({
  data: statsSelector(state),
})

const enhance = connect(mapStateToProps)

export default enhance(Stats)
