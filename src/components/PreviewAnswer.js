import React from 'react'
import styled, {css} from 'react-emotion'
import Image from 'react-medium-image-zoom'

import WebPreview from '../components/WebPreview'

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

export default PreviewAnswer
