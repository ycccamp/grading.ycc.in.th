import React from 'react'
import styled, {css} from 'react-emotion'

import WebPreview from '../components/WebPreview'
import ImagePreview from '../components/ImagePreview'

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
    return <ImagePreview id={data.id} src={answer} />
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

export default PreviewAnswer
