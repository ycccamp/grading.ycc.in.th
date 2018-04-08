import React from 'react'
import styled from 'react-emotion'
import {Field, reduxForm} from 'redux-form'
import {TextField, TextAreaField} from 'redux-form-antd'
import {message, Icon, Popconfirm} from 'antd'

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

const posStyle = {marginRight: '1em', marginBottom: '1.5em'}

const GradingForm = ({handleSubmit, delist, data, role}) => (
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

    <Button htmlType="submit" size="large" type="primary" style={posStyle}>
      ยืนยันการให้คะแนน <Icon type="right" />
    </Button>

    <Popconfirm
      title="คุณต้องการคัดผู้สมัครดังกล่าวออกหรือไม่"
      onConfirm={delist}
      okText="คัดออก"
      cancelText="ยกเลิก">
      <Button size="large" type="danger">
        คัดออก <Icon type="trash" />
      </Button>
    </Popconfirm>
  </form>
)

function validate(values) {
  const errors = {
    scores: [],
  }

  const fields = [0, 1, 2]

  if (values.scores) {
    console.log('Scores:', values.scores)

    fields.forEach(index => {
      const score = parseInt(values.scores[index])

      if (isNaN(score)) {
        errors.scores[index] = 'กรุณาระบุคะแนน'
      }

      if (score > 20) {
        errors.scores[index] = 'คะแนนสูงเกินกว่าเกณฑ์'
      }

      if (score < 0) {
        errors.scores[index] = 'คะแนนต้องมากกว่าศูนย์'
      }
    })
  }

  return errors
}

function onSubmitFail() {
  message.error('กรุณากรอกคะแนนให้ครบถ้วน')
}

const enhance = reduxForm({form: 'grading', validate, onSubmitFail})

export default enhance(GradingForm)
