import React from 'react'
import styled from 'react-emotion'

import WebPreview from './WebPreview'
import ImagePreview from './ImagePreview'

const Answer = styled.p`
  color: #555;
  font-size: 1.38em;
  font-weight: 500;
  font-family: 'Taviraj';

  margin-bottom: 0;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

const Code = styled.code`
  white-space: pre-wrap;
`

const PreviewAnswer = ({data, role, index}) => {
  const answer = JSON.stringify(data)

  if (role === 'developer' && index === 1) {
    return (
      <div>
        <WebPreview src={answer} />
        <Code>{answer}</Code>
      </div>
    )
  }

  if (role === 'designer' && index === 0) {
    return <ImagePreview id={data.id} />
  }

  return <Answer>{answer}</Answer>
}

export default PreviewAnswer
