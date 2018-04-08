import React from 'react'
import {connect} from 'react-redux'
import styled from 'react-emotion'

import GradingForm from '../components/GradingForm'

import {submit, delist, entrySelector} from '../ducks/grading'

const Small = styled.small`
  font-size: 0.65em;
  margin-left: 0.35em;

  text-transform: capitalize;
`

const Grading = ({data, role, delist, submit}) => (
  <div>
    <h1>
      <span>ตรวจคำถาม</span>
      {role === 'core' && <Small> สาขา: {data.major}</Small>}
    </h1>

    <GradingForm role={role} data={data} delist={delist} onSubmit={submit} />
  </div>
)

const mapStateToProps = (state, props) => ({
  role: state.user.role,
  data: entrySelector(state, props),
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
