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

// if (role === 'developer' && index === 2) {
//   return (
//     <div>
//       <WebPreview src={answer} />
//       <Code>{answer}</Code>
//     </div>
//   )
// }

// if (role === 'designer' && index === 2) {
//   return <ImagePreview id={data.id} />
// }

// if (role === 'content' && index === 1) {
//   return (
//     <div>
//       <Answer>{data.majorAnswer2}</Answer>

//       {data.majorAnswer3 && (
//         <Answer style={{marginTop: '0.8em'}}>{data.majorAnswer3}</Answer>
//       )}
//     </div>
//   )
// }

const PreviewAnswer = ({data, role, index}) => {
  const answer = getAnswer(data, role, index)
  console.log('answer =', answer, {data, role, index})

  return <Answer>{answer}</Answer>
}

export default PreviewAnswer
