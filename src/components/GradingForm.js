import React from 'react'
import styled from 'react-emotion'
import {Field, reduxForm} from 'redux-form'
import {TextField, TextAreaField} from 'redux-form-antd'
import {Icon} from 'antd'

import Button from './Button'
import PreviewAnswer from './PreviewAnswer'

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

  .ant-form-item {
    margin-bottom: 0;
    margin-top: 1em;
  }

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

const GradingForm = ({handleSubmit, data, role}) => (
  <form onSubmit={handleSubmit}>
    {getQuestions(role).map((item, index) => (
      <Card key={index}>
        <Question>
          {item.question} (Points: {item.max})
        </Question>
        <PreviewAnswer data={data} role={role} index={index} />
        <Field
          name={`scores.${index}`}
          component={TextField}
          placeholder={`คะแนน (เต็ม ${item.max})`}
        />
      </Card>
    ))}

    <Field
      name="notes"
      rows={3}
      component={TextAreaField}
      placeholder="บันทึกเพิ่มเติม"
    />

    <Button htmlType="submit" size="large">
      ยืนยันการให้คะแนน <Icon type="right" />
    </Button>
  </form>
)

const enhance = reduxForm({form: 'grading'})

export default enhance(GradingForm)
