import React from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import styled, {css} from 'react-emotion'
import Image from 'react-medium-image-zoom'

import WebPreview from '../components/WebPreview'

import {getQuestions} from '../core/grading'

const Card = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  padding: 1.5em;
  background: white;

  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 1.5px 1px;
  transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);

  margin-bottom: 1.5em;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 9.5px 2px;
  }
`

const Question = styled.p`
  color: #666;
  font-size: 0.98em;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

const Answer = styled.p`
  color: #555;
  font-size: 1.28em;
  font-weight: bold;
  margin-bottom: 0;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

const Code = styled.code`
  white-space: pre-wrap;
`

const Small = styled.small`
  font-size: 0.65em;
  margin-left: 0.35em;

  text-transform: capitalize;
`

const imageStyle = css`
  position: relative;
  z-index: 2;

  width: 100%;
  min-height: 500px;
  max-width: 100%;

  margin-top: 0.8em;
  margin-bottom: 0.8em;
  box-shadow: 0 1px 1.5px 1px rgba(0, 0, 0, 0.12);

  background-color: #fbfcff;
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

const PreviewAnswer = ({data, role, index}) => {
  const answer = getAnswer(data, role, index)

  if (role === 'programming' && index === 2) {
    return (
      <div>
        <WebPreview src={answer} />
        <Code>{answer}</Code>
      </div>
    )
  }

  if (role === 'design' && index === 2) {
    return (
      <Image
        image={{src: answer, className: imageStyle}}
        imageZoom={{src: answer}}
      />
    )
  }

  if (role === 'content' && index === 1) {
    return (
      <div>
        <Answer>{data.majorAnswer2}</Answer>
        {data.majorAnswer3 && (
          <Answer style={{marginTop: '0.8em'}}>{data.majorAnswer3}</Answer>
        )}
      </div>
    )
  }

  return <Answer>{answer}</Answer>
}

const Grading = ({data, role}) => (
  <div>
    <h1>
      <span>ตรวจคำถาม</span>
      {role === 'core' && <Small> สาขา: {data.major}</Small>}
    </h1>

    {getQuestions(role).map((item, index) => (
      <Card key={index}>
        <Question>
          {item.question} (Points: {item.max})
        </Question>
        <PreviewAnswer data={data} role={role} index={index} />
      </Card>
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
