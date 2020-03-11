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

const qs = ['Q1', 'Q2', 'Q3']

function getAnswer(data, role, index) {
  let fid = 'major'
  if (role === 'core') fid = 'general'

  const field = data[fid]
  if (!field) return

  const qid = qs[index]

  return field[qid]
}

const PreviewAnswer = ({data, role, index}) => {
  const answer = getAnswer(data, role, index)
  console.log('answer =', answer, {data, role, index})

  if (role === 'designer' && index === 0) {
    return <ImagePreview path={data.major.file} uid={data.id} />
  }

  return <Answer>{answer}</Answer>
}

export default PreviewAnswer
