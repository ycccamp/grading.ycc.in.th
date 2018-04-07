import React from 'react'
import {connect} from 'react-redux'
import styled from 'react-emotion'
import {createSelector} from 'reselect'

import GradingForm from '../components/GradingForm'

import {submitGrading} from '../ducks/grading'

const Small = styled.small`
  font-size: 0.65em;
  margin-left: 0.35em;

  text-transform: capitalize;
`

const Grading = ({data, role, submit}) => (
  <div>
    <h1>
      <span>ตรวจคำถาม</span>
      {role === 'core' && <Small> สาขา: {data.major}</Small>}
    </h1>

    <GradingForm role={role} data={data} onSubmit={submit} />
  </div>
)

const entrySelector = createSelector(
  s => s.camper.campers,
  (s, p) => p.match.params.id,
  (entries, id) => {
    return entries.find(camper => camper.id === id)
  },
)

const mapStateToProps = (state, props) => ({
  role: state.user.role,
  data: entrySelector(state, props),
})

const mapDispatchToProps = (dispatch, {match}) => ({
  submit: data => {
    const {id} = match.params

    dispatch(submitGrading(id, data))
  },
})

const enhance = connect(mapStateToProps, mapDispatchToProps)

export default enhance(Grading)
