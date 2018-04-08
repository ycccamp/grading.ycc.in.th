import React from 'react'
import {connect} from 'react-redux'
import styled from 'react-emotion'
import {Spin} from 'antd'

import GradingForm from '../components/GradingForm'

import {submit, delist, entrySelector, gradingSelector} from '../ducks/grading'

const Heading = styled.h1`
  margin: 0;
`

const SubHeading = styled.h2`
  color: #666;
  font-size: 1.08em;

  margin-top: 0.3em;
  margin-bottom: 0.95em;

  text-transform: capitalize;
`

export const grades = {
  m3: 'มัธยมศึกษาปีที่ 3',
  m4: 'มัธยมศึกษาปีที่ 4',
  m5: 'มัธยมศึกษาปีที่ 5',
  m6: 'มัธยมศึกษาปีที่ 6',
  other: 'อื่นๆ',
}

export const genders = {
  male: 'ชาย',
  female: 'หญิง',
  other: 'เพศอื่นๆ',
  none: 'ไม่ระบุ',
}

const Grading = ({data, role, delist, submit, initial}) => {
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

const mapStateToProps = (state, props) => ({
  role: state.user.role,
  data: entrySelector(state, props),
  initial: gradingSelector(state, props),
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
