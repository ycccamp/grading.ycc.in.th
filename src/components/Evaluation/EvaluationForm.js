import React from 'react'
import styled from 'react-emotion'
import {Field, reduxForm} from 'redux-form'
import {TextField, TextAreaField} from 'redux-form-antd'
import {message, Icon, Popconfirm} from 'antd'

import Card from '../Card'
import Button from '../Button'
import PreviewAnswer from '../PreviewAnswer'

import {maxScores} from '../../core/scoring'
import {getQuestions} from '../../core/evaluation'

const Question = styled.p`
  color: #666;
  font-size: 0.98em;

  white-space: pre-line;
  word-break: break-word;
  word-wrap: break-word;
`

const posStyle = {marginRight: '1em', marginBottom: '1.5em'}

function isIgnored(role, index) {
  return role === 'designer' && index === 2
}

const EvaluationForm = ({handleSubmit, delist, data, role, disabled}) => (
  <form onSubmit={handleSubmit}>
    {getQuestions(role).map((item, index) => {
      if (isIgnored(role, index)) return null

      return (
        <Card key={index}>
          <Question>
            {item.question} (Points: {item.max})
          </Question>
          <PreviewAnswer data={data} role={role} index={index} />

          {!disabled && (
            <Field
              name={`scores.${index}`}
              component={TextField}
              placeholder={`คะแนน (เต็ม ${item.max})`}
              autoFocus={index === 0}
            />
          )}
        </Card>
      )
    })}

    {!disabled && (
      <div>
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
      </div>
    )}

    {disabled && (
      <Button htmlType="submit" size="large" type="primary">
        ไปยังผู้สมัครคนถัดไป <Icon type="right" />
      </Button>
    )}
  </form>
)

function allowExtra(role, index) {
  if (role === 'creative') {
    return true
  }

  if (role === 'developer' && index === 2) {
    return true
  }

  return false
}

function validate(values, {role, disabled}) {
  const errors = {
    scores: [],
  }

  if (disabled) return

  const fields = role === 'content' ? [0, 1] : [0, 1, 2]
  const max = maxScores[role]

  if (!values.scores) {
    errors.scores[0] = 'กรุณาระบุคะแนน'
    return
  }

  fields.forEach(index => {
    if (isIgnored(role, index)) return

    if (values.scores && !values.scores[index]) {
      errors.scores[index] = 'กรุณาระบุคะแนน'
      return
    }

    const score = parseInt(values.scores[index])

    if (isNaN(score)) {
      errors.scores[index] = 'กรุณาระบุคะแนน'
    }

    if (!allowExtra(role, index) && score > max[index]) {
      errors.scores[index] = 'คะแนนสูงเกินกว่าเกณฑ์'
    }

    if (score < 0) {
      errors.scores[index] = 'คะแนนต้องเป็นจำนวนเต็มบวก'
    }
  })

  return errors
}

function onSubmitFail() {
  message.error('กรุณากรอกคะแนนให้ครบถ้วน')
}

const enhance = reduxForm({
  form: 'grading',
  validate,
  onSubmitFail,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})

export default enhance(EvaluationForm)
