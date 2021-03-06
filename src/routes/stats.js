import React from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import {Row, Col} from 'antd'
import styled from 'react-emotion'

import Card from '../components/Card'

import {getEvaluation} from '../core/evaluation'

const Name = styled.div`
  color: #555;
  font-size: 1.18em;
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
  text-transform: capitalize;
`

const properties = ['total', 'delisted', 'creative', 'designer', 'developer']

const Stats = ({data, ...count}) => (
  <div>
    <h1>สถิติการตรวจคำถาม</h1>

    <Row type="flex" justify="center" align="middle" gutter={16}>
      {properties.map(property => (
        <Col span={4} key={property}>
          <Card>
            <Info>{property}</Info>
            <Progress>{count[property]}</Progress>
          </Card>
        </Col>
      ))}
    </Row>

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
  s => s.grading.data,
  (campers, entries) => {
    const candidates = campers.map(camper => {
      const entry = entries.find(entry => entry.id === camper.id)

      return {...entry, ...camper}
    })

    const list = candidates.filter(x => !x.delisted)
    const delisted = candidates.filter(x => x.delisted).length

    const total = list.length
    const designer = list.filter(x => x.track === 'designer').length
    const creative = list.filter(x => x.track === 'creative').length
    const developer = list.filter(x => x.track === 'developer').length

    return {total, delisted, designer, creative, developer}
  },
)

const statsSelector = createSelector(
  s => s.grading.data,
  s => s.grading.staffs,
  countSelector,
  (grading, staffs, count) => {
    console.log('Staffs>', staffs)

    const stats = staffs
      .filter(staff => staff.role !== 'admin')
      .map(staff => {
        const evaluations = grading
          .map(item => {
            let name = staff.name
            if (name) name = name.toLowerCase()

            console.log(name)

            return getEvaluation(item, name, staff.role)
          })
          .filter(x => x)

        const role = staff.role === 'core' ? 'total' : staff.role

        const evaluated = evaluations.length
        let remaining = count[role] - evaluated
        if (remaining < 0) remaining = 0

        let progress = (evaluated / count[role]) * 100
        if (progress > 100) progress = 100

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
  ...countSelector(state),
})

const enhance = connect(mapStateToProps)

export default enhance(Stats)
