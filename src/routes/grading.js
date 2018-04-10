import React from 'react'
import {connect} from 'react-redux'
import styled, {css} from 'react-emotion'
import {Spin} from 'antd'
import {createSelector} from 'reselect'

import GradingForm from '../components/GradingForm'

import {submit, delist, entrySelector, gradingSelector} from '../ducks/grading'

import {grades, genders} from '../core/options'

// prettier-ignore
const Heading = styled.h1`
  margin: 0;

  ${props => props.center && css`
    text-align: center;
  `}
`

const SubHeading = styled.h2`
  color: #666;
  font-size: 1.08em;

  margin-top: 0.3em;
  margin-bottom: 0.95em;

  text-transform: capitalize;
`

const Grading = ({data, role, delist, delistedBy, submit, initial}) => {
  if (delistedBy) {
    return (
      <div>
        <Heading center>
          ผู้สมัครดังกล่าวถูกคัดออกไปแล้วโดย {delistedBy}
        </Heading>
      </div>
    )
  }

  if (data) {
    return (
      <div>
        <Heading>
          <span>ตรวจให้คะแนน: ผู้สมัคร #{data.number}</span>
        </Heading>

        <SubHeading>
          {role === 'core' && <span> สาขา: {data.major} | </span>}
          อายุ: {data.age} | ระดับชั้น: {grades[data.class]} | เพศ:{' '}
          {genders[data.gender]}
        </SubHeading>

        <GradingForm
          role={role}
          data={data}
          delist={delist}
          onSubmit={submit}
          initialValues={initial}
        />
      </div>
    )
  }

  return <Spin />
}

const delistedSelector = createSelector(
  s => s.grading.data,
  (s, p) => p.match.params.id,
  (entries, id) => {
    const entry = entries.find(grading => grading.id === id)

    if (entry.delisted) {
      return entry.delistedBy
    }
  },
)

const mapStateToProps = (state, props) => ({
  role: state.user.role,
  data: entrySelector(state, props),
  initial: gradingSelector(state, props),
  delistedBy: delistedSelector(state, props),
})

const mapDispatchToProps = (dispatch, {match}) => {
  const {id} = match.params

  return {
    submit: data => dispatch(submit(id, data)),
    delist: () => dispatch(delist(id)),
  }
}

const enhance = connect(mapStateToProps, mapDispatchToProps)

export default enhance(Grading)
