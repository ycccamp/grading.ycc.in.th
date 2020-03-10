import React from 'react'
import styled from 'react-emotion'

import Card from './Card'
import PreviewAnswer from './PreviewAnswer'

import {getQuestions} from '../core/evaluation'

const Question = styled.p`
  color: #666;
  font-size: 0.98em;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

const Answers = ({data, type}) => (
  <div>
    {getQuestions(type).map((item, index) => {
      return (
        <Card key={index}>
          <Question>
            {item.question} (Points: {item.max})
          </Question>
          <PreviewAnswer data={data} role={type} index={index} />
        </Card>
      )
    })}
  </div>
)

export default Answers
