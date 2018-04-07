import React from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import styled from 'react-emotion'

import {getQuestions} from '../core/grading'

const Question = styled.p`
  font-size: 1.05em;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

const Answer = styled.p`
  font-size: 1.05em;
  font-weight: bold;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

const coreFields = ['generalAnswer1', 'generalAnswer2', 'generalAnswer3']
const majorFields = ['majorAnswer1', 'majorAnswer2', 'majorAnswer3']

function getAnswer(data, role, index) {
  let field = majorFields[index]

  if (role === 'core') {
    field = coreFields[index]
  }

  return data[field]
}

const Grading = ({data, role}) => (
  <div>
    <h1>ตรวจคำถาม</h1>

    {getQuestions(role).map((item, index) => (
      <div key={index}>
        <Question>
          {item.question} (Points: {item.max})
        </Question>
        <Answer>{getAnswer(data, role, index)}</Answer>
      </div>
    ))}
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

const enhance = connect(mapStateToProps)

export default enhance(Grading)
